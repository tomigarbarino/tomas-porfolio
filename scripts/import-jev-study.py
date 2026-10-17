"""Import the owner's published PDF into reviewed, native web content.

Offline authoring tool only: pip install pdfplumber pypdf Pillow.
Tables are transcribed below because PDF table extraction loses merged cells.
No candidate-level data is read. The PDF remains unchanged.
"""
from pathlib import Path
import hashlib
import json
import re

import pdfplumber
from pypdf import PdfReader
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "public/documents/jev-agora-research.pdf"
EXPECTED_HASH = "e0130022fb2adbe58cee868aaa5e6dc1dbed31ec28142fdd967bc8991e13f468"

# page, full table/caption vertical bounds, caption bounds, column labels, rows
TABLES = [
    (7, 100, 443, 408, 441,
     ["Requisito", "Sistema", "AUROC [IC 95 %]", "Brier", "Exactitud auto.", "Revisión", "Recall invit.", "Neg. invitados", "Pos. rechazados"], [
         ["R1 · clave (n = 334 · prev. 11,4 %)", "JEV", "0,999 [0,997; 1,000]", "0,011", "100,0 %", "3,6 %", "76,3 %", "0,0 %", "0,0 %"],
         ["R1 · clave", "Claude Haiku 4.5", "0,999 [0,997; 1,000]", "0,012", "100,0 %", "4,5 %", "76,3 %", "0,0 %", "0,0 %"],
         ["R1 · clave", "GPT-5.4-mini", "0,999 [0,997; 1,000]", "0,020", "98,8 %", "1,8 %", "100,0 %", "1,4 %", "0,0 %"],
         ["R2 (n = 457 · prev. 18,4 %)", "JEV", "1,000 [0,999; 1,000]", "0,039", "98,6 %", "7,4 %", "98,8 %", "1,6 %", "0,0 %"],
         ["R2", "Claude Haiku 4.5", "0,968 [0,942; 0,987]", "0,045", "96,8 %", "10,5 %", "75,0 %", "2,4 %", "4,8 %"],
         ["R2", "GPT-5.4-mini", "0,981 [0,970; 0,990]", "0,132", "84,6 %", "12,0 %", "100,0 %", "16,6 %", "0,0 %"],
         ["R3 (n = 405 · prev. 31,6 %)", "JEV", "1,000 [0,999; 1,000]", "0,016", "99,7 %", "4,0 %", "93,8 %", "0,4 %", "0,0 %"],
         ["R3", "Claude Haiku 4.5", "1,000 [0,999; 1,000]", "0,011", "99,7 %", "4,7 %", "85,9 %", "0,0 %", "0,8 %"],
         ["R3", "GPT-5.4-mini", "0,999 [0,997; 1,000]", "0,040", "97,3 %", "7,4 %", "99,2 %", "3,6 %", "0,0 %"],
     ]),
    (8, 430, 578, 543, 577,
     ["Sistema", "Acuerdo [IC 95 %]", "Invitar → invitado", "Invitar → rechazado", "Revisar → rechazado", "Descartar → invitado"], [
         ["JEV · rechazo < 0,3 (original)", "41,7 % [30–54]", "7/26", "12/26", "12/15", "2/19"],
         ["JEV · rechazo < 0,05", "46,7 % [35–59]", "7/26", "0/26", "6/15", "2/19"],
         ["Claude Haiku 4.5", "45,0 % [33–57]", "11/26", "9/26", "11/15", "0/19"],
         ["GPT-5.4-mini", "53,3 % [41–65]", "19/26", "7/26", "8/15", "6/19"],
     ]),
    (9, 405, 526, 502, 525,
     ["Sistema", "Invitar vs. resto", "Descartar vs. resto", "Invitar vs. resto (sens.)", "Descartar vs. resto (sens.)"], [
         ["JEV", "0,911 [0,838; 0,968]", "0,798 [0,632; 0,946]", "0,727", "0,804"],
         ["Claude Haiku 4.5", "0,809 [0,656; 0,956]", "0,713 [0,592; 0,855]", "0,678", "0,646"],
         ["GPT-5.4-mini", "0,830 [0,704; 0,929]", "0,751 [0,578; 0,892]", "0,697", "0,757"],
     ]),
    (10, 428, 592, 557, 591,
     ["Sistema", "t−", "A revisión", "Invitados auto.", "Invitables rechazados (est.)", "Ídem, sensibilidad"], [
         ["JEV", "0,3", "32", "35", "61,0 % [37–76]", "72,2 % [52–83]"],
         ["JEV", "0,05", "136", "35", "0,0 % [0–0]", "28,8 % [0–53]"],
         ["Claude Haiku 4.5", "0,3", "71", "39", "49,3 % [22–68]", "63,9 % [38–78]"],
         ["Claude Haiku 4.5", "0,05", "161", "39", "23,7 % [0–50]", "45,7 % [7–65]"],
         ["GPT-5.4-mini", "0,3", "20", "114", "42,3 % [15–63]", "58,9 % [30–74]"],
         ["GPT-5.4-mini", "0,05", "223", "114", "0,0 % [0–0]", "14,4 % [0–40]"],
     ]),
    (11, 67, 174, 148, 173,
     ["Sistema", "t− óptimo", "Costo", "Costo con 0,3", "Pérdida fuera de muestra", "t− (sens.)", "Costo (sens.)", "Pérdida fuera de muestra (sens.)"], [
         ["JEV", "0,05", "151", "791", "4,9 %", "0,005", "476", "26,4 %"],
         ["Claude Haiku 4.5", "0,2", "437", "673", "27,2 %", "0,2", "930", "48,2 %"],
         ["GPT-5.4-mini", "0,1", "247", "588", "9,2 %", "0,03", "319", "16,3 %"],
     ]),
    (11, 424, 605, 560, 604,
     ["Sistema", "Exactitud [IC 95 %]", "F1 macro", "Parcial → sí", "Exactitud (unánime)", "JEV − sistema", "p (Holm)"], [
         ["JEV", "80,9 % [75,0–86,4]", "0,763", "27/105", "95,1 %", "—", "—"],
         ["Claude Haiku 4.5", "73,2 % [66,8–79,1]", "0,740", "52/105", "82,4 %", "+7,7 pp [0,5; 15,1]", "0,027"],
         ["GPT-5.4-mini", "66,8 % [60,1–73,0]", "0,702", "57/105", "81,7 %", "+14,1 pp [8,3; 20,8]", "< 0,001"],
         ["Evaluador histórico", "54,1 % [47,1–60,3]", "0,448", "83/105", "59,2 %", "+26,8 pp [19,0; 35,1]", "< 0,001"],
     ]),
    (17, 103, 335, 320, 334,
     ["t−", "A revisión", "Rechazados", "Invitados", "Invitables rechazados (est.)", "«Revisar» rechazados (est.)", "Descartables invitados (est.)"], [
         ["0,005", "461", "0", "35", "0,0 %", "0,0 %", "2,8 %"],
         ["0,01", "461", "0", "35", "0,0 %", "0,0 %", "2,8 %"],
         ["0,02", "342", "119", "35", "0,0 %", "22,9 %", "2,8 %"],
         ["0,03", "214", "247", "35", "0,0 %", "51,1 %", "2,8 %"],
         ["0,04", "162", "299", "35", "0,0 %", "55,1 %", "2,8 %"],
         ["0,05", "136", "325", "35", "0,0 %", "63,0 %", "2,8 %"],
         ["0,07", "106", "355", "35", "23,7 %", "70,9 %", "2,8 %"],
         ["0,1", "77", "384", "35", "35,4 %", "88,1 %", "2,8 %"],
         ["0,15", "53", "408", "35", "45,8 %", "88,1 %", "2,8 %"],
         ["0,2", "48", "413", "35", "52,8 %", "88,1 %", "2,8 %"],
         ["0,3", "32", "429", "35", "61,0 %", "88,1 %", "2,8 %"],
         ["0,4", "19", "442", "35", "74,1 %", "96,0 %", "2,8 %"],
         ["0,5", "13", "448", "35", "76,6 %", "96,0 %", "2,8 %"],
     ]),
    (17, 396, 534, 511, 533,
     ["λ", "µ", "JEV", "Claude Haiku 4.5", "GPT-5.4-mini"], [
         ["5", "2", "151 (0,05)", "271 (0,2)", "204 (0,1)"],
         ["10", "2", "151 (0,05)", "437 (0,2)", "247 (0,1)"],
         ["20", "2", "151 (0,05)", "728 (0,07)", "275 (0,05)"],
         ["50", "2", "151 (0,05)", "1.596 (0,07)", "275 (0,05)"],
         ["10", "1", "143 (0,05)", "437 (0,2)", "221 (0,1)"],
         ["10", "5", "173 (0,05)", "437 (0,2)", "325 (0,1)"],
     ]),
]

