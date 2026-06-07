#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os
import textwrap

def create_og_image(title, output_path, lang="en"):
    W, H = 1200, 630
    bg_color = "#F5F0EB"
    bar_color = "#8D9B8E"
    text_color = "#333333"
    brand_color = "#8D9B8E"

    img = Image.new("RGB", (W, H), bg_color)
    draw = ImageDraw.Draw(img)

    draw.rectangle([0, 0, W, 80], fill=bar_color)

    font_paths_en = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    font_paths_zh = [
        "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    ]

    font_candidates = font_paths_zh if lang == "zh" else font_paths_en

    title_font = None
    brand_font = None
    for fp in font_candidates + font_paths_en:
        if os.path.exists(fp):
            try:
                title_font = ImageFont.truetype(fp, 46)
                brand_font = ImageFont.truetype(fp, 28)
                break
            except Exception:
                continue

    if title_font is None:
        title_font = ImageFont.load_default()
        brand_font = ImageFont.load_default()

    max_chars = 22 if lang == "zh" else 38
    wrapped = textwrap.wrap(title, width=max_chars)

    line_height = 65
    total_h = len(wrapped) * line_height
    start_y = (H - total_h) // 2 - 20

    for i, line in enumerate(wrapped):
        bbox = draw.textbbox((0, 0), line, font=title_font)
        line_w = bbox[2] - bbox[0]
        x = (W - line_w) // 2
        y = start_y + i * line_height
        draw.text((x, y), line, font=title_font, fill=text_color)

    brand = "BloomPath"
    bbox = draw.textbbox((0, 0), brand, font=brand_font)
    bw = bbox[2] - bbox[0]
    draw.text(((W - bw) // 2, H - 55), brand, font=brand_font, fill=brand_color)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG", quality=85)
    print(f"Saved: {output_path}")

if __name__ == "__main__":
    create_og_image(
        "When Your Toddler Melts Down at Costco: Surviving Public Tantrums",
        "/home/user/Parenting-Site/public/og/toddler-meltdown-grocery-store-public-en.png",
        lang="en"
    )
    create_og_image(
        "孩子在好市多崩潰？搞懂公共場所失控的真正原因",
        "/home/user/Parenting-Site/public/og/toddler-meltdown-grocery-store-public-zh.png",
        lang="zh"
    )
