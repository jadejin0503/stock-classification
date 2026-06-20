#!/usr/bin/env python3
"""从 Canvas 与 JSON 数据源生成 stock-classification.html"""

import json
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
_DEFAULT_CANVAS = "/Users/jade/.cursor/projects/Users-jade-Desktop-AI-knowledge/canvases/watchlist-classification.canvas.tsx"
CANVAS = Path(os.environ.get("STOCK_CANVAS", _DEFAULT_CANVAS))
if not CANVAS.exists() and (ROOT / "watchlist-classification.canvas.tsx").exists():
    CANVAS = ROOT / "watchlist-classification.canvas.tsx"
OUT = ROOT / "stock-classification.html"
PUBLISH_DIR = ROOT / "docs"
TEMPLATE = ROOT / "stock-classification.template.html"

CATEGORY_ORDER = [
    "raw",
    "materials",
    "pcb_upstream",
    "components",
    "semiconductor",
    "packaging",
    "optical",
    "pcb",
    "telecom",
    "infra",
    "compute",
    "simulation",
    "robotics",
    "autodrive",
    "ai_app",
    "consumer",
    "newenergy",
    "utility",
    "healthcare",
    "other",
]


def sort_categories(categories: list[dict]) -> list[dict]:
    order_map = {k: i for i, k in enumerate(CATEGORY_ORDER)}
    return sorted(categories, key=lambda c: order_map.get(c["key"], 999))


def extract_categories(text: str) -> list[dict]:
    cats = []
    for m in re.finditer(
        r'\{ key: "([^"]+)", label: "([^"]+)", color: "([^"]+)", desc: "([^"]+)" \}',
        text,
    ):
        cats.append({"key": m.group(1), "label": m.group(2), "color": m.group(3), "desc": m.group(4)})
    return cats


def extract_stocks(text: str) -> list[dict]:
    block = re.search(r"const STOCKS: Stock\[\] = \[(.*?)\];", text, re.S)
    if not block:
        raise ValueError("STOCKS array not found in canvas")
    stocks = []
    for id_, name, code, rest in re.findall(
        r'\{ id: "([^"]+)", name: "([^"]+)", code: "([^"]+)"([^}]+)\}', block.group(1)
    ):
        market = re.search(r'market: "([^"]+)"', rest)
        cat = re.search(r'category: "([^"]+)"', rest)
        role = re.search(r'role: "([^"]+)"', rest)
        chain = re.search(r'chainLink: "([^"]+)"', rest)
        stocks.append(
            {
                "id": id_,
                "name": name,
                "code": code,
                "market": market.group(1) if market else None,
                "category": cat.group(1) if cat else "other",
                "role": role.group(1) if role else "",
                "chainLink": chain.group(1) if chain else None,
            }
        )
    return stocks


def build_stock_data() -> dict:
    canvas_text = CANVAS.read_text(encoding="utf-8")
    details = json.loads((ROOT / "stock-details.json").read_text(encoding="utf-8"))
    intros = json.loads((ROOT / "category-intros.json").read_text(encoding="utf-8"))
    quotes_raw = json.loads((ROOT / "stock-quotes-thu.json").read_text(encoding="utf-8"))

    categories = sort_categories(extract_categories(canvas_text))
    stocks = extract_stocks(canvas_text)

    # merge intro into categories
    for cat in categories:
        intro = intros.get(cat["key"], {})
        cat["intro"] = intro.get("intro", "")
        cat["chainRole"] = intro.get("chainRole", "")
        cat["watchPoints"] = intro.get("watchPoints", [])

    return {
        "categories": categories,
        "stocks": stocks,
        "details": details,
        "quoteSnapshot": quotes_raw.get("quotes", {}),
        "quoteAsOf": quotes_raw.get("as_of", ""),
    }


def main():
    data = build_stock_data()
    data_json = json.dumps(data, ensure_ascii=False, separators=(",", ":"))

    if TEMPLATE.exists():
        html = TEMPLATE.read_text(encoding="utf-8")
        html = html.replace("__STOCK_DATA_JSON__", data_json)
    else:
        raise FileNotFoundError(f"Template not found: {TEMPLATE}")

    OUT.write_text(html, encoding="utf-8")
    PUBLISH_DIR.mkdir(exist_ok=True)
    shutil.copy2(OUT, PUBLISH_DIR / "index.html")
    print(f"Generated {OUT}")
    print(f"Published {PUBLISH_DIR / 'index.html'}")
    print(f"  categories: {len(data['categories'])}")
    print(f"  stocks: {len(data['stocks'])}")
    print(f"  details: {len(data['details'])}")
    print(f"  quote snapshot: {len(data['quoteSnapshot'])}")


if __name__ == "__main__":
    main()
