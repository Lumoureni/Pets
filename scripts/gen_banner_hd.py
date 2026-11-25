# -*- coding: utf-8 -*-
"""Pixel-art banner assets for the home page.

Generates:
  assets/banner-bg.png             scene background with no pets
  assets/banner-pets/<breed>.png   transparent 32x32-grid pet sprites
  assets/banner-pets.png           static sample banner (fallback)
"""
import os

from PIL import Image, ImageDraw

from gen_pixel_assets import (
    BLACK, WHITE, CREAM, ORANGE, ORANGE_D, BROWN, GRAY, GRAY_D,
    INNER_EAR, BLUSH, NOSE, MOUTH,
    draw_heart, draw_paw, draw_bone, draw_cloud, draw_star,
    rect,
)

ASSETS = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets"))
OUT = os.path.join(ASSETS, "banner-pets.png")
BG_OUT = os.path.join(ASSETS, "banner-bg.png")
PET_DIR = os.path.join(ASSETS, "banner-pets")
W, H = 1440, 680
S = 10

HEAD_ROWS = [
    (8, 6, 25), (9, 5, 26), (10, 4, 27), (11, 3, 28), (12, 3, 28),
    (13, 2, 29), (14, 2, 29), (15, 2, 29), (16, 2, 29), (17, 2, 29),
    (18, 2, 29), (19, 2, 29), (20, 2, 29), (21, 2, 29), (22, 2, 29),
    (23, 3, 28), (24, 4, 27), (25, 5, 26), (26, 6, 25), (27, 8, 23),
    (28, 10, 21),
]
EAR_ROWS = [
    (2, 5, 7), (3, 4, 8), (4, 4, 9), (5, 3, 10), (6, 3, 11), (7, 2, 12),
    (8, 2, 13), (9, 2, 13), (10, 2, 14), (11, 3, 14),
]
EAR_INNER = [
    (4, 5, 6), (5, 4, 7), (6, 4, 8), (7, 4, 8), (8, 3, 9),
    (9, 3, 9), (10, 3, 9),
]
FLOPPY_EAR = [
    (9, 0, 5), (10, 0, 5), (11, 0, 5), (12, 0, 5), (13, 0, 5),
    (14, 0, 5), (15, 0, 5), (16, 1, 5), (17, 1, 5), (18, 2, 5),
    (19, 2, 5), (20, 3, 5),
]


def R(d, x, y, w, h, c, s=S):
    rect(d, x * s, y * s, w * s, h * s, c)


def rows(d, ox, oy, data, c, mirror=False, s=S):
    for y, x0, x1 in data:
        if mirror:
            x0, x1 = 31 - x1, 31 - x0
        R(d, ox + x0, oy + y, x1 - x0 + 1, 1, c, s)


def base_face(d, ox, oy, s, fur, ear=("erect", None), inner=INNER_EAR):
    kind, ec = ear
    ec = ec or fur
    if kind == "erect":
        rows(d, ox, oy, EAR_ROWS, ec, s=s)
        rows(d, ox, oy, EAR_ROWS, ec, mirror=True, s=s)
        rows(d, ox, oy, EAR_INNER, inner, s=s)
        rows(d, ox, oy, EAR_INNER, inner, mirror=True, s=s)
    elif kind == "floppy":
        rows(d, ox, oy, FLOPPY_EAR, ec, s=s)
        rows(d, ox, oy, FLOPPY_EAR, ec, mirror=True, s=s)
    for y, x0, x1 in HEAD_ROWS:
        R(d, ox + x0, oy + y, x1 - x0 + 1, 1, fur, s)


def eyes(d, ox, oy, s, iris, eye=BLACK):
    for ex in (7, 18):
        R(d, ox + ex, oy + 15, 7, 6, WHITE, s)
        if iris:
            R(d, ox + ex + 2, oy + 16, 4, 5, iris, s)
        R(d, ox + ex + 3, oy + 16, 2, 5, eye, s)
        R(d, ox + ex + 2, oy + 16, 1, 1, WHITE, s)
        R(d, ox + ex + 5, oy + 19, 1, 1, WHITE, s)


def blush_and_whiskers(d, ox, oy, s, whisker=BLACK, blush=BLUSH):
    R(d, ox + 5, oy + 20, 2, 2, blush, s)
    R(d, ox + 25, oy + 20, 2, 2, blush, s)
    for wy, x0, w in ((18, 0, 7), (21, 1, 6), (24, 0, 7)):
        R(d, ox + x0, oy + wy, w, 1, whisker, s)
        R(d, ox + 26, oy + wy, 6, 1, whisker, s)


