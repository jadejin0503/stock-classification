#!/usr/bin/env python3
"""为 stock-details.json 中每只股票自动生成 risk 字段"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
CANVAS = Path(
    "/Users/jade/.cursor/projects/Users-jade-Desktop-AI-knowledge/canvases/watchlist-classification.canvas.tsx"
)
DETAILS_PATH = ROOT / "stock-details.json"

CATEGORY_RISKS = {
    "raw": "大宗商品价格波动传导至成本与毛利；战略金属政策与出口管制不确定性。",
    "materials": "紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。",
    "pcb_upstream": "高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。",
    "components": "被动元件价格周期性回落；下游需求不及预期；高端规格竞争加剧。",
    "semiconductor": "晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。",
    "packaging": "封测产能利用率波动；先进封装技术迭代与客户认证风险。",
    "optical": "光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。",
    "pcb": "ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。",
    "telecom": "运营商资本开支周期波动；光纤光缆价格竞争；转型新业务不及预期。",
    "infra": "液冷渗透率提升慢于预期；数据中心建设节奏波动；技术路线变更风险。",
    "compute": "云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。",
    "simulation": "国产 EDA/仿真软件渗透率提升缓慢；海外竞品技术领先；政策支持力度变化。",
    "robotics": "人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。",
    "autodrive": "智能驾驶渗透率提升慢于预期；激光雷达降本不及预期；法规与安全事故风险。",
    "ai_app": "大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。",
    "consumer": "消费电子需求疲软；大客户订单波动；新品创新不及预期。",
    "newenergy": "锂电材料价格周期性波动；产能过剩导致毛利压缩；下游电动车增速放缓。",
    "utility": "防御属性强但弹性有限；电价政策变化；火电环保成本上升。",
    "healthcare": "创新药研发失败风险；集采降价压力；CXO 订单周期性波动。",
    "other": "主业与转型逻辑不确定性较高；题材炒作后估值回落风险。",
}

KEYWORD_RISKS = [
    (r"英伟达|NVIDIA|微软|苹果|Meta|AMD|谷歌|亚马逊|华为|特斯拉", "大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。"),
    (r"垄断|唯一|全球仅|国内唯一|绝对龙头", "高壁垒一旦突破或技术路线变更，竞争格局可能重塑。"),
    (r"涨价|紧缺|缺口|满产|翻倍|50%\+|100%\+", "涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。"),
    (r"国产替代|国产化|信创|自主", "国产替代验证与认证进度可能慢于预期。"),
    (r"转型|布局中|据称|投资", "转型业务进展与盈利贡献存在不确定性。"),
    (r"海外|出海|Opera|全球化", "海外业务面临汇率波动、地缘政治与合规风险。"),
    (r"港股|美股|AH", "海外市场波动与汇率风险；AH 溢价变化。"),
    (r"ETF|板块配置|指数", "板块贝塔品种，个股阿尔法有限，跟随指数波动。"),
    (r"估值|溢价|炒作", "估值偏高，业绩不及预期时回调压力大。"),
    (r"周期|铜价|锂价|存储", "强周期属性，景气下行时业绩与估值双杀风险。"),
    (r"扩产|试产|2026|2027|2028", "新产能爬坡与良率风险；扩产完成后供需可能逆转。"),
    (r"绑定|伙伴|合资", "深度绑定单一客户或伙伴，合作变动影响较大。"),
]


def extract_stock_categories(text: str) -> dict[str, str]:
    block = re.search(r"const STOCKS: Stock\[\] = \[(.*?)\];", text, re.S)
    mapping = {}
    if not block:
        return mapping
    for id_, _name, _code, rest in re.findall(
        r'\{ id: "([^"]+)", name: "([^"]+)", code: "([^"]+)"([^}]+)\}', block.group(1)
    ):
        m = re.search(r'category: "([^"]+)"', rest)
        market = re.search(r'market: "([^"]+)"', rest)
        mapping[id_] = {
            "category": m.group(1) if m else "other",
            "market": market.group(1) if market else None,
        }
    return mapping


def generate_risk(stock_id: str, detail: dict, meta: dict) -> str:
    category = meta.get("category", "other")
    market = meta.get("market")
    texts = " ".join(
        filter(
            None,
            [
                detail.get("business", ""),
                detail.get("products", ""),
                detail.get("advantage", ""),
                detail.get("logic", ""),
            ],
        )
    )

    risks: list[str] = []
    seen: set[str] = set()

    def add(r: str) -> None:
        r = r.strip()
        if r and r not in seen:
            seen.add(r)
            risks.append(r)

    if market in ("港股", "美股"):
        add("海外市场波动与汇率风险；实时行情需通过券商查看。")

    for pattern, msg in KEYWORD_RISKS:
        if re.search(pattern, texts, re.I):
            add(msg)

    base = CATEGORY_RISKS.get(category, CATEGORY_RISKS["other"])
    add(base)

    return "；".join(risks[:3])


def main():
    canvas_text = CANVAS.read_text(encoding="utf-8")
    meta_map = extract_stock_categories(canvas_text)
    details = json.loads(DETAILS_PATH.read_text(encoding="utf-8"))

    count = 0
    for stock_id, detail in details.items():
        meta = meta_map.get(stock_id, {"category": "other", "market": None})
        detail["risk"] = generate_risk(stock_id, detail, meta)
        count += 1

    DETAILS_PATH.write_text(
        json.dumps(details, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Generated risk for {count} stocks -> {DETAILS_PATH}")
    sample = details.get("fugong", {}).get("risk", "")
    print(f"  sample (fugong): {sample[:80]}...")


if __name__ == "__main__":
    main()
