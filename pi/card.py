"""Draws the Smoked Style gift note card as a black-and-white image for the Zebra printer.

Default size: 4 x 6 inch at 203 dpi (set DPI=300 for the 300 dpi printer). Text uses Playfair Display;
Hebrew text switches to Frank Ruhl Libre and is laid out right-to-left.
"""
import os
import re
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
SS = 3  # draw at 3x, then shrink: smoother edges on a thermal printer

HEBREW = re.compile(r"[֐-׿]")


def font(name, px):
    return ImageFont.truetype(os.path.join(FONTS, name), int(px))


def bezier(p0, p1, p2, p3, n=24):
    pts = []
    for i in range(n + 1):
        t = i / n
        a, b, c, d = (1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t**2, t**3
        pts.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
    return pts


def draw_mark(d, x, y, w, ink=(0, 0, 0), acc=(0, 0, 0)):
    """The smoker mark, from the logo. (x, y) = top-left, w = width in pixels."""
    k = w / 116.0
    P = lambda a, b: (x + a * k, y + b * k)
    R = lambda a, b, c, e: [P(a, b), P(c, e)]
    # smoke
    line = bezier(P(29, 38), P(21, 30), P(37, 24), P(29, 16)) + bezier(P(29, 16), P(23, 10), P(31, 6), P(31, 2))
    d.line(line, fill=ink, width=max(2, int(4.5 * k)), joint="curve")
    line2 = bezier(P(40, 34), P(34, 28), P(46, 22), P(40, 14))
    d.line(line2, fill=ink, width=max(2, int(3.5 * k)), joint="curve")
    d.rectangle(R(23, 38, 36, 52), fill=ink)
    d.rounded_rectangle(R(20, 35, 39, 40), radius=1.5 * k, fill=ink)
    d.rounded_rectangle(R(8, 50, 86, 84), radius=17 * k, fill=ink)
    d.line([P(10, 66), P(84, 66)], fill=(255, 255, 255), width=max(2, int(2.5 * k)))
    d.rounded_rectangle(R(39, 57, 57, 61.5), radius=2.2 * k, fill=acc)
    d.rounded_rectangle(R(86, 58, 112, 84), radius=3 * k, fill=ink)
    cx, cy = P(99, 71)
    d.ellipse([cx - 4.5 * k, cy - 4.5 * k, cx + 4.5 * k, cy + 4.5 * k], fill=acc)
    for a, b in (((22, 84), (16, 104)), ((72, 84), (78, 104)), ((19, 95), (75, 95))):
        d.line([P(*a), P(*b)], fill=ink, width=int(4 * k))
    wx, wy = P(79, 103)
    d.ellipse([wx - 5 * k, wy - 5 * k, wx + 5 * k, wy + 5 * k], fill=ink)


def spaced(d, cx, y, text, f, tracking, fill=(0, 0, 0)):
    """Centered, letter-spaced text."""
    widths = [d.textlength(ch, font=f) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2
    for ch, w in zip(text, widths):
        d.text((x, y), ch, font=f, fill=fill)
        x += w + tracking


def wrap(d, text, f, max_w, rtl):
    lines = []
    for para in text.split("\n"):
        words, cur = para.split(), ""
        for w in words:
            t = (cur + " " + w).strip()
            if d.textlength(t, font=f) <= max_w or not cur:
                cur = t
            else:
                lines.append(cur)
                cur = w
        lines.append(cur)
    if rtl:
        try:
            from bidi.algorithm import get_display

            lines = [get_display(l) for l in lines]
        except ImportError:
            pass
    return lines


def _design(message, sender, dpi, color):
    message = (message or "").strip()
    sender = (sender or "").strip()
    W, H = int(4 * dpi), int(6 * dpi)
    INK = (26, 18, 13) if color else (0, 0, 0)
    ACC = (201, 67, 28) if color else (0, 0, 0)
    s = dpi / 203.0 * SS
    img = Image.new("RGB", (W * SS, H * SS), (255, 255, 255))
    d = ImageDraw.Draw(img)
    cx = W * SS / 2
    S = lambda v: v * s

    # double frame
    d.rectangle([S(26), S(26), W * SS - S(26), H * SS - S(26)], outline=ACC, width=int(S(4)))
    d.rectangle([S(42), S(42), W * SS - S(42), H * SS - S(42)], outline=INK, width=int(S(1.5)))

    # header
    spaced(d, cx, S(112), "A GIFT FOR YOU", font("DMSans-Medium.ttf", S(23)), S(7), fill=ACC)
    # diamond divider
    dy = S(178)
    d.line([cx - S(95), dy, cx - S(16), dy], fill=ACC, width=int(S(2)))
    d.line([cx + S(16), dy, cx + S(95), dy], fill=ACC, width=int(S(2)))
    d.polygon([(cx, dy - S(9)), (cx + S(9), dy), (cx, dy + S(9)), (cx - S(9), dy)], fill=ACC)

    # message: biggest size that fits the box
    rtl = bool(HEBREW.search(message))
    fname = "FrankRuhlLibre-Regular.ttf" if rtl else "PlayfairDisplay-Italic.ttf"
    box_w, box_h = S(612), S(540)
    chosen = None
    for px in range(72, 27, -2):
        f = font(fname, S(px))
        lines = wrap(d, message, f, box_w, rtl)
        lh = S(px) * 1.32
        if lh * len(lines) <= box_h:
            chosen = (f, lines, lh)
            break
    if chosen is None:
        f = font(fname, S(28))
        lines = wrap(d, message, f, box_w, rtl)
        chosen = (f, lines, S(28) * 1.32)
    f, lines, lh = chosen
    block_h = lh * len(lines)
    y = S(235) + (box_h - block_h) / 2
    for line in lines:
        w = d.textlength(line, font=f)
        d.text((cx - w / 2, y), line, font=f, fill=INK)
        y += lh

    # sender
    if sender:
        sf = font("FrankRuhlLibre-Regular.ttf" if HEBREW.search(sender) else "PlayfairDisplay-Italic.ttf", S(36))
        text = "— " + sender
        w = d.textlength(text, font=sf)
        sy = min(S(815), y + S(50))
        d.text((cx - w / 2, sy), text, font=sf, fill=INK)

    # footer: divider, mark, wordmark
    fy = S(900)
    d.line([cx - S(95), fy, cx + S(95), fy], fill=ACC, width=int(S(2)))
    mw = S(118)
    draw_mark(d, cx - mw / 2, S(925), mw, INK, ACC)
    bold = font("PlayfairDisplay-Bold.ttf", S(40))
    t = "Smoked Style"
    w = d.textlength(t, font=bold)
    d.text((cx - w / 2, S(1040)), t, font=bold, fill=INK)
    spaced(d, cx, S(1098), "SMOKEHOUSE & CATERING", font("DMSans-Medium.ttf", S(16)), S(5), fill=INK)

    return img.resize((W, H), Image.LANCZOS)


def render_card(message, sender="", dpi=203, width_in=4.0, height_in=6.0, color=False):
    """color=False: 1-bit black and white for a thermal printer. color=True: RGB for an inkjet/laser.
    The 4 x 6 design is scaled to fit the card size and centered on it."""
    k = min(width_in / 4.0, height_in / 6.0)
    design = _design(message, sender, dpi * k, color)
    W, H = int(width_in * dpi), int(height_in * dpi)
    canvas = Image.new("RGB", (W, H), (255, 255, 255))
    canvas.paste(design, ((W - design.width) // 2, (H - design.height) // 2))
    if color:
        return canvas
    return canvas.convert("L").point(lambda p: 255 if p > 150 else 0).convert("1")


def to_zpl(img):
    """1-bit image -> ZPL graphic. White = 0, black = 1 in ZPL, so invert."""
    from PIL import ImageOps

    W, H = img.size
    per_row = (W + 7) // 8
    data = ImageOps.invert(img.convert("L")).convert("1").tobytes()
    total = per_row * H
    return "^XA\n^PW%d\n^LL%d\n^LH0,0\n^FO0,0^GFA,%d,%d,%d,%s^FS\n^PQ1\n^XZ" % (W, H, total, total, per_row, data.hex().upper())


if __name__ == "__main__":
    import sys

    msg = sys.argv[1] if len(sys.argv) > 1 else "Wishing you a happy Chanukah. Enjoy every bite!"
    frm = sys.argv[2] if len(sys.argv) > 2 else "The Wasserman family"
    out = sys.argv[3] if len(sys.argv) > 3 else "card-preview.png"
    color = os.environ.get("COLOR", "1") == "1"
    img = render_card(msg, frm, dpi=300 if color else 203, width_in=5, height_in=7, color=color)
    img.save(out)
    print("saved", out)
