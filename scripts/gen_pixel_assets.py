from PIL import Image, ImageDraw
import os

OUT = r"G:\Project\Pets\assets"

BLACK = (32, 32, 32, 255)
WHITE = (255, 255, 255, 255)
PINK_BG = (247, 190, 205, 255)
PINK_SOFT = (255, 222, 230, 255)
PINK_DEEP = (238, 165, 182, 255)
PEACH = (255, 216, 200, 255)
CREAM = (255, 250, 244, 255)
ORANGE = (255, 178, 96, 255)
ORANGE_D = (235, 145, 65, 255)
BROWN = (145, 90, 55, 255)
GRAY = (150, 155, 165, 255)
GRAY_D = (110, 115, 125, 255)
WHITE_FUR = (255, 255, 255, 255)
NOSE = (45, 45, 45, 255)
MOUTH = (255, 115, 130, 255)
BLUE_SOFT = (190, 222, 248, 255)
CORAL = (232, 90, 106, 255)
GRAY_ICON = (138, 143, 153, 255)
INNER_EAR = (255, 195, 205, 255)
BLUSH = (255, 175, 185, 180)


def new(w, h, bg=(0, 0, 0, 0)):
    img = Image.new("RGBA", (w, h), bg)
    return img, ImageDraw.Draw(img)


def save(img, name):
    img.save(os.path.join(OUT, name))
    print("saved", name)


def rect(d, x, y, w, h, c):
    d.rectangle([x, y, x + max(int(w) - 1, 0), y + max(int(h) - 1, 0)], fill=c)


def draw_cat(d, ox, oy, fur, patch=None, s=1, open_mouth=True):
    """Cute pixel cat face, 18x18 units at scale s."""
    # ears
    rect(d, ox + 1 * s, oy, 5 * s, 5 * s, fur)
    rect(d, ox + 12 * s, oy, 5 * s, 5 * s, fur)
    rect(d, ox + 2 * s, oy + 1 * s, 3 * s, 3 * s, INNER_EAR)
    rect(d, ox + 13 * s, oy + 1 * s, 3 * s, 3 * s, INNER_EAR)
    # head
    rect(d, ox + 2 * s, oy + 4 * s, 14 * s, 11 * s, fur)
    rect(d, ox + 3 * s, oy + 3 * s, 12 * s, 1 * s, fur)
    rect(d, ox + 1 * s, oy + 6 * s, 1 * s, 7 * s, fur)
    rect(d, ox + 16 * s, oy + 6 * s, 1 * s, 7 * s, fur)
    rect(d, ox + 3 * s, oy + 15 * s, 12 * s, 1 * s, fur)
    # patch (brown spot over one eye)
    if patch:
        rect(d, ox + 3 * s, oy + 4 * s, 5 * s, 5 * s, patch)
        rect(d, ox + 2 * s, oy + 7 * s, 3 * s, 4 * s, patch)
        rect(d, ox + 4 * s, oy + 3 * s, 3 * s, 1 * s, patch)
    # eyes - rounded pixel style
    rect(d, ox + 5 * s, oy + 8 * s, 3 * s, 4 * s, BLACK)
    rect(d, ox + 10 * s, oy + 8 * s, 3 * s, 4 * s, BLACK)
    # eye highlights
    rect(d, ox + 5 * s, oy + 8 * s, 1 * s, 1 * s, WHITE)
    rect(d, ox + 10 * s, oy + 8 * s, 1 * s, 1 * s, WHITE)
    rect(d, ox + 7 * s, oy + 11 * s, 1 * s, 1 * s, (140, 210, 255, 255))
    rect(d, ox + 12 * s, oy + 11 * s, 1 * s, 1 * s, (140, 210, 255, 255))
    # blush
    rect(d, ox + 3 * s, oy + 12 * s, 2 * s, 1 * s, BLUSH)
    rect(d, ox + 13 * s, oy + 12 * s, 2 * s, 1 * s, BLUSH)
    # nose
    rect(d, ox + 8 * s, oy + 12 * s, 2 * s, 2 * s, NOSE)
    # mouth
    if open_mouth:
        rect(d, ox + 7 * s, oy + 14 * s, 4 * s, 2 * s, MOUTH)
        rect(d, ox + 7 * s, oy + 14 * s, 4 * s, 1 * s, NOSE)
        rect(d, ox + 8 * s, oy + 15 * s, 2 * s, 1 * s, (255, 160, 170, 255))
    else:
        rect(d, ox + 7 * s, oy + 14 * s, 1 * s, 1 * s, NOSE)
        rect(d, ox + 10 * s, oy + 14 * s, 1 * s, 1 * s, NOSE)
        rect(d, ox + 8 * s, oy + 15 * s, 2 * s, 1 * s, NOSE)
    # whiskers
    for dy in (11, 13):
        rect(d, ox - 1 * s, oy + dy * s, 3 * s, 1 * s, BLACK)
        rect(d, ox + 16 * s, oy + dy * s, 3 * s, 1 * s, BLACK)


