from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630

VOID = (255, 255, 255)
GOLD = (255, 203, 62)
MAGENTA = (240, 36, 143)
CYAN = (2, 132, 199)

def load_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

heading_path = "assets/fonts/heading.woff2"
f_title = load_font(heading_path, 168)
f_tag = load_font(heading_path, 34)

# --- base: hero photo, cover-cropped to 1200x630 ---
photo = Image.open("assets/hero-photo.jpg").convert("RGB")
scale = max(W / photo.width, H / photo.height)
photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
left = (photo.width - W) // 2
top = (photo.height - H) // 2
img = photo.crop((left, top, left + W, top + H))

# --- scrim for legibility (vertical gradient + slight overall darken) ---
scrim = Image.new("L", (1, H))
for y in range(H):
    t = y / (H - 1)
    scrim.putpixel((0, y), int(255 * (0.45 + 0.30 * t)))
scrim = scrim.resize((W, H))
black = Image.new("RGB", (W, H), (12, 9, 16))
img = Image.composite(black, img, scrim)

draw = ImageDraw.Draw(img)

def center_text(draw_obj, cy, text, font, fill):
    bbox = draw_obj.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (W - tw) / 2 - bbox[0]
    y = cy - th / 2 - bbox[1]
    draw_obj.text((x, y), text, font=font, fill=fill)
    return tw

# --- tagline ---
center_text(draw, 210, "Salt Lake City's First Japanese Inspired Arcade", f_tag, GOLD)

# --- CLAW ZONE with magenta glow ---
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gdraw = ImageDraw.Draw(glow)
tb = draw.textbbox((0, 0), "CLAW ZONE", font=f_title)
tw = tb[2] - tb[0]
th = tb[3] - tb[1]
gx = (W - tw) / 2 - tb[0]
gy = 315 - th / 2 - tb[1]
gdraw.text((gx, gy), "CLAW ZONE", font=f_title, fill=(240, 36, 143, 255))
glow = glow.filter(ImageFilter.GaussianBlur(18))
img.paste(Image.new("RGB", (W, H), MAGENTA), (0, 0), glow.split()[3].point(lambda a: int(a * 0.85)))
center_text(draw, 315, "CLAW ZONE", f_title, VOID)

# --- divider gradient bar ---
bar_w, bar_h = 460, 6
bx = (W - bar_w) // 2
by = 430
bar = Image.new("RGB", (bar_w, bar_h))
bd = bar.load()
for x in range(bar_w):
    t = x / (bar_w - 1)
    bd[x, 0] = tuple(round(MAGENTA[i] + (CYAN[i] - MAGENTA[i]) * t) for i in range(3))
for y in range(1, bar_h):
    for x in range(bar_w):
        bar.putpixel((x, y), bar.getpixel((x, 0)))
mask = Image.new("L", (bar_w, bar_h), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, bar_w - 1, bar_h - 1], radius=3, fill=255)
img.paste(bar, (bx, by), mask)

img.save("assets/og-image.jpg", quality=88, optimize=True)
print("wrote assets/og-image.jpg", img.size)
