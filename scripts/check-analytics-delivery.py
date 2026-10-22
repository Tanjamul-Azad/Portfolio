"""Verify the public integration is deployed; does not claim GA has received events."""
import argparse
from html.parser import HTMLParser
from urllib.parse import urljoin
from urllib.request import urlopen
import json
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--base", default="https://tanzamul.dev")
base = parser.parse_args().base.rstrip("/")
expected = json.loads((Path(__file__).resolve().parents[1] / "src/content/analytics.json").read_text())["measurementId"]
assert expected.startswith("G-"), "Real stream ID required"


class Scripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sources = set()

    def handle_starttag(self, tag, attrs):
        if tag == "script":
            source = dict(attrs).get("src", "")
            if source:
                self.sources.add(source)


with urlopen(base + "/", timeout=30) as response:
    document = response.read().decode()
scripts = Scripts()
scripts.feed(document)
assert not any("googletagmanager.com" in src for src in scripts.sources), "Google loader must wait for browser consent"
found = False
for source in scripts.sources:
    if not source.startswith("/_next/static/"):
        continue
    with urlopen(urljoin(base, source), timeout=30) as response:
        found |= expected.encode() in response.read()
assert found, "Expected measurement ID missing from public client bundles"
with urlopen(base + "/privacy", timeout=30) as response:
    privacy = response.read().decode()
    assert "noindex" in privacy
    assert "googletagmanager.com" in response.headers.get("Content-Security-Policy", "")
    assert "Optional Google Analytics" in privacy
print("PASS: expected GA4 ID, consent-gated initial HTML, privacy page and CSP. Realtime receipt still requires account-side verification.")
