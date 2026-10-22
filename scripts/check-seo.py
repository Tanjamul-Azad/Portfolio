"""Audit public sitemap pages and crawler-visible HTML using only the standard library."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from urllib.error import HTTPError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.h1 = 0
        self.description = ""
        self.canonical = ""
        self.robots = []
        self.links = set()
        self.images = []
        self.schema = []
        self.in_schema = False
        self.schema_text = ""
        self.svg_depth = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "svg":
            self.svg_depth += 1
        if tag == "title" and not self.svg_depth:
            self.in_title = True
        if tag == "h1":
            self.h1 += 1
        if tag == "meta":
            if attrs.get("name") == "description":
                self.description = attrs.get("content", "")
            if attrs.get("name") in ("robots", "googlebot"):
                self.robots.append(attrs.get("content", ""))
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href", "")
        if tag == "a":
            self.links.add(attrs.get("href", ""))
        if tag == "img":
            self.images.append(attrs)
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_schema = True
            self.schema_text = ""

    def handle_endtag(self, tag):
        if tag == "svg":
            self.svg_depth -= 1
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.in_schema:
            self.schema.append(json.loads(self.schema_text))
            self.in_schema = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_schema:
            self.schema_text += data


def fetch(url):
    with urlopen(Request(url, headers={"User-Agent": "PortfolioSEOAudit/1.0"}), timeout=45) as response:
        return response.status, response.geturl(), response.read(), response.headers


def audit(base):
    status, _, xml, _ = fetch(base + "/sitemap.xml")
    assert status == 200
    root = ET.fromstring(xml)
    paths = [urlparse(node.text).path or "/" for node in root.findall("{*}url/{*}loc")]
    assert len(paths) == len(set(paths)), "Duplicate sitemap URLs"
    project_count = len([path for path in paths if path.startswith("/projects/") and not path.startswith("/projects/page/")])

    def inspect(path):
        status, final, html, headers = fetch(base + path)
        assert status == 200 and urlparse(final).path.rstrip("/") == path.rstrip("/"), path
        page = Page()
        page.feed(html.decode("utf-8"))
        assert page.title and page.description and page.h1 == 1, (path, page.title, page.h1)
        assert page.canonical.rstrip("/") == ("https://tanzamul.dev" + path).rstrip("/"), (path, page.canonical)
        assert not any("noindex" in robot for robot in page.robots), path
        assert "noindex" not in headers.get("X-Robots-Tag", ""), path
        assert page.schema, path
        assert all("alt" in image for image in page.images), path
        assert not any("tanjamul-azad.vercel.app" in link for link in page.links), path
        if path in ("/projects", "/projects/page/2"):
            details = {link for link in page.links if link.startswith("/projects/") and "/page/" not in link}
            expected = min(9, project_count if path == "/projects" else max(0, project_count - 9))
            assert len(details) >= expected, (path, details)
        if path == "/":
            assert "Tanzamul Azad" in page.title and "Tanjamul" not in page.title
            website = next(item for group in page.schema for item in group.get("@graph", []) if item.get("@type") == "WebSite")
            assert website["name"] == "Tanzamul", website
        return {"path": path, "title": page.title, "canonical": page.canonical, "h1": page.h1, "schema_blocks": len(page.schema), "internal_links": len([link for link in page.links if link.startswith("/")])}

    with ThreadPoolExecutor(max_workers=3) as pool:
        report = list(pool.map(inspect, paths))
    assert len({page["title"] for page in report}) == len(report), "Duplicate page titles"
    _, _, robots, _ = fetch(base + "/robots.txt")
    assert b"Sitemap: https://tanzamul.dev/sitemap.xml" in robots
    for path in ("/projects/not-a-real-project-seo-check", "/blog/not-a-real-post-seo-check", "/projects/page/999"):
        try:
            fetch(base + path)
            raise AssertionError("Expected real 404: " + path)
        except HTTPError as error:
            assert error.code == 404, (path, error.code)
    print(json.dumps({"base": base, "pages_checked": len(report), "pages": report, "result": "PASS"}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="https://tanzamul.dev")
    audit(parser.parse_args().base.rstrip("/"))
