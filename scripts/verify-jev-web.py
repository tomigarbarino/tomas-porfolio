"""HTTP verification of native study content; no browser automation.

python scripts/verify-jev-web.py --base-url http://127.0.0.1:4323 --output report.json
"""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen
import argparse
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]

class StudyHTML(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inside = False
        self.text = []
        self.sections = []
        self.figures = []
        self.figure_images = []
        self.original_links = []
        self.viewer_links = []
        self.references = []
        self.embeds = 0
        self.downloads = []
        self.tables = []
        self.table = None
        self.row = None
        self.cell = None
        self.canonical = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "article" and attrs.get("id") == "jev-study":
            self.inside = True
        if tag in ("iframe", "object", "embed"):
            self.embeds += 1
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "a" and "download" in attrs:
            self.downloads.append(attrs.get("href"))
        if not self.inside:
            return
        if tag == "section" and "jev-section" in attrs.get("class", "").split():
            self.sections.append(attrs["id"])
        if tag == "figure" and "jev-figure" in attrs.get("class", "").split():
            self.figures.append(attrs["id"])
        if tag == "img":
            self.figure_images.append(attrs.get("src"))
        if tag == "a" and "jev-figure__original" in attrs.get("class", "").split():
            self.original_links.append(attrs.get("href"))
        if tag == "a" and attrs.get("href", "").startswith(("/writing/jev/figures/", "/es/writing/jev/figures/")):
            self.viewer_links.append(attrs["href"])
        if tag == "li" and attrs.get("id", "").startswith("jev-ref-"):
            self.references.append(attrs["id"])
        if tag == "table":
            self.table = []
        if tag == "tr" and self.table is not None:
            self.row = []
        if tag in ("td", "th") and self.row is not None:
            self.cell = ""

    def handle_data(self, data):
        if self.inside:
            self.text.append(data)
        if self.cell is not None:
            self.cell += data

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.cell is not None:
            self.row.append(self.cell)
            self.cell = None
        if tag == "tr" and self.row is not None:
            self.table.append(self.row)
            self.row = None
        if tag == "table" and self.table is not None:
            self.tables.append(self.table)
            self.table = None
        if tag == "article":
            self.inside = False

def normalize(text):
    return "".join(char.lower() for char in text if char.isalnum())

def main():
    args = argparse.ArgumentParser()
    args.add_argument("--base-url", required=True)
    args.add_argument("--output", type=Path, required=True)
    args.add_argument("--locale", choices=("en", "es"), default="en")
    options = args.parse_args()
    prefix = "/es" if options.locale == "es" else ""
    content = "src/content" if options.locale == "es" else "src/localized/en/content"
    base = options.base_url.rstrip("/")
    study = json.loads((ROOT / f"{content}/jev-study.json").read_text(encoding="utf-8"))
    report = json.loads((ROOT / "src/content/jev-report.json").read_text(encoding="utf-8"))
    styled = json.loads((ROOT / f"{content}/jev-figure-style.json").read_text(encoding="utf-8"))["figures"]
    with urlopen(base + prefix + "/writing/jev", timeout=30) as response:
        assert response.status == 200
        html = response.read().decode()
    page = StudyHTML()
    page.feed(html)
    assert page.embeds == 0, "The study must not depend on a PDF embed"
    assert page.canonical == "https://tomas-garbarino.vercel.app" + prefix + "/writing/jev"
    assert page.sections == [f'jev-{section["id"]}' for section in study["sections"]]
    assert page.figures == [f"jev-figure-{n}" for n in range(1, 8)]
    assert page.references == [f"jev-ref-{n}" for n in range(1, 26)]
    assert report["localPath"] in page.downloads
    assert len(page.tables) == len(study["tables"]) == 8
    cells = 0
    for actual, expected in zip(page.tables, study["tables"]):
        assert actual[0] == expected["columns"]
        assert actual[1:] == expected["rows"], expected["id"]
        cells += sum(len(row) for row in actual[1:])
    visible = normalize("".join(page.text))
    for section in study["sections"]:
        assert normalize(section["title"]) in visible
        for block in section["blocks"]:
            text = block.get("text", block.get("caption", ""))
            if block["type"] == "listItem":
                text = re.sub(r"^\d\.\s*", "", text)
            assert normalize(text) in visible, text[:100]
    figures = [block for section in study["sections"] for block in section["blocks"] if block["type"] == "figure"]
    assert page.figure_images == [figure["src"] for figure in styled]
    assert page.original_links == [figure["src"] for figure in figures]
    assert page.viewer_links == [f'{prefix}/writing/jev/figures/{figure["number"]}' for figure in styled]

    def check_figure(figure):
        with urlopen(base + figure["src"], timeout=30) as response:
            data = response.read()
        assert hashlib.sha256(data).hexdigest() == figure["sha256"]
        if figure["src"].endswith(".svg"):
            svg = data.decode()
            assert '<image' not in svg and 'data:image' not in svg
            assert 'font-family:Barlow;' in svg and 'font-family:Plex;' in svg
        return {"number": figure["number"], "sha256": figure["sha256"]}

    def check_viewer(path):
        with urlopen(base + path, timeout=30) as response:
            document = response.read().decode()
            assert response.status == 200
        labels = ('Descargar SVG', 'Ajustar al panel') if options.locale == 'es' else ('Download SVG', 'Fit to panel')
        assert all(label in document for label in labels) and 'noindex' in document
        return path

    with ThreadPoolExecutor(max_workers=4) as executor:
        verified_figures = list(executor.map(check_figure, figures))
        verified_styled = list(executor.map(check_figure, styled))
        verified_viewers = list(executor.map(check_viewer, page.viewer_links))
    with urlopen(base + report["localPath"], timeout=30) as response:
        pdf = response.read()
        assert response.headers.get_content_type() == "application/pdf"
    assert hashlib.sha256(pdf).hexdigest() == report["sha256"]
    result = {"base": base, "locale": options.locale, "status": "passed", "nativeSections": len(page.sections), "nativeTables": len(page.tables),
              "tableDataCells": cells, "references": len(page.references), "embeds": page.embeds,
              "allScientificProseRendered": True, "figures": verified_figures, "styledFigures": verified_styled,
              "vectorViewers": verified_viewers,
              "pdf": {"path": report["localPath"], "pages": report["pages"], "sha256": report["sha256"]}}
    options.output.parent.mkdir(parents=True, exist_ok=True)
    options.output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
