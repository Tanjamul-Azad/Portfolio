"""Prepare gzip siblings once at deployment, avoiding per-request compression work."""
import gzip
from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1]).resolve()
count = 0
saved = 0
for folder in (root / "next-static", root / "tech-icons"):
    for source in folder.rglob("*"):
        if not source.is_file() or source.suffix not in {".js", ".css", ".json", ".svg", ".wasm"}:
            continue
        if not source.resolve().is_relative_to(root):
            raise ValueError("Asset escapes the configured root")
        stat = source.stat()
        if stat.st_size < 1024:
            continue
        target = source.with_name(source.name + ".gz")
        if target.exists() and target.stat().st_mtime >= stat.st_mtime:
            continue
        temporary = target.with_name(target.name + ".tmp")
        with source.open("rb") as input_file, temporary.open("wb") as output_file:
            with gzip.GzipFile(filename="", mode="wb", compresslevel=6, mtime=int(stat.st_mtime), fileobj=output_file) as archive:
                shutil.copyfileobj(input_file, archive)
        temporary.replace(target)
        count += 1
        saved += stat.st_size - target.stat().st_size
print(f"Prepared {count} compressed assets; {saved:,} fewer transfer bytes per complete uncached asset set")