def draw_corgi(d, ox, oy, s=1, open_mouth=True):
    """Cute pixel corgi face, 18x18 units at scale s."""
    # tall ears
    rect(d, ox + 1 * s, oy - 2 * s, 5 * s, 8 * s, ORANGE)
    rect(d, ox + 12 * s, oy - 2 * s, 5 * s, 8 * s, ORANGE)
    rect(d, ox + 2 * s, oy - 1 * s, 3 * s, 4 * s, (255, 210, 195, 255))
    rect(d, ox + 13 * s, oy - 1 * s, 3 * s, 4 * s, (255, 210, 195, 255))
    # ear tips darker
    rect(d, ox + 1 * s, oy - 3 * s, 2 * s, 2 * s, ORANGE_D)
    rect(d, ox + 14 * s, oy - 3 * s, 2 * s, 2 * s, ORANGE_D)
    # head
    rect(d, ox + 2 * s, oy + 4 * s, 14 * s, 10 * s, ORANGE)
    rect(d, ox + 3 * s, oy + 3 * s, 12 * s, 1 * s, ORANGE)
    # white blaze + muzzle
    rect(d, ox + 7 * s, oy + 4 * s, 4 * s, 4 * s, WHITE_FUR)
    rect(d, ox + 6 * s, oy + 8 * s, 6 * s, 4 * s, WHITE_FUR)
    rect(d, ox + 5 * s, oy + 11 * s, 8 * s, 4 * s, WHITE_FUR)
    rect(d, ox + 6 * s, oy + 14 * s, 6 * s, 1 * s, WHITE_FUR)
    # side cheeks stay orange
    rect(d, ox + 3 * s, oy + 9 * s, 3 * s, 4 * s, ORANGE)
    rect(d, ox + 12 * s, oy + 9 * s, 3 * s, 4 * s, ORANGE)
    # eyes
    rect(d, ox + 4 * s, oy + 7 * s, 3 * s, 4 * s, BLACK)
    rect(d, ox + 11 * s, oy + 7 * s, 3 * s, 4 * s, BLACK)
    rect(d, ox + 4 * s, oy + 7 * s, 1 * s, 1 * s, WHITE)
    rect(d, ox + 11 * s, oy + 7 * s, 1 * s, 1 * s, WHITE)
    # blush
    rect(d, ox + 3 * s, oy + 12 * s, 2 * s, 1 * s, BLUSH)
    rect(d, ox + 13 * s, oy + 12 * s, 2 * s, 1 * s, BLUSH)
    # nose
    rect(d, ox + 8 * s, oy + 11 * s, 2 * s, 2 * s, NOSE)
    if open_mouth:
        rect(d, ox + 7 * s, oy + 13 * s, 4 * s, 3 * s, MOUTH)
        rect(d, ox + 7 * s, oy + 13 * s, 4 * s, 1 * s, NOSE)
        rect(d, ox + 8 * s, oy + 15 * s, 2 * s, 1 * s, (255, 165, 175, 255))
    else:
        rect(d, ox + 7 * s, oy + 13 * s, 1 * s, 1 * s, NOSE)
        rect(d, ox + 10 * s, oy + 13 * s, 1 * s, 1 * s, NOSE)
        rect(d, ox + 8 * s, oy + 14 * s, 2 * s, 1 * s, NOSE)


