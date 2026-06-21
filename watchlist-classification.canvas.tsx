import {
  BarChart,
  Card,
  CardBody,
  CardHeader,
  Callout,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  IconButton,
  Pill,
  Row,
  Select,
  Spacer,
  Stack,
  Stat,
  Swatch,
  Table,
  Text,
  TextArea,
  TextInput,
  Toggle,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

// ─── 类型 ───────────────────────────────────────────────────

type CategoryKey =
  | "compute"
  | "ai_app"
  | "optical"
  | "pcb"
  | "pcb_upstream"
  | "packaging"
  | "semiconductor"
  | "materials"
  | "components"
  | "telecom"
  | "newenergy"
  | "robotics"
  | "simulation"
  | "autodrive"
  | "infra"
  | "consumer"
  | "raw"
  | "utility"
  | "healthcare"
  | "other";

interface Stock {
  id: string;
  name: string;
  code: string;
  market?: string;
  category: CategoryKey;
  role: string;
  chainLink?: string;
  isWatchlist?: boolean;
  isLeader?: boolean;
}

interface StockDetail {
  business: string;
  products: string;
  advantage: string;
  logic: string;
}

// ─── 分类定义 ─────────────────────────────────────────────────

const CATEGORIES: { key: CategoryKey; label: string; color: "pink" | "orange" | "yellow" | "green" | "blue" | "purple" | "cyan" | "gray"; desc: string }[] = [
  { key: "compute", label: "AI 算力 / 服务器", color: "pink", desc: "算力芯片、AI 服务器、代工、IDC" },
  { key: "ai_app", label: "AI 应用", color: "pink", desc: "大模型应用、AI 办公/营销/游戏/内容、企业服务 AI" },
  { key: "optical", label: "光模块 / CPO", color: "blue", desc: "光模块、光引擎、激光芯片、TFLN、精密耦合" },
  { key: "pcb", label: "PCB / 载板", color: "purple", desc: "高端 PCB、ABF/IC 载板、覆铜板" },
  { key: "pcb_upstream", label: "PCB 上游材料", color: "yellow", desc: "HVLP 铜箔、电子布/Q布、树脂、硅微粉" },
  { key: "packaging", label: "先进封装", color: "orange", desc: "封测、COUPE、晶圆级封装" },
  { key: "semiconductor", label: "半导体制造 / 设计", color: "cyan", desc: "代工、IDM、存储/MCU/接口/设备" },
  { key: "materials", label: "半导体材料 / 特气", color: "yellow", desc: "InP/TFLN/石英/靶材/前驱体/电子特气" },
  { key: "components", label: "电子元器件", color: "green", desc: "MLCC、被动件、铜箔加工" },
  { key: "telecom", label: "通信 / 光纤光缆", color: "blue", desc: "光通信设备、光纤、电缆" },
  { key: "newenergy", label: "锂电 / 新能源", color: "green", desc: "电池、电解液、正极材料" },
  { key: "robotics", label: "机器人 / 工控", color: "orange", desc: "伺服、减速器、人形机器人零部件" },
  { key: "simulation", label: "仿真 / EDA / 数字孪生", color: "cyan", desc: "工业 CAE、EDA、物理仿真、Cosmos 生态" },
  { key: "autodrive", label: "自动驾驶 / 智能驾驶", color: "purple", desc: "域控制器、激光雷达、高精地图" },
  { key: "infra", label: "散热 / 数据中心基建", color: "gray", desc: "液冷、温控、AI 基建" },
  { key: "consumer", label: "消费电子 / 显示", color: "purple", desc: "声学、面板、终端组装" },
  { key: "raw", label: "有色 / 稀土 / 战略金属", color: "yellow", desc: "铜、钨、稀土、铟、特种合金" },
  { key: "utility", label: "电力 / 公用事业", color: "gray", desc: "水电、火电、电力运营" },
  { key: "healthcare", label: "医药 / 医疗", color: "green", desc: "创新药、CXO、医疗服务" },
  { key: "other", label: "其他", color: "gray", desc: "船舶、环保、海外标的等" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<CategoryKey, (typeof CATEGORIES)[number]>;

// ─── 自选股 + 行业龙头（A 股）────────────────────────────────

const STOCKS: Stock[] = [
  // ── AI 算力 / 服务器 ──
  { id: "fugong", name: "工业富联", code: "601138", category: "compute", isWatchlist: true, isLeader: true, role: "AI 服务器代工龙头", chainLink: "Cosmos 第一梯队" },
  { id: "langchao", name: "浪潮信息", code: "000977", category: "compute", isWatchlist: true, isLeader: true, role: "AI 服务器品牌龙头", chainLink: "Cosmos 第一梯队" },
  { id: "haiguang", name: "海光信息", code: "688041", category: "compute", isWatchlist: true, isLeader: true, role: "国产 x86/DCU 算力芯片龙头", chainLink: "算力芯片" },
  { id: "hanwu", name: "寒武纪", code: "688256", category: "compute", isWatchlist: true, isLeader: true, role: "AI 推理/训练芯片龙头", chainLink: "Cosmos 第一梯队" },
  { id: "ziguang", name: "紫光股份", code: "000938", category: "compute", isLeader: true, role: "AI 服务器 + 网络设备龙头", chainLink: "Cosmos 第一梯队" },
  { id: "zhongke", name: "中科曙光", code: "603019", category: "compute", isLeader: true, role: "超算/AI 服务器国家队", chainLink: "Cosmos 第一梯队" },
  { id: "xiechuang", name: "协创数据", code: "300857", category: "compute", isLeader: true, role: "AI 存储/算力基础设施", chainLink: "Cosmos 第一梯队" },
  { id: "aofei", name: "奥飞数据", code: "300738", category: "compute", isLeader: true, role: "IDC/算力租赁", chainLink: "AI 基建" },
  { id: "xinyuan", name: "芯原股份", code: "688521", category: "compute", isLeader: true, role: "芯片 IP + 定制硅", chainLink: "Cosmos 第一梯队" },
  { id: "jingjia", name: "景嘉微", code: "300474", category: "compute", isLeader: true, role: "国产 GPU", chainLink: "算力芯片" },
  { id: "longxin", name: "龙芯中科", code: "688047", category: "compute", isLeader: true, role: "自主指令集 CPU", chainLink: "算力芯片" },

  // ── AI 应用 ──
  { id: "kedaxunfei", name: "科大讯飞", code: "002230", category: "ai_app", isLeader: true, role: "智能语音与大模型应用龙头", chainLink: "AI 应用" },
  { id: "jinshan", name: "金山办公", code: "688111", category: "ai_app", isLeader: true, role: "AI 办公/WPS 龙头", chainLink: "AI 办公" },
  { id: "tuoersi", name: "拓尔思", code: "300229", category: "ai_app", isLeader: true, role: "数据智能与大模型应用", chainLink: "AI 政务/金融" },
  { id: "kunlun", name: "昆仑万维", code: "300418", category: "ai_app", isLeader: true, role: "AI 应用投资与出海", chainLink: "AI 内容/社交" },
  { id: "wancheng", name: "万兴科技", code: "300624", category: "ai_app", isLeader: true, role: "AIGC 创意工具龙头", chainLink: "AI 创作工具" },
  { id: "sanliu", name: "三六零", code: "601360", category: "ai_app", isLeader: true, role: "AI 搜索与安全应用", chainLink: "AI 搜索" },
  { id: "yongyou", name: "用友网络", code: "600588", category: "ai_app", isLeader: true, role: "企业 AI 云服务龙头", chainLink: "AI 企业服务" },
  { id: "zhongkechuangda", name: "中科创达", code: "300496", category: "ai_app", isLeader: true, role: "端侧 AI OS/智能汽车", chainLink: "端侧 AI" },
  { id: "ruantong", name: "软通动力", code: "301236", category: "ai_app", isLeader: true, role: "鸿蒙+AI 应用交付", chainLink: "AI 应用集成" },
  { id: "runhe", name: "润和软件", code: "300339", category: "ai_app", isLeader: true, role: "鸿蒙生态/边缘 AI", chainLink: "端侧 AI" },
  { id: "haitian", name: "海天瑞声", code: "688787", category: "ai_app", isLeader: true, role: "AI 训练数据龙头", chainLink: "AI 语料" },
  { id: "zhongwen", name: "中文在线", code: "300364", category: "ai_app", isLeader: true, role: "AI 内容/IP 运营", chainLink: "AI 内容" },
  { id: "yinli", name: "引力传媒", code: "603598", category: "ai_app", isLeader: true, role: "AI 营销传播", chainLink: "AI 营销" },
  { id: "yuntong", name: "云从科技", code: "688327", category: "ai_app", isLeader: true, role: "计算机视觉 AI 应用", chainLink: "视觉 AI" },
  { id: "hongruan", name: "虹软科技", code: "688088", category: "ai_app", isLeader: true, role: "视觉算法授权龙头", chainLink: "端侧视觉" },
  { id: "fuxin-pdf", name: "福昕软件", code: "688095", category: "ai_app", isLeader: true, role: "AI 文档/PDF 应用", chainLink: "AI 办公" },
  { id: "hande", name: "汉得信息", code: "300170", category: "ai_app", isLeader: true, role: "企业 AI 数字化实施", chainLink: "AI 企业服务" },
  { id: "boyan", name: "博彦科技", code: "002649", category: "ai_app", isLeader: true, role: "AI 应用开发与集成", chainLink: "AI 应用集成" },
  { id: "shenzhou", name: "神州数码", code: "000034", category: "ai_app", isLeader: true, role: "AI 算力分销与应用服务", chainLink: "AI 云服务" },
  { id: "geling", name: "格灵深瞳", code: "688207", category: "ai_app", isLeader: true, role: "垂直场景视觉 AI", chainLink: "视觉 AI" },
  { id: "hanwang", name: "汉王科技", code: "002362", category: "ai_app", isLeader: true, role: "OCR/AI 读写应用", chainLink: "AI 办公" },
  { id: "guomai", name: "果麦文化", code: "301052", category: "ai_app", isLeader: true, role: "AI 阅读/出版", chainLink: "AI 内容" },
  { id: "tangmu", name: "汤姆猫", code: "300459", category: "ai_app", isLeader: true, role: "AI 陪伴/互动游戏", chainLink: "AI 游戏" },
  { id: "juren", name: "巨人网络", code: "002558", category: "ai_app", isLeader: true, role: "AI 游戏探索", chainLink: "AI 游戏" },
  { id: "shiji", name: "世纪华通", code: "002602", category: "ai_app", isLeader: true, role: "AI 游戏/IP", chainLink: "AI 游戏" },

  // ── 光模块 / CPO ──
  { id: "zhongji", name: "中际旭创", code: "300308", category: "optical", isWatchlist: true, isLeader: true, role: "光模块全球龙头", chainLink: "CPO L3" },
  { id: "guangxun", name: "光迅科技", code: "002281", category: "optical", isWatchlist: true, isLeader: true, role: "光芯片+模块全产业链", chainLink: "CPO L1 光芯片" },
  { id: "tianfu", name: "天孚通信", code: "300394", category: "optical", isWatchlist: true, isLeader: true, role: "光引擎/FAU 精密耦合龙头", chainLink: "CPO L3" },
  { id: "yuanjie", name: "源杰科技", code: "688498", category: "optical", isWatchlist: true, isLeader: true, role: "CW 激光器 + InP 外延龙头", chainLink: "CPO L1 CW 激光" },
  { id: "dongshan", name: "东山精密", code: "002384", category: "optical", isWatchlist: true, role: "光芯片/精密制造；EML 布局", chainLink: "CPO L1" },
  { id: "xinyisheng", name: "新易盛", code: "300502", category: "optical", isLeader: true, role: "高速光模块龙头；TFLN 升级", chainLink: "CPO L3 / TFLN" },
  { id: "guangku", name: "光库科技", code: "300620", category: "optical", isLeader: true, role: "TFLN 调制器全球仅 3 家量产之一", chainLink: "CPO L2 TFLN" },
  { id: "shijia", name: "仕佳光子", code: "688313", category: "optical", isLeader: true, role: "PLC/WDM 芯片 + InP 外延", chainLink: "CPO L1/L2" },
  { id: "taichen", name: "太辰光", code: "300570", category: "optical", isLeader: true, role: "FAU/MPO 跳线龙头", chainLink: "CPO L3 FAU" },
  { id: "huagong", name: "华工科技", code: "000988", category: "optical", isLeader: true, role: "光模块 + 激光设备", chainLink: "TFLN 光模块" },
  { id: "jianqiao", name: "剑桥科技", code: "603083", category: "optical", isLeader: true, role: "TFLN 材料/器件自研", chainLink: "TFLN" },
  { id: "liante", name: "联特科技", code: "301205", category: "optical", isLeader: true, role: "高速光模块", chainLink: "TFLN 光模块" },
  { id: "luobote", name: "罗博特科", code: "300757", category: "optical", isLeader: true, role: "光模块设备/硅光工艺", chainLink: "CPO 设备" },
  { id: "fujing", name: "福晶科技", code: "002222", category: "optical", isLeader: true, role: "TGG 磁光晶体国内唯一全球级", chainLink: "CPO L2 隔离器" },
  { id: "lante", name: "蓝特光学", code: "688127", category: "optical", isLeader: true, role: "微透镜阵列/准直器", chainLink: "CPO L2 耦合" },

  // ── PCB / 载板 ──
  { id: "shennan", name: "深南电路", code: "002916", category: "pcb", isWatchlist: true, isLeader: true, role: "ABF 载板 + 高层 PCB 龙头", chainLink: "ABF 载板" },
  { id: "xingsen", name: "兴森科技", code: "002436", category: "pcb", isWatchlist: true, isLeader: true, role: "国内 IC 载板龙头", chainLink: "ABF 载板" },
  { id: "hudian", name: "沪电股份", code: "002463", category: "pcb", isWatchlist: true, isLeader: true, role: "AI 服务器/通信 PCB 龙头", chainLink: "CPO L4 主板" },
  { id: "shengyi", name: "生益科技", code: "600183", category: "pcb", isWatchlist: true, isLeader: true, role: "全球覆铜板 CCL 龙头", chainLink: "CCL + ABF 材料" },
  { id: "guanghe", name: "广合科技", code: "001389", category: "pcb", isWatchlist: true, role: "AI 服务器 PCB 新锐", chainLink: "高端 PCB" },
  { id: "zhongjing", name: "中京电子", code: "002579", category: "pcb", isWatchlist: true, role: "ABF 薄膜投资布局", chainLink: "ABF 材料链" },
  { id: "jingwang", name: "景旺电子", code: "603228", category: "pcb", isLeader: true, role: "PCB 龙头；ABF 技术储备", chainLink: "ABF 载板" },
  { id: "shenghong", name: "胜宏科技", code: "300476", category: "pcb", isLeader: true, role: "AI 服务器 PCB；2026 ABF 试产", chainLink: "ABF 载板" },
  { id: "pengding", name: "鹏鼎控股", code: "002938", category: "pcb", isLeader: true, role: "全球 FPC/HDI PCB 龙头", chainLink: "高端 PCB" },
  { id: "nanya", name: "南亚新材", code: "688519", category: "pcb", isLeader: true, role: "载板 BT 材料；ABF 布局", chainLink: "ABF 材料" },
  { id: "huazheng", name: "华正新材", code: "603186", category: "pcb", isLeader: true, role: "CBF 增层绝缘膜验证算力芯片", chainLink: "ABF 替代" },
  { id: "lianhua", name: "莲花控股", code: "600186", category: "pcb", isLeader: true, role: "据称国内唯一高端 ABF 薄膜量产", chainLink: "ABF 薄膜" },

  // ── PCB 上游材料 ──
  { id: "honghe", name: "宏和科技", code: "603256", category: "pcb_upstream", isLeader: true, role: "国内唯一全系列 Low-CTE/T-glass 布", chainLink: "电子布核心瓶颈" },
  { id: "feilihua", name: "菲利华", code: "300395", category: "pcb_upstream", isLeader: true, role: "Q 布全球核心；石英材料", chainLink: "未来方向 Q 布" },
  { id: "tongguan", name: "铜冠铜箔", code: "301217", category: "pcb_upstream", isLeader: true, role: "HVLP 铜箔系列量产龙头", chainLink: "HVLP4 瓶颈" },
  { id: "defu", name: "德福科技", code: "301511", category: "pcb_upstream", isLeader: true, role: "HVLP3 规模化，HVLP4 跟进", chainLink: "HVLP4 瓶颈" },
  { id: "shengquan", name: "圣泉集团", code: "605589", category: "pcb_upstream", isLeader: true, role: "PPO/PPE 低损耗树脂龙头", chainLink: "M6+ 树脂" },
  { id: "dongcai", name: "东材科技", code: "601208", category: "pcb_upstream", isLeader: true, role: "碳氢树脂/BMI + 固化剂", chainLink: "高端树脂" },
  { id: "hongchang", name: "宏昌电子", code: "603002", category: "pcb_upstream", isLeader: true, role: "电子级环氧 + ABF 增层膜", chainLink: "ABF 薄膜" },
  { id: "lianrui", name: "联瑞新材", code: "688300", category: "pcb_upstream", isLeader: true, role: "球形硅微粉国内绝对龙头", chainLink: "载板填料" },
  { id: "jushi", name: "中国巨石", code: "600176", category: "pcb_upstream", isWatchlist: true, isLeader: true, role: "全球玻纤龙头；电子布基础", chainLink: "电子布基材" },
  { id: "zhongcai", name: "中材科技", code: "002080", category: "pcb_upstream", isLeader: true, role: "Low-Dk 布追赶；第三代 Q 布", chainLink: "电子布/Q 布" },

  // ── 先进封装 ──
  { id: "changdian", name: "长电科技", code: "600584", category: "packaging", isWatchlist: true, isLeader: true, role: "全球封测龙头；CPO 封装候选", chainLink: "CPO L4 / COUPE" },
  { id: "tongfu", name: "通富微电", code: "002156", category: "packaging", isWatchlist: true, isLeader: true, role: "AMD 封测伙伴，先进封装", chainLink: "先进封装" },
  { id: "huatian", name: "华天科技", code: "002185", category: "packaging", isWatchlist: true, isLeader: true, role: "封测第二梯队龙头", chainLink: "先进封装" },
  { id: "jingfang", name: "晶方科技", code: "603005", category: "packaging", isWatchlist: true, isLeader: true, role: "晶圆级封装 WLCSP 龙头", chainLink: "先进封装" },
  { id: "taiji", name: "太极实业", code: "600667", category: "packaging", isWatchlist: true, role: "海太半导体封测（SK 海力士）", chainLink: "先进封装" },
  { id: "yongxi", name: "甬矽电子", code: "688362", category: "packaging", isLeader: true, role: "先进封装新锐", chainLink: "先进封装" },

  // ── 半导体制造 / 设计 ──
  { id: "zhongxin", name: "中芯国际", code: "688981", category: "semiconductor", isWatchlist: true, isLeader: true, role: "国内晶圆代工龙头", chainLink: "制造" },
  { id: "huahong", name: "华虹宏力", code: "688347", category: "semiconductor", isWatchlist: true, isLeader: true, role: "特色工艺晶圆代工龙头", chainLink: "制造" },
  { id: "san-an", name: "三安光电", code: "600703", category: "semiconductor", isWatchlist: true, isLeader: true, role: "化合物半导体 IDM；InP 外延第一", chainLink: "InP 外延" },
  { id: "lanqi-a", name: "澜起科技", code: "688008", category: "semiconductor", isWatchlist: true, isLeader: true, role: "DDR5 内存接口芯片龙头", chainLink: "芯片设计" },
  { id: "lanqi-hk", name: "澜起科技", code: "HK6809", market: "港股", category: "semiconductor", isWatchlist: true, role: "内存接口芯片（AH 股）", chainLink: "芯片设计" },
  { id: "zhaoyi", name: "兆易创新", code: "603986", category: "semiconductor", isWatchlist: true, isLeader: true, role: "NOR Flash / MCU 龙头", chainLink: "芯片设计" },
  { id: "liangwei", name: "立昂微", code: "605358", category: "semiconductor", isWatchlist: true, isLeader: true, role: "半导体硅片 + 功率器件", chainLink: "制造" },
  { id: "xiangnong", name: "香农芯创", code: "300475", category: "semiconductor", isWatchlist: true, role: "半导体分销 + 存储产业链", chainLink: "渠道" },
  { id: "demingli", name: "德明利", code: "001309", category: "semiconductor", isWatchlist: true, role: "存储主控芯片 + 模组", chainLink: "芯片设计" },
  { id: "hugui", name: "沪硅产业", code: "688126", category: "semiconductor", isLeader: true, role: "半导体硅片国产化龙头", chainLink: "制造" },
  { id: "beifang", name: "北方华创", code: "002371", category: "semiconductor", isLeader: true, role: "半导体设备平台龙头", chainLink: "设备" },
  { id: "weier", name: "韦尔股份", code: "603501", category: "semiconductor", isLeader: true, role: "CIS 图像传感器龙头", chainLink: "芯片设计" },
  { id: "haite", name: "海特高新", code: "002023", category: "semiconductor", isLeader: true, role: "InP 外延片产能第二", chainLink: "InP 外延" },
  { id: "bojie", name: "博杰股份", code: "002975", category: "semiconductor", isLeader: true, role: "InP 衬底产能第三", chainLink: "InP 衬底" },

  // ── 半导体材料 / 特气 ──
  { id: "yunnan-zhe", name: "云南锗业", code: "002428", category: "materials", isWatchlist: true, isLeader: true, role: "InP 衬底产能第一", chainLink: "CPO L0 InP" },
  { id: "tiantong", name: "天通股份", code: "600330", category: "materials", isWatchlist: true, isLeader: true, role: "铌酸锂晶体材料龙头", chainLink: "TFLN 材料" },
  { id: "shiying", name: "石英股份", code: "603688", category: "materials", isWatchlist: true, isLeader: true, role: "高纯石英砂 4N8+ 龙头", chainLink: "CPO L0 石英砂" },
  { id: "youyan", name: "有研新材", code: "600206", category: "materials", isWatchlist: true, isLeader: true, role: "InP 衬底产能第二；靶材", chainLink: "InP 衬底" },
  { id: "yake", name: "雅克科技", code: "002409", category: "materials", isWatchlist: true, isLeader: true, role: "半导体前驱体/封装材料龙头", chainLink: "电子特气/材料" },
  { id: "guanghua", name: "光华科技", code: "002741", category: "materials", isWatchlist: true, role: "PCB 化学品/电子级硫酸", chainLink: "稀缺材料-硫酸" },
  { id: "zhongchuan", name: "中船特气", code: "688146", category: "materials", isLeader: true, role: "电子特气（含高纯氦）", chainLink: "稀缺材料-氦气" },
  { id: "huate", name: "华特气体", code: "688268", category: "materials", isLeader: true, role: "特种气体龙头", chainLink: "电子特气" },
  { id: "haohua", name: "昊华科技", code: "600378", category: "materials", isLeader: true, role: "电子特气/氟化工", chainLink: "电子特气" },
  { id: "jiangfeng", name: "江丰电子", code: "300666", category: "materials", isLeader: true, role: "高纯溅射靶材龙头", chainLink: "靶材" },
  { id: "nandaguang", name: "南大光电", code: "300346", category: "materials", isLeader: true, role: "MO 源/前驱体/ArF 光刻胶", chainLink: "半导体材料" },
  { id: "xiye", name: "锡业股份", code: "000960", category: "materials", isLeader: true, role: "全球最大铟储量", chainLink: "高纯铟" },

  // ── 电子元器件 ──
  { id: "huoju", name: "火炬电子", code: "603678", category: "components", isWatchlist: true, isLeader: true, role: "特种 MLCC/陶瓷电容器", chainLink: "稀缺材料-MLCC" },
  { id: "fenghua", name: "风华高科", code: "000636", category: "components", isWatchlist: true, isLeader: true, role: "MLCC 国内龙头", chainLink: "稀缺材料-MLCC" },
  { id: "nuode", name: "诺德股份", code: "600110", category: "components", isWatchlist: true, role: "锂电铜箔 + PCB 铜箔", chainLink: "铜箔" },
  { id: "sanhuan", name: "三环集团", code: "300408", category: "components", isLeader: true, role: "电子陶瓷/MLCC 龙头", chainLink: "被动元件" },

  // ── 通信 / 光纤光缆 ──
  { id: "hengtong", name: "亨通光电", code: "600487", category: "telecom", isWatchlist: true, isLeader: true, role: "光纤光缆 + 海洋通信 + 硅光", chainLink: "光通信/CPO" },
  { id: "fenghuo", name: "烽火通信", code: "600498", category: "telecom", isWatchlist: true, isLeader: true, role: "光通信设备/系统龙头", chainLink: "光通信" },
  { id: "zhongtian", name: "中天科技", code: "600522", category: "telecom", isWatchlist: true, isLeader: true, role: "光纤光缆 + 海缆龙头", chainLink: "光通信" },
  { id: "yongding", name: "永鼎股份", code: "600105", category: "telecom", isWatchlist: true, role: "光纤光缆 + 高温超导", chainLink: "光通信" },
  { id: "tongding", name: "通鼎互联", code: "002491", category: "telecom", isWatchlist: true, role: "光纤光缆 + 数据中心", chainLink: "光通信" },
  { id: "hangdian", name: "杭电股份", code: "603618", category: "telecom", isWatchlist: true, role: "电线电缆", chainLink: "电缆" },

  // ── 锂电 / 新能源 ──
  { id: "tianci", name: "天赐材料", code: "002709", category: "newenergy", isWatchlist: true, isLeader: true, role: "电解液全球龙头", chainLink: "锂电材料" },
  { id: "duofuduo", name: "多氟多", code: "002407", category: "newenergy", isWatchlist: true, isLeader: true, role: "六氟磷酸锂龙头", chainLink: "锂电材料" },
  { id: "yiwei", name: "亿纬锂能", code: "300014", category: "newenergy", isWatchlist: true, isLeader: true, role: "锂电池龙头", chainLink: "电池" },
  { id: "tianhua", name: "天华新能", code: "300390", category: "newenergy", isWatchlist: true, role: "锂电正极材料（氢氧化锂）", chainLink: "锂电材料" },
  { id: "ningde", name: "宁德时代", code: "300750", category: "newenergy", isLeader: true, role: "动力电池全球龙头", chainLink: "电池" },

  // ── 机器人 / 工控 ──
  { id: "huichuan", name: "汇川技术", code: "300124", category: "robotics", isWatchlist: true, isLeader: true, role: "伺服/变频器/工控龙头", chainLink: "Cosmos 第三梯队" },
  { id: "dashi", name: "达实智能", code: "002421", category: "robotics", isWatchlist: true, role: "智慧建筑/物联网", chainLink: "Cosmos 第三梯队" },
  { id: "robot-etf", name: "机器人ETF", code: "159213", market: "ETF", category: "robotics", isWatchlist: true, role: "机器人板块指数 ETF", chainLink: "板块配置" },
  { id: "lvbo", name: "绿的谐波", code: "688017", category: "robotics", isLeader: true, role: "谐波减速器龙头", chainLink: "人形机器人" },
  { id: "tuopu", name: "拓普集团", code: "601689", category: "robotics", isLeader: true, role: "人形机器人核心零部件", chainLink: "Cosmos 第三梯队" },
  { id: "sanhua", name: "三花智控", code: "002050", category: "robotics", isLeader: true, role: "热管理/执行器零部件", chainLink: "Cosmos 第三梯队" },
  { id: "shuanghuan", name: "双环传动", code: "002472", category: "robotics", isLeader: true, role: "RV 减速器龙头", chainLink: "人形机器人" },
  { id: "keli", name: "柯力传感", code: "603662", category: "robotics", isLeader: true, role: "力传感器龙头", chainLink: "传感器" },
  { id: "aobi", name: "奥比中光", code: "688322", category: "robotics", isLeader: true, role: "3D 视觉传感器", chainLink: "传感器" },
  { id: "zhaowei", name: "兆威机电", code: "003021", category: "robotics", isLeader: true, role: "微型传动龙头", chainLink: "执行器" },

  // ── 仿真 / EDA / 数字孪生 ──
  { id: "tianyu", name: "天娱数科", code: "002354", category: "ai_app", isWatchlist: true, role: "数字人/AI 内容", chainLink: "Cosmos 第二梯队" },
  { id: "suochen", name: "索辰科技", code: "688507", category: "simulation", isLeader: true, role: "工业 CAE 仿真龙头", chainLink: "Cosmos 第二梯队" },
  { id: "huadaj", name: "华大九天", code: "301269", category: "simulation", isLeader: true, role: "国产 EDA 龙头", chainLink: "Cosmos 第二梯队" },
  { id: "gailun", name: "概伦电子", code: "688206", category: "simulation", isLeader: true, role: "EDA 器件建模", chainLink: "Cosmos 第二梯队" },
  { id: "zhongwang", name: "中望软件", code: "688083", category: "simulation", isLeader: true, role: "CAD/CAE 国产替代", chainLink: "Cosmos 第二梯队" },
  { id: "chaotu", name: "超图软件", code: "300036", category: "simulation", isLeader: true, role: "GIS/数字孪生底座", chainLink: "Cosmos 第二梯队" },
  { id: "guangli", name: "广立微", code: "301095", category: "simulation", isLeader: true, role: "芯片 EDA 良率分析", chainLink: "Cosmos 第二梯队" },
  { id: "fantuo", name: "凡拓数创", code: "301313", category: "simulation", isLeader: true, role: "数字孪生可视化", chainLink: "Cosmos 第二/四梯队" },

  // ── 自动驾驶 / 智能驾驶 ──
  { id: "desay", name: "德赛西威", code: "002920", category: "autodrive", isLeader: true, role: "智能驾驶域控制器龙头", chainLink: "Cosmos 第四梯队" },
  { id: "siwei", name: "四维图新", code: "002405", category: "autodrive", isLeader: true, role: "高精地图/智驾数据", chainLink: "Cosmos 第四梯队" },
  { id: "wanji", name: "万集科技", code: "300552", category: "autodrive", isLeader: true, role: "激光雷达/ETC", chainLink: "Cosmos 第四梯队" },
  { id: "bert", name: "伯特利", code: "603596", category: "autodrive", isLeader: true, role: "线控底盘/制动系统", chainLink: "Cosmos 第四梯队" },
  { id: "tianzhun", name: "天准科技", code: "688003", category: "autodrive", isLeader: true, role: "机器视觉/智驾检测", chainLink: "Cosmos 第四梯队" },

  // ── 散热 / 数据中心基建 ──
  { id: "yingweike", name: "英维克", code: "002837", category: "infra", isWatchlist: true, isLeader: true, role: "数据中心液冷龙头", chainLink: "AI 基建" },
  { id: "fuxin", name: "富信科技", code: "688662", category: "infra", isLeader: true, role: "TEC 微制冷（CPO 光引擎温控）", chainLink: "CPO L3 热管理" },

  // ── 消费电子 / 显示 ──
  { id: "goertek", name: "歌尔股份", code: "002241", category: "consumer", isWatchlist: true, isLeader: true, role: "声学/VR/AR 代工龙头", chainLink: "消费电子" },
  { id: "boe", name: "京东方A", code: "000725", category: "consumer", isWatchlist: true, isLeader: true, role: "显示面板全球龙头", chainLink: "显示" },
  { id: "lanbiao", name: "蓝色光标", code: "300058", category: "ai_app", isWatchlist: true, role: "AI 营销/数字广告", chainLink: "AI 应用" },

  // ── 有色 / 稀土 / 战略金属 ──
  { id: "tongling", name: "铜陵有色", code: "000630", category: "raw", isWatchlist: true, isLeader: true, role: "阴极铜/铜箔上游", chainLink: "PCB L0 铜" },
  { id: "zhongwu", name: "中钨高新", code: "000657", category: "raw", isWatchlist: true, isLeader: true, role: "钨产业链龙头", chainLink: "战略金属" },
  { id: "beifangxt", name: "北方稀土", code: "600111", category: "raw", isWatchlist: true, isLeader: true, role: "稀土行业绝对龙头", chainLink: "稀土" },
  { id: "xibu", name: "西部材料", code: "002149", category: "raw", isWatchlist: true, role: "钛/锆/稀有金属加工", chainLink: "特种合金" },
  { id: "zhuye", name: "株冶集团", code: "600961", category: "raw", isLeader: true, role: "A 股铟产量第一", chainLink: "高纯铟" },

  // ── 电力 / 公用事业 ──
  { id: "changjiang", name: "长江电力", code: "600900", category: "utility", isWatchlist: true, isLeader: true, role: "水电龙头", chainLink: "电力" },
  { id: "huadian", name: "华电能源", code: "600726", category: "utility", isWatchlist: true, role: "火电运营", chainLink: "电力" },
  { id: "datang", name: "大唐发电", code: "601991", category: "utility", isWatchlist: true, role: "火电/新能源发电", chainLink: "电力" },

  // ── 医药 / 医疗 ──
  { id: "hengrui", name: "恒瑞医药", code: "600276", category: "healthcare", isWatchlist: true, isLeader: true, role: "创新药龙头", chainLink: "医药" },
  { id: "yaoming", name: "药明康德", code: "603259", category: "healthcare", isWatchlist: true, isLeader: true, role: "CXO 全球龙头", chainLink: "医药" },
  { id: "sanbo", name: "三博脑科", code: "301293", category: "healthcare", isWatchlist: true, role: "脑科医疗服务", chainLink: "医疗" },

  // ── 龙头参考补充 ──
  { id: "jiangtong", name: "江西铜业", code: "600362", category: "raw", isLeader: true, role: "国内阴极铜龙头", chainLink: "PCB L0 铜" },
  { id: "xiamenwu", name: "厦门钨业", code: "600549", category: "raw", isLeader: true, role: "钨产业链龙头", chainLink: "战略金属" },
  { id: "anji", name: "安集科技", code: "688019", category: "materials", isLeader: true, role: "CMP 抛光液龙头", chainLink: "半导体材料" },
  { id: "jinhong", name: "金宏气体", code: "688106", category: "materials", isLeader: true, role: "电子特气民营龙头", chainLink: "电子特气" },
  { id: "yihao", name: "逸豪新材", code: "301176", category: "pcb_upstream", isLeader: true, role: "HVLP 铜箔追赶者", chainLink: "HVLP4 瓶颈" },
  { id: "shunluo", name: "顺络电子", code: "002138", category: "components", isLeader: true, role: "电感/被动元件龙头", chainLink: "被动元件" },
  { id: "jiemei", name: "洁美科技", code: "002859", category: "components", isLeader: true, role: "纸质载带/被动元件上游", chainLink: "MLCC 产业链" },
  { id: "zhongwei", name: "中微公司", code: "688012", category: "semiconductor", isLeader: true, role: "刻蚀设备龙头", chainLink: "半导体设备" },
  { id: "zhuosheng", name: "卓胜微", code: "300782", category: "semiconductor", isLeader: true, role: "射频芯片龙头", chainLink: "芯片设计" },
  { id: "jiangbolang", name: "江波龙", code: "301308", category: "semiconductor", isLeader: true, role: "存储模组龙头", chainLink: "存储" },
  { id: "baiwei", name: "佰维存储", code: "688525", category: "semiconductor", isLeader: true, role: "存储模组新锐", chainLink: "存储" },
  { id: "weice", name: "伟测科技", code: "688372", category: "packaging", isLeader: true, role: "芯片测试服务龙头", chainLink: "先进封测" },
  { id: "tengjing", name: "腾景科技", code: "688195", category: "optical", isLeader: true, role: "精密光学/光通信元件", chainLink: "CPO L2 耦合" },
  { id: "dekeli", name: "德科立", code: "688205", category: "optical", isLeader: true, role: "光放大器/光模块", chainLink: "光通信" },
  { id: "shiyun", name: "世运电路", code: "603920", category: "pcb", isLeader: true, role: "汽车+AI 服务器 PCB", chainLink: "高端 PCB" },
  { id: "zhongxing", name: "中兴通讯", code: "000063", category: "telecom", isLeader: true, role: "通信设备全球龙头", chainLink: "算力网络" },
  { id: "shenling", name: "申菱环境", code: "301018", category: "infra", isLeader: true, role: "数据中心液冷/温控龙头", chainLink: "AI 基建液冷" },
  { id: "jialitu", name: "佳力图", code: "603912", category: "infra", isLeader: true, role: "精密空调/液冷", chainLink: "数据中心散热" },
  { id: "shujugang", name: "数据港", code: "603881", category: "compute", isLeader: true, role: "IDC/算力枢纽运营", chainLink: "AI 基建" },
  { id: "guanghuan", name: "光环新网", code: "300383", category: "compute", isLeader: true, role: "IDC+云计算运营", chainLink: "AI 基建" },
  { id: "guanglianda", name: "广联达", code: "002410", category: "simulation", isLeader: true, role: "建筑 CAD/数字造价", chainLink: "数字孪生" },
  { id: "aisidun", name: "埃斯顿", code: "002747", category: "robotics", isLeader: true, role: "工业机器人龙头", chainLink: "人形机器人" },
  { id: "mingzhi", name: "鸣志电器", code: "603728", category: "robotics", isLeader: true, role: "空心杯电机/执行器", chainLink: "人形机器人执行器" },
  { id: "jingwei", name: "经纬恒润", code: "688326", category: "autodrive", isLeader: true, role: "汽车电子/智驾域控", chainLink: "Cosmos 第四梯队" },
  { id: "huayang", name: "华阳集团", code: "002906", category: "autodrive", isLeader: true, role: "智能座舱/域控", chainLink: "Cosmos 第四梯队" },
  { id: "yongxin", name: "永新光学", code: "603297", category: "autodrive", isLeader: true, role: "车载光学/激光雷达光学", chainLink: "智驾传感器" },
  { id: "tonghuashun", name: "同花顺", code: "300033", category: "ai_app", isLeader: true, role: "金融科技/AI 投顾", chainLink: "AI 金融应用" },
  { id: "hengsheng", name: "恒生电子", code: "600570", category: "ai_app", isLeader: true, role: "金融 IT/大模型应用", chainLink: "AI 金融应用" },
  { id: "luxshare", name: "立讯精密", code: "002475", category: "consumer", isLeader: true, role: "消费电子组装龙头", chainLink: "消费电子" },
  { id: "lansi", name: "蓝思科技", code: "300433", category: "consumer", isLeader: true, role: "玻璃盖板/结构件龙头", chainLink: "消费电子" },
  { id: "enjie", name: "恩捷股份", code: "002812", category: "newenergy", isLeader: true, role: "锂电隔膜全球龙头", chainLink: "锂电材料" },

  // ── 产业链图补充 ──
  { id: "tclzhonghuan", name: "TCL中环", code: "002129", category: "semiconductor", isLeader: true, role: "半导体硅片/光伏硅片", chainLink: "硅片衬底" },
  { id: "shanghaixinyang", name: "上海新阳", code: "300236", category: "materials", isLeader: true, role: "电镀液/光刻胶材料", chainLink: "光刻胶/湿电子" },
  { id: "dongxi", name: "东芯股份", code: "688110", category: "semiconductor", isLeader: true, role: "利基型存储设计", chainLink: "存储设计" },
  { id: "zhongci", name: "中瓷电子", code: "003031", category: "components", isLeader: true, role: "陶瓷封装/陶瓷基板", chainLink: "陶瓷基板" },
  { id: "xingfu", name: "兴福电子", code: "688545", category: "materials", isLeader: true, role: "湿电子化学品", chainLink: "湿电子化学品" },
  { id: "guanshi", name: "冠石科技", code: "605588", category: "semiconductor", isLeader: true, role: "掩膜版/显示材料", chainLink: "掩膜版配套" },
  { id: "lingwei", name: "凌玮科技", code: "301373", category: "pcb_upstream", isLeader: true, role: "纳米二氧化硅/球形粉体", chainLink: "球形硅微粉" },
  { id: "kaisheng", name: "凯盛科技", code: "600552", category: "materials", isLeader: true, role: "显示玻璃/石英材料", chainLink: "玻璃基板/石英" },
  { id: "liliang", name: "力量钻石", code: "301071", category: "pcb_upstream", isLeader: true, role: "金刚石散热材料", chainLink: "金刚石散热" },
  { id: "beijingjunzheng", name: "北京君正", code: "300223", category: "semiconductor", isLeader: true, role: "车规存储/MCU", chainLink: "存储设计" },
  { id: "huaguang", name: "华光新材", code: "688379", category: "materials", isLeader: true, role: "钎焊材料/锡焊膏", chainLink: "锡焊膏" },
  { id: "huahaiqingke", name: "华海清科", code: "688120", category: "semiconductor", isLeader: true, role: "CMP 设备龙头", chainLink: "半导体设备" },
  { id: "huahaichengke", name: "华海诚科", code: "688535", category: "packaging", isLeader: true, role: "环氧塑封料", chainLink: "环氧塑封料" },
  { id: "boyian", name: "博迁新材", code: "605376", category: "components", isLeader: true, role: "MLCC 镍粉/金属粉体", chainLink: "MLCC 上游" },
  { id: "weiteou", name: "唯特偶", code: "301319", category: "materials", isLeader: true, role: "微电子焊接材料", chainLink: "锡焊膏" },
  { id: "sifangda", name: "四方达", code: "300179", category: "pcb_upstream", isLeader: true, role: "金刚石超硬材料", chainLink: "金刚石散热" },
  { id: "guoci", name: "国瓷材料", code: "300285", category: "components", isLeader: true, role: "陶瓷粉体/MLCC 材料", chainLink: "MLCC/陶瓷基板" },
  { id: "guokewei", name: "国科微", code: "300672", category: "semiconductor", isLeader: true, role: "SSD 主控/芯片设计", chainLink: "存储主控" },
  { id: "guojifucai", name: "国际复材", code: "301526", category: "pcb_upstream", isLeader: true, role: "电子级玻璃纤维布", chainLink: "电子玻纤布" },
  { id: "yishitong", name: "壹石通", code: "688733", category: "pcb_upstream", isLeader: true, role: "球形氧化铝/硅微粉", chainLink: "球形硅微粉" },
  { id: "rongda", name: "容大感光", code: "300576", category: "materials", isLeader: true, role: "PCB 光刻胶", chainLink: "PCB 光刻胶" },
  { id: "fuled", name: "富乐德", code: "301297", category: "semiconductor", isLeader: true, role: "晶圆再生/洗净服务", chainLink: "半导体材料服务" },
  { id: "juhua", name: "巨化股份", code: "600160", category: "materials", isLeader: true, role: "氟化工/电子特气", chainLink: "电子特气" },
  { id: "guangxin", name: "广信材料", code: "300537", category: "materials", isLeader: true, role: "PCB 油墨/光刻胶", chainLink: "PCB 光刻胶" },
  { id: "kangqiang", name: "康强电子", code: "002119", category: "packaging", isLeader: true, role: "引线框架/封装材料", chainLink: "引线框架" },
  { id: "qiangli", name: "强力新材", code: "300429", category: "materials", isLeader: true, role: "PCB 光刻胶/感光材料", chainLink: "PCB 光刻胶" },
  { id: "tongcheng", name: "彤程新材", code: "603650", category: "materials", isLeader: true, role: "光刻胶树脂/橡胶助剂", chainLink: "光刻胶" },
  { id: "caihong", name: "彩虹股份", code: "600707", category: "materials", isLeader: true, role: "显示玻璃基板", chainLink: "玻璃基板" },
  { id: "gebijia", name: "戈碧迦", code: "835438", market: "北交所", category: "materials", isLeader: true, role: "光学玻璃/特种玻璃", chainLink: "玻璃基板" },
  { id: "tuojing", name: "拓荆科技", code: "688072", category: "semiconductor", isLeader: true, role: "薄膜沉积设备", chainLink: "半导体设备" },
  { id: "xinhenghui", name: "新恒汇", code: "301678", category: "packaging", isLeader: true, role: "蚀刻引线框架", chainLink: "引线框架" },
  { id: "puran", name: "普冉股份", code: "688766", category: "semiconductor", isLeader: true, role: "NOR/EEPROM 存储", chainLink: "存储设计" },
  { id: "gelinda", name: "格林达", code: "603931", category: "materials", isLeader: true, role: "显影液/湿电子化学品", chainLink: "湿电子化学品" },
  { id: "oukeyi", name: "欧科亿", code: "688308", category: "pcb_upstream", isLeader: true, role: "硬质合金刀具/钻针材料", chainLink: "钻针及硬质合金" },
  { id: "minbao", name: "民爆光电", code: "301362", category: "pcb_upstream", isLeader: true, role: "LED 照明/特种照明", chainLink: "PCB 产业链配套" },
  { id: "jianghuawei", name: "江化微", code: "603078", category: "materials", isLeader: true, role: "湿电子化学品", chainLink: "湿电子化学品" },
  { id: "woerde", name: "沃尔德", code: "688028", category: "pcb_upstream", isLeader: true, role: "金刚石刀具/超硬材料", chainLink: "金刚石散热/刀具" },
  { id: "woge", name: "沃格光电", code: "603773", category: "materials", isLeader: true, role: "玻璃基板/显示器件", chainLink: "玻璃基板" },
  { id: "shenkeji", name: "深科技", code: "000021", category: "packaging", isLeader: true, role: "DRAM 封测", chainLink: "存储封测" },
  { id: "qingyi", name: "清溢光电", code: "688138", category: "semiconductor", isLeader: true, role: "掩膜版", chainLink: "掩膜版" },
  { id: "wenzhouhongfeng", name: "温州宏丰", code: "300283", category: "packaging", isLeader: true, role: "电接触材料/引线框架", chainLink: "引线框架" },
  { id: "shengmei", name: "盛美上海", code: "688082", category: "semiconductor", isLeader: true, role: "清洗设备", chainLink: "半导体设备" },
  { id: "shengong", name: "神工股份", code: "688233", category: "semiconductor", isLeader: true, role: "大硅片/硅零部件", chainLink: "硅片衬底" },
  { id: "jingce", name: "精测电子", code: "300567", category: "semiconductor", isLeader: true, role: "存储/面板检测设备", chainLink: "半导体设备" },
  { id: "juchen", name: "聚辰股份", code: "688123", category: "semiconductor", isLeader: true, role: "EEPROM/SPD 芯片", chainLink: "存储设计" },
  { id: "suzhouguz", name: "苏州固锝", code: "002079", category: "packaging", isLeader: true, role: "二极管/封装", chainLink: "引线框架/封装" },
  { id: "luwei", name: "路维光电", code: "688401", category: "semiconductor", isLeader: true, role: "掩膜版", chainLink: "掩膜版" },
  { id: "jinanguoji", name: "金安国纪", code: "002636", category: "pcb", isLeader: true, role: "覆铜板 CCL", chainLink: "CCL" },
  { id: "ashichuang", name: "阿石创", code: "300706", category: "materials", isLeader: true, role: "PVD 靶材", chainLink: "靶材" },
  { id: "longhua", name: "隆华科技", code: "300263", category: "materials", isLeader: true, role: "靶材/节能新材料", chainLink: "靶材" },
  { id: "longyang", name: "隆扬电子", code: "301389", category: "pcb_upstream", isLeader: true, role: "电磁屏蔽/铜箔材料", chainLink: "铜箔/屏蔽材料" },
  { id: "feikai", name: "飞凯材料", code: "300398", category: "materials", isLeader: true, role: "封装材料/光刻胶", chainLink: "环氧塑封料" },
  { id: "maijie", name: "麦捷科技", code: "300319", category: "components", isLeader: true, role: "电感/被动元件", chainLink: "被动元件" },
  { id: "huanghe", name: "黄河旋风", code: "600172", category: "pcb_upstream", isLeader: true, role: "金刚石材料", chainLink: "金刚石散热" },
  { id: "dingtai", name: "鼎泰高科", code: "301377", category: "pcb_upstream", isLeader: true, role: "PCB 微型刀具/钻针", chainLink: "钻针" },
  { id: "dinglong", name: "鼎龙股份", code: "300054", category: "materials", isLeader: true, role: "CMP 抛光垫", chainLink: "CMP 材料" },
  { id: "longtu", name: "龙图光罩", code: "688721", category: "semiconductor", isLeader: true, role: "半导体掩膜版", chainLink: "掩膜版" },

  // ── 其他 ──
  { id: "yuandong", name: "远东股份", code: "600869", category: "other", isWatchlist: true, role: "电缆/电池/AI 线缆", chainLink: "电缆" },
  { id: "huilv", name: "汇绿生态", code: "001267", category: "other", isWatchlist: true, role: "生态工程/光模块转型", chainLink: "转型" },
  { id: "zhongguo-chuan", name: "中国船舶", code: "600150", category: "other", isWatchlist: true, isLeader: true, role: "船舶制造龙头", chainLink: "军工" },
  { id: "nokia", name: "诺基亚", code: "NOK", market: "美股", category: "other", isWatchlist: true, role: "全球电信设备", chainLink: "海外" },
];

const PRICE_AS_OF = "2026-06-19 周四收盘（端午节 6/20-6/22 休市）";

const QUOTES: Record<string, { price?: number; changePct?: number }> = {
  "000034": { price: 26.58, changePct: -0.41 },
  "000630": { price: 7.65, changePct: 1.19 },
  "000636": { price: 74.6, changePct: 0.73 },
  "000657": { price: 98.48, changePct: 10.0 },
  "000725": { price: 6.55, changePct: -1.5 },
  "000938": { price: 27.45, changePct: 0.88 },
  "000960": { price: 41.74, changePct: 0.75 },
  "000977": { price: 65.66, changePct: 1.8 },
  "000988": { price: 177.55, changePct: 4.13 },
  "001267": { price: 58.1, changePct: 5.71 },
  "001309": { price: 712.0, changePct: 0.34 },
  "001389": { price: 201.46, changePct: -2.11 },
  "002023": { price: 12.6, changePct: 1.61 },
  "002050": { price: 45.74, changePct: 2.56 },
  "002080": { price: 80.55, changePct: -2.26 },
  "002149": { price: 57.3, changePct: -4.58 },
  "002156": { price: 68.27, changePct: 1.56 },
  "002185": { price: 19.61, changePct: 2.94 },
  "002222": { price: 103.0, changePct: -1.41 },
  "002230": { price: 42.61, changePct: 2.45 },
  "002241": { price: 23.92, changePct: 1.01 },
  "002281": { price: 266.2, changePct: 10.0 },
  "002354": { price: 7.73, changePct: 9.96 },
  "002362": { price: 17.1, changePct: -7.62 },
  "002371": { price: 721.04, changePct: 2.39 },
  "002384": { price: 273.0, changePct: 6.26 },
  "002405": { price: 7.1, changePct: -1.53 },
  "002407": { price: 38.78, changePct: 0.81 },
  "002409": { price: 150.16, changePct: 1.51 },
  "002421": { price: 3.83, changePct: 0.0 },
  "002428": { price: 100.44, changePct: 1.19 },
  "002436": { price: 52.06, changePct: 8.91 },
  "002463": { price: 147.9, changePct: 0.92 },
  "002472": { price: 43.78, changePct: 4.84 },
  "002491": { price: 31.58, changePct: 10.0 },
  "002558": { price: 23.9, changePct: -0.79 },
  "002579": { price: 20.32, changePct: 10.02 },
  "002602": { price: 12.94, changePct: -1.07 },
  "002649": { price: 8.82, changePct: 0.23 },
  "002709": { price: 51.61, changePct: -2.35 },
  "002741": { price: 41.3, changePct: 4.72 },
  "002837": { price: 74.37, changePct: -0.34 },
  "002916": { price: 453.8, changePct: 2.15 },
  "002920": { price: 87.75, changePct: -0.51 },
  "002938": { price: 119.91, changePct: 0.76 },
  "002975": { price: 136.8, changePct: -4.05 },
  "003021": { price: 98.23, changePct: 1.53 },
  "159213": { price: 1.41, changePct: 2.4 },
  "300014": { price: 66.66, changePct: -1.3 },
  "300036": { price: 12.12, changePct: -3.04 },
  "300058": { price: 15.25, changePct: 2.01 },
  "300124": { price: 71.18, changePct: 2.05 },
  "300170": { price: 17.88, changePct: 2.52 },
  "300229": { price: 15.64, changePct: 2.22 },
  "300308": { price: 1367.88, changePct: 7.19 },
  "300339": { price: 40.21, changePct: 0.7 },
  "300346": { price: 64.9, changePct: -0.66 },
  "300364": { price: 25.06, changePct: 7.09 },
  "300390": { price: 89.0, changePct: -3.0 },
  "300394": { price: 336.6, changePct: 2.21 },
  "300395": { price: 135.75, changePct: 0.65 },
  "300408": { price: 157.89, changePct: 1.56 },
  "300418": { price: 43.0, changePct: 10.97 },
  "300459": { price: 3.52, changePct: 1.15 },
  "300474": { price: 55.52, changePct: 2.85 },
  "300475": { price: 254.87, changePct: 3.91 },
  "300476": { price: 369.0, changePct: 2.02 },
  "300496": { price: 65.86, changePct: 6.55 },
  "300502": { price: 581.48, changePct: 4.23 },
  "300552": { price: 26.55, changePct: -1.04 },
  "300570": { price: 268.6, changePct: 0.98 },
  "300620": { price: 390.8, changePct: -1.11 },
  "300624": { price: 56.6, changePct: 6.21 },
  "300666": { price: 311.2, changePct: 3.19 },
  "300738": { price: 21.12, changePct: 5.18 },
  "300750": { price: 391.55, changePct: -1.87 },
  "300757": { price: 666.0, changePct: 0.88 },
  "300857": { price: 277.76, changePct: 4.03 },
  "301052": { price: 24.77, changePct: -0.32 },
  "301095": { price: 102.5, changePct: 3.9 },
  "301205": { price: 361.02, changePct: 7.39 },
  "301217": { price: 200.0, changePct: 10.08 },
  "301236": { price: 38.56, changePct: 0.21 },
  "301269": { price: 104.0, changePct: -0.96 },
  "301293": { price: 54.14, changePct: 0.35 },
  "301313": { price: 59.24, changePct: -4.62 },
  "301511": { price: 160.9, changePct: -1.17 },
  "600105": { price: 62.12, changePct: -1.54 },
  "600110": { price: 17.57, changePct: 2.03 },
  "600111": { price: 51.4, changePct: 2.15 },
  "600150": { price: 36.14, changePct: -2.72 },
  "600176": { price: 53.5, changePct: -2.01 },
  "600183": { price: 183.87, changePct: 2.06 },
  "600186": { price: 14.28, changePct: -2.59 },
  "600206": { price: 42.51, changePct: 6.84 },
  "600276": { price: 48.42, changePct: 3.04 },
  "600330": { price: 32.88, changePct: -1.59 },
  "600378": { price: 65.16, changePct: 2.13 },
  "600487": { price: 111.01, changePct: 0.01 },
  "600498": { price: 75.31, changePct: -1.79 },
  "600522": { price: 56.55, changePct: 2.99 },
  "600584": { price: 83.03, changePct: 1.55 },
  "600588": { price: 9.79, changePct: 0.1 },
  "600667": { price: 20.92, changePct: 9.99 },
  "600703": { price: 17.54, changePct: 2.21 },
  "600726": { price: 7.88, changePct: -5.06 },
  "600869": { price: 32.86, changePct: -1.2 },
  "600900": { price: 26.66, changePct: -1.26 },
  "600961": { price: 28.82, changePct: 7.94 },
  "601138": { price: 78.08, changePct: 7.49 },
  "601208": { price: 74.83, changePct: 2.23 },
  "601360": { price: 9.37, changePct: 1.63 },
  "601689": { price: 62.3, changePct: 3.64 },
  "601991": { price: 8.22, changePct: -9.97 },
  "603002": { price: 23.58, changePct: 1.64 },
  "603005": { price: 45.71, changePct: -0.89 },
  "603019": { price: 88.68, changePct: 2.51 },
  "603083": { price: 214.54, changePct: 5.53 },
  "603186": { price: 238.11, changePct: 5.05 },
  "603228": { price: 81.06, changePct: 0.37 },
  "603256": { price: 257.8, changePct: -0.42 },
  "603259": { price: 102.72, changePct: 4.6 },
  "603501": { price: 89.97, changePct: -0.17 },
  "603596": { price: 28.51, changePct: -1.38 },
  "603598": { price: 19.25, changePct: 1.0 },
  "603618": { price: 51.77, changePct: 0.08 },
  "603662": { price: 70.09, changePct: -0.33 },
  "603678": { price: 67.75, changePct: -2.81 },
  "603688": { price: 80.55, changePct: 1.53 },
  "603986": { price: 629.0, changePct: 7.33 },
  "605358": { price: 70.2, changePct: -1.06 },
  "605589": { price: 69.82, changePct: 5.15 },
  "688003": { price: 124.42, changePct: 7.07 },
  "688008": { price: 269.9, changePct: 2.82 },
  "688017": { price: 408.01, changePct: 6.92 },
  "688041": { price: 328.0, changePct: 6.42 },
  "688047": { price: 146.49, changePct: 2.08 },
  "688083": { price: 65.43, changePct: 0.8 },
  "688088": { price: 38.05, changePct: 0.55 },
  "688095": { price: 66.49, changePct: 2.7 },
  "688111": { price: 217.36, changePct: 0.96 },
  "688126": { price: 32.2, changePct: -0.62 },
  "688127": { price: 89.48, changePct: 2.56 },
  "688146": { price: 364.0, changePct: 7.15 },
  "688206": { price: 38.4, changePct: -1.54 },
  "688207": { price: 21.13, changePct: -2.76 },
  "688256": { price: 1507.46, changePct: 14.2 },
  "688268": { price: 188.36, changePct: 0.54 },
  "688300": { price: 270.47, changePct: 14.98 },
  "688313": { price: 175.44, changePct: 3.49 },
  "688322": { price: 133.73, changePct: 2.33 },
  "688327": { price: 14.27, changePct: 3.48 },
  "688347": { price: 277.81, changePct: 6.56 },
  "688362": { price: 72.5, changePct: 4.47 },
  "688498": { price: 1673.36, changePct: 3.81 },
  "688507": { price: 254.5, changePct: 4.31 },
  "688519": { price: 397.0, changePct: 0.5 },
  "688521": { price: 274.0, changePct: 6.42 },
  "688662": { price: 142.91, changePct: 5.08 },
  "688787": { price: 159.39, changePct: 1.28 },
  "688981": { price: 140.7, changePct: 4.45 },
};

// 公司详情：主营业务 / 核心产品 / 竞争优势 / 关注逻辑
const DETAILS: Record<string, StockDetail> = JSON.parse(String.raw`{"fugong":{"business":"全球电子制造服务（EMS）龙头，富士康体系核心上市平台","products":"AI 服务器、云计算设备、网络设备、精密结构件代工组装","advantage":"绑定英伟达、微软等头部云厂商，AI 服务器放量最直接受益的代工标的","logic":"算力基建扩张→服务器出货量增长→代工产能利用率与单台价值量双升","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；深度绑定单一客户或伙伴，合作变动影响较大。；云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"langchao":{"business":"国内领先的服务器及存储解决方案提供商","products":"AI 服务器、通用服务器、液冷整机、智算中心解决方案","advantage":"国产 AI 服务器品牌龙头，政府及运营商集采核心供应商","logic":"国产算力替代+智算中心建设，品牌整机厂商弹性高于纯代工","risk":"强周期属性，景气下行时业绩与估值双杀风险。；云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"haiguang":{"business":"国产 x86 及 GPGPU（DCU）芯片设计企业","products":"海光 CPU、深算 DCU 加速卡，面向数据中心与 AI 训练推理","advantage":"国内少数具备高端 x86 授权及自主 DCU 的算力芯片平台","logic":"国产算力芯片渗透率提升，AI 与信创双轮驱动","risk":"国产替代验证与认证进度可能慢于预期。；云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"hanwu":{"business":"专注 AI 芯片的 Fabless 设计公司","products":"思元系列训练/推理 AI 芯片及加速卡，寒武纪行歌车载芯片","advantage":"国内 AI 芯片第一股，云端推理芯片已有规模化部署","logic":"大模型推理需求爆发，国产 AI ASIC 替代空间打开","risk":"云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"ziguang":{"business":"数字化解决方案与 ICT 基础设施提供商","products":"H3C 网络设备、AI 服务器、云与智算平台、存储","advantage":"新华三品牌在国内企业级网络与服务器市场份额领先","logic":"企业智算网络+服务器一体化交付能力，Cosmos 算力链核心","risk":"强周期属性，景气下行时业绩与估值双杀风险。；云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"zhongke":{"business":"中科院体系高性能计算与数据中心领军企业","products":"曙光系列服务器、液冷数据中心、先进计算服务","advantage":"国家超算主力厂商，液冷与先进计算技术积累深厚","logic":"国家算力枢纽+液冷技术领先，AI 基建国家队属性","risk":"云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"xiechuang":{"business":"智能物联网与数据存储方案提供商","products":"AI 服务器存储模组、数据中心存储、边缘计算设备","advantage":"绑定海外云客户，AI 存储需求增长受益","logic":"AI 集群存储容量升级，ODM 模式放量","risk":"海外业务面临汇率波动、地缘政治与合规风险。；强周期属性，景气下行时业绩与估值双杀风险。；深度绑定单一客户或伙伴，合作变动影响较大。"},"aofei":{"business":"互联网数据中心（IDC）及算力租赁运营商","products":"IDC 机柜、算力租赁、云计算基础设施","advantage":"华南地区 IDC 龙头，算力租赁业务快速扩张","logic":"AI 算力紧缺→算力租赁价格上涨","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"xinyuan":{"business":"芯片 IP 授权与芯片定制服务企业","products":"GPU/NPU/DSP IP、一站式芯片设计服务（Chiplet）","advantage":"国内领先的半导体 IP 平台，服务 AIoT 与算力芯片客户","logic":"Chiplet 与定制硅需求增长，IP+设计服务模式","risk":"云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"jingjia":{"business":"军用电子与国产 GPU 研发企业","products":"JM 系列国产 GPU、图形处理芯片、小型专用雷达","advantage":"国内自主 GPU 重要参与者，军工+民用双布局","logic":"国产 GPU 替代长期逻辑，信创与特种领域刚需","risk":"国产替代验证与认证进度可能慢于预期。；云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"longxin":{"business":"基于自主 LoongArch 指令集的 CPU 设计企业","products":"龙芯系列通用 CPU、工控芯片、服务器处理器","advantage":"完全自主指令集架构，国产替代政策受益","logic":"信创深化→自主 CPU 渗透率提升","risk":"国产替代验证与认证进度可能慢于预期。；云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"zhongji":{"business":"全球高速光模块龙头企业","products":"800G/1.6T 光模块，硅光/CPO 前瞻布局，数据中心互连","advantage":"绑定北美云巨头，800G 份额全球领先，盈利能力行业最强","logic":"AI 集群 Scale-out 网络升级→高速光模块量价齐升","risk":"深度绑定单一客户或伙伴，合作变动影响较大。；光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"guangxun":{"business":"光通信全产业链企业（光芯片+器件+模块+系统）","products":"EML/CW 激光器、SiPh 芯片、光模块、光传输设备","advantage":"国内唯一具备光芯片到模块垂直整合能力的央企背景厂商","logic":"CPO 时代光芯片自主可控，垂直整合壁垒高","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；国产替代验证与认证进度可能慢于预期。；光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"tianfu":{"business":"光器件精密制造平台型企业","products":"光引擎、FAU 光纤阵列、耦合器件、无源光器件","advantage":"CPO 精密耦合全球龙头，绑定全球光模块巨头","logic":"CPO 渗透率提升→FAU/耦合器件用量指数级增长","risk":"板块贝塔品种，个股阿尔法有限，跟随指数波动。；深度绑定单一客户或伙伴，合作变动影响较大。；光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"yuanjie":{"business":"化合物半导体激光芯片设计制造企业","products":"2.5G-100G CW/EML 激光器芯片，InP 外延片","advantage":"国内 CW 激光器龙头，硅光 CPO 核心光源供应商","logic":"硅光 CPO 主路线=InP CW 激光×外置调制器，光源需求爆发","risk":"光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"dongshan":{"business":"精密制造与电子电路综合平台","products":"PCB、LED、触控显示、光通信精密组件、光芯片封装","advantage":"收购 MFlex 后成为全球柔性电路龙头，光芯片制造布局","logic":"光芯片封装+PCB 双轮，CPO 精密制造受益","risk":"光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"xinyisheng":{"business":"高速光模块制造商","products":"100G-1.6T 光模块，LPO/硅光方案，TFLN 技术升级中","advantage":"海外云客户份额快速提升，毛利率改善明显","logic":"光模块第二梯队龙头，受益 AI 资本开支扩张","risk":"海外业务面临汇率波动、地缘政治与合规风险。；光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"guangku":{"business":"光纤器件与铌酸锂调制器制造商","products":"TFLN 薄膜调制器、光纤激光器、光开关/隔离器","advantage":"收购 Lumentum 铌酸锂产线，全球仅 3 家 TFLN 量产企业之一","logic":"1.6T/3.2T 时代 TFLN 是最优调制方案，稀缺性极高","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"shijia":{"business":"光电子核心芯片及器件制造商","products":"PLC 分路器芯片、AWG、DFB 激光器、InP 外延片","advantage":"全球 PLC 芯片主要供应商，无源+有源芯片平台","logic":"CPO 外置 WDM 仍广泛使用，InP 外延协同源杰","risk":"光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"taichen":{"business":"光通信无源器件制造商","products":"FAU 光纤阵列、MPO 连接器、Shuffle Box、陶瓷插芯","advantage":"FAU/MPO 国内龙头，CPO 光纤管理核心供应商","logic":"CPO 交换机外部光纤管理复杂度提升，MPO 需求增长","risk":"光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"huagong":{"business":"激光装备与光通信设备制造商","products":"光模块、激光加工装备、传感器、智能制造","advantage":"激光产业链协同，TFLN 光模块产业化推进","logic":"光模块+激光设备双业务，TFLN 技术整合","risk":"光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"jianqiao":{"business":"网络通信设备与光模块制造商","products":"宽带接入设备、WiFi、TFLN 材料/器件自研","advantage":"自研薄膜铌酸锂调制器方案，垂直整合差异化","logic":"TFLN 调制器国产化参与者","risk":"国产替代验证与认证进度可能慢于预期。；光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"liante":{"business":"高速光模块专业制造商","products":"数据中心高速光模块，硅光/LPO 方案","advantage":"专注高速光模块细分赛道，客户结构多元化","logic":"高速光模块需求旺盛，中小厂商份额提升","risk":"光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"luobote":{"business":"光伏与光通信自动化设备制造商","products":"硅光芯片封装设备、光模块自动化产线","advantage":"光通信设备端稀缺标的，绑定头部光模块厂","logic":"CPO/硅光扩产→自动化设备订单增长","risk":"新产能爬坡与良率风险；扩产完成后供需可能逆转。；深度绑定单一客户或伙伴，合作变动影响较大。；光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"fujing":{"business":"光学晶体及精密光学元件制造商","products":"LBO/BBO/铌酸锂/TGG 磁光晶体，精密光学器件","advantage":"TGG 磁光晶体国内唯一达全球水平，CPO 隔离器必需","logic":"CPO 高密度集成→反射光隔离用量 2-3 倍于传统模块","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"lante":{"business":"精密光学元器件制造商","products":"微棱镜、微透镜阵列、玻璃非球面透镜","advantage":"苹果供应链核心光学元件供应商，微透镜技术领先","logic":"CPO FAU 耦合需亚微米精度微透镜，良率决定成本","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"shennan":{"business":"高端 PCB 及 IC 载板制造商","products":"通信/服务器 PCB、FC-BGA 载板、射频模块基板","advantage":"国内 ABF 载板龙头之一，16 层以下量产、20 层认证中","logic":"GPU/CPU 载板供需缺口 22%（大摩），ABF 载板核心受益","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"xingsen":{"business":"IC 载板与 PCB 综合制造商","products":"IC 封装基板、半导体测试板、5G/服务器 PCB","advantage":"国内 IC 载板先行者，ABF 研发量产推进中","logic":"国产 ABF 载板替代加速，客户认证突破是关键催化","risk":"ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"hudian":{"business":"企业通讯及汽车电子 PCB 制造商","products":"高速通信 PCB、汽车电子 PCB、AI 服务器主板","advantage":"绑定华为/思科等通信巨头，AI 服务器 PCB 快速放量","logic":"CPO 交换机 Megtron6/7 级 PCB 需求，沪电为核心供应商","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；深度绑定单一客户或伙伴，合作变动影响较大。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"shengyi":{"business":"覆铜板（CCL）及粘结片制造商","products":"FR4/高频高速 CCL、封装基板材料、类 ABF 增层膜","advantage":"全球覆铜板龙头，高速材料技术国内领先","logic":"高端 CCL 紧缺传导至上游，ABF 材料验证是第二增长曲线","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"guanghe":{"business":"服务器及通信类 PCB 制造商","products":"AI 服务器 PCB、数据通信 PCB、消费电子 PCB","advantage":"AI 服务器 PCB 新锐，绑定国内云厂商快速上量","logic":"AI 服务器 PCB 需求爆发，新产能释放弹性大","risk":"深度绑定单一客户或伙伴，合作变动影响较大。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"zhongjing":{"business":"刚性电路板及柔性电路板制造商","products":"HDI PCB、FPC、投资布局 ABF 薄膜材料","advantage":"ABF 薄膜产业链投资，向载板材料端延伸","logic":"ABF 薄膜国产替代早期布局者","risk":"国产替代验证与认证进度可能慢于预期。；转型业务进展与盈利贡献存在不确定性。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"jingwang":{"business":"PCB 行业综合性龙头企业","products":"多层/HDI/柔性 PCB，IC 载板技术储备","advantage":"产品线最全的 PCB 企业之一，ABF 载板研发推进","logic":"PCB 龙头向载板升级，客户协同优势明显","risk":"ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"shenghong":{"business":"高密度互连 PCB 制造商","products":"显卡/服务器 PCB、汽车电子 PCB，2026 ABF 试产","advantage":"AI 服务器 PCB 份额快速提升，ABF 载板新进入者","logic":"2026 ABF 试产是重要时间节点","risk":"新产能爬坡与良率风险；扩产完成后供需可能逆转。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"pengding":{"business":"全球 PCB 产值最大的企业","products":"FPC、HDI、SLP 类载板、MiniLED PCB","advantage":"苹果供应链核心，全球 FPC 绝对龙头","logic":"消费电子创新+服务器 PCB 双驱动","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"nanya":{"business":"覆铜板及粘结片制造商","products":"高频高速 CCL、BT 封装材料、ABF 材料布局","advantage":"BT 材料智能工厂 2026 末投产，持股 ABF 材料公司","logic":"载板材料国产替代，BT→ABF 升级路径","risk":"国产替代验证与认证进度可能慢于预期。；新产能爬坡与良率风险；扩产完成后供需可能逆转。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"huazheng":{"business":"覆铜板及复合材料制造商","products":"BT 封装材料、CBF 增层绝缘膜（ABF 替代）","advantage":"CBF 膜加速验证算力芯片，ABF 替代材料先行者","logic":"味之素 ABF 垄断→国产替代材料窗口期","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；国产替代验证与认证进度可能慢于预期。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"lianhua":{"business":"调味品+半导体材料双主业（转型中）","products":"子公司深圳佐菲斯高端 ABF 薄膜","advantage":"据称国内唯一实现高端 ABF 薄膜量产供货","logic":"ABF 薄膜国产突破若验证，估值体系重构","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；转型业务进展与盈利贡献存在不确定性。；估值偏高，业绩不及预期时回调压力大。"},"honghe":{"business":"高端电子级玻璃纤维布制造商","products":"Low-Dk 1/2 代布、Low-CTE/T-glass 全系列产品","advantage":"国内唯一能量产全系列 Low-CTE 布，电子布当前最紧瓶颈","logic":"AI 服务器消耗最稀缺电子布规格，紧缺周期至 2028","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；强周期属性，景气下行时业绩与估值双杀风险。"},"feilihua":{"business":"石英玻璃材料及制品制造商","products":"石英纤维/Q 布、半导体石英器件、航空航天材料","advantage":"Q 布（石英布）全球核心供应商，M8/M9 级板顶级方案","logic":"电子布之后下一代瓶颈是 Q 布，菲利华是最纯标的","risk":"高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"tongguan":{"business":"电子铜箔制造商","products":"HVLP 1-4 代铜箔、RTF 铜箔、锂电铜箔","advantage":"HVLP 系列量产龙头，AI 服务器铜箔核心供应商","logic":"HVLP4 是全球稀缺规格，认证壁垒极高","risk":"高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"defu":{"business":"电子铜箔专业制造商","products":"HVLP3 规模化生产，HVLP4 认证推进中","advantage":"国内 HVLP 铜箔第二龙头，产能快速扩张","logic":"高端铜箔满产满销，加工费上涨周期","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；强周期属性，景气下行时业绩与估值双杀风险。；高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"shengquan":{"business":"合成树脂及复合材料制造商","products":"PPO/PPE 低损耗树脂、酚醛树脂、铸造材料","advantage":"M6+ 低损耗板核心树脂供应商，配方壁垒高","logic":"高速 CCL 升级→低 Df 树脂需求增长","risk":"高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"dongcai":{"business":"绝缘材料及复合材料制造商","products":"碳氢树脂/BMI、活性酯固化剂、光学膜","advantage":"高端树脂固化剂国产追赶者，碳氢树脂用于 RF/高速板","logic":"树脂配方+认证壁垒，扩产≠立即可用","risk":"新产能爬坡与良率风险；扩产完成后供需可能逆转。；高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"hongchang":{"business":"电子级环氧树脂及覆铜板制造商","products":"电子级环氧、ABF 载板用增层膜（年产能 172.8 万平米）","advantage":"ABF 增层膜国内重要供应商，环氧基材龙头","logic":"ABF 薄膜国产替代+环氧基材双逻辑","risk":"国产替代验证与认证进度可能慢于预期。；高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"lianrui":{"business":"无机填料及电子级粉体材料制造商","products":"球形硅微粉、球形氧化铝，用于 CCL/载板/封装","advantage":"电子级球形硅微粉国内绝对龙头","logic":"载板填料控 CTE/导热，联瑞是隐藏冠军","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"jushi":{"business":"玻璃纤维及复合材料制造商","products":"E 玻纤、电子纱/电子布基材，风电叶片","advantage":"全球玻纤产能龙头，电子布产业链最上游","logic":"电子布紧缺向上传导至玻纤纱产能","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"zhongcai":{"business":"风电叶片+玻璃纤维+锂电池隔膜综合企业","products":"Low-Dk 电子布、第三代 Q 布、风电叶片","advantage":"Low-Dk 布扩产追赶宏和科技，Q 布布局","logic":"电子布国产第二供应商，追赶逻辑","risk":"新产能爬坡与良率风险；扩产完成后供需可能逆转。；高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"changdian":{"business":"全球第三大半导体封测企业","products":"先进封装（2.5D/3D）、SiP、传统封测","advantage":"国内封测绝对龙头，CPO COUPE 封装潜在合作伙伴","logic":"先进封装是 AI 芯片性能升级关键，长电技术领先","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；深度绑定单一客户或伙伴，合作变动影响较大。；封测产能利用率波动；先进封装技术迭代与客户认证风险。"},"tongfu":{"business":"集成电路封测服务商","products":"CPU/GPU/存储先进封装，AMD 核心封测伙伴","advantage":"AMD 绑定深度最深，Chiplet 封装经验丰富","logic":"AMD AI GPU 放量→通富微电封测订单增长","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；强周期属性，景气下行时业绩与估值双杀风险。；深度绑定单一客户或伙伴，合作变动影响较大。"},"huatian":{"business":"半导体封测服务企业","products":"DIP/SOP/QFN/先进封装，汽车电子封测","advantage":"封测第二梯队龙头，成本控制能力突出","logic":"封测产能利用率回升，业绩弹性","risk":"封测产能利用率波动；先进封装技术迭代与客户认证风险。"},"jingfang":{"business":"晶圆级芯片封装测试服务商","products":"WLCSP、TSV、汽车 CIS 封装","advantage":"国内 WLCSP 龙头，先进封装技术领先","logic":"CIS 与传感器封装需求增长","risk":"封测产能利用率波动；先进封装技术迭代与客户认证风险。"},"taiji":{"business":"半导体封测+工程服务+光伏","products":"海太半导体（SK 海力士封测合资）、工程总包","advantage":"SK 海力士封测合资平台，存储封测受益","logic":"存储复苏+海力士扩产","risk":"强周期属性，景气下行时业绩与估值双杀风险。；新产能爬坡与良率风险；扩产完成后供需可能逆转。；深度绑定单一客户或伙伴，合作变动影响较大。"},"yongxi":{"business":"集成电路先进封装测试企业","products":"倒装焊、SiP、FC 先进封装","advantage":"先进封装新锐，产能快速扩张","logic":"封测产能紧缺背景下新锐厂商份额提升","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；封测产能利用率波动；先进封装技术迭代与客户认证风险。"},"zhongxin":{"business":"中国大陆规模最大、技术最先进的晶圆代工企业","products":"0.35μm-14nm 晶圆代工，FinFET/特色工艺","advantage":"国产晶圆代工绝对龙头，先进制程持续突破","logic":"国产替代+AI 芯片本土化生产需求","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；国产替代验证与认证进度可能慢于预期。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"huahong":{"business":"特色工艺晶圆代工企业","products":"嵌入式存储、功率器件、射频、MCU 代工","advantage":"国内特色工艺代工龙头，功率/模拟需求旺盛","logic":"汽车电子+工业控制芯片代工需求增长","risk":"强周期属性，景气下行时业绩与估值双杀风险。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"san-an":{"business":"化合物半导体 IDM 企业","products":"GaN/LED、射频、电力电子、InP 外延片（产能第一）","advantage":"InP 外延片月产能 6000 片行业第一","logic":"InP 外延是 CPO 激光器核心，三安光电产能优势","risk":"晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"lanqi-a":{"business":"内存接口芯片及津逮服务器平台","products":"DDR5 RCD/DB 芯片、PCIe Retimer、CXL 芯片","advantage":"DDR5 内存接口芯片全球龙头，AI 服务器内存升级受益","logic":"DDR5 渗透率提升+AI 服务器内存容量增长","risk":"晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"lanqi-hk":{"business":"内存接口芯片（港股 AH）","products":"同 A 股澜起科技","advantage":"AH 溢价套利+全球配置","logic":"同 688008","risk":"海外市场波动与汇率风险；实时行情需通过券商查看。；海外市场波动与汇率风险；AH 溢价变化。；估值偏高，业绩不及预期时回调压力大。"},"zhaoyi":{"business":"Fabless 芯片设计公司","products":"NOR Flash、MCU、DRAM、传感器","advantage":"NOR Flash 全球前三，32 位 MCU 国产龙头","logic":"存储价格回升+MCU 国产替代","risk":"国产替代验证与认证进度可能慢于预期。；强周期属性，景气下行时业绩与估值双杀风险。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"liangwei":{"business":"半导体硅片及功率器件制造商","products":"6-12 英寸半导体硅片、MOSFET/IGBT","advantage":"国内半导体硅片重要供应商，功率器件协同","logic":"硅片国产化+功率半导体需求","risk":"国产替代验证与认证进度可能慢于预期。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"xiangnong":{"business":"电子元器件分销及存储产业链","products":"存储芯片分销、企业级 SSD 方案","advantage":"海力士/美光等原厂授权分销商","logic":"存储周期复苏+分销毛利率改善","risk":"强周期属性，景气下行时业绩与估值双杀风险。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"demingli":{"business":"存储主控芯片及存储模组","products":"SSD 主控芯片、存储模组、嵌入式存储","advantage":"自研主控+模组垂直整合","logic":"国产存储产业链自主可控","risk":"国产替代验证与认证进度可能慢于预期。；强周期属性，景气下行时业绩与估值双杀风险。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"hugui":{"business":"半导体硅片制造企业","products":"300mm 半导体硅片（SOI/抛光片/外延片）","advantage":"国内 12 英寸硅片龙头，国产化率提升核心","logic":"硅片进口替代+产能爬坡","risk":"国产替代验证与认证进度可能慢于预期。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"beifang":{"business":"半导体设备平台型企业","products":"刻蚀/薄膜沉积/热处理/清洗设备","advantage":"国内半导体设备营收规模最大，平台化布局","logic":"国产设备渗透率提升+先进制程扩产","risk":"新产能爬坡与良率风险；扩产完成后供需可能逆转。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"weier":{"business":"半导体芯片设计企业","products":"CIS 图像传感器、模拟芯片、显示驱动","advantage":"全球 CIS 第三，手机/汽车 CIS 双驱动","logic":"汽车 CIS+AI 手机影像升级","risk":"晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"haite":{"business":"航空维修+化合物半导体","products":"InP 外延片（月产能 1500 片）、航空维修","advantage":"InP 外延产能国内第二","logic":"光通信+射频 InP 外延需求","risk":"晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"bojie":{"business":"工业自动化测试+半导体投资","products":"参股珠海鼎泰芯源（InP 衬底），测试设备","advantage":"InP 衬底产能第三，2-4 寸年产能 5-8 万片","logic":"InP 衬底国产替代","risk":"国产替代验证与认证进度可能慢于预期。；转型业务进展与盈利贡献存在不确定性。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"yunnan-zhe":{"business":"锗产品全产业链企业","products":"InP 衬底（产能第一，2-4 寸 15 万片/年）、锗晶片","advantage":"国内 InP 衬底绝对龙头，6 寸良率 70-75%","logic":"CPO 每个交换机 4-8 颗 InP 激光器→衬底需求爆发","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"tiantong":{"business":"电子材料+智能装备制造商","products":"铌酸锂晶体（生长→衬底加工全流程）、蓝宝石、压电晶体","advantage":"国内铌酸锂晶体材料龙头，TFLN 上游核心","logic":"TFLN 调制器放量→铌酸锂晶体需求增长","risk":"紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"shiying":{"business":"高纯石英材料制造商","products":"高纯石英砂（4N8+）、石英管/锭/坩埚","advantage":"半导体内层砂国产龙头，石英坩埚核心供应商","logic":"石英砂地质稀缺+提纯壁垒，扩产周期 3-5 年","risk":"强周期属性，景气下行时业绩与估值双杀风险。；新产能爬坡与良率风险；扩产完成后供需可能逆转。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"youyan":{"business":"有色金属新材料+贵金属功能材料","products":"InP 衬底（产能第二）、高纯靶材、贵金属材料","advantage":"有研集团背景，InP 衬底 4 寸年产能 2 万片","logic":"InP 衬底+靶材双轮驱动","risk":"紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"yake":{"business":"电子材料及 LNG 保温绝热板材","products":"半导体前驱体（收购 UP Chemical）、封装材料、LNG 板材","advantage":"前驱体/封装材料国内龙头，海外并购技术整合","logic":"先进制程前驱体国产化","risk":"国产替代验证与认证进度可能慢于预期。；海外业务面临汇率波动、地缘政治与合规风险。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"guanghua":{"business":"电子化学品及锂电池材料","products":"PCB 化学品、电子级硫酸、钴盐/碳酸锂","advantage":"电子级硫酸国内重要供应商，年内涨价 50%+","logic":"芯片湿法清洗关键原料紧缺","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"zhongchuan":{"business":"电子特种气体制造商","products":"氟氮类/砷烷/磷烷等电子特气，含高纯氦","advantage":"央企背景电子特气平台，高纯氦国内重要供应商","logic":"高纯氦年内涨价 100%+，7nm 以下制程刚需","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"huate":{"business":"特种气体制造商","products":"氟碳类/氧化亚氮/氢气等电子特气","advantage":"国内特种气体龙头，客户覆盖主流晶圆厂","logic":"晶圆厂扩产→特气需求线性增长","risk":"新产能爬坡与良率风险；扩产完成后供需可能逆转。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"haohua":{"business":"氟化工+电子化学品央企","products":"电子特气、含氟精细化学品、航空材料","advantage":"昊华集团电子特气整合平台","logic":"特气国产替代+氟化工涨价","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；国产替代验证与认证进度可能慢于预期。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"jiangfeng":{"business":"高纯溅射靶材制造商","products":"铝/钛/钽/铜靶材，半导体及显示用","advantage":"国内高纯靶材龙头，铝靶年内原料涨 80%","logic":"靶材短缺周期至 2027 末","risk":"强周期属性，景气下行时业绩与估值双杀风险。；新产能爬坡与良率风险；扩产完成后供需可能逆转。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"nandaguang":{"business":"光电材料及半导体材料","products":"MO 源、ArF 光刻胶、前驱体、特气","advantage":"ArF 光刻胶国产突破，MO 源全球领先","logic":"光刻胶+前驱体国产替代","risk":"国产替代验证与认证进度可能慢于预期。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"xiye":{"business":"锡全产业链企业","products":"精锡、锡材、铟（全球最大储量）","advantage":"全球最大铟储量，高纯铟是 InP 化学基础","logic":"铟为锌副产物，中国供应全球 60%","risk":"紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"huoju":{"business":"电容器及新材料制造商","products":"特种 MLCC、陶瓷电容器、高温合金","advantage":"军工+民用特种 MLCC 龙头，年内涨价 50%+","logic":"MLCC 全球现货紧缺","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；被动元件价格周期性回落；下游需求不及预期；高端规格竞争加剧。"},"fenghua":{"business":"电子元器件制造商","products":"MLCC、电阻、电感等被动元件","advantage":"国内 MLCC 龙头，产能持续扩张","logic":"被动元件复苏+AI 硬件拉动","risk":"被动元件价格周期性回落；下游需求不及预期；高端规格竞争加剧。"},"nuode":{"business":"电解铜箔制造商","products":"锂电铜箔、PCB 电子铜箔","advantage":"铜箔双应用领域布局","logic":"铜箔年内价格翻倍，现货缺口大","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；被动元件价格周期性回落；下游需求不及预期；高端规格竞争加剧。"},"sanhuan":{"business":"电子陶瓷及元器件制造商","products":"MLCC、陶瓷基片、光纤连接器","advantage":"电子陶瓷全产业链，MLCC 自给率高","logic":"电子陶瓷平台型企业，被动元件复苏","risk":"被动元件价格周期性回落；下游需求不及预期；高端规格竞争加剧。"},"hengtong":{"business":"光纤通信及海洋通信综合企业","products":"光纤光缆、海缆、硅光模块、量子通信","advantage":"光纤光缆+海洋通信双龙头，硅光布局","logic":"光通信基建+硅光 CPO 转型","risk":"转型业务进展与盈利贡献存在不确定性。；运营商资本开支周期波动；光纤光缆价格竞争；转型新业务不及预期。"},"fenghuo":{"business":"光通信系统设备制造商","products":"光传输设备、光纤接入、数据网络","advantage":"央企背景光通信龙头，5G+算力网络核心","logic":"算力网络建设→光通信设备需求","risk":"运营商资本开支周期波动；光纤光缆价格竞争；转型新业务不及预期。"},"zhongtian":{"business":"光纤通信及新能源综合企业","products":"光纤光缆、海缆（全球领先）、光伏、储能","advantage":"海缆国内绝对龙头，光纤光缆份额前三","logic":"海上风电+算力网络双驱动","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；运营商资本开支周期波动；光纤光缆价格竞争；转型新业务不及预期。"},"yongding":{"business":"光纤光缆及高温超导","products":"光纤光缆、高温超导带材、汽车线束","advantage":"超导材料差异化布局","logic":"光通信+超导双题材","risk":"运营商资本开支周期波动；光纤光缆价格竞争；转型新业务不及预期。"},"tongding":{"business":"光纤光缆及通信设备","products":"光纤光缆、通信设备、数据中心布线","advantage":"光纤光缆老牌企业，数据中心转型","logic":"算力基建→光纤需求","risk":"转型业务进展与盈利贡献存在不确定性。；运营商资本开支周期波动；光纤光缆价格竞争；转型新业务不及预期。"},"hangdian":{"business":"电线电缆制造商","products":"电力电缆、通信电缆、特种电缆","advantage":"区域电缆龙头","logic":"电网投资+通信电缆需求","risk":"转型业务进展与盈利贡献存在不确定性。；运营商资本开支周期波动；光纤光缆价格竞争；转型新业务不及预期。"},"tianci":{"business":"锂电池材料制造商","products":"电解液、六氟磷酸锂、正极材料","advantage":"电解液全球龙头，一体化成本优势","logic":"锂电材料龙头，产能利用率回升","risk":"锂电材料价格周期性波动；产能过剩导致毛利压缩；下游电动车增速放缓。"},"duofuduo":{"business":"氟化工及锂电池材料","products":"六氟磷酸锂、HF、锂电池","advantage":"六氟磷酸锂老牌龙头，垂直一体化","logic":"电解液原料价格周期","risk":"强周期属性，景气下行时业绩与估值双杀风险。；锂电材料价格周期性波动；产能过剩导致毛利压缩；下游电动车增速放缓。"},"yiwei":{"business":"锂原电池及动力电池制造商","products":"消费锂电、动力电池、储能电池","advantage":"国内锂电池龙头，储能+动力双轮","logic":"储能放量+动力锂电复苏","risk":"锂电材料价格周期性波动；产能过剩导致毛利压缩；下游电动车增速放缓。"},"tianhua":{"business":"锂电正极材料及新能源","products":"氢氧化锂/碳酸锂、正极材料","advantage":"锂盐+正极材料一体化","logic":"锂价周期底部反弹","risk":"强周期属性，景气下行时业绩与估值双杀风险。；锂电材料价格周期性波动；产能过剩导致毛利压缩；下游电动车增速放缓。"},"ningde":{"business":"全球动力电池龙头企业","products":"动力电池、储能系统、电池回收","advantage":"全球市占率第一，技术+规模双领先","logic":"全球电动化+储能长期增长","risk":"锂电材料价格周期性波动；产能过剩导致毛利压缩；下游电动车增速放缓。"},"huichuan":{"business":"工业自动化及新能源汽车电控","products":"伺服系统、变频器、PLC、新能源汽车电驱","advantage":"国产工控龙头，伺服系统份额持续提升","logic":"工业自动化+人形机器人伺服需求","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"dashi":{"business":"智慧建筑及物联网解决方案","products":"楼宇自控、数据中心能效管理、智慧交通","advantage":"建筑节能+物联网平台","logic":"Cosmos 第三梯队，智慧基建","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"robot-etf":{"business":"机器人板块指数 ETF","products":"跟踪机器人产业指数的一揽子配置","advantage":"板块贝塔配置工具，分散个股风险","logic":"人形机器人产业化预期","risk":"板块贝塔品种，个股阿尔法有限，跟随指数波动。；人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"lvbo":{"business":"精密传动装置制造商","products":"谐波减速器、机电一体化执行器","advantage":"国内谐波减速器龙头，人形机器人核心零部件","logic":"人形机器人量产→减速器需求爆发","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"tuopu":{"business":"汽车底盘及零部件平台","products":"减震/内饰/热管理/机器人执行器","advantage":"特斯拉核心供应商，积极布局人形机器人","logic":"汽车+机器人双平台，执行器放量","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"sanhua":{"business":"制冷控制元器件制造商","products":"阀件/热管理系统，汽车+机器人热管理","advantage":"全球制冷元器件龙头，机器人热管理切入","logic":"人形机器人热管理+汽车电子","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"shuanghuan":{"business":"齿轮及传动部件制造商","products":"RV 减速器、汽车齿轮、新能源齿轮","advantage":"RV 减速器国内龙头，机器人+汽车双驱动","logic":"工业机器人+人形机器人减速器需求","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"keli":{"business":"力传感器及物联网解决方案","products":"应变式/称重传感器，工业物联网","advantage":"国内力传感器龙头，机器人六维力传感布局","logic":"机器人力控传感刚需","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"aobi":{"business":"3D 视觉感知技术企业","products":"3D 结构光/ToF 传感器、AIoT 视觉方案","advantage":"国内 3D 视觉龙头，机器人视觉核心","logic":"人形机器人视觉感知","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"zhaowei":{"business":"微型驱动系统制造商","products":"微型齿轮箱/电机，汽车+医疗+机器人","advantage":"微型传动国内龙头，灵巧手驱动潜力","logic":"机器人末端执行器微型化","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"tianyu":{"business":"数字娱乐及 AI 内容平台","products":"数字人、虚拟偶像、AI 营销内容","advantage":"数字人赛道先行者，NVIDIA Cosmos 生态","logic":"物理 AI+数字孪生内容需求","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"suochen":{"business":"工业软件及 CAE 仿真","products":"结构/流体/电磁仿真软件，工程咨询","advantage":"国内 CAE 仿真龙头，打破 ANSYS 垄断","logic":"Cosmos 第二梯队，物理仿真国产替代","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；国产替代验证与认证进度可能慢于预期。；国产 EDA/仿真软件渗透率提升缓慢；海外竞品技术领先；政策支持力度变化。"},"huadaj":{"business":"EDA 工具及 IP 开发商","products":"全流程 EDA 工具、模拟电路设计平台","advantage":"国产 EDA 绝对龙头，政策强力支持","logic":"芯片设计工具国产替代刚需","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；国产替代验证与认证进度可能慢于预期。；国产 EDA/仿真软件渗透率提升缓慢；海外竞品技术领先；政策支持力度变化。"},"gailun":{"business":"EDA 及半导体测试解决方案","products":"器件建模 EDA、半导体参数测试","advantage":"器件建模细分领域领先","logic":"先进制程器件建模工具","risk":"国产 EDA/仿真软件渗透率提升缓慢；海外竞品技术领先；政策支持力度变化。"},"zhongwang":{"business":"CAD/CAE/CAM 工业软件","products":"中望 CAD/CAE/CAM，3D 设计平台","advantage":"国产 CAD 龙头，全产品线布局","logic":"工业软件国产替代","risk":"国产替代验证与认证进度可能慢于预期。；国产 EDA/仿真软件渗透率提升缓慢；海外竞品技术领先；政策支持力度变化。"},"chaotu":{"business":"地理信息系统（GIS）软件","products":"SuperMap GIS 平台、数字孪生底座","advantage":"国产 GIS 龙头，数字孪生空间底座","logic":"Cosmos 物理 AI 需要空间数据底座","risk":"国产 EDA/仿真软件渗透率提升缓慢；海外竞品技术领先；政策支持力度变化。"},"guangli":{"business":"芯片 EDA 良率分析","products":"WAT 测试、良率分析 EDA 软件","advantage":"芯片良率提升工具细分龙头","logic":"先进制程良率挑战→分析工具需求","risk":"国产 EDA/仿真软件渗透率提升缓慢；海外竞品技术领先；政策支持力度变化。"},"fantuo":{"business":"数字孪生及 3D 可视化","products":"数字孪生平台、3D 可视化解决方案","advantage":"数字孪生可视化领先企业","logic":"Cosmos 第二/四梯队，数字孪生展示","risk":"国产 EDA/仿真软件渗透率提升缓慢；海外竞品技术领先；政策支持力度变化。"},"desay":{"business":"汽车电子及智能驾驶","products":"智能座舱、智能驾驶域控制器、T-Box","advantage":"智能驾驶域控国内龙头，英伟达 Thor 合作伙伴","logic":"L2+/L3 智驾渗透率提升","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；深度绑定单一客户或伙伴，合作变动影响较大。；智能驾驶渗透率提升慢于预期；激光雷达降本不及预期；法规与安全事故风险。"},"siwei":{"business":"导航地图及智驾数据","products":"高精地图、智驾数据闭环、车联网","advantage":"国内导航地图龙头，智驾数据服务","logic":"智驾数据闭环+高精地图","risk":"智能驾驶渗透率提升慢于预期；激光雷达降本不及预期；法规与安全事故风险。"},"wanji":{"business":"智能交通及激光雷达","products":"ETC、激光雷达、V2X 路侧设备","advantage":"ETC 龙头向激光雷达延伸","logic":"车路协同+激光雷达放量","risk":"智能驾驶渗透率提升慢于预期；激光雷达降本不及预期；法规与安全事故风险。"},"bert":{"business":"汽车制动及线控底盘","products":"盘式制动器、EPB、线控制动 WCBS","advantage":"线控底盘国内领先，智驾执行层核心","logic":"线控底盘是 L3+ 智驾必需","risk":"智能驾驶渗透率提升慢于预期；激光雷达降本不及预期；法规与安全事故风险。"},"tianzhun":{"business":"精密测量及机器视觉","products":"工业视觉检测、智驾测试设备","advantage":"苹果供应链检测方案，智驾测试切入","logic":"智驾检测+工业视觉双轮","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；智能驾驶渗透率提升慢于预期；激光雷达降本不及预期；法规与安全事故风险。"},"yingweike":{"business":"精密温控及环境控制","products":"数据中心液冷、精密空调、储能温控","advantage":"数据中心液冷龙头，AI 算力散热刚需","logic":"AI 服务器功耗上升→液冷渗透率提升","risk":"液冷渗透率提升慢于预期；数据中心建设节奏波动；技术路线变更风险。"},"fuxin":{"business":"半导体热电制冷器件","products":"TEC 制冷片、微制冷模块","advantage":"CPO 光引擎 InP 激光温控需 ±0.1°C，TEC 核心","logic":"CPO 光引擎功率密度极高→精密温控","risk":"液冷渗透率提升慢于预期；数据中心建设节奏波动；技术路线变更风险。"},"fuxin-pdf":{"business":"PDF 及电子文档软件","products":"福昕 PDF、AI 文档助手","advantage":"国产 PDF 软件龙头","logic":"AI 文档处理应用","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"goertek":{"business":"声学及智能硬件代工","products":"TWS 耳机、VR/AR 代工、MEMS 麦克风","advantage":"全球声学代工龙头，Meta/苹果核心供应商","logic":"VR/AR 复苏+AI 硬件创新","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；消费电子需求疲软；大客户订单波动；新品创新不及预期。"},"boe":{"business":"显示面板制造商","products":"LCD/OLED 面板、MiniLED、车载显示","advantage":"全球显示面板出货面积第一","logic":"OLED 渗透+车载显示增长","risk":"消费电子需求疲软；大客户订单波动；新品创新不及预期。"},"lanbiao":{"business":"营销传播及 AI 应用","products":"AI 营销、数字广告、元宇宙营销","advantage":"AI+营销先行者，大模型应用落地","logic":"AI 应用端营销变现","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"tongling":{"business":"铜采选冶及加工一体化","products":"阴极铜、铜箔、铜加工材","advantage":"国内铜冶炼龙头，PCB 铜材成本基础","logic":"铜价上涨传导至 PCB 全链条","risk":"强周期属性，景气下行时业绩与估值双杀风险。；大宗商品价格波动传导至成本与毛利；战略金属政策与出口管制不确定性。"},"zhongwu":{"business":"钨全产业链企业","products":"钨精矿、APT、硬质合金、数控刀具","advantage":"国内钨产业链龙头，战略金属","logic":"高端制造刀具+战略资源","risk":"大宗商品价格波动传导至成本与毛利；战略金属政策与出口管制不确定性。"},"beifangxt":{"business":"稀土开采及加工","products":"稀土精矿、稀土氧化物、稀土永磁材料","advantage":"全球最大稀土企业，轻稀土定价权","logic":"稀土战略资源+永磁需求","risk":"大宗商品价格波动传导至成本与毛利；战略金属政策与出口管制不确定性。"},"xibu":{"business":"稀有金属材料加工","products":"钛/锆/镍合金板材、管材","advantage":"航空航天稀有金属加工龙头","logic":"航空航天+核电材料需求","risk":"大宗商品价格波动传导至成本与毛利；战略金属政策与出口管制不确定性。"},"zhuye":{"business":"锌冶炼及综合回收","products":"锌锭、铟（A 股产量第一 50 吨/年）、硫酸","advantage":"铟为 InP 原料，锌冶炼副产物回收","logic":"高纯铟供应→InP 产业链上游","risk":"大宗商品价格波动传导至成本与毛利；战略金属政策与出口管制不确定性。"},"changjiang":{"business":"大型水电运营企业","products":"三峡、葛洲坝等水电站运营","advantage":"全球最大水电上市公司，现金流稳定","logic":"防御性资产，高股息","risk":"防御属性强但弹性有限；电价政策变化；火电环保成本上升。"},"huadian":{"business":"火电及热电联产","products":"电力、热力供应","advantage":"东北地区主要电力供应商","logic":"电力防御配置","risk":"防御属性强但弹性有限；电价政策变化；火电环保成本上升。"},"datang":{"business":"综合电力运营商","products":"火电、水电、风电、光伏","advantage":"五大发电集团之一上市平台","logic":"电力+新能源转型","risk":"转型业务进展与盈利贡献存在不确定性。；防御属性强但弹性有限；电价政策变化；火电环保成本上升。"},"hengrui":{"business":"创新药研发及商业化","products":"抗肿瘤药、麻醉药、造影剂，创新药管线","advantage":"国内创新药绝对龙头，出海加速","logic":"创新药+国际化双驱动","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；海外业务面临汇率波动、地缘政治与合规风险。；创新药研发失败风险；集采降价压力；CXO 订单周期性波动。"},"yaoming":{"business":"医药研发外包（CXO）","products":"药物发现、临床前/临床 CRO、CDMO","advantage":"全球 CXO 龙头，一体化服务平台","logic":"全球新药研发外包+国内创新药","risk":"创新药研发失败风险；集采降价压力；CXO 订单周期性波动。"},"sanbo":{"business":"脑科医疗服务","products":"神经外科、神经内科诊疗服务","advantage":"专科医疗服务连锁，脑科细分龙头","logic":"专科医疗+老龄化","risk":"创新药研发失败风险；集采降价压力；CXO 订单周期性波动。"},"yuandong":{"business":"电线电缆及新能源","products":"特种电缆、锂电池、AI 服务器线缆","advantage":"电缆老牌企业，向 AI 线缆转型","logic":"算力基建线缆需求","risk":"转型业务进展与盈利贡献存在不确定性。；主业与转型逻辑不确定性较高；题材炒作后估值回落风险。"},"huilv":{"business":"生态工程+光通信转型","products":"园林绿化、光模块（转型中）","advantage":"收购光模块资产转型科技","logic":"转型题材，光模块布局","risk":"转型业务进展与盈利贡献存在不确定性。；主业与转型逻辑不确定性较高；题材炒作后估值回落风险。"},"zhongguo-chuan":{"business":"船舶制造及海洋工程","products":"军民船舶、海工装备、动力装置","advantage":"国内船舶制造龙头，造船周期上行","logic":"造船景气周期+军工","risk":"强周期属性，景气下行时业绩与估值双杀风险。；主业与转型逻辑不确定性较高；题材炒作后估值回落风险。"},"nokia":{"business":"全球电信设备及网络服务（美股）","products":"5G 设备、光网络、网络管理软件","advantage":"全球电信设备主要供应商","logic":"全球光通信+5G 基建","risk":"海外市场波动与汇率风险；实时行情需通过券商查看。；海外市场波动与汇率风险；AH 溢价变化。；主业与转型逻辑不确定性较高；题材炒作后估值回落风险。"},"kedaxunfei":{"business":"国内人工智能语音与自然语言处理龙头企业","products":"讯飞星火大模型、智能语音、智慧教育、智慧医疗、开放平台","advantage":"语音AI技术积累最深，大模型+行业场景落地能力领先","logic":"大模型应用落地→教育/办公/医疗等场景变现","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"jinshan":{"business":"办公软件及云服务提供商","products":"WPS Office、金山文档、WPS AI 办公助手","advantage":"国产办公软件绝对龙头，AI 办公助手用户渗透率高","logic":"AI 办公刚需→订阅与增值服务增长","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"tuoersi":{"business":"大数据与人工智能语义分析企业","products":"拓天大模型、舆情监测、知识图谱、数据智能","advantage":"政府/媒体/金融数据智能龙头，大模型+数据资产","logic":"政务与金融 AI 应用→数据智能需求","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"kunlun":{"business":"互联网平台及 AI 应用投资企业","products":"Opera 浏览器 AI、SkyReels 视频、AI 社交/游戏","advantage":"海外 AI 应用布局积极，多模态内容生成","logic":"AI 应用出海+内容生成变现","risk":"转型业务进展与盈利贡献存在不确定性。；海外业务面临汇率波动、地缘政治与合规风险。；大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"wancheng":{"business":"数字创意软件及 AI 工具提供商","products":"万兴喵影/Filmora、万兴 PDF、AI 视频/设计工具","advantage":"面向 C 端创作者的 AI 工具矩阵，海外收入占比高","logic":"AIGC 工具订阅增长","risk":"海外业务面临汇率波动、地缘政治与合规风险。；大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"sanliu":{"business":"互联网安全及 AI 搜索企业","products":"360 安全大脑、360AI 搜索、企业安全","advantage":"海量用户基础+安全数据，AI 搜索差异化","logic":"AI 搜索与安全大模型应用","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"tangmu":{"business":"移动游戏及 AI 互动娱乐","products":"会说话的汤姆猫、AI 陪伴/互动游戏","advantage":"IP 矩阵+AI 陪伴概念，海外用户基础","logic":"AI 游戏与虚拟陪伴商业化","risk":"海外业务面临汇率波动、地缘政治与合规风险。；大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"hanwang":{"business":"文字识别及智能交互设备企业","products":"OCR 识别、电纸书、手写板、AI 办公本","advantage":"OCR 技术老牌龙头，AI 读写场景","logic":"AI 办公硬件+识别应用","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"yuntong":{"business":"计算机视觉与人机协同解决方案","products":"人脸识别、智慧金融、智慧治理","advantage":"CV 四小龙之一，政企市场落地","logic":"视觉 AI 行业应用渗透","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"geling":{"business":"计算机视觉与大数据分析","products":"智慧银行、智慧商业、轨交视觉","advantage":"金融/城市场景视觉 AI 专精","logic":"垂直场景 AI 落地","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"hongruan":{"business":"视觉算法授权及解决方案","products":"智能手机影像算法、车载视觉、IoT 视觉","advantage":"算法授权模式轻资产，绑定头部手机厂商","logic":"端侧 AI 视觉需求增长","risk":"深度绑定单一客户或伙伴，合作变动影响较大。；大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"yongyou":{"business":"企业云服务及管理软件","products":"用友 BIP、YonGPT 企业服务大模型","advantage":"国产 ERP/云服务龙头，企业 AI 化核心平台","logic":"企业 AI 化→云服务 ARPU 提升","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"hande":{"business":"企业数字化及 IT 咨询实施","products":"ERP 实施、智能制造、AI 应用集成","advantage":"大型企业数字化实施经验丰富","logic":"AI+ERP 实施需求","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"zhongwen":{"business":"数字阅读及 IP 运营","products":"中文在线阅读、AI 内容生成、短剧/IP","advantage":"海量文学 IP+AI 内容生成","logic":"AI 内容/IP 变现","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"guomai":{"business":"图书出版及 AI 阅读","products":"图书出版、AI 阅读助手","advantage":"出版+AI 阅读场景结合","logic":"AI 出版与阅读应用","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"yinli":{"business":"整合营销传播服务","products":"AI 营销、数字广告、品牌传播","advantage":"营销 AI 应用先行者","logic":"AI 营销降本增效","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"ruantong":{"business":"软件与数字技术服务","products":"鸿蒙生态、AI 应用开发、IT 服务","advantage":"华为生态核心伙伴，AI 应用交付","logic":"鸿蒙+AI 应用服务放量","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；深度绑定单一客户或伙伴，合作变动影响较大。；大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"runhe":{"business":"操作系统及行业解决方案","products":"OpenHarmony、行业 OS、AI 边缘计算","advantage":"鸿蒙生态核心开发商","logic":"端侧 AI OS 生态","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"haitian":{"business":"AI 训练数据服务","products":"语音识别/合成/自然语言训练数据集","advantage":"国内 AI 语料数据龙头","logic":"大模型训练→高质量语料需求","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"boyan":{"business":"IT 咨询及行业解决方案","products":"金融/互联网 IT 服务、AI 应用开发","advantage":"头部互联网公司服务经验丰富","logic":"AI 应用外包与集成","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"shenzhou":{"business":"IT 分销及云服务","products":"华为/戴尔分销、云与 AI 算力服务","advantage":"国内 IT 分销龙头，算力+AI 服务","logic":"AI 算力分销与应用交付","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"juren":{"business":"网络游戏研发与运营","products":"征途系列、AI NPC/游戏","advantage":"老牌游戏龙头，AI 游戏探索","logic":"AI 游戏玩法创新","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"shiji":{"business":"网络游戏及互联网文化","products":"传奇/传奇世界、AI 游戏","advantage":"游戏 IP 丰富，AI 游戏布局","logic":"AI 游戏内容生成","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"zhongkechuangda":{"business":"智能操作系统及边缘 AI","products":"智能汽车 OS、机器人 OS、端侧 AI","advantage":"端侧 AI OS 龙头，车+机器人双轮","logic":"端侧 AI 与智能设备 OS","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"jiangtong":{"business":"铜采选冶及加工一体化企业","products":"阴极铜、铜杆、铜加工材","advantage":"国内铜冶炼龙头，PCB 上游阴极铜成本锚","logic":"铜价上涨传导至 PCB 全链条","risk":"强周期属性，景气下行时业绩与估值双杀风险。；大宗商品价格波动传导至成本与毛利；战略金属政策与出口管制不确定性。"},"xiamenwu":{"business":"钨钼稀土等有色金属采选冶炼","products":"钨精矿、APT、硬质合金、数控刀具","advantage":"国内钨产业链龙头，高端刀具需求受益","logic":"高端制造+战略资源属性","risk":"大宗商品价格波动传导至成本与毛利；战略金属政策与出口管制不确定性。"},"anji":{"business":"半导体材料及化学机械抛光液","products":"CMP 抛光液、刻蚀液、清洗液","advantage":"国产 CMP 抛光液龙头，先进制程突破","logic":"晶圆厂扩产+材料国产化","risk":"国产替代验证与认证进度可能慢于预期。；新产能爬坡与良率风险；扩产完成后供需可能逆转。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"jinhong":{"business":"特种气体研发生产销售","products":"超纯氨、氧化亚氮、氢气等电子特气","advantage":"民营电子特气龙头，客户覆盖主流晶圆厂","logic":"半导体扩产拉动特气需求","risk":"新产能爬坡与良率风险；扩产完成后供需可能逆转。；紧缺缓解后涨价不可持续；扩产周期长、认证壁垒高；进口依赖与地缘政治风险。"},"yihao":{"business":"电子电路铜箔及铝基覆铜板","products":"HVLP 铜箔、RTF 铜箔、铝基 CCL","advantage":"HVLP 铜箔产能扩张，AI 服务器 PCB 受益","logic":"高端铜箔满产满销周期","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；强周期属性，景气下行时业绩与估值双杀风险。；高端规格扩产不及预期；客户认证周期长；紧缺周期结束后加工费回落。"},"shunluo":{"business":"电子元器件研发生产","products":"片式电感、变压器、陶瓷电子元件","advantage":"国内电感龙头，AI 硬件拉动被动件需求","logic":"被动元件复苏+汽车电子","risk":"被动元件价格周期性回落；下游需求不及预期；高端规格竞争加剧。"},"jiemei":{"business":"电子功能材料及纸质载带","products":"纸质载带、上下胶带、离型膜","advantage":"MLCC 封装载带龙头，绑定村田等巨头","logic":"MLCC 紧缺传导至封装材料","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；深度绑定单一客户或伙伴，合作变动影响较大。；被动元件价格周期性回落；下游需求不及预期；高端规格竞争加剧。"},"zhongwei":{"business":"半导体刻蚀及 MOCVD 设备","products":"等离子刻蚀机、MOCVD 设备","advantage":"国内刻蚀设备龙头，CCP/ICP 技术领先","logic":"国产设备渗透率提升","risk":"晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"zhuosheng":{"business":"射频前端芯片设计","products":"射频开关、LNA、滤波器、WiFi FEM","advantage":"国内射频芯片龙头，手机+物联网双驱动","logic":"5G/AIoT 射频需求增长","risk":"晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"jiangbolang":{"business":"半导体存储产品应用方案","products":"企业级 SSD、嵌入式存储、消费级存储","advantage":"国内存储模组龙头，企业级存储放量","logic":"存储周期复苏+AI 存储需求","risk":"强周期属性，景气下行时业绩与估值双杀风险。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"baiwei":{"business":"半导体存储器研发制造销售","products":"嵌入式存储、消费级 SSD、工规存储","advantage":"存储模组新锐，国产替代加速","logic":"存储复苏+信创存储需求","risk":"国产替代验证与认证进度可能慢于预期。；强周期属性，景气下行时业绩与估值双杀风险。；晶圆厂资本开支周期波动；先进制程研发与国产化进度不及预期；存储/芯片价格周期下行。"},"weice":{"business":"集成电路测试服务","products":"晶圆测试、芯片成品测试","advantage":"国内独立第三方测试龙头","logic":"封测产能紧缺外溢至测试环节","risk":"涨价与紧缺周期不可持续，产能释放后价格与毛利可能回落。；封测产能利用率波动；先进封装技术迭代与客户认证风险。"},"tengjing":{"business":"精密光学元件及光纤器件","products":"滤光片、光纤透镜、WDM 器件","advantage":"精密光学元件供应商，光通信+CPO 受益","logic":"光模块精密光学需求增长","risk":"光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"dekeli":{"business":"光电子器件研发生产","products":"光放大器、光模块、光传输子系统","advantage":"光放大器细分领域龙头","logic":"算力网络长距传输需求","risk":"光模块技术路线变更（硅光/LPO/CPO）；800G 竞争加剧压毛利；海外客户订单集中度较高。"},"shiyun":{"business":"印制电路板制造","products":"汽车电子 PCB、服务器 PCB、消费电子 PCB","advantage":"特斯拉 PCB 核心供应商，AI 服务器 PCB 布局","logic":"汽车电子+算力 PCB 双驱动","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；ABF 载板国产替代进度不及预期；PCB 行业周期性波动；高端板竞争加剧。"},"zhongxing":{"business":"通信系统设备制造商","products":"5G 基站、光传输、服务器、算力网络","advantage":"全球四大通信设备商之一，算力网络核心","logic":"算力基建+5G 网络建设","risk":"运营商资本开支周期波动；光纤光缆价格竞争；转型新业务不及预期。"},"shenling":{"business":"专业环境系统解决方案","products":"数据中心液冷、精密空调、特种空调","advantage":"数据中心液冷核心供应商，绑定头部云厂商","logic":"液冷渗透率快速提升","risk":"深度绑定单一客户或伙伴，合作变动影响较大。；液冷渗透率提升慢于预期；数据中心建设节奏波动；技术路线变更风险。"},"jialitu":{"business":"精密空调设备及机房环境","products":"精密空调、液冷系统、磁悬浮冷水机组","advantage":"数据中心精密空调老牌企业，液冷转型","logic":"AI 数据中心散热需求","risk":"转型业务进展与盈利贡献存在不确定性。；液冷渗透率提升慢于预期；数据中心建设节奏波动；技术路线变更风险。"},"shujugang":{"business":"互联网数据中心服务","products":"IDC 机柜、定制化数据中心","advantage":"绑定阿里巴巴等头部云客户，算力枢纽核心","logic":"算力基建+IDC 需求增长","risk":"深度绑定单一客户或伙伴，合作变动影响较大。；云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"guanghuan":{"business":"互联网数据中心及云计算","products":"IDC 服务、AWS 云服务运营","advantage":"国内领先 IDC 运营商，云计算协同","logic":"算力租赁与 IDC 扩张","risk":"云厂商 CAPEX 下行影响订单；算力芯片竞争加剧；客户集中度较高。"},"guanglianda":{"business":"建筑信息化软件","products":"工程造价、施工管理、BIM 数字孪生","advantage":"建筑信息化龙头，数字孪生底座","logic":"建筑业数字化+AI 应用","risk":"国产 EDA/仿真软件渗透率提升缓慢；海外竞品技术领先；政策支持力度变化。"},"aisidun":{"business":"工业机器人及智能制造","products":"工业机器人、伺服系统、运动控制","advantage":"国产工业机器人龙头，全产业链布局","logic":"工业机器人+人形机器人放量","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"mingzhi":{"business":"控制电机及其驱动系统","products":"空心杯电机、步进电机、无刷电机","advantage":"空心杯电机全球领先，灵巧手核心部件","logic":"人形机器人执行器需求爆发","risk":"人形机器人产业化进度低于预期；量产降本难度大；下游需求不及预期。"},"jingwei":{"business":"汽车电子及智能驾驶","products":"智驾域控制器、车身电子、研发服务","advantage":"汽车电子综合供应商，智驾域控布局","logic":"L2+/L3 智驾渗透率提升","risk":"智能驾驶渗透率提升慢于预期；激光雷达降本不及预期；法规与安全事故风险。"},"huayang":{"business":"汽车电子及精密压铸","products":"智能座舱、HUD、车载声学、域控制器","advantage":"智能座舱国内龙头，绑定主流车企","logic":"智能座舱升级+智驾融合","risk":"深度绑定单一客户或伙伴，合作变动影响较大。；智能驾驶渗透率提升慢于预期；激光雷达降本不及预期；法规与安全事故风险。"},"yongxin":{"business":"光学显微镜及光学元件","products":"激光雷达光学元件、车载镜头、显微镜","advantage":"激光雷达光学元件核心供应商","logic":"激光雷达放量+车载光学","risk":"智能驾驶渗透率提升慢于预期；激光雷达降本不及预期；法规与安全事故风险。"},"tonghuashun":{"business":"金融信息服务","products":"iFinD、问财 AI、行情交易软件","advantage":"互联网金融信息服务龙头，AI 投顾领先","logic":"AI+金融信息服务变现","risk":"大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"hengsheng":{"business":"金融软件及网络服务","products":"证券/基金/银行 IT 系统、LightGPT","advantage":"金融 IT 绝对龙头，金融机构核心系统","logic":"金融大模型+信创替代","risk":"高壁垒一旦突破或技术路线变更，竞争格局可能重塑。；国产替代验证与认证进度可能慢于预期。；大模型应用商业化不及预期；竞争加剧导致获客成本上升；估值偏高回调风险。"},"luxshare":{"business":"消费电子精密制造","products":"连接器、线缆、Apple 组装、Vision Pro","advantage":"苹果供应链核心，消费电子组装龙头","logic":"AI 硬件+Vision Pro 创新","risk":"大客户/头部客户订单依赖度较高，客户资本开支波动影响业绩。；消费电子需求疲软；大客户订单波动；新品创新不及预期。"},"lansi":{"business":"消费电子玻璃及结构件","products":"玻璃盖板、金属结构件、模组组装","advantage":"全球消费电子玻璃龙头，Apple 核心供应商","logic":"消费电子创新周期","risk":"强周期属性，景气下行时业绩与估值双杀风险。；消费电子需求疲软；大客户订单波动；新品创新不及预期。"},"enjie":{"business":"锂电池隔膜研发生产","products":"湿法隔膜、涂覆隔膜","advantage":"全球锂电隔膜龙头，市占率领先","logic":"储能+动力电池隔膜需求","risk":"锂电材料价格周期性波动；产能过剩导致毛利压缩；下游电动车增速放缓。"}}`) as Record<string, StockDetail>;

function formatQuote(code: string, market?: string): { text: string; tone: "success" | "danger" | "warning" | "neutral" } {
  if (market === "美股" || market === "港股") return { text: "海外行情请查本地券商", tone: "neutral" };
  const q = QUOTES[code];
  if (!q) return { text: "暂无行情", tone: "neutral" };
  const priceStr = q.price != null ? `${q.price.toFixed(2)}` : null;
  const pctStr = q.changePct != null ? `${q.changePct >= 0 ? "+" : ""}${q.changePct.toFixed(2)}%` : null;
  if (priceStr && pctStr) return { text: `${priceStr}  ${pctStr}`, tone: (q.changePct ?? 0) >= 0 ? "success" : "danger" };
  if (pctStr) return { text: pctStr, tone: q.changePct! >= 0 ? "success" : "danger" };
  if (priceStr) return { text: priceStr, tone: "neutral" };
  return { text: "暂无行情", tone: "neutral" };
}

const WATCHLIST_COUNT = STOCKS.filter((s) => s.isWatchlist).length;
const LEADER_COUNT = STOCKS.filter((s) => s.isLeader).length;
const OVERLAP_COUNT = STOCKS.filter((s) => s.isWatchlist && s.isLeader).length;

const SHOW_OPTIONS = [
  { value: "all", label: "全部" },
  { value: "watchlist", label: "我的自选" },
  { value: "leaders", label: "行业龙头" },
  { value: "gap", label: "龙头未覆盖（补缺）" },
];

const VIEW_OPTIONS = [
  { value: "category", label: "按行业分类" },
  { value: "chain", label: "按产业链" },
  { value: "all", label: "全部列表" },
];

const CHAIN_GROUPS = [
  { id: "ai-compute", label: "AI 算力链", color: "pink" as const, keywords: ["算力", "服务器", "代工", "x86", "AI 推理", "AI 服务器", "IDC", "GPU", "DCU"] },
  { id: "ai-app", label: "AI 应用链", color: "pink" as const, keywords: ["AI 应用", "AI 办公", "AI 营销", "AI 内容", "AI 游戏", "大模型", "AIGC", "数字人", "企业服务", "端侧 AI", "视觉 AI"] },
  { id: "cpo", label: "CPO 光通信链", color: "blue" as const, keywords: ["CPO", "光模块", "光引擎", "FAU", "CW 激光", "InP", "TFLN", "光芯片", "精密耦合", "调制器", "隔离器"] },
  { id: "pcb-abf", label: "PCB / ABF 载板链", color: "purple" as const, keywords: ["ABF", "载板", "PCB", "覆铜板", "CCL"] },
  { id: "pcb-upstream", label: "PCB 上游材料链", color: "yellow" as const, keywords: ["HVLP", "电子布", "Q 布", "树脂", "硅微粉", "铜箔", "T-glass", "玻纤"] },
  { id: "packaging", label: "先进封装链", color: "orange" as const, keywords: ["封装", "封测", "WLCSP", "COUPE"] },
  { id: "materials", label: "半导体材料链", color: "yellow" as const, keywords: ["石英", "铌酸锂", "InP", "硫酸", "前驱体", "靶材", "特气", "氦气", "铟", "MLCC", "稀缺材料"] },
  { id: "passive", label: "被动元件 / MLCC 链", color: "green" as const, keywords: ["MLCC", "被动元件", "陶瓷电容", "稀缺材料-MLCC"] },
  { id: "robotics", label: "机器人 / 仿真链", color: "orange" as const, keywords: ["机器人", "减速器", "伺服", "传感器", "Cosmos", "仿真", "EDA", "数字孪生"] },
  { id: "newenergy", label: "新能源链", color: "green" as const, keywords: ["锂电", "电解液", "电池", "正极", "六氟"] },
  { id: "non-tech", label: "非科技（防御/消费）", color: "gray" as const, keywords: ["水电", "火电", "医药", "CXO", "脑科", "船舶", "稀土", "钨", "电缆", "显示", "声学"] },
];

function stockSortKey(s: Stock & { effectiveCat: CategoryKey }): number {
  if (s.isWatchlist && s.isLeader) return 0;
  if (s.isWatchlist) return 1;
  if (s.isLeader) return 2;
  return 3;
}

function matchesShowMode(s: Stock, mode: string): boolean {
  if (mode === "watchlist") return !!s.isWatchlist;
  if (mode === "leaders") return !!s.isLeader;
  if (mode === "gap") return !!s.isLeader && !s.isWatchlist;
  return true;
}

// ─── 工具 ─────────────────────────────────────────────────────

function getEffectiveCategory(stock: Stock, overrides: Record<string, CategoryKey>): CategoryKey {
  return overrides[stock.id] ?? stock.category;
}

function matchChain(stock: Stock): string {
  const link = stock.chainLink ?? stock.role;
  for (const g of CHAIN_GROUPS) {
    if (g.keywords.some((k) => link.includes(k) || stock.role.includes(k))) return g.id;
  }
  return "other-chain";
}

// ─── 子组件 ───────────────────────────────────────────────────

function StockRow({
  stock,
  category,
  watched,
  onToggleWatch,
  selected,
  onSelect,
  note,
  onNoteChange,
  onMoveCategory,
}: {
  stock: Stock;
  category: CategoryKey;
  watched: boolean;
  onToggleWatch: () => void;
  selected: boolean;
  onSelect: () => void;
  note: string;
  onNoteChange: (v: string) => void;
  onMoveCategory: (cat: CategoryKey) => void;
}) {
  const theme = useHostTheme();
  const quote = formatQuote(stock.code, stock.market);
  const detail = DETAILS[stock.id];
  return (
    <Stack gap={0}>
      <Row gap={8} align="center" style={{ padding: "8px 0", borderBottom: `1px solid ${theme.stroke.tertiary}` }}>
        <IconButton title={watched ? "取消关注" : "标记重点"} onClick={onToggleWatch} variant="circle" size="sm">
          {watched ? "★" : "☆"}
        </IconButton>
        <div onClick={onSelect} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}>
          <Row gap={6} align="center" wrap>
            <Text weight="semibold">{stock.name}</Text>
            <Pill size="sm" tone="neutral">
              {stock.code}
            </Pill>
            <Pill size="sm" tone={quote.tone === "success" ? "success" : quote.tone === "danger" ? "warning" : "neutral"}>
              {quote.text}
            </Pill>
            {stock.market && (
              <Pill size="sm" tone="info">
                {stock.market}
              </Pill>
            )}
            {stock.isWatchlist && (
              <Pill size="sm" tone="warning">
                自选
              </Pill>
            )}
            {stock.isLeader && (
              <Pill size="sm" tone="success">
                龙头
              </Pill>
            )}
          </Row>
          <Text size="small" tone="secondary">
            {stock.role}
            {stock.chainLink ? ` · ${stock.chainLink}` : ""}
          </Text>
        </div>
        <div onClick={onSelect} style={{ cursor: "pointer" }}>
          <Text size="small" tone="tertiary">
            {selected ? "▾" : "▸"}
          </Text>
        </div>
      </Row>
      {selected && (
        <Stack gap={10} style={{ padding: "10px 0 14px 28px" }}>
          {detail && (
            <Stack gap={6}>
              <Text size="small">
                <Text weight="semibold" as="span">主营业务：</Text>
                {detail.business}
              </Text>
              <Text size="small">
                <Text weight="semibold" as="span">核心产品：</Text>
                {detail.products}
              </Text>
              <Text size="small">
                <Text weight="semibold" as="span">竞争优势：</Text>
                {detail.advantage}
              </Text>
              <Text size="small">
                <Text weight="semibold" as="span">关注逻辑：</Text>
                {detail.logic}
              </Text>
            </Stack>
          )}
          <Row gap={8} align="center">
            <Text size="small" tone="tertiary">
              调整分类：
            </Text>
            <Select
              value={category}
              onChange={(v) => onMoveCategory(v as CategoryKey)}
              options={CATEGORIES.map((c) => ({ value: c.key, label: c.label }))}
              style={{ flex: 1 }}
            />
          </Row>
          <TextArea value={note} onChange={onNoteChange} placeholder="研究笔记…" rows={2} />
        </Stack>
      )}
    </Stack>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────

export default function WatchlistCanvas() {
  const [view, setView] = useCanvasState("wl-view", "category");
  const [showMode, setShowMode] = useCanvasState("wl-show-mode", "all");
  const [search, setSearch] = useCanvasState("wl-search", "");
  const [watchlist, setWatchlist] = useCanvasState<string[]>("wl-watchlist", []);
  const [watchOnly, setWatchOnly] = useCanvasState("wl-watch-only", false);
  const [selectedId, setSelectedId] = useCanvasState<string | null>("wl-selected", null);
  const [notes, setNotes] = useCanvasState<Record<string, string>>("wl-notes", {});
  const [catOverrides, setCatOverrides] = useCanvasState<Record<string, CategoryKey>>("wl-cat-overrides", {});
  const [globalNotes, setGlobalNotes] = useCanvasState("wl-global-notes", "");

  const toggleWatch = (id: string) => {
    setWatchlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const moveCategory = (id: string, cat: CategoryKey) => {
    setCatOverrides((prev) => ({ ...prev, [id]: cat }));
  };

  const enriched = STOCKS.map((s) => ({
    ...s,
    effectiveCat: getEffectiveCategory(s, catOverrides),
  }));

  const filtered = enriched
    .filter((s) => {
      if (!matchesShowMode(s, showMode)) return false;
      if (watchOnly && !watchlist.includes(s.id)) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        (s.chainLink ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => stockSortKey(a) - stockSortKey(b));

  const gapCount = STOCKS.filter((s) => s.isLeader && !s.isWatchlist).length;

  const catCounts = CATEGORIES.map((c) => ({
    ...c,
    count: enriched.filter((s) => s.effectiveCat === c.key).length,
    watchCount: enriched.filter((s) => s.effectiveCat === c.key && s.isWatchlist).length,
    leaderCount: enriched.filter((s) => s.effectiveCat === c.key && s.isLeader).length,
    gapCount: enriched.filter((s) => s.effectiveCat === c.key && s.isLeader && !s.isWatchlist).length,
  })).filter((c) => c.count > 0);

  const techCount = enriched.filter((s) => s.isWatchlist && !["utility", "healthcare", "other", "raw"].includes(s.effectiveCat)).length;

  return (
    <Stack gap={20} style={{ padding: "4px 0" }}>
      <Stack gap={4}>
        <H1>自选股 · 行业逻辑分类</H1>
        <Text tone="secondary">
          自选 {WATCHLIST_COUNT} 只 · 龙头参考 {LEADER_COUNT} 只 · 重叠 {OVERLAP_COUNT} 只 · 待补缺 {gapCount} 只
        </Text>
        <Callout tone="info">行情数据截至 {PRICE_AS_OF}，来源新浪财经（161 只 A 股/ETF 含价格与涨跌幅）。港股/美股请查本地券商。</Callout>
      </Stack>

      <Card>
        <CardBody>
          <Row gap={12} align="center" wrap>
            <Select value={view} onChange={setView} options={VIEW_OPTIONS} style={{ minWidth: 130 }} />
            <Select value={showMode} onChange={setShowMode} options={SHOW_OPTIONS} style={{ minWidth: 150 }} />
            <TextInput
              value={search}
              onChange={setSearch}
              placeholder="搜索名称、代码、产业链…"
              type="search"
              style={{ flex: 1, minWidth: 160 }}
            />
            <Row gap={8} align="center">
              <Text size="small" tone="secondary">
                仅看重点
              </Text>
              <Toggle checked={watchOnly} onChange={setWatchOnly} />
            </Row>
          </Row>
        </CardBody>
      </Card>

      <Grid columns={4} gap={12}>
        <Stat label="我的自选" value={String(WATCHLIST_COUNT)} tone="warning" />
        <Stat label="行业龙头" value={String(LEADER_COUNT)} tone="success" />
        <Stat label="龙头未覆盖" value={String(gapCount)} tone="info" />
        <Stat label="我的重点" value={String(watchlist.length)} tone="info" />
      </Grid>

      {/* 行业分布图 */}
      <H2>分类结构（自选 / 龙头 / 待补缺）</H2>
      <BarChart
        horizontal
        categories={catCounts.map((c) => c.label)}
        series={[
          { name: "我的自选", data: catCounts.map((c) => c.watchCount), tone: "warning" },
          { name: "龙头未覆盖", data: catCounts.map((c) => c.gapCount), tone: "info" },
        ]}
        stacked
        height={catCounts.length * 32 + 48}
      />
      <Text size="small" tone="tertiary">
        橙色=已持仓 · 蓝色=龙头参考但未在自选中 · 切换「龙头未覆盖」可查看补缺清单
      </Text>

      {/* 按行业分类视图 */}
      {view === "category" &&
        CATEGORIES.filter((c) => enriched.some((s) => s.effectiveCat === c.key && filtered.some((f) => f.id === s.id))).map(
          (cat) => {
            const stocks = filtered.filter((s) => s.effectiveCat === cat.key);
            if (stocks.length === 0) return null;
            return (
              <div key={cat.key}>
                <CollapsibleSection
                  title={cat.label}
                  count={stocks.length}
                  leading={<Swatch color={cat.color} />}
                  trailing={
                    <Text size="small" tone="tertiary">
                      自选 {stocks.filter((s) => s.isWatchlist).length} · 龙头 {stocks.filter((s) => s.isLeader).length} · 补缺 {stocks.filter((s) => s.isLeader && !s.isWatchlist).length}
                    </Text>
                  }
                  defaultOpen={stocks.length <= 6}
                >
                  <Stack gap={0}>
                    {stocks.map((s) => (
                      <div key={s.id}>
                        <StockRow
                          stock={s}
                          category={s.effectiveCat}
                          watched={watchlist.includes(s.id)}
                          onToggleWatch={() => toggleWatch(s.id)}
                          selected={selectedId === s.id}
                          onSelect={() => setSelectedId(selectedId === s.id ? null : s.id)}
                          note={notes[s.id] ?? ""}
                          onNoteChange={(v) => setNotes((prev) => ({ ...prev, [s.id]: v }))}
                          onMoveCategory={(c) => moveCategory(s.id, c)}
                        />
                      </div>
                    ))}
                  </Stack>
                </CollapsibleSection>
              </div>
            );
          },
        )}

      {/* 按产业链视图 */}
      {view === "chain" && (
        <Stack gap={8}>
          <H2>产业链映射</H2>
          <Text tone="secondary">
            将你的持仓映射到 AI 时代上游供应链主线
          </Text>
          {CHAIN_GROUPS.map((g) => {
            const stocks = filtered.filter((s) => matchChain(s) === g.id);
            if (stocks.length === 0) return null;
            return (
              <div key={g.id}>
                <CollapsibleSection
                  title={g.label}
                  count={stocks.length}
                  leading={<Swatch color={g.color} />}
                  defaultOpen
                >
                  <Table
                    headers={["公司", "代码", "股价/涨跌", "产业链定位", "行业分类"]}
                    rows={stocks.map((s) => {
                      const q = formatQuote(s.code, s.market);
                      return [s.name, s.code, q.text, s.chainLink ?? s.role, CAT_MAP[s.effectiveCat].label];
                    })}
                    striped
                  />
                </CollapsibleSection>
              </div>
            );
          })}
        </Stack>
      )}

      {/* 全部列表 */}
      {view === "all" && (
        <Stack gap={8}>
          <H2>全部标的 ({filtered.length})</H2>
          <Table
            headers={["公司", "代码", "股价/涨跌", "类型", "产业链定位", "行业分类"]}
            rows={filtered.map((s) => {
              const q = formatQuote(s.code, s.market);
              return [
                s.name,
                s.code,
                q.text,
                s.isWatchlist && s.isLeader ? "自选+龙头" : s.isWatchlist ? "自选" : s.isLeader ? "龙头" : "-",
                s.chainLink ?? s.role,
                CAT_MAP[s.effectiveCat].label,
              ];
            })}
            striped
            stickyHeader
          />
        </Stack>
      )}

      {/* 主线速查 */}
      <Card>
        <CardHeader>持仓 vs 龙头覆盖分析</CardHeader>
        <CardBody>
          <Grid columns={2} gap={16}>
            <Stack gap={8}>
              <H3>自选已覆盖龙头（{OVERLAP_COUNT} 只）</H3>
              <Text size="small" tone="secondary">
                中际旭创、天孚通信、深南电路、兴森科技、长电科技、中芯国际、云南锗业、石英股份、工业富联、浪潮信息…
              </Text>
            </Stack>
            <Stack gap={8}>
              <H3>重点补缺方向（{gapCount} 只龙头未自选）</H3>
              <Text size="small" tone="secondary">
                PCB上游：宏和科技、菲利华、铜冠铜箔、联瑞新材 ·
                光模块：新易盛、光库科技、太辰光 ·
                仿真：索辰科技、华大九天 ·
                机器人：绿的谐波、拓普集团
              </Text>
            </Stack>
          </Grid>
          <Divider />
          <Grid columns={2} gap={16}>
            <Stack gap={8}>
              <H3>自选科技主线（{techCount} 只）</H3>
              <Text size="small" tone="secondary">
                算力 ({enriched.filter((s) => s.isWatchlist && s.effectiveCat === "compute").length}) ·
                光模块 ({enriched.filter((s) => s.isWatchlist && s.effectiveCat === "optical").length}) ·
                PCB/载板 ({enriched.filter((s) => s.isWatchlist && s.effectiveCat === "pcb").length}) ·
                封装 ({enriched.filter((s) => s.isWatchlist && s.effectiveCat === "packaging").length}) ·
                半导体 ({enriched.filter((s) => s.isWatchlist && s.effectiveCat === "semiconductor").length}) ·
                材料 ({enriched.filter((s) => s.isWatchlist && s.effectiveCat === "materials").length})
              </Text>
            </Stack>
            <Stack gap={8}>
              <H3>新增分类说明</H3>
              <Text size="small" tone="secondary">
                PCB上游（铜箔/电子布/Q布/树脂）· 仿真/EDA/数字孪生 · 自动驾驶/智能驾驶 — 从原分类中拆分，对齐产业链研报逻辑
              </Text>
            </Stack>
          </Grid>
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing={<Text size="small" tone="tertiary">自动保存</Text>}>持仓研究笔记</CardHeader>
        <CardBody>
          <TextArea
            value={globalNotes}
            onChange={setGlobalNotes}
            placeholder="记录整体仓位逻辑、调仓计划、待研究问题…"
            rows={4}
          />
        </CardBody>
      </Card>

      <Text size="small" tone="quaternary">
        分类可手动调整，修改会持久保存。不构成投资建议。
      </Text>
    </Stack>
  );
}
