"""Create compact WebP covers and separate mobile/list sizes.

Usage: python tools/optimize-images.py src/assets/images/example.png
Requires: python -m pip install Pillow
"""

from argparse import ArgumentParser
from pathlib import Path

from PIL import Image, ImageOps


def write_webp(image: Image.Image, target: Path, max_width: int, quality: int) -> None:
    width = min(image.width, max_width)
    height = round(image.height * width / image.width)
    resized = image.resize((width, height), Image.Resampling.LANCZOS)
    temporary = target.with_name(target.stem + ".tmp.webp")
    resized.save(temporary, format="WEBP", quality=quality, method=6)
    temporary.replace(target)
    print(f"{target}: {width}x{height}, {target.stat().st_size // 1024} KiB")


def optimize(source: Path) -> None:
    if not source.is_file() or source.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
        raise ValueError(f"Unsupported image: {source}")
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        image = image.convert("RGBA" if image.has_transparency_data else "RGB")
        target = source.with_suffix(".webp")
        if source.suffix.lower() != ".webp":
            write_webp(image, target, 1280, 78)
        write_webp(image, target.with_name(target.stem + "-small.webp"), 800, 76)
        write_webp(image, target.with_name(target.stem + "-thumb.webp"), 480, 72)


if __name__ == "__main__":
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("images", nargs="+", type=Path)
    args = parser.parse_args()
    for image_path in args.images:
        optimize(image_path)
