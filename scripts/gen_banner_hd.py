# -*- coding: utf-8 -*-
"""Pixel-art banner assets for the home page.

Generates:
  assets/banner-bg.png             scene background with no pets
  assets/banner-pets/<breed>.png   transparent 32x32-grid pet sprites
  assets/banner-pets/anim/<breed>.png  12 pose frames + seamless repeat frame
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
SHEET_DIR = os.path.join(PET_DIR, "anim")
W, H = 1440, 680
S = 10
FRAMES = 12
SHEET_FRAMES = FRAMES + 1


def pose_of(frame, species):
    poses = {
        0: {},
        1: {"ear": (1, 1), "paw": 1, "mouth": "smile"},
        2: {"blink": True},
        3: {"mouth": "happy", "ear": (1, 1)},
        4: {"gaze": 1, "ear": (0, 1)},
        5: {"squint": True, "mouth": "smile"},
        6: {"paw": 2},
        7: {"mouth": "yawn", "ear": (1, 0)},
        8: {"gaze": -1, "ear": (0, 1)},
        9: {"stretch": 1, "mouth": "smile"},
        10: {"paw": 3, "mouth": "smile"},
        11: {"ear": (1, 0), "gaze": 1},
    }
    pose = dict(poses.get(frame, {}))
    defaults = {
        "ear": (0, 0), "paw": 0, "gaze": 0, "blink": False,
        "squint": False, "mouth": "normal", "stretch": 0, "tail": 0,
    }
    for key, value in defaults.items():
        pose.setdefault(key, value)
    if species == "cat":
        if frame == 10:
            pose.update(paw=3, mouth="smile")
        if frame == 11:
            pose.update(ear=(1, 0), gaze=1)
    else:
        if frame == 10:
            pose.update(tail=1)
        if frame == 11:
            pose.update(tail=-1)
    return pose

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


def shade(c, factor=0.72):
    alpha = c[3] if len(c) > 3 else 255
    return (int(c[0] * factor), int(c[1] * factor), int(c[2] * factor), alpha)


def base_face(d, ox, oy, s, fur, ear=("erect", None), inner=INNER_EAR,
              ear_lift=(0, 0), head_shift=0):
    kind, ec = ear
    ec = ec or fur
    ey = oy - head_shift
    left_lift, right_lift = ear_lift
    variant = sum(fur[:3]) % 3
    if variant == 1:
        right_lift += 1
    elif variant == 2:
        left_lift += 1
    if kind == "erect":
        rows(d, ox, ey - left_lift, EAR_ROWS, ec, s=s)
        rows(d, ox, ey - right_lift, EAR_ROWS, ec, mirror=True, s=s)
        rows(d, ox, ey - left_lift, EAR_INNER, inner, s=s)
        rows(d, ox, ey - right_lift, EAR_INNER, inner, mirror=True, s=s)
    elif kind == "floppy":
        rows(d, ox, ey - left_lift, FLOPPY_EAR, ec, s=s)
        rows(d, ox, ey - right_lift, FLOPPY_EAR, ec, mirror=True, s=s)
    for y, x0, x1 in HEAD_ROWS:
        R(d, ox + x0, ey + y, x1 - x0 + 1, 1, fur, s)
    outline = shade(fur, 0.68)
    R(d, ox + 9, ey + 27, 14, 1, outline, s)
    R(d, ox + 6, ey + 26, 3, 1, outline, s)
    R(d, ox + 23, ey + 25, 3, 1, outline, s)
    R(d, ox + 14, ey + 6, 3, 1, fur, s)
    R(d, ox + 15, ey + 5, 1, 2, fur, s)
    fur_shade = shade(fur, 0.88)
    R(d, ox + 7, ey + 22, 3, 2, fur_shade, s)
    R(d, ox + 23, ey + 19, 2, 3, fur_shade, s)
    R(d, ox + 11, ey + 7, 4, 1, fur_shade, s)


def eyes(d, ox, oy, s, iris, eye=BLACK, blink=False, squint=False, gaze=0):
    for idx, ex in enumerate((7, 18)):
        if blink:
            R(d, ox + ex, oy + 18, 7 if idx == 0 else 6, 2, eye, s)
            R(d, ox + ex + (2 if idx == 0 else 1), oy + 17, 3, 1, eye, s)
            continue
        if squint:
            R(d, ox + ex + 1, oy + 18, 5, 1, eye, s)
            R(d, ox + ex + 2, oy + 17, 3, 1, eye, s)
            R(d, ox + ex + (3 if idx == 0 else 2), oy + 16, 1, 1, eye, s)
            continue
        R(d, ox + ex, oy + 15, 7, 6, WHITE, s)
        if iris:
            R(d, ox + ex + 2 + gaze, oy + 16, 4 if idx == 0 else 3, 5, iris, s)
        R(d, ox + ex + 3 + gaze, oy + 16, 2, 5, eye, s)
        R(d, ox + ex + 2 + gaze, oy + 16, 1, 1, WHITE, s)
        R(d, ox + ex + (5 if idx == 0 else 4) + gaze,
          oy + (19 if idx == 0 else 18), 1, 1, WHITE, s)


def blush_and_whiskers(d, ox, oy, s, whisker=BLACK, blush=BLUSH):
    R(d, ox + 5, oy + 20, 2, 2, blush, s)
    R(d, ox + 25, oy + 21, 3, 2, blush, s)
    for wy, x0, w in ((18, 0, 7), (21, 1, 5), (24, 0, 6)):
        R(d, ox + x0, oy + wy, w, 1, whisker, s)
    for wy, x0, w in ((19, 26, 5), (22, 25, 6)):
        R(d, ox + x0, oy + wy, w, 1, whisker, s)


def chest(d, ox, oy, s, fur, chest_c, paw=0):
    for y, w in ((28, 10), (29, 14), (30, 18), (31, 20)):
        R(d, ox + 3, oy + y, 26, 1, fur, s)
        R(d, ox + 16 - w // 2, oy + y, w, 1, chest_c, s)
    R(d, ox + 7, oy + 30, 4, 1, shade(chest_c, 0.86), s)
    py = 29 - (1 if paw in (1, 3) else 0)
    if paw in (1, 3):
        R(d, ox + 4, oy + py, 4, 3, fur, s)
    if paw in (2, 3):
        R(d, ox + 24, oy + py, 4, 3, fur, s)


def draw_tail(d, ox, oy, s, fur, direction):
    if direction > 0:
        R(d, ox + 27, oy + 26, 3, 2, fur, s)
        R(d, ox + 29, oy + 24, 2, 3, fur, s)
    elif direction < 0:
        R(d, ox + 2, oy + 26, 3, 2, fur, s)
        R(d, ox + 1, oy + 24, 2, 3, fur, s)


def draw_cat(d, ox, oy, s, fur, ear=("erect", None), patch=None, patch2=None,
             stripes=None, iris=(112, 190, 145, 255), eye=BLACK,
             nose_c=(255, 125, 145, 255), chest_c=CREAM,
             whisker=(55, 50, 55, 255), inner=INNER_EAR, frame=0):
    pose = pose_of(frame, "cat")
    fy = oy - pose["stretch"]
    base_face(d, ox, oy, s, fur, ear, inner,
              ear_lift=pose["ear"], head_shift=pose["stretch"])
    if patch:
        R(d, ox + 3, fy + 12, 10, 7, patch, s)
        R(d, ox + 2, fy + 15, 4, 4, patch, s)
        R(d, ox + 8, fy + 18, 4, 2, patch, s)
    if patch2:
        R(d, ox + 18, fy + 13, 10, 7, patch2, s)
        R(d, ox + 26, fy + 16, 4, 4, patch2, s)
        R(d, ox + 20, fy + 20, 3, 2, patch2, s)
    if stripes:
        R(d, ox + 9, fy + 10, 2, 4, stripes, s)
        R(d, ox + 15, fy + 8, 3, 4, stripes, s)
        R(d, ox + 21, fy + 11, 2, 2, stripes, s)
    eyes(d, ox, fy, s, iris, eye,
         blink=pose["blink"], squint=pose["squint"], gaze=pose["gaze"])
    R(d, ox + 8, fy + 13, 2, 1, fur, s)
    R(d, ox + 21, fy + 12, 3, 1, fur, s)
    R(d, ox + 15, fy + 21, 2, 2, nose_c, s)
    mouth = pose["mouth"]
    if mouth == "yawn":
        R(d, ox + 13, fy + 23, 6, 4, BLACK, s)
        R(d, ox + 14, fy + 24, 4, 2, MOUTH, s)
        R(d, ox + 15, fy + 26, 2, 1, (255, 170, 180, 255), s)
    elif mouth == "happy":
        R(d, ox + 14, fy + 23, 4, 1, BLACK, s)
        R(d, ox + 14, fy + 24, 4, 2, MOUTH, s)
        R(d, ox + 15, fy + 25, 2, 1, (255, 170, 180, 255), s)
    elif mouth == "smile":
        R(d, ox + 13, fy + 24, 6, 1, BLACK, s)
        R(d, ox + 14, fy + 25, 4, 1, MOUTH, s)
        R(d, ox + 15, fy + 26, 2, 1, (255, 170, 180, 255), s)
    else:
        R(d, ox + 14, fy + 23, 4, 1, BLACK, s)
        R(d, ox + 12, fy + 24, 2, 1, BLACK, s)
        R(d, ox + 18, fy + 24, 2, 1, BLACK, s)
        R(d, ox + 14, fy + 25, 4, 1, BLACK, s)
        R(d, ox + 15, fy + 25, 2, 1, MOUTH, s)
    blush_and_whiskers(d, ox, fy, s, whisker)
    chest(d, ox, oy, s, fur, chest_c, paw=pose["paw"])


def draw_dog(d, ox, oy, s, fur, muzzle, ear=("erect", None),
             iris=(70, 60, 55, 255), brows=None, blaze=0,
             nose_c=NOSE, chest_c=CREAM, frame=0):
    pose = pose_of(frame, "dog")
    fy = oy - pose["stretch"]
    base_face(d, ox, oy, s, fur, ear, inner=(255, 215, 200, 255),
              ear_lift=pose["ear"], head_shift=pose["stretch"])
    if blaze:
        if blaze >= 6:
            blaze_rows = [
                (10, 14, 2), (11, 13, 4), (12, 13, 4), (13, 12, 6),
                (14, 12, 6), (15, 13, 4), (16, 14, 2), (17, 14, 2),
                (18, 15, 1), (19, 15, 1),
            ]
            for by, bx, bw in blaze_rows:
                R(d, ox + bx, fy + by, bw, 1, muzzle, s)
            R(d, ox + 20, fy + 18, 2, 3, muzzle, s)
        else:
            R(d, ox + 15, fy + 10, 2, 11, muzzle, s)
            R(d, ox + 14, fy + 13, 4, 7, muzzle, s)
            R(d, ox + 17, fy + 18, 2, 3, muzzle, s)
    R(d, ox + 9, fy + 18, 14, 9, muzzle, s)
    R(d, ox + 8, fy + 19, 16, 7, muzzle, s)
    eyes(d, ox, fy, s, iris,
         blink=pose["blink"], squint=pose["squint"], gaze=pose["gaze"])
    if brows:
        R(d, ox + 8, fy + 13, 2, 2, brows, s)
        R(d, ox + 22, fy + 13, 2, 2, brows, s)
    R(d, ox + 14, fy + 21, 4, 3, nose_c, s)
    mouth = pose["mouth"]
    if mouth == "yawn":
        R(d, ox + 12, fy + 24, 8, 4, BLACK, s)
        R(d, ox + 14, fy + 25, 4, 2, MOUTH, s)
        R(d, ox + 14, fy + 27, 4, 2, (255, 175, 185, 255), s)
    elif mouth == "happy":
        R(d, ox + 14, fy + 24, 4, 1, BLACK, s)
        R(d, ox + 13, fy + 25, 6, 2, MOUTH, s)
        R(d, ox + 13, fy + 26, 6, 3, (255, 175, 185, 255), s)
    elif mouth == "smile":
        R(d, ox + 13, fy + 25, 6, 1, BLACK, s)
        R(d, ox + 14, fy + 26, 4, 1, MOUTH, s)
    else:
        R(d, ox + 14, fy + 24, 4, 1, BLACK, s)
        R(d, ox + 12, fy + 24, 2, 1, BLACK, s)
        R(d, ox + 18, fy + 24, 2, 1, BLACK, s)
        R(d, ox + 13, fy + 25, 6, 2, MOUTH, s)
        R(d, ox + 15, fy + 26, 2, 2, (255, 175, 185, 255), s)
    R(d, ox + 5, fy + 20, 2, 2, BLUSH, s)
    R(d, ox + 25, fy + 20, 2, 2, BLUSH, s)
    chest(d, ox, oy, s, fur, chest_c, paw=pose["paw"])
    draw_tail(d, ox, oy, s, fur, pose["tail"])


PET_SPECS = {
    "cat-orange": lambda d, x, y, s, f: draw_cat(d, x, y, s, ORANGE, stripes=ORANGE_D, frame=f),
    "cat-tuxedo": lambda d, x, y, s, f: draw_cat(d, x, y, s, WHITE, ear=("erect", BLACK), patch=BLACK, frame=f),
    "cat-calico": lambda d, x, y, s, f: draw_cat(d, x, y, s, CREAM, patch=ORANGE, patch2=BROWN, frame=f),
    "cat-siamese": lambda d, x, y, s, f: draw_cat(d, x, y, s, CREAM, ear=("erect", (122, 96, 106)), patch=(150, 120, 128), patch2=(150, 120, 128), frame=f),
    "cat-black": lambda d, x, y, s, f: draw_cat(d, x, y, s, (52, 52, 56), inner=(96, 96, 104), eye=(250, 205, 95), nose_c=(255, 150, 165), whisker=(255, 255, 255, 170), frame=f),
    "cat-british": lambda d, x, y, s, f: draw_cat(d, x, y, s, GRAY, frame=f),
    "dog-corgi": lambda d, x, y, s, f: draw_dog(d, x, y, s, ORANGE, WHITE, ear=("erect", ORANGE), brows=CREAM, frame=f),
    "dog-shiba": lambda d, x, y, s, f: draw_dog(d, x, y, s, (240, 152, 92), CREAM, ear=("erect", (212, 122, 68)), frame=f),
    "dog-golden": lambda d, x, y, s, f: draw_dog(d, x, y, s, (248, 198, 120), (255, 228, 175), ear=("floppy", (225, 165, 88)), frame=f),
    "dog-husky": lambda d, x, y, s, f: draw_dog(d, x, y, s, GRAY, WHITE, blaze=6, iris=(120, 180, 235), frame=f),
    "dog-poodle": lambda d, x, y, s, f: draw_dog(d, x, y, s, (186, 140, 100), (226, 186, 146), ear=("floppy", (155, 110, 75)), frame=f),
    "dog-frenchie": lambda d, x, y, s, f: draw_dog(d, x, y, s, (170, 174, 182), (110, 114, 122), ear=("erect_wide", None), frame=f),
}


def make_base():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # flat retro bands with dithered seams instead of a smooth gradient
    grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    bands = [
        (255, 238, 244, 255),
        (255, 223, 233, 255),
        (255, 206, 221, 255),
        (249, 187, 205, 255),
    ]
    band_h = (H - 28) // len(bands)
    for i, color in enumerate(bands):
        y0 = 16 + i * band_h
        y1 = 16 + (i + 1) * band_h if i < len(bands) - 1 else H - 12
        gd.rectangle([0, y0, W, y1], fill=color)
    for y in (16 + band_h, 16 + 2 * band_h, 16 + 3 * band_h):
        for x in range(0, W, 16):
            jitter = (x // 16) % 4
            if jitter != 0:
                gd.rectangle(
                    [x + jitter, y + jitter % 2, x + 7 + jitter, y + 7 + jitter % 2],
                    fill=(255, 255, 255, 42),
                )
            if jitter != 2:
                gd.rectangle(
                    [x + 8 - jitter, y + 8, x + 15 - jitter, y + 15],
                    fill=(238, 165, 182, 34),
                )
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
        fn(ImageDraw.Draw(pet), 0, 0, S, 0)
        path = os.path.join(PET_DIR, key + ".png")
        pet.save(path)
        print("saved", path)


def make_animations():
    os.makedirs(SHEET_DIR, exist_ok=True)
    for key, fn in PET_SPECS.items():
        sheet = Image.new("RGBA", (32 * S * SHEET_FRAMES, 32 * S), (0, 0, 0, 0))
        for frame in range(SHEET_FRAMES):
            pet = Image.new("RGBA", (32 * S, 32 * S), (0, 0, 0, 0))
            source_frame = 0 if frame == FRAMES else frame
            fn(ImageDraw.Draw(pet), 0, 0, S, source_frame)
            sheet.paste(pet, (frame * 32 * S, 0), pet)
        path = os.path.join(SHEET_DIR, key + ".png")
        sheet.save(path)
        print("saved", path)


if __name__ == "__main__":
    make_bg()
    make_pets()
    make_animations()
    make_banner()
    print("BANNER ASSETS DONE")
