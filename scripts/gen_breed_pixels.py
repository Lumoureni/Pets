# -*- coding: utf-8 -*-
"""Generate pixel-art avatars for cat & dog breeds.

Independent from gen_pixel_assets.py output: writes to assets/breeds/,
reuses the same palette and 18x18 face template for a consistent look.
"""
import math
import os

from PIL import Image

from gen_pixel_assets import (
    BLACK, WHITE, CREAM, ORANGE, ORANGE_D, BROWN, GRAY, GRAY_D,
    INNER_EAR, BLUSH, NOSE, MOUTH,
    PINK_SOFT, PEACH, BLUE_SOFT,
    new, rect,
)

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "breeds")


def save_breed(img, name):
    os.makedirs(OUT_DIR, exist_ok=True)
    img.save(os.path.join(OUT_DIR, name))
    print("saved", name)


def draw_breed_cat(d, ox, oy, s, fur, inner=INNER_EAR, ear_color=None,
                   patch=None, patch2=None, stripes=None,
                   eye=BLACK, iris=(140, 210, 255, 255),
                   nose_c=NOSE, whisker=BLACK):
    """18x18 pixel cat face with breed customization."""
    ec = ear_color or fur
    # ears
    rect(d, ox + 1 * s, oy, 5 * s, 5 * s, ec)
    rect(d, ox + 12 * s, oy, 5 * s, 5 * s, ec)
    rect(d, ox + 2 * s, oy + 1 * s, 3 * s, 3 * s, inner)
    rect(d, ox + 13 * s, oy + 1 * s, 3 * s, 3 * s, inner)
    # head
    rect(d, ox + 2 * s, oy + 4 * s, 14 * s, 11 * s, fur)
    rect(d, ox + 3 * s, oy + 3 * s, 12 * s, 1 * s, fur)
    rect(d, ox + 1 * s, oy + 6 * s, 1 * s, 7 * s, fur)
    rect(d, ox + 16 * s, oy + 6 * s, 1 * s, 7 * s, fur)
    rect(d, ox + 3 * s, oy + 15 * s, 12 * s, 1 * s, fur)
    # left eye patch
    if patch:
        rect(d, ox + 3 * s, oy + 4 * s, 5 * s, 5 * s, patch)
        rect(d, ox + 2 * s, oy + 7 * s, 3 * s, 4 * s, patch)
        rect(d, ox + 4 * s, oy + 3 * s, 3 * s, 1 * s, patch)
    # right eye patch (mirror)
    if patch2:
        rect(d, ox + 10 * s, oy + 4 * s, 5 * s, 5 * s, patch2)
        rect(d, ox + 13 * s, oy + 7 * s, 3 * s, 4 * s, patch2)
        rect(d, ox + 11 * s, oy + 3 * s, 3 * s, 1 * s, patch2)
    # forehead stripes (tabby)
    if stripes:
        rect(d, ox + 6 * s, oy + 3 * s, 1 * s, 3 * s, stripes)
        rect(d, ox + 8 * s, oy + 3 * s, 1 * s, 4 * s, stripes)
        rect(d, ox + 10 * s, oy + 3 * s, 1 * s, 3 * s, stripes)
    # eyes
    rect(d, ox + 5 * s, oy + 8 * s, 3 * s, 4 * s, eye)
    rect(d, ox + 10 * s, oy + 8 * s, 3 * s, 4 * s, eye)
    rect(d, ox + 5 * s, oy + 8 * s, 1 * s, 1 * s, WHITE)
    rect(d, ox + 10 * s, oy + 8 * s, 1 * s, 1 * s, WHITE)
    if iris:
        rect(d, ox + 7 * s, oy + 11 * s, 1 * s, 1 * s, iris)
        rect(d, ox + 12 * s, oy + 11 * s, 1 * s, 1 * s, iris)
    # blush / nose / mouth
    rect(d, ox + 3 * s, oy + 12 * s, 2 * s, 1 * s, BLUSH)
    rect(d, ox + 13 * s, oy + 12 * s, 2 * s, 1 * s, BLUSH)
    rect(d, ox + 8 * s, oy + 12 * s, 2 * s, 2 * s, nose_c)
    rect(d, ox + 7 * s, oy + 14 * s, 4 * s, 2 * s, MOUTH)
    rect(d, ox + 7 * s, oy + 14 * s, 4 * s, 1 * s, nose_c)
    rect(d, ox + 8 * s, oy + 15 * s, 2 * s, 1 * s, (255, 160, 170, 255))
    # whiskers
    for dy in (11, 13):
        rect(d, ox - 1 * s, oy + dy * s, 3 * s, 1 * s, whisker)
        rect(d, ox + 16 * s, oy + dy * s, 3 * s, 1 * s, whisker)


