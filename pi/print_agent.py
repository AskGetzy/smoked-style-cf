#!/usr/bin/env python3
"""Smoked Style print agent. Runs on the Raspberry Pi.

Every few seconds it asks the website for the next waiting print job, prints it on the Zebra through CUPS,
and reports back. The Pi only makes outgoing web requests, so no tunnel or static IP is needed.

Settings (environment variables, see smoked-style-print.service):
  SS_URL      site address, e.g. https://smoked-style-cf.getzyw89.workers.dev
  SS_TOKEN    the same secret saved as PRINT_TOKEN on the Cloudflare Worker
  SS_PRINTER       the Zebra label printer's CUPS name (run `lpstat -p`), e.g. Zebra_ZD621. Prints labels.
  SS_CARD_PRINTER  the regular color printer for gift note cards, e.g. Epson_ET_8550
  SS_CARD_W_IN / SS_CARD_H_IN   card size in inches (default 5 x 7)
  SS_CARD_MEDIA    paper size name for CUPS (default Custom.5x7in; try 5x7 or A6 if your printer lists those)
  SS_CARD_TRAY     optional tray name, e.g. Manual or Rear, for heavy cardstock
  SS_DPI           Zebra resolution, 203 (default) or 300
"""
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

from card import render_card, to_zpl

URL = os.environ.get("SS_URL", "").rstrip("/")
TOKEN = os.environ.get("SS_TOKEN", "")
PRINTER = os.environ.get("SS_PRINTER", "")
CARD_PRINTER = os.environ.get("SS_CARD_PRINTER", "")
CARD_W = float(os.environ.get("SS_CARD_W_IN", "5"))
CARD_H = float(os.environ.get("SS_CARD_H_IN", "7"))
CARD_MEDIA = os.environ.get("SS_CARD_MEDIA", "Custom.%gx%gin" % (CARD_W, CARD_H))
CARD_TRAY = os.environ.get("SS_CARD_TRAY", "")
DPI = int(os.environ.get("SS_DPI", "203"))
POLL_SECONDS = 4

if not (URL and TOKEN and (PRINTER or CARD_PRINTER)):
    sys.exit("Set SS_URL, SS_TOKEN and at least one of SS_PRINTER / SS_CARD_PRINTER first.")


def call(path, body=None):
    req = urllib.request.Request(
        URL + path,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": "Bearer " + TOKEN, "Content-Type": "application/json", "User-Agent": "smoked-style-pi"},
        method="POST" if body is not None else "GET",
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return None if r.status == 204 else json.loads(r.read())


def print_zpl(zpl):
    with tempfile.NamedTemporaryFile("w", suffix=".zpl", delete=False) as f:
        f.write(zpl)
        path = f.name
    try:
        subprocess.run(["lp", "-d", PRINTER, "-o", "raw", path], check=True, capture_output=True, timeout=60)
    finally:
        os.unlink(path)


def print_card_pdf(message, sender):
    img = render_card(message, sender, dpi=300, width_in=CARD_W, height_in=CARD_H, color=True)
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
        path = f.name
    try:
        img.save(path, "PDF", resolution=300.0)
        cmd = ["lp", "-d", CARD_PRINTER, "-o", "media=" + CARD_MEDIA, "-o", "fit-to-page", "-o", "sides=one-sided"]
        if CARD_TRAY:
            cmd += ["-o", "InputSlot=" + CARD_TRAY]
        subprocess.run(cmd + [path], check=True, capture_output=True, timeout=90)
    finally:
        os.unlink(path)


def handle(job):
    if job["kind"] == "gift_card" and job.get("payload"):
        p = json.loads(job["payload"])
        if CARD_PRINTER:
            print_card_pdf(p.get("message", ""), p.get("from", ""))
            return
        if not PRINTER:
            raise RuntimeError("no printer set for gift cards")
        print_zpl(to_zpl(render_card(p.get("message", ""), p.get("from", ""), dpi=DPI)))  # fallback: Zebra
        return
    if not PRINTER:
        raise RuntimeError("no label printer set")
    print_zpl(job["zpl"])


def main():
    print("Print agent running. Labels:", PRINTER or "-", "| Cards:", CARD_PRINTER or "-", flush=True)
    while True:
        try:
            job = call("/api/print/next")
            if job:
                try:
                    handle(job)
                    call("/api/print/%d" % job["id"], {"status": "printed"})
                    print("printed job", job["id"], flush=True)
                except Exception as e:  # report, don't loop forever on a bad job
                    print("job", job["id"], "failed:", e, flush=True)
                    call("/api/print/%d" % job["id"], {"status": "failed"})
                continue  # check for another job right away
        except (urllib.error.URLError, TimeoutError) as e:
            print("website not reachable:", e, flush=True)
            time.sleep(15)
        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    main()
