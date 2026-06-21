#!/usr/bin/env python3
"""补充产业链图片中的缺失标的（电子材料 / PCB / 存储链）"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
CANVAS_LOCAL = ROOT / "watchlist-classification.canvas.tsx"
CANVAS_CURSOR = Path(
    "/Users/jade/.cursor/projects/Users-jade-Desktop-AI-knowledge/canvases/watchlist-classification.canvas.tsx"
)
DETAILS = ROOT / "stock-details.json"

# id, name, code, category, role, chainLink, detail
CHAIN_STOCKS = [
    ("tclzhonghuan", "TCL中环", "002129", "semiconductor", "半导体硅片/光伏硅片", "硅片衬底", {
        "business": "半导体与光伏硅片", "products": "8-12 英寸半导体硅片、光伏单晶硅片",
        "advantage": "硅片产能规模领先，半导体硅片国产化", "logic": "晶圆扩产+光伏硅片需求",
    }),
    ("shanghaixinyang", "上海新阳", "300236", "materials", "电镀液/光刻胶材料", "光刻胶/湿电子", {
        "business": "半导体及 PCB 专用化学品", "products": "电镀液、光刻胶、清洗液、CMP 材料",
        "advantage": "电镀液龙头，光刻胶与先进封装材料布局", "logic": "晶圆厂扩产+材料国产化",
    }),
    ("dongxi", "东芯股份", "688110", "semiconductor", "利基型存储设计", "存储设计", {
        "business": "中小容量存储芯片设计", "products": "SLC NAND、NOR、DRAM 利基型存储",
        "advantage": "国内工业级 SLC NAND 领先", "logic": "工控/IoT 利基存储国产替代",
    }),
    ("zhongci", "中瓷电子", "003031", "components", "陶瓷封装/陶瓷基板", "陶瓷基板", {
        "business": "电子陶瓷系列产品", "products": "通信陶瓷外壳、陶瓷基板、陶瓷管壳",
        "advantage": "电子陶瓷封装龙头，绑定主流通信与功率器件客户", "logic": "先进封装陶瓷基板需求",
    }),
    ("xingfu", "兴福电子", "688545", "materials", "湿电子化学品", "湿电子化学品", {
        "business": "湿电子化学品研发生产", "products": "电子级磷酸、硫酸、双氧水等",
        "advantage": "国内湿电子化学品重要供应商", "logic": "晶圆厂扩产拉动湿电子需求",
    }),
    ("guanshi", "冠石科技", "605588", "semiconductor", "掩膜版/显示材料", "掩膜版配套", {
        "business": "半导体显示功能器件", "products": "偏光片、掩膜版、功能性器件",
        "advantage": "显示与半导体掩膜版配套能力", "logic": "面板与半导体掩膜版需求",
    }),
    ("lingwei", "凌玮科技", "301373", "pcb_upstream", "纳米二氧化硅/球形粉体", "球形硅微粉", {
        "business": "纳米二氧化硅及新材料", "products": "球形硅微粉、消光剂、油墨树脂",
        "advantage": "高端纳米二氧化硅供应商", "logic": "PCB/封装填料需求",
    }),
    ("kaisheng", "凯盛科技", "600552", "materials", "显示玻璃/石英材料", "玻璃基板/石英", {
        "business": "新型显示与新材料", "products": "显示玻璃、UTG、石英材料",
        "advantage": "显示玻璃与新材料平台", "logic": "玻璃基板与显示材料升级",
    }),
    ("liliang", "力量钻石", "301071", "pcb_upstream", "金刚石散热材料", "金刚石散热", {
        "business": "人造金刚石及培育钻石", "products": "金刚石单晶、微粉、散热材料",
        "advantage": "金刚石材料产能领先", "logic": "高功率芯片散热需求",
    }),
    ("beijingjunzheng", "北京君正", "300223", "semiconductor", "车规存储/MCU", "存储设计", {
        "business": "嵌入式 CPU 与存储芯片", "products": "车规 SRAM/DRAM、MCU、智能视频芯片",
        "advantage": "车规存储国内领先", "logic": "智能汽车存储需求增长",
    }),
    ("huaguang", "华光新材", "688379", "materials", "钎焊材料/锡焊膏", "锡焊膏", {
        "business": "钎焊材料研发生产", "products": "银钎料、锡焊膏、复合钎料",
        "advantage": "国内钎焊材料龙头", "logic": "功率器件与电子组装焊料需求",
    }),
    ("huahaiqingke", "华海清科", "688120", "semiconductor", "CMP 设备龙头", "半导体设备", {
        "business": "半导体 CMP 设备", "products": "CMP 抛光机、减薄设备",
        "advantage": "国产 CMP 设备龙头", "logic": "晶圆厂扩产+设备国产化",
    }),
    ("huahaichengke", "华海诚科", "688535", "packaging", "环氧塑封料", "环氧塑封料", {
        "business": "半导体封装材料", "products": "环氧塑封料、电子胶黏剂",
        "advantage": "国内环氧塑封料领先企业", "logic": "封装材料国产替代",
    }),
    ("boyian", "博迁新材", "605376", "components", "MLCC 镍粉/金属粉体", "MLCC 上游", {
        "business": "电子专用高端金属粉体", "products": "MLCC 用镍粉、银粉、合金粉",
        "advantage": "MLCC 镍粉国内龙头", "logic": "MLCC 复苏+高端粉体需求",
    }),
    ("weiteou", "唯特偶", "301319", "materials", "微电子焊接材料", "锡焊膏", {
        "business": "微电子焊接材料", "products": "锡膏、锡焊料、助焊剂",
        "advantage": "微电子焊接材料供应商", "logic": "电子组装与功率器件焊料",
    }),
    ("sifangda", "四方达", "300179", "pcb_upstream", "金刚石超硬材料", "金刚石散热", {
        "business": "超硬材料及制品", "products": "金刚石复合片、微粉、刀具",
        "advantage": "超硬材料细分领域领先", "logic": "高端切削与散热材料",
    }),
    ("guoci", "国瓷材料", "300285", "components", "陶瓷粉体/MLCC 材料", "MLCC/陶瓷基板", {
        "business": "电子陶瓷粉体材料", "products": "MLCC 粉体、陶瓷基板、催化材料",
        "advantage": "电子陶瓷粉体平台龙头", "logic": "MLCC 与陶瓷基板材料需求",
    }),
    ("guokewei", "国科微", "300672", "semiconductor", "SSD 主控/芯片设计", "存储主控", {
        "business": "芯片设计及解决方案", "products": "SSD 主控、直播芯片、智能视觉芯片",
        "advantage": "国产 SSD 主控重要厂商", "logic": "存储主控国产替代",
    }),
    ("guojifucai", "国际复材", "301526", "pcb_upstream", "电子级玻璃纤维布", "电子玻纤布", {
        "business": "玻璃纤维及复合材料", "products": "电子级玻璃纤维布、风电复合材料",
        "advantage": "电子布与复合材料供应商", "logic": "高端电子布需求",
    }),
    ("yishitong", "壹石通", "688733", "pcb_upstream", "球形氧化铝/硅微粉", "球形硅微粉", {
        "business": "先进无机非金属复合材料", "products": "球形氧化铝、勃姆石、硅微粉",
        "advantage": "锂电池涂覆与电子填料材料", "logic": "封装填料与导热材料",
    }),
    ("rongda", "容大感光", "300576", "materials", "PCB 光刻胶", "PCB 光刻胶", {
        "business": "感光化学品研发生产", "products": "PCB 光刻胶、显示光刻胶",
        "advantage": "PCB 光刻胶国内领先", "logic": "高端 PCB 与显示光刻胶需求",
    }),
    ("fuled", "富乐德", "301297", "semiconductor", "晶圆再生/洗净服务", "半导体材料服务", {
        "business": "泛半导体设备洗净及再生", "products": "石英器件再生、设备洗净服务",
        "advantage": "泛半导体洗净服务龙头", "logic": "晶圆厂运维与再生需求",
    }),
    ("juhua", "巨化股份", "600160", "materials", "氟化工/电子特气", "电子特气", {
        "business": "氟化工新材料", "products": "制冷剂、含氟聚合物、电子湿化学品",
        "advantage": "氟化工龙头，电子特气布局", "logic": "半导体氟化物材料需求",
    }),
    ("guangxin", "广信材料", "300537", "materials", "PCB 油墨/光刻胶", "PCB 光刻胶", {
        "business": "专用油墨及涂料", "products": "PCB 油墨、光刻胶、UV 涂料",
        "advantage": "PCB 专用油墨供应商", "logic": "高端 PCB 油墨需求",
    }),
    ("kangqiang", "康强电子", "002119", "packaging", "引线框架/封装材料", "引线框架", {
        "business": "半导体封装材料", "products": "引线框架、键合丝、电极丝",
        "advantage": "国内引线框架龙头", "logic": "封装引线框架国产替代",
    }),
    ("qiangli", "强力新材", "300429", "materials", "PCB 光刻胶/感光材料", "PCB 光刻胶", {
        "business": "光刻胶及专用化学品", "products": "PCB 光刻胶、显示光刻胶、光刻胶树脂",
        "advantage": "PCB 光刻胶老牌企业", "logic": "光刻胶国产替代",
    }),
    ("tongcheng", "彤程新材", "603650", "materials", "光刻胶树脂/橡胶助剂", "光刻胶", {
        "business": "特种橡胶助剂与电子材料", "products": "光刻胶树脂、橡胶助剂、PBAT",
        "advantage": "光刻胶树脂与电子材料布局", "logic": "KrF/ArF 光刻胶国产化",
    }),
    ("caihong", "彩虹股份", "600707", "materials", "显示玻璃基板", "玻璃基板", {
        "business": "新型显示器件及玻璃基板", "products": "液晶玻璃基板、显示面板",
        "advantage": "国内玻璃基板重要厂商", "logic": "显示玻璃基板国产替代",
    }),
    ("gebijia", "戈碧迦", "835438", "materials", "光学玻璃/特种玻璃", "玻璃基板", {
        "business": "特种玻璃及光学元件", "products": "光学玻璃、红外滤光片、微棱镜",
        "advantage": "特种光学玻璃供应商", "logic": "光学与显示玻璃材料",
    }),
    ("tuojing", "拓荆科技", "688072", "semiconductor", "薄膜沉积设备", "半导体设备", {
        "business": "半导体薄膜设备", "products": "PECVD、ALD、混合键合设备",
        "advantage": "国产薄膜沉积设备龙头", "logic": "存储/逻辑扩产设备国产化",
    }),
    ("xinhenghui", "新恒汇", "301678", "packaging", "蚀刻引线框架", "引线框架", {
        "business": "智能卡与引线框架", "products": "蚀刻引线框架、智能卡模块、eSIM 封测",
        "advantage": "蚀刻引线框架国内领先", "logic": "封装引线框架国产替代",
    }),
    ("puran", "普冉股份", "688766", "semiconductor", "NOR/EEPROM 存储", "存储设计", {
        "business": "非易失性存储芯片设计", "products": "NOR Flash、EEPROM、MCU",
        "advantage": "低功耗 NOR 存储领先", "logic": "IoT/消费电子存储需求",
    }),
    ("gelinda", "格林达", "603931", "materials", "显影液/湿电子化学品", "湿电子化学品", {
        "business": "湿电子化学品", "products": "TMAH 显影液、蚀刻液、清洗液",
        "advantage": "显影液细分领域领先", "logic": "晶圆厂湿电子需求",
    }),
    ("oukeyi", "欧科亿", "688308", "pcb_upstream", "硬质合金刀具/钻针材料", "钻针及硬质合金", {
        "business": "硬质合金数控刀具", "products": "数控刀片、整体刀具、棒材",
        "advantage": "国产数控刀具领先企业", "logic": "PCB 钻针与高端刀具需求",
    }),
    ("minbao", "民爆光电", "301362", "pcb_upstream", "LED 照明/特种照明", "PCB 产业链配套", {
        "business": "LED 照明产品", "products": "商业照明、工业照明、特种照明",
        "advantage": "LED 照明出口企业", "logic": "产业链配套标的（照明电子）",
    }),
    ("jianghuawei", "江化微", "603078", "materials", "湿电子化学品", "湿电子化学品", {
        "business": "湿电子化学品生产", "products": "超净高纯试剂、光刻胶配套试剂",
        "advantage": "湿电子化学品老牌企业", "logic": "晶圆厂扩产拉动湿电子",
    }),
    ("woerde", "沃尔德", "688028", "pcb_upstream", "金刚石刀具/超硬材料", "金刚石散热/刀具", {
        "business": "超高精密刀具", "products": "金刚石刀具、硬质合金刀具、磨削设备",
        "advantage": "金刚石刀具领先企业", "logic": "高端切削与散热加工",
    }),
    ("woge", "沃格光电", "603773", "materials", "玻璃基板/显示器件", "玻璃基板", {
        "business": "光电玻璃及显示器件", "products": "玻璃基板减薄、镀膜、Mini LED 载板",
        "advantage": "玻璃基板深加工龙头", "logic": "玻璃基板与 Mini LED 需求",
    }),
    ("shenkeji", "深科技", "000021", "packaging", "DRAM 封测", "存储封测", {
        "business": "电子产品制造与封测", "products": "DRAM 封测、硬盘磁头、智能计量",
        "advantage": "国内 DRAM 封测龙头", "logic": "存储封测与算力存储需求",
    }),
    ("qingyi", "清溢光电", "688138", "semiconductor", "掩膜版", "掩膜版", {
        "business": "平板显示及半导体掩膜版", "products": "LCD/半导体掩膜版",
        "advantage": "国内掩膜版领先企业", "logic": "半导体掩膜版国产替代",
    }),
    ("wenzhouhongfeng", "温州宏丰", "300283", "packaging", "电接触材料/引线框架", "引线框架", {
        "business": "电接触功能复合材料", "products": "电接触材料、复层触头、硬质合金",
        "advantage": "电接触材料供应商", "logic": "封装与电接触材料需求",
    }),
    ("shengmei", "盛美上海", "688082", "semiconductor", "清洗设备", "半导体设备", {
        "business": "半导体清洗设备", "products": "单片清洗设备、电镀设备",
        "advantage": "国产清洗设备龙头", "logic": "存储/HBM 清洗设备需求",
    }),
    ("shengong", "神工股份", "688233", "semiconductor", "大硅片/硅零部件", "硅片衬底", {
        "business": "半导体硅材料", "products": "大直径硅材料、硅零部件、刻蚀电极",
        "advantage": "大硅片及硅零部件供应商", "logic": "硅片国产化与零部件需求",
    }),
    ("jingce", "精测电子", "300567", "semiconductor", "存储/面板检测设备", "半导体设备", {
        "business": "面板及半导体检测设备", "products": "膜厚/OCD 检测、存储测试设备",
        "advantage": "检测设备平台型企业", "logic": "存储与面板检测需求",
    }),
    ("juchen", "聚辰股份", "688123", "semiconductor", "EEPROM/SPD 芯片", "存储设计", {
        "business": "集成电路芯片设计", "products": "EEPROM、SPD、音圈马达驱动芯片",
        "advantage": "EEPROM 与 DDR5 SPD 芯片领先", "logic": "DDR5 与汽车 EEPROM 需求",
    }),
    ("suzhouguz", "苏州固锝", "002079", "packaging", "二极管/封装", "引线框架/封装", {
        "business": "半导体分立器件", "products": "二极管、整流桥、传感器、封装",
        "advantage": "分立器件与封装老牌企业", "logic": "功率器件封装需求",
    }),
    ("luwei", "路维光电", "688401", "semiconductor", "掩膜版", "掩膜版", {
        "business": "掩膜版研发生产", "products": "平板显示掩膜版、半导体掩膜版",
        "advantage": "掩膜版国产领先企业", "logic": "半导体掩膜版需求增长",
    }),
    ("jinanguoji", "金安国纪", "002636", "pcb", "覆铜板 CCL", "CCL", {
        "business": "覆铜板及电子级玻纤布", "products": "FR-4 覆铜板、半固化片",
        "advantage": "覆铜板重要供应商", "logic": "AI 服务器 PCB 拉动 CCL",
    }),
    ("ashichuang", "阿石创", "300706", "materials", "PVD 靶材", "靶材", {
        "business": "溅射靶材及蒸发材料", "products": "显示/半导体/光伏靶材",
        "advantage": "国内靶材重要供应商", "logic": "靶材国产替代",
    }),
    ("longhua", "隆华科技", "300263", "materials", "靶材/节能新材料", "靶材", {
        "business": "节能新材料及靶材", "products": "钼靶、钨靶、节能换热材料",
        "advantage": "靶材与节能材料双主业", "logic": "显示与半导体靶材需求",
    }),
    ("longyang", "隆扬电子", "301389", "pcb_upstream", "电磁屏蔽/铜箔材料", "铜箔/屏蔽材料", {
        "business": "电磁屏蔽材料", "products": "电磁屏蔽膜、铜箔类材料",
        "advantage": "电磁屏蔽材料供应商", "logic": "高端铜箔与屏蔽材料",
    }),
    ("feikai", "飞凯材料", "300398", "materials", "封装材料/光刻胶", "环氧塑封料", {
        "business": "电子化学品及新材料", "products": "封装材料、光刻胶、屏幕涂料",
        "advantage": "封装与显示材料平台", "logic": "封装材料国产替代",
    }),
    ("maijie", "麦捷科技", "300319", "components", "电感/被动元件", "被动元件", {
        "business": "电子元器件", "products": "片式电感、LTCC、变压器、射频器件",
        "advantage": "国内电感与被动元件供应商", "logic": "被动元件与射频需求",
    }),
    ("huanghe", "黄河旋风", "600172", "pcb_upstream", "金刚石材料", "金刚石散热", {
        "business": "超硬材料及制品", "products": "人造金刚石、金刚石工具",
        "advantage": "超硬材料老牌企业", "logic": "金刚石散热与工具需求",
    }),
    ("dingtai", "鼎泰高科", "301377", "pcb_upstream", "PCB 微型刀具/钻针", "钻针", {
        "business": "PCB 微型刀具", "products": "PCB 钻针、铣刀、数控刀具",
        "advantage": "PCB 钻针重要供应商", "logic": "高端 PCB 钻针需求",
    }),
    ("dinglong", "鼎龙股份", "300054", "materials", "CMP 抛光垫", "CMP 材料", {
        "business": "打印复印通用耗材及新材料", "products": "CMP 抛光垫、柔性显示材料、硒鼓芯片",
        "advantage": "国产 CMP 抛光垫龙头", "logic": "CMP 材料国产替代",
    }),
    ("longtu", "龙图光罩", "688721", "semiconductor", "半导体掩膜版", "掩膜版", {
        "business": "半导体掩膜版", "products": "石英掩膜版、苏打掩膜版",
        "advantage": "半导体掩膜版新锐", "logic": "掩膜版国产替代",
    }),
]


def stock_line(s, market=None):
    id_, name, code, cat, role, chain, _ = s
    m = f', market: "{market}"' if market else ""
    return (
        f'  {{ id: "{id_}", name: "{name}", code: "{code}"{m}, category: "{cat}", '
        f'isLeader: true, role: "{role}", chainLink: "{chain}" }},'
    )


def apply(canvas_path: Path, details: dict) -> int:
    canvas = canvas_path.read_text(encoding="utf-8")
    block = canvas.split("const STOCKS")[1].split("];")[0]
    existing_ids = set(re.findall(r'id: "([^"]+)"', block))
    existing_codes = set(re.findall(r'code: "([^"]+)"', block))

    to_add = [s for s in CHAIN_STOCKS if s[0] not in existing_ids and s[2] not in existing_codes]
    if not to_add:
        return 0

    insert_block = "\n  // ── 产业链图补充 ──\n"
    for s in to_add:
        market = "北交所" if s[2] == "835438" else None
        insert_block += stock_line(s, market) + "\n"
        details[s[0]] = {**s[6], "risk": ""}

    canvas = canvas.replace("\n  // ── 其他 ──", insert_block + "\n  // ── 其他 ──")
    canvas_path.write_text(canvas, encoding="utf-8")
    return len(to_add)


def main():
    details = json.loads(DETAILS.read_text(encoding="utf-8"))
    total = 0
    for path in [CANVAS_LOCAL, CANVAS_CURSOR]:
        if path.exists():
            n = apply(path, details)
            total = max(total, n)
            print(f"{path}: added {n}")
    DETAILS.write_text(json.dumps(details, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Details entries: {len(details)}, new stocks: {total}")


if __name__ == "__main__":
    main()