def draw_heart(d, cx, cy, s, c):
    d.ellipse([cx - 2 * s, cy - s, cx, cy + s], fill=c)
    d.ellipse([cx, cy - s, cx + 2 * s, cy + s], fill=c)
    d.polygon([(cx - 2 * s, cy), (cx + 2 * s, cy), (cx, cy + 2 * s)], fill=c)


def draw_paw(d, cx, cy, s, c):
    d.ellipse([cx - 2 * s, cy, cx + 2 * s, cy + 2 * s], fill=c)
    d.ellipse([cx - 3 * s, cy - 3 * s, cx - s, cy - s], fill=c)
    d.ellipse([cx - s, cy - 4 * s, cx + s, cy - 2 * s], fill=c)
    d.ellipse([cx + s, cy - 3 * s, cx + 3 * s, cy - s], fill=c)


def draw_cloud(d, x, y, s, c):
    d.rounded_rectangle([x, y + s, x + 10 * s, y + 3 * s], radius=s, fill=c)
    d.rounded_rectangle([x + 2 * s, y, x + 7 * s, y + 2 * s], radius=s, fill=c)


def draw_bone(d, x, y, s, c):
    d.rectangle([x + s, y, x + 7 * s, y + 2 * s], fill=c)
    d.ellipse([x - s, y - s, x + s, y + s], fill=c)
    d.ellipse([x - s, y + s, x + s, y + 3 * s], fill=c)
    d.ellipse([x + 7 * s, y - s, x + 9 * s, y + s], fill=c)
    d.ellipse([x + 7 * s, y + s, x + 9 * s, y + 3 * s], fill=c)


def draw_star(d, cx, cy, s, c):
    d.rectangle([cx - s, cy - 1, cx + s, cy], fill=c)
    d.rectangle([cx, cy - s, cx + 1, cy + s], fill=c)


def make_banner():
    w, h = 720, 340
    img, d = new(w, h, (0, 0, 0, 0))

    # soft vertical gradient card
    grad = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    top_c = (255, 228, 235, 255)
    bot_c = (246, 185, 202, 255)
    for y in range(8, h - 6):
        t = (y - 8) / float(h - 14)
        c = tuple(int(top_c[i] + (bot_c[i] - top_c[i]) * t) for i in range(3)) + (255,)
        gd.line([(0, y), (w, y)], fill=c)
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([6, 8, w - 7, h - 6], radius=40, fill=255)
    img.paste(grad, (0, 0), mask)

    # ground shelf with highlight edge
    shelf_top = h - 78
    d.rounded_rectangle([6, shelf_top, w - 7, h - 6], radius=40, fill=PINK_DEEP)
    d.rectangle([44, shelf_top, w - 45, shelf_top + 4], fill=(255, 255, 255, 110))

    # sky decorations
    draw_cloud(d, 110, 36, 5, (255, 255, 255, 220))
    draw_cloud(d, 540, 26, 4, (255, 255, 255, 200))
    draw_heart(d, 236, 66, 5, CORAL)
    draw_heart(d, 468, 52, 4, (255, 255, 255, 210))
    draw_heart(d, 646, 96, 6, (255, 160, 175, 220))
    draw_star(d, 52, 118, 6, (255, 255, 255, 200))
    draw_star(d, 400, 100, 5, (255, 255, 255, 190))
    draw_star(d, 668, 40, 5, (255, 255, 255, 190))

    # pets lying on the shelf, evenly spaced
    draw_cat(d, 70, 176, CREAM, patch=BROWN, s=6, open_mouth=True)
    draw_corgi(d, 297, 160, s=7, open_mouth=True)
    draw_cat(d, 542, 176, GRAY, patch=GRAY_D, s=6, open_mouth=True)

    # ground decorations between pets
    draw_bone(d, 212, 288, 4, (255, 255, 255, 190))
    draw_paw(d, 452, 286, 4, (255, 255, 255, 170))
    draw_paw(d, 640, 292, 3, (255, 255, 255, 150))
    save(img, "banner-pets.png")


