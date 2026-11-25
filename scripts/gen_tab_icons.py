from PIL import Image, ImageDraw
import os

out = r"G:\Project\Pets\assets"
os.makedirs(out, exist_ok=True)


def make_home(color, path):
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = color
    for y in range(8, 28):
        half = (y - 8) // 2 + 2
        d.rectangle([32 - half * 2, y, 32 + half * 2, y], fill=c)
    d.rectangle([16, 26, 48, 48], fill=c)
    d.rectangle([28, 34, 36, 48], fill=(0, 0, 0, 0))
    d.rectangle([40, 14, 46, 26], fill=c)
    img.save(path)


def make_community(color, path):
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = color
    d.rectangle([12, 12, 30, 30], outline=c, width=3)
    d.rectangle([34, 12, 52, 30], outline=c, width=3)
    d.rectangle([12, 34, 30, 52], outline=c, width=3)
    d.rectangle([34, 34, 52, 52], outline=c, width=3)
    if c[3] > 200:
        d.rectangle([12, 12, 30, 30], fill=c)
        d.rectangle([34, 12, 52, 30], fill=c)
        d.rectangle([12, 34, 30, 52], fill=c)
        d.rectangle([34, 34, 52, 52], fill=c)
    img.save(path)


def make_mine(color, path):
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = color
    d.ellipse([24, 8, 40, 24], fill=c)
    d.ellipse([14, 28, 50, 56], fill=c)
    d.rectangle([0, 48, 64, 64], fill=(0, 0, 0, 0))
    img.save(path)


inactive = (138, 143, 153, 255)
active = (232, 90, 106, 255)

make_home(inactive, os.path.join(out, "tab-home.png"))
make_home(active, os.path.join(out, "tab-home-active.png"))
make_community(inactive, os.path.join(out, "tab-community.png"))
make_community(active, os.path.join(out, "tab-community-active.png"))
make_mine(inactive, os.path.join(out, "tab-mine.png"))
make_mine(active, os.path.join(out, "tab-mine-active.png"))
print("tab icons ok")
