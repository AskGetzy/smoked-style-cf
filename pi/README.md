# Raspberry Pi print agent

Prints from the Smoked Style website: gift note cards on a regular color printer (cardstock), and labels on the Zebra ZD621.

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

## Gift cards: printer and paper
Cards print in color on a normal inkjet or laser printer (not the Zebra). Default card is 5 x 7 inch; set `SS_CARD_W_IN` /
`SS_CARD_H_IN` for 4 x 6 or anything else. Use matte, white or cream cardstock (about 80 to 110 lb cover, 215 to 300 gsm)
and feed it from the printer's rear or manual tray (`SS_CARD_TRAY`). Add the printer in CUPS (`http://localhost:631`),
then put its name in `SS_CARD_PRINTER`. If `SS_CARD_PRINTER` is empty, cards fall back to the Zebra in black and white.

Look at a sample first: `python3 card.py "Happy Chanukah!" "The Smith family" preview.png`