def make_avatar(name, kind, fur, patch, bg, s=6):
    size = 128
    img, d = new(size, size, (0, 0, 0, 0))
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=28, fill=bg)
    d.rounded_rectangle([5, 5, size - 6, size - 6], radius=24, outline=BLACK, width=3)
    if kind == "cat":
        draw_cat(d, 16, 30, fur, patch=patch, s=s, open_mouth=True)
    else:
        draw_corgi(d, 16, 36, s=s, open_mouth=True)
    save(img, name)


def make_feed_icon():
    img, d = new(96, 96, (0, 0, 0, 0))
    # bowl
    d.rounded_rectangle([16, 44, 80, 82], radius=12, fill=PEACH, outline=BLACK, width=3)
    # inner bowl
    d.ellipse([22, 34, 74, 62], fill=CREAM, outline=BLACK, width=3)
    # kibble
    for cx, cy in [(34, 44), (48, 40), (62, 46), (42, 52), (56, 54)]:
        d.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=ORANGE_D, outline=BLACK, width=2)
    # bowl rim highlight
    d.arc([24, 52, 72, 78], start=0, end=180, fill=BLACK, width=3)
    # feet
    d.rectangle([28, 82, 38, 88], fill=ORANGE, outline=BLACK, width=2)
    d.rectangle([58, 82, 68, 88], fill=ORANGE, outline=BLACK, width=2)
    save(img, "icon-feed.png")


def make_vaccine_icon():
    img, d = new(96, 96, (0, 0, 0, 0))
    # bottle body
    d.rounded_rectangle([30, 24, 66, 84], radius=8, fill=PINK_SOFT, outline=BLACK, width=3)
    # cap
    d.rounded_rectangle([38, 8, 58, 26], radius=4, fill=PEACH, outline=BLACK, width=3)
    # liquid
    d.rectangle([36, 54, 60, 80], fill=(255, 185, 200, 255), outline=BLACK, width=2)
    # label cross
    d.rectangle([42, 34, 54, 50], fill=CORAL)
    d.rectangle([38, 40, 58, 44], fill=CORAL)
    # highlight
    d.rectangle([36, 28, 40, 50], fill=(255, 255, 255, 140))
    save(img, "icon-vaccine.png")


def make_walk_icon():
    img, d = new(96, 96, (0, 0, 0, 0))
    # card bg
    d.rounded_rectangle([10, 24, 86, 84], radius=18, fill=PINK_SOFT, outline=BLACK, width=3)
    # paw
    d.ellipse([34, 50, 60, 74], fill=ORANGE, outline=BLACK, width=2)
    d.ellipse([26, 40, 40, 54], fill=ORANGE, outline=BLACK, width=2)
    d.ellipse([40, 36, 54, 50], fill=ORANGE, outline=BLACK, width=2)
    d.ellipse([54, 40, 68, 54], fill=ORANGE, outline=BLACK, width=2)
    # leash curve
    d.arc([44, 12, 84, 52], start=190, end=330, fill=BLACK, width=3)
    d.rounded_rectangle([70, 12, 88, 30], radius=4, fill=PEACH, outline=BLACK, width=2)
    # small heart
    d.ellipse([18, 58, 28, 68], fill=CORAL)
    d.ellipse([24, 58, 34, 68], fill=CORAL)
    d.polygon([(18, 64), (34, 64), (26, 74)], fill=CORAL)
    save(img, "icon-walk.png")


