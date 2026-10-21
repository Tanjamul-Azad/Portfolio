"""Verify rendered image URLs and HTTP caching without browser dependencies."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.request import Request, urlopen


class Images(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []

    def handle_starttag(self, tag, attrs):
        if tag == "img":
            self.items.append(dict(attrs))


def verify(base):
    pages = ["/", "/projects", "/projects/radflow", "/blog", "/blog/all",
             "/blog/neuro-symbolic-ai-the-case-for-hybrid-minds"]
    assets = set()
    for page in pages:
        with urlopen(base + page, timeout=40) as response:
            parser = Images()
            parser.feed(response.read().decode("utf-8"))
        prepared = [img for img in parser.items if img.get("src", "").startswith("/images/optimized/")]
        assert prepared, f"No prepared images: {page}"
        assert not any("/_next/image?" in img.get("src", "") for img in parser.items), page
        for image in prepared:
            assets.add(image["src"])
            for candidate in image.get("srcset", "").split(","):
                if candidate.strip():
                    assets.add(candidate.strip().split()[0])
        print(f"{page}: {len(prepared)} prepared images; no runtime image transforms")

    def inspect(asset):
        with urlopen(Request(base + asset, method="HEAD"), timeout=30) as response:
            assert response.status == 200, asset
            assert response.headers.get_content_type() == "image/webp", asset
            assert "immutable" in response.headers.get("Cache-Control", ""), asset
            etag = response.headers.get("ETag")
            assert etag, asset
        return asset, etag

    with ThreadPoolExecutor(max_workers=4) as pool:
        checked = list(pool.map(inspect, sorted(assets)))
    asset, etag = checked[0]
    try:
        urlopen(Request(base + asset, headers={"If-None-Match": etag}), timeout=30)
        raise AssertionError("Conditional image request did not return 304")
    except HTTPError as error:
        assert error.code == 304, error.code
    print(f"PASS: {len(checked)} responsive image URLs, immutable caching, ETags and conditional HTTP 304")


if __name__ == "__main__":
    arguments = argparse.ArgumentParser()
    arguments.add_argument("--base", default="https://tanzamul.dev")
    verify(arguments.parse_args().base.rstrip("/"))
