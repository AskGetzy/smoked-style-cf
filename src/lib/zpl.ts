// Gift note card as ZPL for the Zebra ZD621. Change the three constants to match the stock in the printer.
// Default: a 4 x 6 inch card at 203 dpi (use 300 for the 300 dpi model and scale the numbers).
const DOTS_PER_INCH = 203;
const CARD_W = 4 * DOTS_PER_INCH; // 812
const CARD_H = 6 * DOTS_PER_INCH; // 1218

export const GIFT_MESSAGE_MAX = 240;
export const GIFT_FROM_MAX = 60;

/** ^ and ~ are ZPL command characters. Control characters are dropped. */
function clean(s: string): string {
  return s
    .replace(/[\^~]/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .replace(/\n/g, "\\&");
}

export function giftCardZpl(message: string, from: string | null): string {
  const msg = clean(message).slice(0, GIFT_MESSAGE_MAX * 2);
  const sender = from ? clean(from).replace(/\\&/g, " ").slice(0, GIFT_FROM_MAX) : "";
  const len = message.length;
  const size = len <= 80 ? 62 : len <= 160 ? 50 : 40;
  const margin = 70;
  const inner = CARD_W - margin * 2;
  return [
    "^XA",
    "^CI28", // UTF-8
    `^PW${CARD_W}`,
    `^LL${CARD_H}`,
    "^LH0,0",
    // header
    `^FO0,110^FB${CARD_W},1,0,C,0^A0N,28,28^FDA GIFT FOR YOU^FS`,
    `^FO${CARD_W / 2 - 60},175^GB120,3,3^FS`,
    // message, centered
    `^FO${margin},300^FB${inner},12,10,C,0^A0N,${size},${size}^FD${msg}^FS`,
    // sender
    sender ? `^FO${margin},930^FB${inner},2,6,C,0^A0N,36,36^FD- ${sender}^FS` : "",
    // footer
    `^FO${CARD_W / 2 - 60},1075^GB120,3,3^FS`,
    `^FO0,1110^FB${CARD_W},1,0,C,0^A0N,30,30^FDSmoked Style^FS`,
    "^PQ1",
    "^XZ",
  ]
    .filter(Boolean)
    .join("\n");
}