def chest(d, ox, oy, s, fur, chest_c):
    for y, w in ((28, 10), (29, 14), (30, 18), (31, 20)):
        R(d, ox + 3, oy + y, 26, 1, fur, s)
        R(d, ox + 16 - w // 2, oy + y, w, 1, chest_c, s)


def draw_cat(d, ox, oy, s, fur, ear=("erect", None), patch=None, patch2=None,
             stripes=None, iris=(112, 190, 145, 255), eye=BLACK,
             nose_c=(255, 125, 145, 255), chest_c=CREAM,
             whisker=(55, 50, 55, 255), inner=INNER_EAR):
    base_face(d, ox, oy, s, fur, ear, inner)
    if patch:
        R(d, ox + 3, oy + 12, 11, 8, patch, s)
        R(d, ox + 2, oy + 15, 4, 5, patch, s)
    if patch2:
        R(d, ox + 18, oy + 12, 11, 8, patch2, s)
        R(d, ox + 26, oy + 15, 4, 5, patch2, s)
    if stripes:
        R(d, ox + 9, oy + 10, 2, 3, stripes, s)
        R(d, ox + 15, oy + 9, 2, 4, stripes, s)
        R(d, ox + 21, oy + 10, 2, 3, stripes, s)
    eyes(d, ox, oy, s, iris, eye)
    R(d, ox + 8, oy + 13, 2, 1, fur, s)
    R(d, ox + 22, oy + 13, 2, 1, fur, s)
    R(d, ox + 15, oy + 21, 2, 2, nose_c, s)
    R(d, ox + 14, oy + 23, 4, 1, BLACK, s)
    R(d, ox + 12, oy + 24, 2, 1, BLACK, s)
    R(d, ox + 18, oy + 24, 2, 1, BLACK, s)
    R(d, ox + 14, oy + 25, 4, 1, BLACK, s)
    R(d, ox + 15, oy + 25, 2, 1, MOUTH, s)
    blush_and_whiskers(d, ox, oy, s, whisker)
    chest(d, ox, oy, s, fur, chest_c)


def draw_dog(d, ox, oy, s, fur, muzzle, ear=("erect", None),
             iris=(70, 60, 55, 255), brows=None, blaze=0,
             nose_c=NOSE, chest_c=CREAM):
    base_face(d, ox, oy, s, fur, ear, inner=(255, 215, 200, 255))
    if blaze:
        if blaze >= 6:
            R(d, ox + 13, oy + 10, 6, 10, muzzle, s)
            R(d, ox + 12, oy + 13, 8, 6, muzzle, s)
        else:
            R(d, ox + 15, oy + 10, 2, 11, muzzle, s)
            R(d, ox + 14, oy + 13, 4, 7, muzzle, s)
    R(d, ox + 9, oy + 18, 14, 9, muzzle, s)
    R(d, ox + 8, oy + 19, 16, 7, muzzle, s)
    eyes(d, ox, oy, s, iris)
    if brows:
        R(d, ox + 8, oy + 13, 2, 2, brows, s)
        R(d, ox + 22, oy + 13, 2, 2, brows, s)
    R(d, ox + 14, oy + 21, 4, 3, nose_c, s)
    R(d, ox + 14, oy + 24, 4, 1, BLACK, s)
    R(d, ox + 12, oy + 24, 2, 1, BLACK, s)
    R(d, ox + 18, oy + 24, 2, 1, BLACK, s)
    R(d, ox + 13, oy + 25, 6, 2, MOUTH, s)
    R(d, ox + 15, oy + 26, 2, 2, (255, 175, 185, 255), s)
    R(d, ox + 5, oy + 20, 2, 2, BLUSH, s)
    R(d, ox + 25, oy + 20, 2, 2, BLUSH, s)
    chest(d, ox, oy, s, fur, chest_c)


PET_SPECS = {
    "cat-orange": lambda d, x, y, s: draw_cat(d, x, y, s, ORANGE, stripes=ORANGE_D),
    "cat-tuxedo": lambda d, x, y, s: draw_cat(d, x, y, s, WHITE, ear=("erect", BLACK), patch=BLACK),
    "cat-calico": lambda d, x, y, s: draw_cat(d, x, y, s, CREAM, patch=ORANGE, patch2=BROWN),
    "cat-siamese": lambda d, x, y, s: draw_cat(d, x, y, s, CREAM, ear=("erect", (122, 96, 106)), patch=(150, 120, 128), patch2=(150, 120, 128)),
    "cat-black": lambda d, x, y, s: draw_cat(d, x, y, s, (52, 52, 56), inner=(96, 96, 104), eye=(250, 205, 95), nose_c=(255, 150, 165), whisker=(255, 255, 255, 170)),
    "cat-british": lambda d, x, y, s: draw_cat(d, x, y, s, GRAY),
    "dog-corgi": lambda d, x, y, s: draw_dog(d, x, y, s, ORANGE, WHITE, ear=("erect", ORANGE), brows=CREAM),
    "dog-shiba": lambda d, x, y, s: draw_dog(d, x, y, s, (240, 152, 92), CREAM, ear=("erect", (212, 122, 68))),
    "dog-golden": lambda d, x, y, s: draw_dog(d, x, y, s, (248, 198, 120), (255, 228, 175), ear=("floppy", (225, 165, 88))),
    "dog-husky": lambda d, x, y, s: draw_dog(d, x, y, s, GRAY, WHITE, blaze=6, iris=(120, 180, 235)),
    "dog-poodle": lambda d, x, y, s: draw_dog(d, x, y, s, (186, 140, 100), (226, 186, 146), ear=("floppy", (155, 110, 75))),
    "dog-frenchie": lambda d, x, y, s: draw_dog(d, x, y, s, (170, 174, 182), (110, 114, 122), ear=("erect_wide", None)),
}


def make_base():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # soft pink gradient card
    grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    top, mid, bot = (255, 236, 242, 255), (255, 214, 226, 255), (247, 183, 200, 255)
    for y in range(16, H - 12):
        t = (y - 16) / float(H - 28)
        if t < 0.55:
            k = t / 0.55
            c = tuple(int(top[i] + (mid[i] - top[i]) * k) for i in range(3)) + (255,)
        else:
            k = (t - 0.55) / 0.45
            c = tuple(int(mid[i] + (bot[i] - mid[i]) * k) for i in range(3)) + (255,)
        gd.line([(0, y), (W, y)], fill=c)
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).rounded_rectangle([12, 16, W - 13, H - 12], radius=80, fill=255)
    img.paste(grad, (0, 0), mask)

    # sky decorations
    draw_cloud(d, 170, 70, 12, (255, 255, 255, 210))
    draw_cloud(d, 700, 44, 9, (255, 255, 255, 180))
    draw_cloud(d, 1160, 90, 10, (255, 255, 255, 190))
    draw_heart(d, 480, 120, 9, (246, 150, 168, 230))
    draw_heart(d, 980, 150, 6, (255, 255, 255, 210))
    draw_star(d, 320, 150, 12, (255, 255, 255, 200))
    draw_star(d, 860, 96, 10, (255, 255, 255, 190))
    draw_star(d, 1300, 190, 9, (255, 255, 255, 180))

    # ground
    d.rounded_rectangle([12, 500, W - 13, H - 12], radius=80, fill=(238, 165, 182, 255))
    d.rectangle([90, 500, W - 90, 510], fill=(255, 255, 255, 90))
    for cx, cy in ((100, 590), (360, 610), (720, 575), (1080, 615), (1350, 580)):
        draw_paw(d, cx, cy, 9, (255, 255, 255, 95))
    draw_bone(d, 450, 590, 10, (255, 255, 255, 220))
    draw_bone(d, 900, 600, 9, (255, 255, 255, 200))
    return img


