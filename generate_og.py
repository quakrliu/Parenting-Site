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

    # Top bar
    draw.rectangle([0, 0, W, 80], fill=bar_color)

    # Try to load font
    font_paths_en = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ]
    font_paths_zh = [
        "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc",
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

    # Wrap title text
    max_chars = 30 if lang == "zh" else 40
    wrapped = textwrap.wrap(title, width=max_chars)

    # Calculate total text height
    line_height = 60
    total_h = len(wrapped) * line_height
    start_y = (H - total_h) // 2 - 20

    for i, line in enumerate(wrapped):
        bbox = draw.textbbox((0, 0), line, font=title_font)
        line_w = bbox[2] - bbox[0]
        x = (W - line_w) // 2
        y = start_y + i * line_height
        draw.text((x, y), line, font=brand_font if title_font is None else title_font, fill=text_color)

    # Brand name at bottom
    brand = "BloomPath"
    bbox = draw.textbbox((0, 0), brand, font=brand_font)
    bw = bbox[2] - bbox[0]
    draw.text(((W - bw) // 2, H - 55), brand, font=brand_font, fill=brand_color)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG", quality=85)
    print(f"Saved: {output_path}")

if __name__ == "__main__":
    create_og_image(
        "Why My Toddler Cries at Preschool Drop-Off Every Morning",
        "/home/user/Parenting-Site/public/og/toddler-preschool-drop-off-tears-en.png",
        lang="en"
    )
    create_og_image(
        "台中蒙特梭利幼兒園完整指南 2026：學費、入學、家長真實心得",
        "/home/user/Parenting-Site/public/og/taichung-montessori-schools-2026-zh.png",
        lang="zh"
    )