def make_health_icon():
    img, d = new(96, 96, (0, 0, 0, 0))
    # clipboard
    d.rounded_rectangle([16, 14, 80, 88], radius=8, fill=WHITE, outline=BLACK, width=3)
    d.rounded_rectangle([36, 8, 60, 24], radius=4, fill=PEACH, outline=BLACK, width=3)
    # bars
    bars = [
        (28, 56, 12, 22, CORAL),
        (44, 42, 12, 36, ORANGE),
        (60, 32, 12, 46, (110, 195, 165, 255)),
    ]
    for x, y, w, h, c in bars:
        d.rectangle([x, y, x + w - 1, y + h - 1], fill=c, outline=BLACK, width=2)
    # trend line
    d.line([26, 48, 44, 38, 62, 28], fill=CORAL, width=3)
    for px, py in [(26, 48), (44, 38), (62, 28)]:
        d.ellipse([px - 3, py - 3, px + 3, py + 3], fill=BLACK)
    # baseline
    d.line([26, 80, 74, 80], fill=GRAY_ICON, width=2)
    save(img, "icon-health.png")


def make_menu_icons():
    # records notebook
    img, d = new(80, 80, (0, 0, 0, 0))
    d.rounded_rectangle([14, 10, 66, 74], radius=8, fill=WHITE, outline=BLACK, width=3)
    d.rectangle([24, 26, 56, 30], fill=GRAY_ICON)
    d.rectangle([24, 38, 50, 42], fill=GRAY_ICON)
    d.rectangle([24, 50, 44, 54], fill=GRAY_ICON)
    # paw badge
    d.ellipse([50, 50, 70, 70], fill=CORAL, outline=BLACK, width=2)
    d.ellipse([56, 56, 64, 64], fill=WHITE)
    save(img, "icon-records.png")

    # settings gear
    img, d = new(80, 80, (0, 0, 0, 0))
    import math
    for ang in range(0, 360, 45):
        x = 40 + int(26 * math.cos(math.radians(ang)))
        y = 40 + int(26 * math.sin(math.radians(ang)))
        d.rectangle([x - 6, y - 6, x + 6, y + 6], fill=WHITE, outline=BLACK, width=2)
    d.ellipse([18, 18, 62, 62], fill=WHITE, outline=BLACK, width=3)
    d.ellipse([30, 30, 50, 50], fill=PINK_SOFT, outline=BLACK, width=3)
    d.ellipse([36, 36, 44, 44], fill=CORAL)
    save(img, "icon-settings.png")

    # service chat
    img, d = new(80, 80, (0, 0, 0, 0))
    d.rounded_rectangle([8, 14, 72, 58], radius=14, fill=WHITE, outline=BLACK, width=3)
    d.polygon([(28, 56), (40, 72), (52, 56)], fill=WHITE)
    d.line([(30, 56), (40, 70), (50, 56)], fill=BLACK, width=3)
    # smiley
    d.ellipse([24, 26, 34, 36], fill=BLACK)
    d.ellipse([46, 26, 56, 36], fill=BLACK)
    d.arc([28, 30, 52, 52], start=0, end=180, fill=BLACK, width=3)
    # antenna / headset
    d.arc([20, 8, 60, 36], start=200, end=340, fill=CORAL, width=3)
    save(img, "icon-service.png")


def make_logo():
    size = 80
    img, d = new(size, size, (0, 0, 0, 0))
    d.rounded_rectangle([4, 4, size - 5, size - 5], radius=18, fill=PINK_SOFT, outline=BLACK, width=3)
    draw_cat(d, 12, 22, CREAM, patch=BROWN, s=3, open_mouth=True)
    save(img, "nav-logo.png")


def make_add_tile():
    size = 128
    img, d = new(size, size, (0, 0, 0, 0))
    d.rounded_rectangle([3, 3, size - 4, size - 4], radius=28, fill=WHITE, outline=CORAL, width=5)
    # dashed-like plus
    d.rectangle([56, 32, 72, 96], fill=CORAL)
    d.rectangle([32, 56, 96, 72], fill=CORAL)
    # corner dots
    for cx, cy in [(28, 28), (100, 28), (28, 100), (100, 100)]:
        d.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=PINK_DEEP)
    save(img, "icon-add-pet.png")