MAJOR = {
    "Resumen": "resumen", "Qué aprendimos": "aprendizajes",
    "1. Introducción": "introduccion", "2. Trabajo relacionado": "trabajo-relacionado",
    "3. Sistema": "sistema", "4. Diseño del estudio": "diseno",
    "5. Resultados": "resultados", "6. Discusión": "discusion", "7. Conclusión": "conclusion",
    "Disponibilidad de datos y código": "datos-y-codigo", "Declaración de intereses": "intereses",
    "Referencias": "referencias", "Apéndice A. Requisitos, umbrales y rubrics": "apendice-a",
    "Apéndice B. Curva de operación completa de JEV": "apendice-b",
    "Apéndice C. Sensibilidad del costo": "apendice-c", "Apéndice D. Glosario": "apendice-d",
}

def join_lines(lines):
    text = ""
    for line in lines:
        if text.endswith("-") and re.match(r"^[a-záéíóúñ]", line):
            text = text[:-1] + line
        else:
            text += (" " if text else "") + line
    return re.sub(r"\s+", " ", text).strip()

def main():
    assert hashlib.sha256(PDF.read_bytes()).hexdigest() == EXPECTED_HASH
    image_dir = ROOT / "public/media/research/jev"
    image_dir.mkdir(parents=True, exist_ok=True)
    figures = {}
    for page_number, page in enumerate(PdfReader(PDF).pages, 1):
        for source in page.images:
            number = int(re.search(r"\d+", source.name).group())
            dest = image_dir / f"figure-{number}.png"
            dest.write_bytes(source.data)
            with Image.open(dest) as im:
                width, height = im.size
            figures[number] = {"src": f"/media/research/jev/figure-{number}.png", "width": width, "height": height,
                               "sha256": hashlib.sha256(source.data).hexdigest(), "sourcePage": page_number}

    sections = []
    current = None
    pending = []
    pending_pages = set()
    previous = None
    table_outputs = []

    def flush():
        nonlocal pending, pending_pages
        if not pending:
            return
        text = join_lines(pending)
        block = {"type": "paragraph", "text": text, "sourcePages": sorted(pending_pages)}
        figure = re.match(r"^Figura (\d+)\.", text)
        reference = re.match(r"^\[(\d+)\]\s*(.+)", text)
        if figure:
            number = int(figure.group(1))
            block = {"type": "figure", "number": number, "caption": text, **figures[number]}
        elif current["id"] == "referencias" and reference:
            block = {"type": "reference", "number": int(reference.group(1)), "text": reference.group(2), "sourcePages": sorted(pending_pages)}
        elif text.startswith("invitar si p >") or text.startswith("C(t−)"):
            block["type"] = "equation"
        elif re.match(r"^[1-4]\. ", text) and current["id"] in ("aprendizajes", "introduccion"):
            block["type"] = "listItem"
        current["blocks"].append(block)
        pending, pending_pages = [], set()

    with pdfplumber.open(PDF) as pdf:
        for page_number, page in enumerate(pdf.pages, 1):
            spans = [(i, t) for i, t in enumerate(TABLES, 1) if t[0] == page_number]
            inserted = set()
            lines = page.extract_text_lines(x_tolerance=1, y_tolerance=5)
            for line in lines:
                top, bottom, text = line["top"], line["bottom"], line["text"]
                if top < 60 or bottom > 790 or (page_number == 1 and (top < 280 or top > 720)):
                    continue
                table = next(((i, t) for i, t in spans if t[1] <= top < t[2]), None)
                if table:
                    i, t = table
                    if i not in inserted:
                        flush()
                        caption = page.crop((60, t[3], 536, t[4])).extract_text(x_tolerance=1, y_tolerance=5)
                        caption = join_lines(caption.splitlines())
                        label = re.match(r"Tabla ([\w]+)\.", caption).group(1)
                        table_outputs.append({"id": f"jev-table-{label.lower()}", "label": label, "caption": caption,
                                              "columns": t[5], "rows": t[6], "sourcePage": page_number})
                        current["blocks"].append({"type": "table", "id": f"jev-table-{label.lower()}"})
                        inserted.add(i)
                    previous = None
                    continue
                if text in MAJOR:
                    flush()
                    current = {"id": MAJOR[text], "title": text, "sourcePage": page_number, "blocks": []}
                    sections.append(current)
                    previous = None
                    continue
                size = max(c["size"] for c in line["chars"])
                if re.match(r"^[3-6]\.\d+ ", text) and size > 11.5:
                    flush()
                    current["blocks"].append({"type": "heading", "id": "jev-section-" + re.match(r"[\d.]+", text).group().replace(".", "-"), "text": text, "sourcePages": [page_number]})
                    previous = None
                    continue
                is_reference = current["id"] == "referencias" and re.match(r"^\[\d+\]", text)
                paragraph_break = previous and page_number == previous["page"] and top - previous["bottom"] > 4.5
                if pending and (paragraph_break or is_reference or text.startswith("Palabras clave:")):
                    flush()
                pending.append(text)
                pending_pages.add(page_number)
                previous = {"page": page_number, "bottom": bottom}
            # A sentence can continue across a PDF page. Do not join completed paragraphs.
            if pending and re.search(r"[.?!:)]$", pending[-1]):
                flush()
            previous = None
    flush()
    assert [s["id"] for s in sections] == list(MAJOR.values()), [s["title"] for s in sections]
    refs = [b["number"] for s in sections for b in s["blocks"] if b["type"] == "reference"]
    assert refs == list(range(1, 26)), refs
    assert len(figures) == 7 and len(table_outputs) == 8
    content = {"title": "Cómo decide JEV en Agora", "subtitle": "Probabilidades, umbrales y revisión humana en el filtrado de candidatos y la evaluación de entrevistas",
               "language": "es", "author": "Tomás Garbarino", "sourcePdfSha256": EXPECTED_HASH,
               "sections": sections, "tables": table_outputs}
    (ROOT / "src/content/jev-study.json").write_text(json.dumps(content, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"sections": len(sections), "tables": len(table_outputs), "figures": len(figures), "references": len(refs),
                      "blocks": sum(len(s["blocks"]) for s in sections)}, indent=2))

if __name__ == "__main__":
    main()
