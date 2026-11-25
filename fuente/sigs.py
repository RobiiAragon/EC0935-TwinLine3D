from PIL import Image, ImageDraw, ImageFont, ImageOps
import math, random
F="/home/claude/fonts/node_modules/@fontsource/"
fonts={"hvm":F+"herr-von-muellerhoff/files/herr-von-muellerhoff-latin-400-normal.woff",
       "dafoe":F+"mr-dafoe/files/mr-dafoe-latin-400-normal.woff",
       "mld":F+"monsieur-la-doulaise/files/monsieur-la-doulaise-latin-400-normal.woff",
       "lba":F+"la-belle-aurore/files/la-belle-aurore-latin-400-normal.woff",
       "med":F+"meddon/files/meddon-latin-400-normal.woff"}
def trans(im, ink):
    g = ImageOps.grayscale(im); a = g.point(lambda v: 0 if v > 200 else min(255, int((255 - v) * 1.6)))
    out = Image.new("RGBA", im.size, ink + (0,)); out.putalpha(a); return out.crop(out.getbbox())
def make(name, text, font, size, ink, rot, seed):
    random.seed(seed)
    im = Image.new("L", (900, 360), 255); d = ImageDraw.Draw(im)
    f = ImageFont.truetype(fonts[font], size)
    d.text((40, 60), text, font=f, fill=0)
    bb = im.getbbox() or (0,0,900,360)
    # rúbrica: curva bajo el nombre
    x0, x1, y = bb[0] + (bb[2]-bb[0])*0.35, bb[2] + 15, bb[3] - (bb[3]-bb[1])*0.18
    pts = [(x0 + (x1 - x0) * t, y + 9 * math.sin(t * math.pi * 1.6 + seed) - 22 * t) for t in [i / 60 for i in range(61)]]
    d.line(pts, fill=0, width=3)
    im = im.rotate(rot, resample=Image.BICUBIC, fillcolor=255, expand=True)
    trans(im.convert("RGB"), ink).save(f"sig/{name}.png")
INK = (20, 28, 70); BLK = (25, 25, 25)
make("dueno", "Ricardo Méndez", "hvm", 150, INK, 4, 1)
make("mant", "M. Castillo", "dafoe", 120, BLK, 2, 2)
make("prod", "Laura Ibarra", "mld", 110, INK, 5, 3)
make("ti", "F. Ochoa V.", "lba", 100, BLK, -2, 4)
make("fin", "Ana Villaseñor", "med", 70, INK, 3, 5)
# Firma real del líder (extraída de Deko3D)
src = Image.open("/tmp/sig/m1-002.png").convert("RGB")
trans(src, (10, 10, 10)).save("sig/lider.png")
for n in ["dueno","mant","prod","ti","fin","lider"]:
    im = Image.open(f"sig/{n}.png"); print(n, im.size)
