"""
Ürün fotoğrafını web için hazırlar: arka planı kaldırır, renkleri hafifçe düzeltir,
şeffaf 900x1200 WebP üretir.

Kullanım:
  pip install opencv-python-headless pillow numpy
  python3 scripts/urun-foto.py girdi.jpg public/products/urun-adi.webp

Düz, tek renkli bir zemin (duvar, kumaş, kâğıt) önünde, şişe ortada ve dik çekilmiş
fotoğraflarda en iyi sonucu verir. Ardından products.ts içinde ürüne
  image: "/products/urun-adi.webp"
satırını ekleyin.
"""
import sys
import cv2
import numpy as np
from PIL import Image, ImageOps, ImageFilter, ImageEnhance

if len(sys.argv) < 3:
    print(__doc__); sys.exit(1)
src_path, out_path = sys.argv[1], sys.argv[2]

src = cv2.imread(src_path)
if src is None:
    print("Görsel okunamadı:", src_path); sys.exit(1)
h0, w0 = src.shape[:2]
scale = 2016 / h0
img = cv2.resize(src, (int(w0 * scale), 2016), interpolation=cv2.INTER_AREA)
h, w = img.shape[:2]

hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
V, S = hsv[:, :, 2], hsv[:, :, 1]
mask = np.full((h, w), cv2.GC_BGD, np.uint8)
x0, x1, y0, y1 = int(w * 0.12), int(w * 0.88), int(h * 0.03), int(h * 0.99)
mask[y0:y1, x0:x1] = cv2.GC_PR_BGD
center = np.zeros((h, w), bool); center[y0:y1, int(w * 0.3):int(w * 0.7)] = True
seed = ((V < 70) | (S > 120)) & center
seed = cv2.erode(seed.astype(np.uint8), np.ones((15, 15), np.uint8)).astype(bool)
mask[seed] = cv2.GC_FGD
bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
cv2.grabCut(img, mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

n, lab, stats, _ = cv2.connectedComponentsWithStats(fg, 8)
if n > 1:
    big = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]); fg = np.where(lab == big, 255, 0).astype(np.uint8)

# Tek parça nesne: satır bazında doldur, kenar profilini yumuşat, gövdede doğrusal kenar
L = np.full(h, np.nan); R = np.full(h, np.nan)
for y in range(h):
    xs = np.where(fg[y] > 0)[0]
    if xs.size: L[y], R[y] = xs.min(), xs.max()
valid = ~np.isnan(L); top, bot = np.where(valid)[0][[0, -1]]
idx = np.arange(h)
L[top:bot+1] = np.interp(idx[top:bot+1], idx[valid], L[valid]); R[top:bot+1] = np.interp(idx[top:bot+1], idx[valid], R[valid])
def med(a, k):
    out = a.copy(); r = k // 2
    for y in range(top, bot + 1):
        a0, a1 = max(top, y - r), min(bot, y + r); out[y] = np.median(a[a0:a1+1])
    return out
L = med(L, 31); R = med(R, 31)
width = R - L
body = np.where(width >= 0.965 * np.nanmax(width[top:bot+1]))[0]
b0, b1 = body.min(), body.max(); span = b1 - b0
if span > 80:
    anchor = np.concatenate([np.arange(b0, b0 + int(span * 0.18)), np.arange(b1 - int(span * 0.12), b1 + 1)])
    for prof in (L, R):
        coef = np.polyfit(anchor, prof[anchor], 1); prof[b0:b1+1] = np.polyval(coef, np.arange(b0, b1 + 1))
fg = np.zeros_like(fg)
for y in range(top, bot + 1):
    fg[y, int(round(L[y])):int(round(R[y])) + 1] = 255
fg = cv2.erode(fg, np.ones((3, 3), np.uint8))
alpha = cv2.GaussianBlur(fg, (0, 0), 1.4)

ys, xs = np.where(alpha > 10)
bx0, bx1, by0, by1 = xs.min(), xs.max(), ys.min(), ys.max()
pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
pil = ImageOps.autocontrast(pil, cutoff=0.4)
pil = ImageEnhance.Color(pil).enhance(1.12)
pil = ImageEnhance.Contrast(pil).enhance(1.06)
pil = pil.filter(ImageFilter.UnsharpMask(radius=2, percent=90, threshold=3))
rgba = pil.convert("RGBA"); rgba.putalpha(Image.fromarray(alpha))
cut = rgba.crop((bx0, by0, bx1 + 1, by1 + 1))
W, H = 900, 1200
target_h = int(H * 0.92)
cut = cut.resize((int(cut.width * target_h / cut.height), target_h), Image.LANCZOS)
canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
canvas.paste(cut, ((W - cut.width) // 2, (H - cut.height) // 2 + int(H * 0.015)), cut)
canvas.save(out_path, "WEBP", quality=88, method=6)
print("yazıldı:", out_path)