def draw_breed_dog(d, ox, oy, s, fur, muzzle, ear="erect", ear_color=None,
                   ear_inner=(255, 210, 195, 255), ear_tip=None,
                   blaze=4, blaze_wide=False, cheeks=True,
                   eye=BLACK, iris=None, brows=False, wrinkles=False,
                   tongue=True, topknot=False, nose_c=NOSE):
    """18x18 pixel dog face with breed customization."""
    ec = ear_color or fur
    # ears
    if ear == "erect":
        rect(d, ox + 1 * s, oy - 2 * s, 5 * s, 8 * s, ec)
        rect(d, ox + 12 * s, oy - 2 * s, 5 * s, 8 * s, ec)
        rect(d, ox + 2 * s, oy - 1 * s, 3 * s, 4 * s, ear_inner)
        rect(d, ox + 13 * s, oy - 1 * s, 3 * s, 4 * s, ear_inner)
        if ear_tip:
            rect(d, ox + 1 * s, oy - 3 * s, 2 * s, 2 * s, ear_tip)
            rect(d, ox + 14 * s, oy - 3 * s, 2 * s, 2 * s, ear_tip)
    elif ear == "erect_wide":
        rect(d, ox, oy - 2 * s, 6 * s, 9 * s, ec)
        rect(d, ox + 12 * s, oy - 2 * s, 6 * s, 9 * s, ec)
        rect(d, ox + 2 * s, oy, 2 * s, 4 * s, ear_inner)
        rect(d, ox + 14 * s, oy, 2 * s, 4 * s, ear_inner)
    elif ear == "floppy":
        rect(d, ox - 1 * s, oy + 6 * s, 5 * s, 10 * s, ec)
        rect(d, ox + 14 * s, oy + 6 * s, 5 * s, 10 * s, ec)
    # head
    rect(d, ox + 2 * s, oy + 4 * s, 14 * s, 10 * s, fur)
    rect(d, ox + 3 * s, oy + 3 * s, 12 * s, 1 * s, fur)
    if topknot:
        rect(d, ox + 5 * s, oy + 1 * s, 8 * s, 3 * s, fur)
        rect(d, ox + 4 * s, oy + 2 * s, 10 * s, 2 * s, fur)
    # blaze / muzzle
    if blaze:
        hw = blaze // 2
        top_y = 3 if blaze_wide else 4
        top_h = 5 if blaze_wide else 4
        rect(d, ox + (9 - hw) * s, oy + top_y * s, blaze * s, top_h * s, muzzle)
        rect(d, ox + 6 * s, oy + 8 * s, 6 * s, 4 * s, muzzle)
        rect(d, ox + 5 * s, oy + 11 * s, 8 * s, 4 * s, muzzle)
        rect(d, ox + 6 * s, oy + 14 * s, 6 * s, 1 * s, muzzle)
    else:
        rect(d, ox + 6 * s, oy + 9 * s, 6 * s, 5 * s, muzzle)
    # side cheeks
    if cheeks:
        rect(d, ox + 3 * s, oy + 9 * s, 3 * s, 4 * s, fur)
        rect(d, ox + 12 * s, oy + 9 * s, 3 * s, 4 * s, fur)
    # wrinkles (flat face)
    if wrinkles:
        rect(d, ox + 6 * s, oy + 4 * s, 1 * s, 3 * s, nose_c)
        rect(d, ox + 11 * s, oy + 4 * s, 1 * s, 3 * s, nose_c)
    # eyes
    rect(d, ox + 4 * s, oy + 7 * s, 3 * s, 4 * s, eye)
    rect(d, ox + 11 * s, oy + 7 * s, 3 * s, 4 * s, eye)
    rect(d, ox + 4 * s, oy + 7 * s, 1 * s, 1 * s, WHITE)
    rect(d, ox + 11 * s, oy + 7 * s, 1 * s, 1 * s, WHITE)
    if iris:
        rect(d, ox + 6 * s, oy + 10 * s, 1 * s, 1 * s, iris)
        rect(d, ox + 13 * s, oy + 10 * s, 1 * s, 1 * s, iris)
    if brows:
        rect(d, ox + 4 * s, oy + 5 * s, 2 * s, 2 * s, muzzle)
        rect(d, ox + 12 * s, oy + 5 * s, 2 * s, 2 * s, muzzle)
    # blush / nose / mouth
    rect(d, ox + 3 * s, oy + 12 * s, 2 * s, 1 * s, BLUSH)
    rect(d, ox + 13 * s, oy + 12 * s, 2 * s, 1 * s, BLUSH)
    rect(d, ox + 8 * s, oy + 11 * s, 2 * s, 2 * s, nose_c)
    rect(d, ox + 7 * s, oy + 13 * s, 4 * s, 3 * s, MOUTH)
    rect(d, ox + 7 * s, oy + 13 * s, 4 * s, 1 * s, nose_c)
    if tongue:
        rect(d, ox + 8 * s, oy + 15 * s, 2 * s, 1 * s, (255, 165, 175, 255))