def make_banner():
    img = make_base()
    d = ImageDraw.Draw(img)
    for px in (120, 560, 1000):
        d.ellipse([px + 40, 510, px + 280, 556], fill=(205, 118, 140, 120))
    draw_cat(d, 12, 20, S, WHITE, patch=ORANGE, patch2=BROWN, iris=(110, 190, 145, 255))
    draw_dog(d, 56, 20, S, ORANGE, WHITE, ear=("erect", ORANGE),
             iris=(90, 65, 55, 255), brows=(255, 245, 225, 255))
    draw_cat(d, 100, 20, S, GRAY, ear=("erect", GRAY_D), patch=(118, 123, 133, 255),
             iris=(125, 190, 240, 255), chest_c=WHITE, whisker=(70, 75, 85, 255))
    img.save(OUT)
    print("saved", OUT)


def make_bg():
    make_base().save(BG_OUT)
    print("saved", BG_OUT)


def make_pets():
    os.makedirs(PET_DIR, exist_ok=True)
    for key, fn in PET_SPECS.items():
        pet = Image.new("RGBA", (32 * S, 32 * S), (0, 0, 0, 0))
        fn(ImageDraw.Draw(pet), 0, 0, S)
        path = os.path.join(PET_DIR, key + ".png")
        pet.save(path)
        print("saved", path)


if __name__ == "__main__":
    make_bg()
    make_pets()
    make_banner()
    print("BANNER ASSETS DONE")
