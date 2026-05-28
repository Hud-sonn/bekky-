#!/usr/bin/env python3
"""Compress videos (via ffmpeg) and images (via Pillow) in the public/ directory.

Usage:
    python scripts/compress_media.py              # compress everything
    python scripts/compress_media.py --video-only  # only videos
    python scripts/compress_media.py --image-only  # only images
    python scripts/compress_media.py --dry-run     # show what would be done
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

PUBLIC_DIR = Path(__file__).resolve().parent.parent / "public"
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Target max dimensions/sizes
VIDEO_CRF = 28  # CRF 28 = good compression, decent quality (lower = better quality/larger)
IMAGE_QUALITY = 80  # JPEG quality 0-100
IMAGE_MAX_WIDTH = 1920
IMAGE_MAX_HEIGHT = 1080
IMAGE_MAX_SIZE_KB = 200  # Warn if still > this after compression


def sizeof_fmt(size_bytes: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if size_bytes < 1024:
            return f"{size_bytes:.1f}{unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f}TB"


def has_ffmpeg() -> bool:
    if shutil.which("ffmpeg"):
        return True
    home_bin = Path.home() / "bin" / "ffmpeg"
    if home_bin.exists():
        os.environ["PATH"] = f"{home_bin.parent}:{os.environ.get('PATH', '')}"
        return True
    return False


def has_pillow() -> bool:
    try:
        from PIL import Image
        return True
    except ImportError:
        return False


def compress_video(path: Path, dry_run: bool) -> bool:
    orig_size = path.stat().st_size
    tmp = path.with_suffix(path.suffix + ".tmp.mp4")

    if dry_run:
        print(f"  [DRY-RUN] Would compress: {path.name} ({sizeof_fmt(orig_size)})")
        return True

    # Use libx264 with CRF, fast start for web streaming, reduce audio bitrate
    cmd = [
        "ffmpeg", "-y", "-i", str(path),
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", str(VIDEO_CRF),
        "-movflags", "+faststart",
        "-c:a", "aac", "-b:a", "64k",
        "-loglevel", "error",
        str(tmp),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  [ERROR] ffmpeg failed for {path.name}: {result.stderr.strip()}")
        if tmp.exists():
            tmp.unlink()
        return False

    new_size = tmp.stat().st_size
    ratio = new_size / orig_size
    if ratio < 1:
        tmp.replace(path)
        print(f"  Compressed: {path.name}  {sizeof_fmt(orig_size)} → {sizeof_fmt(new_size)} ({ratio:.0%})")
        return True
    else:
        tmp.unlink()
        print(f"  Skipped (no gain): {path.name}  {sizeof_fmt(orig_size)}")
        return True


def compress_image(path: Path, dry_run: bool) -> bool:
    from PIL import Image

    orig_size = path.stat().st_size
    if dry_run:
        print(f"  [DRY-RUN] Would compress: {path.name} ({sizeof_fmt(orig_size)})")
        return True

    img = Image.open(path)
    orig_mode = img.mode
    orig_w, orig_h = img.size

    # Convert RGBA/RGB to RGB for JPEG saving
    rgb_img = img
    if path.suffix.lower() in (".jpg", ".jpeg") and img.mode in ("RGBA", "P"):
        rgb_img = img.convert("RGB")

    # Resize if larger than max dimensions
    if orig_w > IMAGE_MAX_WIDTH or orig_h > IMAGE_MAX_HEIGHT:
        ratio = min(IMAGE_MAX_WIDTH / orig_w, IMAGE_MAX_HEIGHT / orig_h)
        new_w = int(orig_w * ratio)
        new_h = int(orig_h * ratio)
        rgb_img = rgb_img.resize((new_w, new_h), Image.LANCZOS)

    # Save with optimization
    save_kwargs = {"optimize": True}
    if path.suffix.lower() in (".jpg", ".jpeg"):
        save_kwargs["quality"] = IMAGE_QUALITY
        save_kwargs["progressive"] = True
    elif path.suffix.lower() == ".png":
        save_kwargs["compress_level"] = 9
    elif path.suffix.lower() == ".webp":
        save_kwargs["quality"] = IMAGE_QUALITY

    rgb_img.save(path, **save_kwargs)
    new_size = path.stat().st_size
    ratio = new_size / orig_size

    if ratio < 1:
        print(f"  Compressed: {path.name}  {sizeof_fmt(orig_size)} → {sizeof_fmt(new_size)} ({ratio:.0%})", end="")
        if new_size > IMAGE_MAX_SIZE_KB * 1024:
            print(f"  ⚠ still > {IMAGE_MAX_SIZE_KB}KB", end="")
        print()
    else:
        print(f"  Skipped (no gain): {path.name}  {sizeof_fmt(orig_size)}")

    return True


def collect_files(video_only: bool, image_only: bool):
    videos, images = [], []

    for root, _dirs, files in os.walk(PUBLIC_DIR):
        for f in files:
            p = Path(root) / f
            ext = p.suffix.lower()
            if ext in VIDEO_EXTENSIONS:
                videos.append(p)
            elif ext in IMAGE_EXTENSIONS:
                images.append(p)

    if video_only:
        return videos, []
    if image_only:
        return [], images
    return videos, images


def main():
    parser = argparse.ArgumentParser(description="Compress media files in public/")
    parser.add_argument("--video-only", action="store_true", help="Only compress videos")
    parser.add_argument("--image-only", action="store_true", help="Only compress images")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done")
    args = parser.parse_args()

    videos, images = collect_files(args.video_only, args.image_only)

    if videos:
        if not has_ffmpeg():
            print("[SKIP] ffmpeg not found — installing via apt:")
            subprocess.run(["sudo", "apt", "install", "-y", "ffmpeg"])
            if not has_ffmpeg():
                print("[ERROR] ffmpeg still not available after install attempt. Skipping videos.")
                videos = []

        if videos:
            print(f"\n--- Compressing {len(videos)} video(s) ---")
            for v in videos:
                compress_video(v, args.dry_run)

    if images:
        if not has_pillow():
            print("[INSTALL] Installing Pillow...")
            subprocess.run([sys.executable, "-m", "pip", "install", "Pillow", "-q"])
            if not has_pillow():
                print("[ERROR] Pillow not available. Skipping images.")
                images = []

        if images:
            print(f"\n--- Compressing {len(images)} image(s) ---")
            for img in images:
                compress_image(img, args.dry_run)

    print("\nDone.")


if __name__ == "__main__":
    main()
