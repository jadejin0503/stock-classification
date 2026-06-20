#!/usr/bin/env python3
"""从新浪/腾讯拉取 A 股行情快照，写入 stock-quotes-thu.json"""

import json
import os
import re
import ssl
import time
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent
_DEFAULT_CANVAS = "/Users/jade/.cursor/projects/Users-jade-Desktop-AI-knowledge/canvases/watchlist-classification.canvas.tsx"
CANVAS = Path(os.environ.get("STOCK_CANVAS", _DEFAULT_CANVAS))
if not CANVAS.exists() and (ROOT / "watchlist-classification.canvas.tsx").exists():
    CANVAS = ROOT / "watchlist-classification.canvas.tsx"
OUT = ROOT / "stock-quotes-thu.json"


def make_ssl_context():
    ctx = ssl.create_default_context()
    try:
        import certifi

        ctx.load_verify_locations(certifi.where())
    except Exception:
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
    return ctx


def load_codes() -> list[str]:
    text = CANVAS.read_text(encoding="utf-8")
    entries = re.findall(
        r'\{ id: "[^"]+", name: "[^"]+", code: "([^"]+)"(?:, market: "([^"]+)")?',
        text,
    )
    codes = []
    seen = set()
    for code, market in entries:
        if market in ("港股", "美股"):
            continue
        if code not in seen:
            seen.add(code)
            codes.append(code)
    return sorted(codes)


def sina_symbol(code: str) -> str:
    if code.startswith("6") or code.startswith("5"):
        return "sh" + code
    return "sz" + code


def fetch_sina(ctx, codes: list[str], quotes: dict) -> None:
    symbols = [sina_symbol(c) for c in codes]
    url = "https://hq.sinajs.cn/list=" + ",".join(symbols)
    req = urllib.request.Request(
        url,
        headers={"Referer": "https://finance.sina.com.cn", "User-Agent": "Mozilla/5.0"},
    )
    with urllib.request.urlopen(req, timeout=20, context=ctx) as resp:
        raw = resp.read().decode("gbk", errors="ignore")
    for line in raw.strip().split("\n"):
        m = re.match(r'var hq_str_(sh|sz)(\d+)="([^"]*)"', line)
        if not m:
            continue
        code = m.group(2)
        parts = m.group(3).split(",")
        if len(parts) < 4 or not parts[3]:
            continue
        try:
            price = float(parts[3])
            prev = float(parts[2]) if parts[2] else 0
            if not price or not prev:
                continue
            pct = (price - prev) / prev * 100
            quotes[code] = {
                "price": round(price, 2),
                "changePct": round(pct, 2),
            }
        except ValueError:
            pass


def fetch_tencent(ctx, codes: list[str], quotes: dict) -> None:
    symbols = [sina_symbol(c) for c in codes]
    url = "https://qt.gtimg.cn/q=" + ",".join(symbols)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20, context=ctx) as resp:
        raw = resp.read().decode("gbk", errors="ignore")
    for line in raw.strip().split(";"):
        if "~" not in line:
            continue
        parts = line.split("~")
        if len(parts) < 33:
            continue
        code = parts[2]
        try:
            price = float(parts[3])
            pct = float(parts[32])
            quotes[code] = {"price": round(price, 2), "changePct": round(pct, 2)}
        except ValueError:
            pass


def main():
    if not CANVAS.exists():
        raise FileNotFoundError(f"Canvas not found: {CANVAS}")

    ctx = make_ssl_context()
    codes = load_codes()
    quotes: dict = {}

    for i in range(0, len(codes), 40):
        batch = codes[i : i + 40]
        try:
            fetch_sina(ctx, batch, quotes)
        except Exception as e:
            print(f"sina batch {i} error: {e}")
        time.sleep(0.2)

    missing = [c for c in codes if c not in quotes]
    for i in range(0, len(missing), 40):
        batch = missing[i : i + 40]
        try:
            fetch_tencent(ctx, batch, quotes)
        except Exception as e:
            print(f"tencent batch {i} error: {e}")
        time.sleep(0.2)

    as_of = datetime.now().strftime("%Y-%m-%d %H:%M")
    payload = {"as_of": as_of, "quotes": quotes}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {OUT}")
    print(f"  codes: {len(codes)}, fetched: {len(quotes)}")


if __name__ == "__main__":
    main()
