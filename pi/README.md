# Raspberry Pi print agent

Prints gift note cards (and later labels) from the Smoked Style website on the Zebra ZD621.

## One-time setup on the Pi
```bash
sudo apt install -y python3-pil python3-bidi cups git
git clone https://github.com/AskGetzy/smoked-style-cf.git ~/smoked-style-cf
lpstat -p            # shows the Zebra's CUPS name; add it with the CUPS page (http://localhost:631) if missing
cd ~/smoked-style-cf/pi
python3 card.py "Happy Chanukah!" "The Smith family" preview.png   # draws a sample card to look at
```
Then edit `smoked-style-print.service` (site address, secret, printer name), and:
```bash
sudo cp smoked-style-print.service /etc/systemd/system/
sudo systemctl enable --now smoked-style-print
journalctl -u smoked-style-print -f      # watch it work
```

## The secret
Pick any long random text and save it in two places: as `PRINT_TOKEN` on the Cloudflare Worker (Settings, Variables and
Secrets) and as `SS_TOKEN` in the service file.

## Card size
Default is a 4 x 6 inch card at 203 dpi. For the 300 dpi printer set `SS_DPI=300`. For a different card size change
`width_in` / `height_in` in `card.py`'s `render_card`.