BREEDS = [
    ("cat-orange", lambda d, x, y, s: draw_breed_cat(d, x, y, s, ORANGE, stripes=ORANGE_D), PINK_SOFT),
    ("cat-tuxedo", lambda d, x, y, s: draw_breed_cat(d, x, y, s, WHITE, patch=BLACK, ear_color=BLACK), BLUE_SOFT),
    ("cat-calico", lambda d, x, y, s: draw_breed_cat(d, x, y, s, CREAM, patch=ORANGE, patch2=BROWN, ear_color=ORANGE), PEACH),
    ("cat-siamese", lambda d, x, y, s: draw_breed_cat(d, x, y, s, CREAM, ear_color=(122, 96, 106), patch=(150, 120, 128), patch2=(150, 120, 128)), PINK_SOFT),
    ("cat-black", lambda d, x, y, s: draw_breed_cat(d, x, y, s, (52, 52, 56), inner=(96, 96, 104), eye=(250, 205, 95), iris=None, nose_c=(255, 150, 165), whisker=(255, 255, 255, 170)), BLUE_SOFT),
    ("cat-british", lambda d, x, y, s: draw_breed_cat(d, x, y, s, GRAY), PEACH),
    ("dog-corgi", lambda d, x, y, s: draw_breed_dog(d, x, y, s, ORANGE, WHITE, ear_tip=ORANGE_D), PINK_SOFT),
    ("dog-shiba", lambda d, x, y, s: draw_breed_dog(d, x, y, s, (240, 152, 92), CREAM, ear_tip=(212, 122, 68), brows=True), BLUE_SOFT),
    ("dog-golden", lambda d, x, y, s: draw_breed_dog(d, x, y, s, (248, 198, 120), (255, 228, 175), ear="floppy", ear_color=(225, 165, 88)), PEACH),
    ("dog-husky", lambda d, x, y, s: draw_breed_dog(d, x, y, s, GRAY, WHITE, blaze=6, blaze_wide=True, ear_tip=GRAY_D, iris=(120, 180, 235)), PINK_SOFT),
    ("dog-poodle", lambda d, x, y, s: draw_breed_dog(d, x, y, s, (186, 140, 100), (226, 186, 146), ear="floppy", ear_color=(155, 110, 75), topknot=True), BLUE_SOFT),
    ("dog-frenchie", lambda d, x, y, s: draw_breed_dog(d, x, y, s, (170, 174, 182), (110, 114, 122), ear="erect_wide", blaze=0, wrinkles=True), PEACH),
]


def make_breed_avatar(name, bg, draw_fn, s=6):
    size = 128
    img, d = new(size, size, (0, 0, 0, 0))
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=28, fill=bg)
    d.rounded_rectangle([5, 5, size - 6, size - 6], radius=24, outline=BLACK, width=3)
    draw_fn(d, 16, 30, s)
    save_breed(img, name + ".png")


def make_preview():
    cols, cell, gap, margin = 4, 128, 16, 24
    rows = int(math.ceil(len(BREEDS) / float(cols)))
    w = margin * 2 + cols * cell + (cols - 1) * gap
    h = margin * 2 + rows * cell + (rows - 1) * gap
    board, _ = new(w, h, (244, 245, 247, 255))
    for i, (name, _, _) in enumerate(BREEDS):
        img = Image.open(os.path.join(OUT_DIR, name + ".png")).convert("RGBA")
        r, c = divmod(i, cols)
        board.alpha_composite(img, (margin + c * (cell + gap), margin + r * (cell + gap)))
    save_breed(board, "breeds-preview.png")


if __name__ == "__main__":
    for name, fn, bg in BREEDS:
        make_breed_avatar(name, bg, fn)
    make_preview()
    print("BREED AVATARS DONE")