def make_sprites():
    img, d = new(160, 160, (0, 0, 0, 0))
    draw_cat(d, 14, 28, CREAM, patch=BROWN, s=7, open_mouth=True)
    save(img, "sprite-cat-white.png")

    img, d = new(160, 160, (0, 0, 0, 0))
    draw_corgi(d, 14, 32, s=7, open_mouth=True)
    save(img, "sprite-corgi.png")

    img, d = new(120, 120, (0, 0, 0, 0))
    draw_corgi(d, 10, 22, s=5, open_mouth=True)
    save(img, "sprite-corgi-small.png")

    img, d = new(160, 160, (0, 0, 0, 0))
    draw_cat(d, 14, 28, GRAY, patch=GRAY_D, s=7, open_mouth=True)
    save(img, "sprite-cat-gray.png")

    for name, bg in [("tile-pink.png", PINK_SOFT), ("tile-peach.png", PEACH), ("tile-blue.png", BLUE_SOFT)]:
        img, d = new(128, 128, (0, 0, 0, 0))
        d.rounded_rectangle([0, 0, 127, 127], radius=28, fill=bg)
        save(img, name)


def make_tabs():
    inactive = GRAY_ICON
    active = CORAL

    def home(color, name):
        img, d = new(64, 64, (0, 0, 0, 0))
        for y in range(6, 28):
            half = (y - 6) // 2 + 2
            d.rectangle([32 - half * 2, y, 32 + half * 2, y], fill=color)
        d.rectangle([16, 26, 48, 50], fill=color)
        d.rectangle([28, 36, 38, 50], fill=(0, 0, 0, 0))
        d.rectangle([40, 12, 48, 26], fill=color)
        save(img, name)

    def community(color, name, filled=False):
        img, d = new(64, 64, (0, 0, 0, 0))
        boxes = [(10, 10, 30, 30), (34, 10, 54, 30), (10, 34, 30, 54), (34, 34, 54, 54)]
        for x1, y1, x2, y2 in boxes:
            if filled:
                d.rounded_rectangle([x1, y1, x2, y2], radius=4, fill=color)
            else:
                d.rounded_rectangle([x1, y1, x2, y2], radius=4, outline=color, width=3)
        save(img, name)

    def mine(color, name):
        img, d = new(64, 64, (0, 0, 0, 0))
        d.ellipse([24, 6, 40, 22], fill=color)
        d.ellipse([12, 26, 52, 56], fill=color)
        d.rectangle([0, 48, 64, 64], fill=(0, 0, 0, 0))
        save(img, name)

    home(inactive, "tab-home.png")
    home(active, "tab-home-active.png")
    community(inactive, "tab-community.png", filled=False)
    community(active, "tab-community-active.png", filled=True)
    mine(inactive, "tab-mine.png")
    mine(active, "tab-mine-active.png")


def make_all_avatars():
    make_avatar("post-avatar-1.png", "corgi", None, None, PEACH, s=6)
    make_avatar("post-avatar-2.png", "cat", CREAM, BROWN, BLUE_SOFT, s=6)
    make_avatar("profile-avatar.png", "corgi", None, None, PINK_SOFT, s=6)
    make_avatar("avatar-white-cat.png", "cat", CREAM, BROWN, PINK_SOFT, s=6)
    make_avatar("avatar-corgi.png", "corgi", None, None, PEACH, s=6)
    make_avatar("avatar-orange-corgi.png", "corgi", None, None, PINK_SOFT, s=5)
    make_avatar("avatar-gray-cat.png", "cat", GRAY, GRAY_D, PINK_SOFT, s=6)


if __name__ == "__main__":
    make_banner()
    make_all_avatars()
    make_feed_icon()
    make_vaccine_icon()
    make_walk_icon()
    make_health_icon()
    make_menu_icons()
    make_logo()
    make_add_tile()
    make_sprites()
    make_tabs()
    print("FINAL ASSETS DONE")
