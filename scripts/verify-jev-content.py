"""Check native scientific prose/captions against every eligible PDF source line.

Run with Python + pdfplumber. Table bodies are separately transcribed/reviewed;
tests/jev-study.test.mjs checks their structure and key decision denominators.
PDF running headers/footers, title furniture and author affiliation footnote
are not part of the web reading-body comparison.
"""
from pathlib import Path
from collections import Counter
import json
import re
import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
study = json.loads((ROOT / "src/content/jev-study.json").read_text(encoding="utf-8"))
parts = []
for section in study["sections"]:
    parts.append(section["title"])
    for block in section["blocks"]:
        prefix = f'[{block["number"]}] ' if block["type"] == "reference" else ""
        parts.append(prefix + block.get("text", block.get("caption", "")))
parts.extend(table["caption"] for table in study["tables"])

def normalize(text):
    return "".join(char.lower() for char in text if char.isalnum())

web = normalize(" ".join(parts))
table_bodies = {7: [(100, 408)], 8: [(430, 543)], 9: [(405, 502)],
                10: [(428, 557)], 11: [(67, 148), (424, 560)],
                17: [(103, 320), (396, 511)]}
missing = []
checked = 0
numeric_tables = []
row_ranges = [(7, 127, 395), (8, 459, 532), (9, 439, 490), (10, 470, 544),
              (11, 104, 135), (11, 454, 547), (17, 145, 307), (17, 419, 499)]
with pdfplumber.open(ROOT / "public/documents/jev-agora-research.pdf") as pdf:
    for number, page in enumerate(pdf.pages, 1):
        for line in page.extract_text_lines(x_tolerance=1, y_tolerance=5):
            if line["top"] < 60 or line["bottom"] > 790 or (number == 1 and (line["top"] < 280 or line["top"] > 720)):
                continue
            if any(start <= line["top"] < end for start, end in table_bodies.get(number, [])):
                continue
            checked += 1
            if normalize(line["text"]) not in web:
                missing.append({"page": number, "text": line["text"]})
    for table, (number, top, bottom) in zip(study["tables"], row_ranges):
        original = pdf.pages[number - 1].crop((60, top, 536, bottom)).extract_text(x_tolerance=1, y_tolerance=5)
        native = " ".join(" ".join(row) for row in table["rows"])
        numbers = lambda text: Counter(re.findall(r"\d+(?:[.,]\d+)*", text))
        assert numbers(original) == numbers(native), f'Table {table["label"]}: numerical content differs'
        numeric_tables.append(table["label"])
print(json.dumps({"checkedSourceLines": checked, "missingLines": missing, "numericalTablesMatched": numeric_tables}, ensure_ascii=False, indent=2))
assert not missing, "Original source prose is missing from the web study"
