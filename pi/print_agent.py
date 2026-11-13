#!/usr/bin/env python3
"""Smoked Style print agent. Runs on the Raspberry Pi.

Every few seconds it asks the website for the next waiting print job, prints it on the Zebra through CUPS,
and reports back. The Pi only makes outgoing web requests, so no tunnel or static IP is needed.

Settings (environment variables, see smoked-style-print.service):
  SS_URL      site address, e.g. https://smoked-style-cf.getzyw89.workers.dev
  SS_TOKEN    the same secret saved as PRINT_TOKEN on the Cloudflare Worker
  SS_PRINTER  CUPS printer name (run `lpstat -p` to see it), e.g. Zebra_ZD621
  SS_DPI      203 (default) or 300 for the 300 dpi printer
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
DPI = int(os.environ.get("SS_DPI", "203"))
POLL_SECONDS = 4

if not (URL and TOKEN and PRINTER):
    sys.exit("Set SS_URL, SS_TOKEN and SS_PRINTER first.")


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


def handle(job):
    zpl = job["zpl"]
    if job["kind"] == "gift_card" and job.get("payload"):
        p = json.loads(job["payload"])
        zpl = to_zpl(render_card(p.get("message", ""), p.get("from", ""), dpi=DPI))
    print_zpl(zpl)


def main():
    print("Print agent running. Printer:", PRINTER, flush=True)
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
