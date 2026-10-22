"""Create a print-friendly QR for the canonical portfolio (requires qrcode and Pillow)."""
from pathlib import Path
import qrcode

root = Path(__file__).resolve().parents[1]
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=20, border=4)
qr.add_data("https://tanzamul.dev/")
qr.make(fit=True)
image = qr.make_image(fill_color="black", back_color="white")
for relative in ("cv/portfolio-qr.png", "public/images/portfolio-qr.png", "output/pdf/Portfolio_QR.png"):
    target = root / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target)
print("Created portfolio QR: https://tanzamul.dev/ (with four-module quiet zone)")
