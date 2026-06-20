#!/usr/bin/env python3
"""向 Canvas 与 stock-details.json 补充各行业龙头参考股"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
CANVAS = Path(
    "/Users/jade/.cursor/projects/Users-jade-Desktop-AI-knowledge/canvases/watchlist-classification.canvas.tsx"
)
DETAILS = ROOT / "stock-details.json"

# id, name, code, category, role, chainLink, detail dict
NEW_STOCKS = [
    ("jiangtong", "江西铜业", "600362", "raw", "国内阴极铜龙头", "PCB L0 铜", {
        "business": "铜采选冶及加工一体化企业", "products": "阴极铜、铜杆、铜加工材",
        "advantage": "国内铜冶炼龙头，PCB 上游阴极铜成本锚", "logic": "铜价上涨传导至 PCB 全链条",
    }),
    ("xiamenwu", "厦门钨业", "600549", "raw", "钨产业链龙头", "战略金属", {
        "business": "钨钼稀土等有色金属采选冶炼", "products": "钨精矿、APT、硬质合金、数控刀具",
        "advantage": "国内钨产业链龙头，高端刀具需求受益", "logic": "高端制造+战略资源属性",
    }),
    ("anji", "安集科技", "688019", "materials", "CMP 抛光液龙头", "半导体材料", {
        "business": "半导体材料及化学机械抛光液", "products": "CMP 抛光液、刻蚀液、清洗液",
        "advantage": "国产 CMP 抛光液龙头，先进制程突破", "logic": "晶圆厂扩产+材料国产化",
    }),
    ("jinhong", "金宏气体", "688106", "materials", "电子特气民营龙头", "电子特气", {
        "business": "特种气体研发生产销售", "products": "超纯氨、氧化亚氮、氢气等电子特气",
        "advantage": "民营电子特气龙头，客户覆盖主流晶圆厂", "logic": "半导体扩产拉动特气需求",
    }),
    ("yihao", "逸豪新材", "301176", "pcb_upstream", "HVLP 铜箔追赶者", "HVLP4 瓶颈", {
        "business": "电子电路铜箔及铝基覆铜板", "products": "HVLP 铜箔、RTF 铜箔、铝基 CCL",
        "advantage": "HVLP 铜箔产能扩张，AI 服务器 PCB 受益", "logic": "高端铜箔满产满销周期",
    }),
    ("shunluo", "顺络电子", "002138", "components", "电感/被动元件龙头", "被动元件", {
        "business": "电子元器件研发生产", "products": "片式电感、变压器、陶瓷电子元件",
        "advantage": "国内电感龙头，AI 硬件拉动被动件需求", "logic": "被动元件复苏+汽车电子",
    }),
    ("jiemei", "洁美科技", "002859", "components", "纸质载带/被动元件上游", "MLCC 产业链", {
        "business": "电子功能材料及纸质载带", "products": "纸质载带、上下胶带、离型膜",
        "advantage": "MLCC 封装载带龙头，绑定村田等巨头", "logic": "MLCC 紧缺传导至封装材料",
    }),
    ("zhongwei", "中微公司", "688012", "semiconductor", "刻蚀设备龙头", "半导体设备", {
        "business": "半导体刻蚀及 MOCVD 设备", "products": "等离子刻蚀机、MOCVD 设备",
        "advantage": "国内刻蚀设备龙头，CCP/ICP 技术领先", "logic": "国产设备渗透率提升",
    }),
    ("zhuosheng", "卓胜微", "300782", "semiconductor", "射频芯片龙头", "芯片设计", {
        "business": "射频前端芯片设计", "products": "射频开关、LNA、滤波器、WiFi FEM",
        "advantage": "国内射频芯片龙头，手机+物联网双驱动", "logic": "5G/AIoT 射频需求增长",
    }),
    ("jiangbolang", "江波龙", "301308", "semiconductor", "存储模组龙头", "存储", {
        "business": "半导体存储产品应用方案", "products": "企业级 SSD、嵌入式存储、消费级存储",
        "advantage": "国内存储模组龙头，企业级存储放量", "logic": "存储周期复苏+AI 存储需求",
    }),
    ("baiwei", "佰维存储", "688525", "semiconductor", "存储模组新锐", "存储", {
        "business": "半导体存储器研发制造销售", "products": "嵌入式存储、消费级 SSD、工规存储",
        "advantage": "存储模组新锐，国产替代加速", "logic": "存储复苏+信创存储需求",
    }),
    ("weice", "伟测科技", "688372", "packaging", "芯片测试服务龙头", "先进封测", {
        "business": "集成电路测试服务", "products": "晶圆测试、芯片成品测试",
        "advantage": "国内独立第三方测试龙头", "logic": "封测产能紧缺外溢至测试环节",
    }),
    ("tengjing", "腾景科技", "688195", "optical", "精密光学/光通信元件", "CPO L2 耦合", {
        "business": "精密光学元件及光纤器件", "products": "滤光片、光纤透镜、WDM 器件",
        "advantage": "精密光学元件供应商，光通信+CPO 受益", "logic": "光模块精密光学需求增长",
    }),
    ("dekeli", "德科立", "688205", "optical", "光放大器/光模块", "光通信", {
        "business": "光电子器件研发生产", "products": "光放大器、光模块、光传输子系统",
        "advantage": "光放大器细分领域龙头", "logic": "算力网络长距传输需求",
    }),
    ("shiyun", "世运电路", "603920", "pcb", "汽车+AI 服务器 PCB", "高端 PCB", {
        "business": "印制电路板制造", "products": "汽车电子 PCB、服务器 PCB、消费电子 PCB",
        "advantage": "特斯拉 PCB 核心供应商，AI 服务器 PCB 布局", "logic": "汽车电子+算力 PCB 双驱动",
    }),
    ("zhongxing", "中兴通讯", "000063", "telecom", "通信设备全球龙头", "算力网络", {
        "business": "通信系统设备制造商", "products": "5G 基站、光传输、服务器、算力网络",
        "advantage": "全球四大通信设备商之一，算力网络核心", "logic": "算力基建+5G 网络建设",
    }),
    ("shenling", "申菱环境", "301018", "infra", "数据中心液冷/温控龙头", "AI 基建液冷", {
        "business": "专业环境系统解决方案", "products": "数据中心液冷、精密空调、特种空调",
        "advantage": "数据中心液冷核心供应商，绑定头部云厂商", "logic": "液冷渗透率快速提升",
    }),
    ("jialitu", "佳力图", "603912", "infra", "精密空调/液冷", "数据中心散热", {
        "business": "精密空调设备及机房环境", "products": "精密空调、液冷系统、磁悬浮冷水机组",
        "advantage": "数据中心精密空调老牌企业，液冷转型", "logic": "AI 数据中心散热需求",
    }),
    ("shujugang", "数据港", "603881", "compute", "IDC/算力枢纽运营", "AI 基建", {
        "business": "互联网数据中心服务", "products": "IDC 机柜、定制化数据中心",
        "advantage": "绑定阿里巴巴等头部云客户，算力枢纽核心", "logic": "算力基建+IDC 需求增长",
    }),
    ("guanghuan", "光环新网", "300383", "compute", "IDC+云计算运营", "AI 基建", {
        "business": "互联网数据中心及云计算", "products": "IDC 服务、AWS 云服务运营",
        "advantage": "国内领先 IDC 运营商，云计算协同", "logic": "算力租赁与 IDC 扩张",
    }),
    ("guanglianda", "广联达", "002410", "simulation", "建筑 CAD/数字造价", "数字孪生", {
        "business": "建筑信息化软件", "products": "工程造价、施工管理、BIM 数字孪生",
        "advantage": "建筑信息化龙头，数字孪生底座", "logic": "建筑业数字化+AI 应用",
    }),
    ("aisidun", "埃斯顿", "002747", "robotics", "工业机器人龙头", "人形机器人", {
        "business": "工业机器人及智能制造", "products": "工业机器人、伺服系统、运动控制",
        "advantage": "国产工业机器人龙头，全产业链布局", "logic": "工业机器人+人形机器人放量",
    }),
    ("mingzhi", "鸣志电器", "603728", "robotics", "空心杯电机/执行器", "人形机器人执行器", {
        "business": "控制电机及其驱动系统", "products": "空心杯电机、步进电机、无刷电机",
        "advantage": "空心杯电机全球领先，灵巧手核心部件", "logic": "人形机器人执行器需求爆发",
    }),
    ("jingwei", "经纬恒润", "688326", "autodrive", "汽车电子/智驾域控", "Cosmos 第四梯队", {
        "business": "汽车电子及智能驾驶", "products": "智驾域控制器、车身电子、研发服务",
        "advantage": "汽车电子综合供应商，智驾域控布局", "logic": "L2+/L3 智驾渗透率提升",
    }),
    ("huayang", "华阳集团", "002906", "autodrive", "智能座舱/域控", "Cosmos 第四梯队", {
        "business": "汽车电子及精密压铸", "products": "智能座舱、HUD、车载声学、域控制器",
        "advantage": "智能座舱国内龙头，绑定主流车企", "logic": "智能座舱升级+智驾融合",
    }),
    ("yongxin", "永新光学", "603297", "autodrive", "车载光学/激光雷达光学", "智驾传感器", {
        "business": "光学显微镜及光学元件", "products": "激光雷达光学元件、车载镜头、显微镜",
        "advantage": "激光雷达光学元件核心供应商", "logic": "激光雷达放量+车载光学",
    }),
    ("tonghuashun", "同花顺", "300033", "ai_app", "金融科技/AI 投顾", "AI 金融应用", {
        "business": "金融信息服务", "products": "iFinD、问财 AI、行情交易软件",
        "advantage": "互联网金融信息服务龙头，AI 投顾领先", "logic": "AI+金融信息服务变现",
    }),
    ("hengsheng", "恒生电子", "600570", "ai_app", "金融 IT/大模型应用", "AI 金融应用", {
        "business": "金融软件及网络服务", "products": "证券/基金/银行 IT 系统、LightGPT",
        "advantage": "金融 IT 绝对龙头，金融机构核心系统", "logic": "金融大模型+信创替代",
    }),
    ("luxshare", "立讯精密", "002475", "consumer", "消费电子组装龙头", "消费电子", {
        "business": "消费电子精密制造", "products": "连接器、线缆、Apple 组装、Vision Pro",
        "advantage": "苹果供应链核心，消费电子组装龙头", "logic": "AI 硬件+Vision Pro 创新",
    }),
    ("lansi", "蓝思科技", "300433", "consumer", "玻璃盖板/结构件龙头", "消费电子", {
        "business": "消费电子玻璃及结构件", "products": "玻璃盖板、金属结构件、模组组装",
        "advantage": "全球消费电子玻璃龙头，Apple 核心供应商", "logic": "消费电子创新周期",
    }),
    ("enjie", "恩捷股份", "002812", "newenergy", "锂电隔膜全球龙头", "锂电材料", {
        "business": "锂电池隔膜研发生产", "products": "湿法隔膜、涂覆隔膜",
        "advantage": "全球锂电隔膜龙头，市占率领先", "logic": "储能+动力电池隔膜需求",
    }),
]


def stock_line(s):
    id_, name, code, cat, role, chain, _ = s
    return (
        f'  {{ id: "{id_}", name: "{name}", code: "{code}", category: "{cat}", '
        f'isLeader: true, role: "{role}", chainLink: "{chain}" }},'
    )


def main():
    canvas = CANVAS.read_text(encoding="utf-8")
    details = json.loads(DETAILS.read_text(encoding="utf-8"))
    existing_ids = set(re.findall(r'id: "([^"]+)"', canvas.split("const STOCKS")[1].split("];")[0]))
    existing_codes = set(re.findall(r'code: "([^"]+)"', canvas.split("const STOCKS")[1].split("];")[0]))

    to_add = [s for s in NEW_STOCKS if s[0] not in existing_ids and s[2] not in existing_codes]
    if not to_add:
        print("No new stocks to add")
        return

    # group by category for insertion before closing ];
    lines_by_cat: dict[str, list[str]] = {}
    for s in to_add:
        lines_by_cat.setdefault(s[3], []).append(stock_line(s))
        details[s[0]] = {**s[6], "risk": ""}

    # insert before `];` of STOCKS - append block at end before other section
    insert_block = "\n  // ── 龙头参考补充 ──\n" + "\n".join(
        line for s in to_add for line in [stock_line(s)]
    ) + "\n"
    canvas = canvas.replace(
        "\n  // ── 其他 ──",
        insert_block + "\n  // ── 其他 ──",
    )

    CANVAS.write_text(canvas, encoding="utf-8")
    DETAILS.write_text(json.dumps(details, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {len(to_add)} stocks to canvas and details")
    for s in to_add:
        print(f"  + [{s[3]}] {s[1]} {s[2]}")


if __name__ == "__main__":
    main()
