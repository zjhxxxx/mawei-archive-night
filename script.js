const SAVE_KEY = "mawei-archive-night-v3";
const params = new URLSearchParams(window.location.search);
const previewMode = params.has("preview");
const previewScene = params.get("scene");
const previewView = params.get("view");
const previewUnlockAll = params.get("all") === "1";
const previewArchiveDrawer = params.get("archive") === "1";
const previewMapDrawer = params.get("map") === "1";
const autoStartNew = params.get("play") === "1";
const autoResume = params.get("resume") === "1";

const SCENE_ORDER = ["yamen", "academy", "dock", "tower", "archive"];
const THEME_LABELS = { craft: "匠作", study: "新学", voyage: "向海" };

const sceneImages = {
  yamen: "output/imagegen/ark/scene-yamen-v3.png",
  academy: "output/imagegen/ark/scene-academy-v3.png",
  dock: "output/imagegen/ark/scene-dock-v3.png",
  tower: "output/imagegen/ark/scene-tower-v4.png",
  archive: "output/imagegen/ark/scene-archive-v1.png",
};

const artifactImages = {
  "yamen-seal": "output/imagegen/ark/artifacts/yamen-seal-v1.png",
  "yamen-ledger": "output/imagegen/ark/artifacts/yamen-ledger-v1.png",
  "yamen-bell": "output/imagegen/ark/artifacts/yamen-bell-v1.png",
  "academy-bell": "output/imagegen/ark/artifacts/academy-bell-v1.png",
  "academy-books": "output/imagegen/ark/artifacts/academy-books-v1.png",
  "academy-desk": "output/imagegen/ark/artifacts/academy-desk-v1.png",
  "dock-keel": "output/imagegen/ark/artifacts/dock-keel-v1.png",
  "dock-engine": "output/imagegen/ark/artifacts/dock-engine-v1.png",
  "dock-launch": "output/imagegen/ark/artifacts/dock-launch-v1.png",
  "tower-light": "output/imagegen/ark/artifacts/tower-light-v1.png",
  "tower-chart": "output/imagegen/ark/artifacts/tower-chart-v1.png",
  "tower-watch": "output/imagegen/ark/artifacts/tower-watch-v1.png",
  "archive-map": "output/imagegen/ark/artifacts/archive-map-v1.png",
  "archive-roll": "output/imagegen/ark/artifacts/archive-roll-v1.png",
  "archive-model": "output/imagegen/ark/artifacts/archive-model-v1.png",
};

const endingText = {
  craft: {
    title: "你归档出的，是一条把想法做成器物的线",
    text: "在你的夜访里，船政最打动人的地方，是它把制度、工艺与流程真正落到了船坞与器物上。它不是停在纸上的宏愿，而是可以被制造、被调度、被运行的现实工程。",
  },
  study: {
    title: "你归档出的，是一条把新学接入现实的线",
    text: "在你的夜访里，船政最重要的意义，是它让近代中国第一次系统地看见了课程、译书、制图与实践如何合成一套新的工程教育。它改变的，首先是理解世界的方法。",
  },
  voyage: {
    title: "你归档出的，是一条向海打开视野的线",
    text: "在你的夜访里，船政真正留下的，是一种被重新校准的目光。海洋不再只是边界之外的风景，而成为国家、技术与未来想象共同指向的方向。",
  },
};

const scenes = {
  yamen: {
    id: "yamen",
    short: "衙门",
    kicker: "起点",
    title: "总理船政衙门",
    mission: "先从衙门的三条线索开始，理解船政如何被组织成真正能运转的系统。",
    intro: {
      speaker: "引导",
      title: "从门外进入船政系统",
      text: "这里不是单一遗址，而是一套现实工程的总开关。你需要先进入内景，再把真正的档案归入柜中。",
    },
    entryViewId: "yamen-courtyard",
    choices: [
      { id: "yamen-craft", label: "它先让制度能够推动制造", text: "船政之所以能落地，不只是因为有理想，而是因为衙门把命令、经费、调度和工艺连成了一套可执行结构。", score: "craft" },
      { id: "yamen-study", label: "它先让新学找到现实入口", text: "衙门的意义在于，它给课程、译书和新式人才培养建立了真正会发生作用的制度入口。", score: "study" },
      { id: "yamen-voyage", label: "它先把向海的目光组织起来", text: "当方向被组织起来，海洋才从边缘景色变成国家议题。衙门真正改变的，是面向海防与世界的视线。", score: "voyage" },
    ],
    viewpoints: {
      "yamen-courtyard": {
        id: "yamen-courtyard",
        sceneId: "yamen",
        label: "门外",
        parentViewId: null,
        kicker: "起点",
        title: "总理船政衙门",
        summary: "江风、船埠与衙门同框，船政在这里被组织成一套现实工程。",
        objective: "从门、案台或侧廊选一个入口切入，进入更近的镜头。",
        art: { sceneKey: "yamen", focusX: 50, focusY: 52, scale: 1.04 },
        actions: [
          { id: "yamen-enter-hall", type: "navigate", label: "进门", meta: "步入正厅", x: "31%", y: "46%", targetViewId: "yamen-hall", requires: [] },
          { id: "yamen-approach-desk", type: "navigate", label: "靠近案台", meta: "看调度簿册", x: "56%", y: "84%", targetViewId: "yamen-desk", requires: [] },
          { id: "yamen-step-sidehall", type: "navigate", label: "步入侧廊", meta: "看命令铜铃", x: "87%", y: "22%", targetViewId: "yamen-bell-view", requires: [] },
        ],
      },
      "yamen-hall": {
        id: "yamen-hall",
        sceneId: "yamen",
        label: "正厅",
        parentViewId: "yamen-courtyard",
        kicker: "制度",
        title: "正厅门内",
        summary: "跨过门槛之后，制度不再是抽象词语，而是把工程与海防真正压到现实里的一套组织方式。",
        objective: "查看厅中印信，把衙门的第一份档案收入柜中。",
        art: { sceneKey: "yamen", focusX: 34, focusY: 42, scale: 1.42 },
        actions: [
          { id: "yamen-collect-seal", type: "collect", label: "看印信", meta: "收入第一份档案", x: "46%", y: "58%", collectibleId: "yamen-seal", requires: ["yamen-enter-hall"] },
        ],
      },
      "yamen-desk": {
        id: "yamen-desk",
        sceneId: "yamen",
        label: "案台",
        parentViewId: "yamen-courtyard",
        kicker: "调度",
        title: "案台近景",
        summary: "从案头开始，图纸、采买、译书与造船被真正编成同一条可执行链路。",
        objective: "翻开案头簿册，把衙门里的第二份档案带走。",
        art: { sceneKey: "yamen", focusX: 55, focusY: 88, scale: 1.62 },
        actions: [
          { id: "yamen-collect-ledger", type: "collect", label: "翻簿册", meta: "查看衙门调度", x: "50%", y: "42%", collectibleId: "yamen-ledger", requires: ["yamen-approach-desk"] },
        ],
      },
      "yamen-bell-view": {
        id: "yamen-bell-view",
        sceneId: "yamen",
        label: "侧廊",
        parentViewId: "yamen-courtyard",
        kicker: "方向",
        title: "侧廊铜铃",
        summary: "命令最终要传到船坞、课堂与江面。船政并不以衙门为终点，而是从这里把方向推向更远处。",
        objective: "查看铜铃，让衙门的第三份档案归位。",
        art: { sceneKey: "yamen", focusX: 90, focusY: 24, scale: 1.58 },
        actions: [
          { id: "yamen-collect-bell", type: "collect", label: "看铜铃", meta: "记录命令方向", x: "70%", y: "48%", collectibleId: "yamen-bell", requires: ["yamen-step-sidehall"] },
        ],
      },
    },
    collectibles: [
      { id: "yamen-seal", label: "官印", tag: "制度", title: "船政印信", text: "印信不是装饰，它意味着工程、经费、师资与制造环节第一次被真正组织起来。船政之所以能运转，先要有一套被认可、能调度的制度框架。", stepHint: "先推门入厅，再查看印信。" },
      { id: "yamen-ledger", label: "簿册", tag: "调度", title: "往来簿册", text: "从译书、造船到采买，簿册把繁杂事务串成可执行的链条。它让船政从口号变成具体流程，让每一个命令都能找到下一站。", stepHint: "先靠近案台，再翻开簿册。" },
      { id: "yamen-bell", label: "令铃", tag: "方向", title: "调度铜铃", text: "一端连着衙门，一端连着江面。它提醒你，船政的目标从来不只在屋檐之下，而是要把组织能力推进到船坞、课堂与海防方向。", stepHint: "先进入侧廊，再查看铜铃。" },
    ],
  },
  academy: {
    id: "academy",
    short: "学堂",
    kicker: "育人",
    title: "船政学堂",
    mission: "在学堂里收齐三份档案，确认船政文化为什么始终和近代工程教育连在一起。",
    intro: {
      speaker: "学堂",
      title: "从讲堂里看见新学成形",
      text: "这里最重要的不是某一门课，而是知识、译书、制图与实践第一次被编进同一张课表。",
    },
    entryViewId: "academy-classroom",
    choices: [
      { id: "academy-study", label: "我记住的是新学如何进入课堂", text: "船政学堂的重要之处，在于它让近代中国第一次拥有了成体系的工程教育，不再只是零散地听说世界。", score: "study" },
      { id: "academy-craft", label: "我记住的是课堂如何接向工地", text: "这里的知识不是为了纸上漂亮，而是要把公式、测绘与图纸一直送到真正的制造现场。", score: "craft" },
      { id: "academy-voyage", label: "我记住的是语言如何打开海洋世界", text: "译书、外语与课程一起展开，让向海的眼光第一次不再隔着一层传闻，而是直接进入课堂与笔记。", score: "voyage" },
    ],
    viewpoints: {
      "academy-classroom": {
        id: "academy-classroom",
        sceneId: "academy",
        label: "讲堂",
        parentViewId: null,
        kicker: "育人",
        title: "船政学堂讲堂",
        summary: "钟声、长桌、制图板与书册摆在同一空间里，知识在这里第一次被编成工程秩序。",
        objective: "选择你要靠近的焦点：课钟、书架，或制图桌。",
        art: { sceneKey: "academy", focusX: 50, focusY: 50, scale: 1.04 },
        actions: [
          { id: "academy-step-bell", type: "navigate", label: "看课钟", meta: "靠近课堂节律", x: "50%", y: "18%", targetViewId: "academy-bell-view", requires: [] },
          { id: "academy-step-books", type: "navigate", label: "到书架", meta: "查看译书材料", x: "18%", y: "78%", targetViewId: "academy-books-view", requires: [] },
          { id: "academy-step-desk", type: "navigate", label: "近案台", meta: "查看制图桌", x: "84%", y: "76%", targetViewId: "academy-desk-view", requires: [] },
        ],
      },
      "academy-bell-view": {
        id: "academy-bell-view",
        sceneId: "academy",
        label: "课钟",
        parentViewId: "academy-classroom",
        kicker: "课程",
        title: "课堂钟声",
        summary: "钟声让课程拥有了稳定节律，也让新学不再是偶然出现的片段，而是持续发生的学习系统。",
        objective: "查看课钟，把学堂里关于课程秩序的线索归档。",
        art: { sceneKey: "academy", focusX: 50, focusY: 16, scale: 1.48 },
        actions: [
          { id: "academy-collect-bell", type: "collect", label: "记下课钟", meta: "归档课程节律", x: "50%", y: "48%", collectibleId: "academy-bell", requires: ["academy-step-bell"] },
        ],
      },
      "academy-books-view": {
        id: "academy-books-view",
        sceneId: "academy",
        label: "书架",
        parentViewId: "academy-classroom",
        kicker: "译书",
        title: "译书与教材",
        summary: "语言被翻译，知识也被翻译。船政学堂重要的地方之一，是它让世界知识不再隔着耳闻，而真正进入学习现场。",
        objective: "靠近书架，归档与译书相关的线索。",
        art: { sceneKey: "academy", focusX: 16, focusY: 80, scale: 1.56 },
        actions: [
          { id: "academy-collect-books", type: "collect", label: "翻看译书", meta: "归档语言入口", x: "54%", y: "46%", collectibleId: "academy-books", requires: ["academy-step-books"] },
        ],
      },
      "academy-desk-view": {
        id: "academy-desk-view",
        sceneId: "academy",
        label: "制图桌",
        parentViewId: "academy-classroom",
        kicker: "实学",
        title: "制图桌前",
        summary: "从图纸到操作，从课堂到工地，船政学堂最硬核的地方，在于它始终让抽象知识贴着现实问题。",
        objective: "查看制图桌，把学堂里的第三条线索收入柜中。",
        art: { sceneKey: "academy", focusX: 87, focusY: 76, scale: 1.58 },
        actions: [
          { id: "academy-collect-desk", type: "collect", label: "展开图纸", meta: "归档实学方法", x: "44%", y: "46%", collectibleId: "academy-desk", requires: ["academy-step-desk"] },
        ],
      },
    },
    collectibles: [
      { id: "academy-bell", label: "课钟", tag: "课程", title: "课钟余响", text: "钟声给课堂带来了可重复的秩序。它提醒我们，船政学堂的革新不只在内容，也在于它让新的学习方式拥有了节律与制度。", stepHint: "先靠近课钟，再记录它的节律。" },
      { id: "academy-books", label: "译书架", tag: "语言", title: "译书书架", text: "译书不是配角，而是新学真正进入课堂的桥。它让公式、工艺术语与世界知识第一次能被系统地转译、讲授与使用。", stepHint: "先走到书架，再翻看译书。" },
      { id: "academy-desk", label: "制图案", tag: "实学", title: "制图长桌", text: "从图纸到操作，从课堂到工地，制图桌体现的是一种始终贴着现实问题运转的工程教育方法。这也是船政文化最鲜明的延续之一。", stepHint: "先靠近制图桌，再展开图纸。" },
    ],
  },
  dock: {
    id: "dock",
    short: "船坞",
    kicker: "造物",
    title: "马尾船坞",
    mission: "在船坞里收齐三份档案，确认船政如何把图纸、材料与流程真正做成船。",
    intro: {
      speaker: "船坞",
      title: "这里负责把图纸做成现实",
      text: "从龙骨到轮机，再到下水，船坞代表的是一种把工程真正跑通的能力。",
    },
    entryViewId: "dock-overview",
    choices: [
      { id: "dock-craft", label: "我记住的是工艺如何被做成体系", text: "船坞最震撼人的地方，是它把材料、结构、流程与装配都纳进了可复制、可维护、可传授的制造体系。", score: "craft" },
      { id: "dock-study", label: "我记住的是知识如何落到船体上", text: "这里让课堂里的图纸与数据真正变成了能触摸、能检验、能运行的工程结果。", score: "study" },
      { id: "dock-voyage", label: "我记住的是一艘船如何指向更远处", text: "造船本身不是终点，真正重要的是通过制造能力，把探索与海防的方向推向更远海域。", score: "voyage" },
    ],
    viewpoints: {
      "dock-overview": {
        id: "dock-overview",
        sceneId: "dock",
        label: "船台",
        parentViewId: null,
        kicker: "造物",
        title: "马尾船坞船台",
        summary: "巨大的船体、湿雾与轨道压在眼前。这里不再谈抽象理想，而是谈龙骨、轮机和下水流程如何被真正完成。",
        objective: "靠近龙骨、机件区或下水位，进入更近的制造镜头。",
        art: { sceneKey: "dock", focusX: 50, focusY: 50, scale: 1.04 },
        actions: [
          { id: "dock-step-keel", type: "navigate", label: "上平台", meta: "看龙骨结构", x: "34%", y: "76%", targetViewId: "dock-keel-view", requires: [] },
          { id: "dock-step-engine", type: "navigate", label: "入机件区", meta: "看轮机部件", x: "56%", y: "82%", targetViewId: "dock-engine-view", requires: [] },
          { id: "dock-step-launch", type: "navigate", label: "到下水位", meta: "看流程节点", x: "82%", y: "68%", targetViewId: "dock-launch-view", requires: [] },
        ],
      },
      "dock-keel-view": {
        id: "dock-keel-view",
        sceneId: "dock",
        label: "龙骨平台",
        parentViewId: "dock-overview",
        kicker: "结构",
        title: "龙骨平台",
        summary: "龙骨是整艘船的骨架。船政让造船第一次拥有了成体系的工艺起点，而不只是分散手艺的拼接。",
        objective: "查看龙骨样段，把关于结构的档案带走。",
        art: { sceneKey: "dock", focusX: 36, focusY: 68, scale: 1.44 },
        actions: [
          { id: "dock-collect-keel", type: "collect", label: "看龙骨", meta: "归档结构样段", x: "54%", y: "46%", collectibleId: "dock-keel", requires: ["dock-step-keel"] },
        ],
      },
      "dock-engine-view": {
        id: "dock-engine-view",
        sceneId: "dock",
        label: "机件区",
        parentViewId: "dock-overview",
        kicker: "机械",
        title: "机件与装配",
        summary: "机械的价值不在于看上去先进，而在于它必须稳定、可装配、可维护，能够真正进入航行系统。",
        objective: "查看轮机部件，把第二份船坞档案收入柜中。",
        art: { sceneKey: "dock", focusX: 56, focusY: 86, scale: 1.5 },
        actions: [
          { id: "dock-collect-engine", type: "collect", label: "看轮机", meta: "归档机械部件", x: "48%", y: "46%", collectibleId: "dock-engine", requires: ["dock-step-engine"] },
        ],
      },
      "dock-launch-view": {
        id: "dock-launch-view",
        sceneId: "dock",
        label: "下水位",
        parentViewId: "dock-overview",
        kicker: "流程",
        title: "下水节点",
        summary: "真正的制造能力，不在某个零件上，而在于从结构、装配到试航的整条流程都能被稳定地推向终点。",
        objective: "查看下水节点，把船坞里的第三份档案带回。",
        art: { sceneKey: "dock", focusX: 80, focusY: 66, scale: 1.46 },
        actions: [
          { id: "dock-collect-launch", type: "collect", label: "看下水位", meta: "归档流程节点", x: "46%", y: "46%", collectibleId: "dock-launch", requires: ["dock-step-launch"] },
        ],
      },
    },
    collectibles: [
      { id: "dock-keel", label: "龙骨", tag: "结构", title: "龙骨样段", text: "龙骨决定了船体如何站起来。它象征的不是某个零件本身，而是船政把造船工艺第一次组织成可复制骨架的能力。", stepHint: "先上平台，再查看龙骨。" },
      { id: "dock-engine", label: "轮机", tag: "机械", title: "轮机部件", text: "轮机提醒你，近代制造的关键不在新奇，而在于它是否稳定、可装配、可维护。它必须真正进入一艘船的运行系统。", stepHint: "先进入机件区，再查看轮机。" },
      { id: "dock-launch", label: "下水位", tag: "流程", title: "下水节点", text: "从图纸到船体，再从船体到航行，船政真正留下的是一条能把理想稳定推进到现实终点的工艺流程。", stepHint: "先走到下水位，再记录流程节点。" },
    ],
  },
  tower: {
    id: "tower",
    short: "罗星塔",
    kicker: "远望",
    title: "罗星塔",
    mission: "在罗星塔完成三份归档，确认船政为什么始终与测绘、航向和向海目光联系在一起。",
    intro: {
      speaker: "江口",
      title: "向海的镜头在这里升高",
      text: "塔下不是风景页，而是观测、测绘与判断方向的空间。你需要进入塔的内景与观测位，才能把线索拿到手。",
    },
    entryViewId: "tower-shore",
    choices: [
      { id: "tower-voyage", label: "我记住的是船政如何重新校准目光", text: "罗星塔让你看到，向海不是情绪，而是一种不断测位、不断判断方向的能力。", score: "voyage" },
      { id: "tower-study", label: "我记住的是测绘如何成为知识支点", text: "塔下的图表、观测与望具，把抽象的空间感变成了可记录、可推算、可教学的知识体系。", score: "study" },
      { id: "tower-craft", label: "我记住的是导航同样是一种工程", text: "航向并不是凭感觉完成的。灯、图与望具构成的是另一套严密的工程方法，它同样要求稳定、准确和持续校准。", score: "craft" },
    ],
    viewpoints: {
      "tower-shore": {
        id: "tower-shore",
        sceneId: "tower",
        label: "塔下",
        parentViewId: null,
        kicker: "远望",
        title: "罗星塔与江口",
        summary: "灯、图与望远镜把视线拉向更远处。这里不是停留观看的地方，而是不断校准方向的前哨。",
        objective: "靠近航灯、图表或望具，进入更近的观测镜头。",
        art: { sceneKey: "tower", focusX: 50, focusY: 50, scale: 1.04 },
        actions: [
          { id: "tower-step-light", type: "navigate", label: "靠近航灯", meta: "进入塔下灯位", x: "14%", y: "60%", targetViewId: "tower-light-view", requires: [] },
          { id: "tower-step-chart", type: "navigate", label: "摊开图表", meta: "查看测位图", x: "24%", y: "84%", targetViewId: "tower-chart-view", requires: [] },
          { id: "tower-step-watch", type: "navigate", label: "走到望具旁", meta: "查看观测位", x: "88%", y: "60%", targetViewId: "tower-watch-view", requires: [] },
        ],
      },
      "tower-light-view": {
        id: "tower-light-view",
        sceneId: "tower",
        label: "灯位",
        parentViewId: "tower-shore",
        kicker: "航向",
        title: "塔下航灯",
        summary: "航灯不是景物，而是一套帮助船只与海岸重新确认彼此位置的人工信号。船政的向海能力，离不开这种持续校准。",
        objective: "记录航灯，把罗星塔里的第一份档案收入柜中。",
        art: { sceneKey: "tower", focusX: 14, focusY: 60, scale: 1.54 },
        actions: [
          { id: "tower-collect-light", type: "collect", label: "记航灯", meta: "归档方向信号", x: "56%", y: "44%", collectibleId: "tower-light", requires: ["tower-step-light"] },
        ],
      },
      "tower-chart-view": {
        id: "tower-chart-view",
        sceneId: "tower",
        label: "图表",
        parentViewId: "tower-shore",
        kicker: "测绘",
        title: "测位图表",
        summary: "图表让空间、海流与角度可以被记录和推算。向海的目光之所以可靠，是因为它被画进了可以复用的知识结构中。",
        objective: "查看图表，把第二份罗星塔档案归档。",
        art: { sceneKey: "tower", focusX: 24, focusY: 84, scale: 1.6 },
        actions: [
          { id: "tower-collect-chart", type: "collect", label: "看图表", meta: "归档测绘逻辑", x: "58%", y: "42%", collectibleId: "tower-chart", requires: ["tower-step-chart"] },
        ],
      },
      "tower-watch-view": {
        id: "tower-watch-view",
        sceneId: "tower",
        label: "望具",
        parentViewId: "tower-shore",
        kicker: "观测",
        title: "观测位",
        summary: "望具并不神秘，它只是在提醒你：向海不是浪漫口号，而是一种反复确认距离、方向与位置的实际能力。",
        objective: "查看望具，把罗星塔里的第三份档案收好。",
        art: { sceneKey: "tower", focusX: 87, focusY: 58, scale: 1.52 },
        actions: [
          { id: "tower-collect-watch", type: "collect", label: "看望具", meta: "归档观测能力", x: "38%", y: "46%", collectibleId: "tower-watch", requires: ["tower-step-watch"] },
        ],
      },
    },
    collectibles: [
      { id: "tower-light", label: "航灯", tag: "方向", title: "塔下航灯", text: "航灯意味着海上的位置关系可以被人造信号持续校准。它说明船政文化并不只关心制造，还关心如何安全、准确地面向海洋。", stepHint: "先靠近航灯，再记录信号。" },
      { id: "tower-chart", label: "图表", tag: "测绘", title: "测位图表", text: "图表让海域、方位与航线进入可记录、可推算、可传授的知识结构。它把向海从经验感受推进到可复用的方法。", stepHint: "先摊开图表，再查看测位逻辑。" },
      { id: "tower-watch", label: "望具", tag: "观测", title: "观测望具", text: "望具让远处不再只是模糊背景，而成为可以被反复确认的目标。它象征的是一种不断测量、不断修正的向海工程能力。", stepHint: "先走到观测位，再查看望具。" },
    ],
  },
  archive: {
    id: "archive",
    short: "归档室",
    kicker: "归档",
    title: "船政归档室",
    mission: "在归档室完成最后三份线索，把整个夜访拼成总图，再为船政留下你的结论。",
    intro: {
      speaker: "归档室",
      title: "最后的房间负责把碎片拼成总图",
      text: "这里不再寻找某个单一物件，而是要打开抽屉、展开卷宗、掀起模型罩，让这场夜访真正完成闭环。",
    },
    entryViewId: "archive-overview",
    choices: [
      { id: "archive-craft", label: "我归档出的，是一套能把想法做成现实的工程方法", text: "从衙门到船坞，再到归档室，你最终看见的是一种把组织、知识与制造推向现实的能力。", score: "craft" },
      { id: "archive-study", label: "我归档出的，是一套能把新知接入现实的学习方法", text: "从学堂到归档室，这场夜访最终证明，船政留下的不只是遗迹，更是一整套进入现代的认知结构。", score: "study" },
      { id: "archive-voyage", label: "我归档出的，是一条始终向海而生的视线", text: "从罗星塔到总图模型，最终被保留下来的，是一种不断向外、不断远望的方向感。", score: "voyage" },
    ],
    viewpoints: {
      "archive-overview": {
        id: "archive-overview",
        sceneId: "archive",
        label: "总览",
        parentViewId: null,
        kicker: "归档",
        title: "船政归档室",
        summary: "灯光落在展台、抽屉与模型上。这里不再是寻找新的地点，而是把前面所有地点串成能被解释的总图。",
        objective: "打开抽屉、展开卷宗或掀起模型罩，把最后三份档案补齐。",
        art: { sceneKey: "archive", focusX: 50, focusY: 50, scale: 1.04 },
        actions: [
          { id: "archive-step-map", type: "navigate", label: "开抽屉", meta: "查看旧图", x: "57%", y: "28%", targetViewId: "archive-map-view", requires: [] },
          { id: "archive-step-roll", type: "navigate", label: "展开卷宗", meta: "查看长卷", x: "25%", y: "26%", targetViewId: "archive-roll-view", requires: [] },
          { id: "archive-step-model", type: "navigate", label: "掀模型罩", meta: "查看总图模型", x: "86%", y: "26%", targetViewId: "archive-model-view", requires: [] },
        ],
      },
      "archive-map-view": {
        id: "archive-map-view",
        sceneId: "archive",
        label: "抽屉旧图",
        parentViewId: "archive-overview",
        kicker: "旧图",
        title: "抽屉旧图",
        summary: "旧图告诉你，这一整套工程如何在空间里被放置、扩张和持续修正。它是总图的底板，也是归档室的第一把钥匙。",
        objective: "查看旧图，把归档室的第一份档案收入柜中。",
        art: { sceneKey: "archive", focusX: 58, focusY: 28, scale: 1.54 },
        actions: [
          { id: "archive-collect-map", type: "collect", label: "看旧图", meta: "归档空间底板", x: "50%", y: "52%", collectibleId: "archive-map", requires: ["archive-step-map"] },
        ],
      },
      "archive-roll-view": {
        id: "archive-roll-view",
        sceneId: "archive",
        label: "卷宗长卷",
        parentViewId: "archive-overview",
        kicker: "卷宗",
        title: "卷宗长卷",
        summary: "长卷让事件、时间与空间可以被同时看见。归档不是简单收藏，而是把零散证据重新编成可解释的叙事。",
        objective: "展开长卷，把第二份归档室线索归位。",
        art: { sceneKey: "archive", focusX: 24, focusY: 24, scale: 1.58 },
        actions: [
          { id: "archive-collect-roll", type: "collect", label: "看长卷", meta: "归档时间线索", x: "54%", y: "46%", collectibleId: "archive-roll", requires: ["archive-step-roll"] },
        ],
      },
      "archive-model-view": {
        id: "archive-model-view",
        sceneId: "archive",
        label: "模型台",
        parentViewId: "archive-overview",
        kicker: "总图",
        title: "总图模型",
        summary: "模型不是一件漂亮展示品，它是在提醒你：船政留下的，不是单一地点，而是一整套仍能被重新理解、重新接续的方法。",
        objective: "查看模型，把最后一份档案收入柜中。",
        art: { sceneKey: "archive", focusX: 88, focusY: 28, scale: 1.58 },
        actions: [
          { id: "archive-collect-model", type: "collect", label: "看模型", meta: "归档总图意识", x: "42%", y: "46%", collectibleId: "archive-model", requires: ["archive-step-model"] },
        ],
      },
    },
    collectibles: [
      { id: "archive-map", label: "旧图", tag: "空间", title: "旧图底板", text: "旧图提醒你，船政从来不是一座孤立建筑，而是一整套在空间中不断扩张、连接与调整的工程系统。", stepHint: "先打开抽屉，再查看旧图。" },
      { id: "archive-roll", label: "长卷", tag: "时间", title: "卷宗长卷", text: "长卷让不同时间层层叠加，也让这场夜访不再只是看点位，而是看船政如何在时间里持续改变近代中国面对世界的方式。", stepHint: "先展开卷宗，再查看长卷。" },
      { id: "archive-model", label: "模型", tag: "总图", title: "总图模型", text: "模型把整场夜访拼成一张总图：制度、学习、制造与向海，并非彼此分离，而是船政文化得以成立的四条同心线。", stepHint: "先掀开模型罩，再查看总图模型。" },
    ],
  },
};

const bootScreen = document.getElementById("boot-screen");
const startGameButton = document.getElementById("start-game");
const continueGameButton = document.getElementById("continue-game");
const archiveCountNode = document.getElementById("archive-count");
const unlockCountNode = document.getElementById("unlock-count");
const mapButton = document.getElementById("map-button");
const archiveButton = document.getElementById("archive-button");
const resetButton = document.getElementById("reset-button");
const stageNode = document.getElementById("scene-stage");
const consolePanel = document.querySelector(".console-panel");
const backButton = document.getElementById("view-back");
const stagePathNode = document.getElementById("stage-path");
const stageProgressNode = document.getElementById("stage-progress");
const artworkNode = document.getElementById("scene-artwork");
const actionsNode = document.getElementById("scene-actions");
const sceneKickerNode = document.getElementById("scene-kicker");
const sceneTitleNode = document.getElementById("scene-title");
const sceneSummaryNode = document.getElementById("scene-summary");
const sceneObjectiveNode = document.getElementById("scene-objective");
const panelTabButtons = Array.from(document.querySelectorAll("[data-panel-tab]"));
const panelViews = Array.from(document.querySelectorAll("[data-panel-view]"));
const storySpeakerNode = document.getElementById("story-speaker");
const storyTitleNode = document.getElementById("story-title");
const storyTextNode = document.getElementById("story-text");
const missionTitleNode = document.getElementById("mission-title");
const missionTextNode = document.getElementById("mission-text");
const checklistNode = document.getElementById("scene-checklist");
const choiceKickerNode = document.getElementById("choice-kicker");
const choiceHintNode = document.getElementById("choice-hint");
const choiceListNode = document.getElementById("choice-list");
const scoreCraftNode = document.getElementById("score-craft");
const scoreStudyNode = document.getElementById("score-study");
const scoreVoyageNode = document.getElementById("score-voyage");
const archiveDialogSceneNode = document.getElementById("archive-dialog-scene");
const archiveDialogTitleNode = document.getElementById("archive-dialog-title");
const archiveDialogProgressNode = document.getElementById("archive-dialog-progress");
const archiveDialogArtNode = document.getElementById("archive-dialog-art");
const archiveDialogTagNode = document.getElementById("archive-dialog-tag");
const archiveDialogTextNode = document.getElementById("archive-dialog-text");
const archiveDialogHintNode = document.getElementById("archive-dialog-hint");
const archiveDialogContinueButton = document.getElementById("archive-dialog-continue");
const archiveDialogOpenButton = document.getElementById("archive-dialog-open");
const mapDrawer = document.getElementById("map-drawer");
const mapClose = document.getElementById("map-close");
const mapCloseButton = document.getElementById("map-close-button");
const mapNodes = Array.from(document.querySelectorAll(".map-node"));
const routePaths = Array.from(document.querySelectorAll("[data-route]"));
const archiveDrawer = document.getElementById("archive-drawer");
const archiveClose = document.getElementById("archive-close");
const archiveCloseButton = document.getElementById("archive-close-button");
const archiveGridNode = document.getElementById("archive-grid");
const archiveDetailSceneNode = document.getElementById("archive-detail-scene");
const archiveDetailArtNode = document.getElementById("archive-detail-art");
const archiveDetailTitleNode = document.getElementById("archive-detail-title");
const archiveDetailTextNode = document.getElementById("archive-detail-text");
const relicModal = document.getElementById("relic-modal");
const relicClose = document.getElementById("relic-close");
const relicCancel = document.getElementById("relic-cancel");
const relicConfirm = document.getElementById("relic-confirm");
const relicSceneNode = document.getElementById("relic-scene");
const relicPlateNode = document.getElementById("relic-plate");
const relicTitleNode = document.getElementById("relic-title");
const relicTagNode = document.getElementById("relic-tag");
const relicTextNode = document.getElementById("relic-text");
const relicProgressNode = document.getElementById("relic-progress");
const endingScreen = document.getElementById("ending-screen");
const endingTitleNode = document.getElementById("ending-title");
const endingTextNode = document.getElementById("ending-text");
const endingArchivesNode = document.getElementById("ending-archives");
const endingThemesNode = document.getElementById("ending-themes");
const endingBonusNode = document.getElementById("ending-bonus");
const endingRestartButton = document.getElementById("ending-restart");
const endingCloseButton = document.getElementById("ending-close");
const toastNode = document.getElementById("toast");

const viewIndex = {};
const archiveIndex = {};
const actionIndex = {};
const orderedArchives = [];
const sceneChoiceIndex = {};

SCENE_ORDER.forEach((sceneId) => {
  const scene = scenes[sceneId];
  sceneChoiceIndex[sceneId] = {};
  scene.choices.forEach((choice) => {
    sceneChoiceIndex[sceneId][choice.id] = choice;
  });
  Object.values(scene.viewpoints).forEach((view) => {
    viewIndex[view.id] = { ...view, sceneId };
    view.actions.forEach((action) => {
      actionIndex[action.id] = { ...action, sceneId, viewId: view.id };
    });
  });
  scene.collectibles.forEach((collectible) => {
    const entry = { ...collectible, sceneId, sceneTitle: scene.title, sceneShort: scene.short };
    archiveIndex[collectible.id] = entry;
    orderedArchives.push(entry);
  });
});

let state;
let activePanel = "story";
let archiveDialogueId = null;
let pendingRelicId = null;
let pendingActionId = null;
let selectedArchiveId = null;
let toastTimer = null;

function createInitialState() {
  const sceneProgress = {};
  SCENE_ORDER.forEach((sceneId) => {
    sceneProgress[sceneId] = { actionsCompleted: [], collectiblesFound: [] };
  });
  return {
    started: false,
    currentScene: SCENE_ORDER[0],
    currentViewpoint: scenes[SCENE_ORDER[0]].entryViewId,
    unlockedScenes: [SCENE_ORDER[0]],
    collectedArchives: [],
    sceneChoices: {},
    sceneProgress,
    themeScores: { craft: 0, study: 0, voyage: 0 },
  };
}

function uniqueValidIds(values, whitelist) {
  return Array.from(new Set((Array.isArray(values) ? values : []).filter((value) => whitelist.has(value))));
}

function normalizeState(raw) {
  const base = createInitialState();
  if (!raw || typeof raw !== "object") {
    return base;
  }

  const normalized = {
    ...base,
    started: Boolean(raw.started),
    unlockedScenes: uniqueValidIds(raw.unlockedScenes, new Set(SCENE_ORDER)),
    collectedArchives: uniqueValidIds(raw.collectedArchives, new Set(orderedArchives.map((item) => item.id))),
    sceneChoices: {},
    sceneProgress: {},
    themeScores: { ...base.themeScores },
  };

  if (!normalized.unlockedScenes.length) {
    normalized.unlockedScenes = [SCENE_ORDER[0]];
  }

  SCENE_ORDER.forEach((sceneId) => {
    const progress = raw.sceneProgress?.[sceneId] || {};
    const actionIds = new Set(
      Object.values(scenes[sceneId].viewpoints)
        .flatMap((view) => view.actions.map((action) => action.id)),
    );
    const collectibleIds = new Set(scenes[sceneId].collectibles.map((item) => item.id));
    normalized.sceneProgress[sceneId] = {
      actionsCompleted: uniqueValidIds(progress.actionsCompleted, actionIds),
      collectiblesFound: uniqueValidIds(progress.collectiblesFound, collectibleIds),
    };
  });

  Object.entries(raw.sceneChoices || {}).forEach(([sceneId, choiceId]) => {
    if (sceneChoiceIndex[sceneId]?.[choiceId]) {
      normalized.sceneChoices[sceneId] = choiceId;
    }
  });

  Object.keys(normalized.themeScores).forEach((key) => {
    const value = Number(raw.themeScores?.[key]);
    normalized.themeScores[key] = Number.isFinite(value) && value >= 0 ? value : 0;
  });

  normalized.currentScene = SCENE_ORDER.includes(raw.currentScene) ? raw.currentScene : normalized.unlockedScenes[0];
  if (!normalized.unlockedScenes.includes(normalized.currentScene)) {
    normalized.currentScene = normalized.unlockedScenes[0];
  }

  const fallbackView = scenes[normalized.currentScene].entryViewId;
  const activeView = viewIndex[raw.currentViewpoint];
  normalized.currentViewpoint =
    activeView && activeView.sceneId === normalized.currentScene ? activeView.id : fallbackView;

  return normalized;
}

function persistState() {
  if (previewMode) {
    return;
  }
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (error) {
    // Storage can be blocked in some browser privacy modes; gameplay should still continue.
  }
}

function loadSavedState() {
  try {
    return normalizeState(JSON.parse(window.localStorage.getItem(SAVE_KEY)));
  } catch (error) {
    return createInitialState();
  }
}

function getScene(sceneId = state.currentScene) {
  return scenes[sceneId];
}

function getView(viewId = state.currentViewpoint) {
  return viewIndex[viewId];
}

function getSceneProgress(sceneId = state.currentScene) {
  return state.sceneProgress[sceneId];
}

function collectedCount() {
  return state.collectedArchives.length;
}

function isSceneUnlocked(sceneId) {
  return state.unlockedScenes.includes(sceneId);
}

function isSceneCompleted(sceneId) {
  return Boolean(state.sceneChoices[sceneId]);
}

function isArchiveCollected(archiveId) {
  return state.collectedArchives.includes(archiveId);
}

function isActionDone(actionId) {
  const action = actionIndex[actionId];
  return action ? getSceneProgress(action.sceneId).actionsCompleted.includes(actionId) : false;
}

function canRunAction(action) {
  return (action.requires || []).every((requiredId) => isActionDone(requiredId));
}

function markActionDone(sceneId, actionId) {
  const progress = getSceneProgress(sceneId);
  if (!progress.actionsCompleted.includes(actionId)) {
    progress.actionsCompleted = [...progress.actionsCompleted, actionId];
  }
}

function getViewPath(viewId) {
  const chain = [];
  let pointer = viewIndex[viewId];
  while (pointer) {
    chain.unshift(pointer);
    pointer = pointer.parentViewId ? viewIndex[pointer.parentViewId] : null;
  }
  return chain;
}

function routeKeyToScenes(routeKey) {
  return routeKey.split("-");
}

function clearBootParams() {
  if (previewMode) {
    return;
  }
  const url = new URL(window.location.href);
  const changed =
    url.searchParams.delete("play") ||
    url.searchParams.delete("resume") ||
    url.searchParams.delete("v");
  if (changed) {
    const query = url.searchParams.toString();
    const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }
}

function setPanel(panelName) {
  activePanel = panelName;
  if (consolePanel) {
    consolePanel.classList.toggle("is-archive-dialogue", panelName === "archive-dialog");
  }
  if (panelName !== "archive-dialog") {
    archiveDialogueId = null;
  }
  panelTabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panelTab === panelName);
  });
  panelViews.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panelView === panelName);
  });
}

function getRecommendedPanel(sceneId = state.currentScene) {
  const progress = getSceneProgress(sceneId);
  if (progress.collectiblesFound.length === scenes[sceneId].collectibles.length && !state.sceneChoices[sceneId]) {
    return "choices";
  }
  if (progress.collectiblesFound.length > 0) {
    return "checklist";
  }
  return "story";
}

function openMapDrawer() {
  mapDrawer.setAttribute("aria-hidden", "false");
}

function closeMapDrawer() {
  mapDrawer.setAttribute("aria-hidden", "true");
}

function openArchiveDrawer(archiveId = null) {
  if (archiveId && isArchiveCollected(archiveId)) {
    selectedArchiveId = archiveId;
  } else if (!selectedArchiveId || !isArchiveCollected(selectedArchiveId)) {
    selectedArchiveId = state.collectedArchives[state.collectedArchives.length - 1] || null;
  }
  archiveDrawer.setAttribute("aria-hidden", "false");
  renderArchiveDrawer();
}

function closeArchiveDrawer() {
  archiveDrawer.setAttribute("aria-hidden", "true");
}

function getArchiveDialogueHint(sceneId) {
  const progress = getSceneProgress(sceneId);
  if (progress.collectiblesFound.length === scenes[sceneId].collectibles.length) {
    return "这一处地点的线索已经收齐。继续进入归档判断，或打开档案柜回看刚刚完成的归位。";
  }
  return "这份线索已经完成归档。继续夜访当前地点，或打开档案柜查看它在整套船政档案中的位置。";
}

function openArchiveDialogue(archiveId) {
  if (!archiveIndex[archiveId]) {
    return;
  }
  archiveDialogueId = archiveId;
  activePanel = "archive-dialog";
  renderAll();
}

function closeArchiveDialogue() {
  if (!archiveDialogueId && activePanel !== "archive-dialog") {
    return;
  }
  const sceneId = archiveDialogueId ? archiveIndex[archiveDialogueId].sceneId : state.currentScene;
  archiveDialogueId = null;
  activePanel = getRecommendedPanel(sceneId);
  renderAll();
}

function openRelicModal() {
  relicModal.hidden = true;
}

function closeRelicModal() {
  relicModal.hidden = true;
}

function showToast(message) {
  toastNode.textContent = message;
  toastNode.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastNode.classList.remove("is-visible");
  }, 2200);
}

function renderArtifact(archiveId) {
  const src = artifactImages[archiveId];
  const entry = archiveIndex[archiveId];
  return src
    ? `<div class="artifact-photo"><img src="${src}" alt="${entry.title}"></div>`
    : `<div class="artifact-photo artifact-photo--fallback"></div>`;
}

function renderStageArtwork(view) {
  const src = sceneImages[view.art.sceneKey];
  artworkNode.innerHTML = src
    ? `
      <div class="scene-stage__image-shell">
        <img
          class="scene-stage__image"
          src="${src}"
          alt="${view.title}"
          style="--focus-x: ${view.art.focusX}%; --focus-y: ${view.art.focusY}%; --scale: ${view.art.scale};"
        >
        <div class="scene-stage__image-vignette"></div>
        <div class="scene-stage__image-grid"></div>
      </div>
    `
    : `<div class="scene-stage__image-shell"></div>`;
}

function renderActionButton(action) {
  const isCollectedAction = action.type === "collect";
  const alreadyCollected = isCollectedAction && isArchiveCollected(action.collectibleId);
  const done = isActionDone(action.id) || alreadyCollected;
  const locked = !done && !canRunAction(action);
  return `
    <button
      class="scene-action scene-action--${action.type} ${done ? "is-done" : ""}"
      data-action-id="${action.id}"
      type="button"
      style="left: ${action.x}; top: ${action.y};"
      ${locked ? "disabled" : ""}
    >
      <span class="scene-action__dot" aria-hidden="true"></span>
      <span class="scene-action__label">${action.label}</span>
      <span class="scene-action__meta">${alreadyCollected ? "已归档，可再次查看" : action.meta}</span>
    </button>
  `;
}

function renderStage() {
  const scene = getScene();
  const view = getView();
  stageNode.dataset.scene = scene.id;
  renderStageArtwork(view);
  actionsNode.innerHTML = view.actions.map(renderActionButton).join("");
  const path = getViewPath(view.id).map((item) => item.label);
  stagePathNode.textContent = `${scene.short} / ${path.join(" / ")}`;
  stageProgressNode.textContent = `当前地点 ${getSceneProgress(scene.id).collectiblesFound.length} / ${scene.collectibles.length}`;
  backButton.hidden = !view.parentViewId;
  sceneKickerNode.textContent = view.kicker;
  sceneTitleNode.textContent = view.title;
  sceneSummaryNode.textContent = view.summary;
  sceneObjectiveNode.textContent = view.objective;
}

function renderStoryPanel() {
  const scene = getScene();
  const view = getView();
  storySpeakerNode.textContent = view.parentViewId ? view.kicker : scene.intro.speaker;
  storyTitleNode.textContent = view.parentViewId ? view.title : scene.intro.title;
  storyTextNode.textContent = view.parentViewId ? view.summary : scene.intro.text;
  missionTitleNode.textContent = scene.title;
  missionTextNode.textContent = view.objective || scene.mission;
}

function renderChecklist() {
  const scene = getScene();
  const progress = getSceneProgress(scene.id);
  checklistNode.innerHTML = scene.collectibles
    .map((item) => {
      const collected = progress.collectiblesFound.includes(item.id);
      return `
        <li class="checklist__item ${collected ? "is-collected" : ""}">
          <span class="checklist__dot" aria-hidden="true"></span>
          <div>
            <strong class="checklist__title">${item.label}</strong>
            <span class="checklist__meta">${collected ? item.title : item.stepHint}</span>
          </div>
          <span class="checklist__state">${collected ? "已归档" : "待发现"}</span>
        </li>
      `;
    })
    .join("");

  const maxScore = Math.max(1, ...Object.values(state.themeScores));
  scoreCraftNode.style.width = `${(state.themeScores.craft / maxScore) * 100}%`;
  scoreStudyNode.style.width = `${(state.themeScores.study / maxScore) * 100}%`;
  scoreVoyageNode.style.width = `${(state.themeScores.voyage / maxScore) * 100}%`;
}

function renderChoices() {
  const scene = getScene();
  const ready = getSceneProgress(scene.id).collectiblesFound.length === scene.collectibles.length;
  const selectedChoiceId = state.sceneChoices[scene.id];
  choiceKickerNode.textContent = selectedChoiceId ? "归档完成" : "归档判断";
  choiceHintNode.textContent = selectedChoiceId
    ? "这就是你为这个地点留下的解释。继续前往下一处，或回看已经收集的档案。"
    : ready
      ? "三份档案已经齐全。现在选择你想保留的理解方式。"
      : "先收齐当前地点的三份档案，再完成归档判断。";

  choiceListNode.innerHTML = scene.choices
    .map((choice) => {
      const selected = selectedChoiceId === choice.id;
      return `
        <article class="choice-card ${selected ? "is-selected" : ""}">
          <h3>${choice.label}</h3>
          <p>${choice.text}</p>
          <button
            class="button button--ghost choice-card__button"
            data-choice-id="${choice.id}"
            type="button"
            ${!ready || Boolean(selectedChoiceId) ? "disabled" : ""}
          >
            ${selected ? "已归档" : "将它归入这一线"}
          </button>
        </article>
      `;
    })
    .join("");
}

function renderMap() {
  const currentScene = getScene();
  mapNodes.forEach((node) => {
    const sceneId = node.dataset.sceneTarget;
    const progress = getSceneProgress(sceneId);
    const stateNode = node.querySelector(".map-node__state");
    const countNode = node.querySelector(".map-node__count");
    node.classList.toggle("is-active", sceneId === currentScene.id);
    node.classList.toggle("is-complete", isSceneCompleted(sceneId));
    node.classList.toggle("is-locked", !isSceneUnlocked(sceneId));
    stateNode.textContent = isSceneCompleted(sceneId)
      ? "已归档"
      : isSceneUnlocked(sceneId)
        ? progress.collectiblesFound.length
          ? "探索中"
          : "已开启"
        : "未解锁";
    countNode.textContent = `${progress.collectiblesFound.length} / ${scenes[sceneId].collectibles.length}`;
  });

  routePaths.forEach((pathNode) => {
    const [fromScene, toScene] = routeKeyToScenes(pathNode.dataset.route);
    pathNode.classList.toggle("is-active", isSceneUnlocked(toScene));
    pathNode.classList.toggle("is-complete", isSceneCompleted(fromScene));
  });
}

function renderArchiveDrawer() {
  archiveGridNode.innerHTML = orderedArchives
    .map((item) => {
      const collected = isArchiveCollected(item.id);
      const active = selectedArchiveId === item.id && collected;
      return `
        <button
          class="archive-card ${collected ? "" : "is-locked"} ${active ? "is-active" : ""}"
          data-archive-id="${item.id}"
          type="button"
          ${collected ? "" : "disabled"}
        >
          <div class="archive-card__art">${renderArtifact(item.id)}</div>
          <strong class="archive-card__title">${item.label}</strong>
          <span class="archive-card__meta">${collected ? item.title : "尚未归档"}</span>
        </button>
      `;
    })
    .join("");

  const detail = selectedArchiveId && isArchiveCollected(selectedArchiveId) ? archiveIndex[selectedArchiveId] : null;
  if (!detail) {
    archiveDetailSceneNode.textContent = "等待选取";
    archiveDetailArtNode.innerHTML = "";
    archiveDetailTitleNode.textContent = "尚未展开档案";
    archiveDetailTextNode.textContent = "点击已经归档的卡片，查看这份线索在船政文化中的位置。";
    return;
  }

  archiveDetailSceneNode.textContent = `${detail.sceneShort} / ${detail.tag}`;
  archiveDetailArtNode.innerHTML = renderArtifact(detail.id);
  archiveDetailTitleNode.textContent = detail.title;
  archiveDetailTextNode.textContent = detail.text;
}

function renderRelicModal() {
  if (!pendingRelicId) {
    return;
  }
  const item = archiveIndex[pendingRelicId];
  const progress = getSceneProgress(item.sceneId);
  relicSceneNode.textContent = `${item.sceneShort} / 线索揭示`;
  relicPlateNode.innerHTML = renderArtifact(item.id);
  relicTitleNode.textContent = item.title;
  relicTagNode.textContent = item.tag;
  relicTextNode.textContent = item.text;
  relicProgressNode.textContent = `当前地点 ${progress.collectiblesFound.length} / ${scenes[item.sceneId].collectibles.length}`;
}

function renderArchiveDialogue() {
  if (!archiveDialogueId) {
    return;
  }
  const item = archiveIndex[archiveDialogueId];
  if (!item) {
    return;
  }
  const progress = getSceneProgress(item.sceneId);
  archiveDialogSceneNode.textContent = `${item.sceneShort} / 已归档`;
  archiveDialogTitleNode.textContent = item.title;
  archiveDialogProgressNode.textContent = `当前地点 ${progress.collectiblesFound.length} / ${scenes[item.sceneId].collectibles.length}`;
  archiveDialogArtNode.innerHTML = renderArtifact(item.id);
  archiveDialogTagNode.textContent = item.tag;
  archiveDialogTextNode.textContent = item.text;
  archiveDialogHintNode.textContent = getArchiveDialogueHint(item.sceneId);
}

function getPrimaryEndingKey() {
  return Object.entries(state.themeScores).sort((left, right) => right[1] - left[1])[0]?.[0] || "craft";
}

function renderEnding() {
  const endingKey = getPrimaryEndingKey();
  const ending = endingText[endingKey];
  endingTitleNode.textContent = ending.title;
  endingTextNode.textContent = ending.text;
  endingArchivesNode.textContent = `档案 ${collectedCount()} / ${orderedArchives.length}`;
  endingThemesNode.textContent = `倾向：${THEME_LABELS[endingKey]}`;
  const hasBonus = collectedCount() === orderedArchives.length;
  endingBonusNode.hidden = !hasBonus;
  endingBonusNode.textContent = hasBonus
    ? "隐藏总图已显影：你看到的不是单一旧址，而是制度、学习、制造与向海共同拼出的完整船政。"
    : "";
}

function renderHeader() {
  archiveCountNode.textContent = `${collectedCount()} / ${orderedArchives.length}`;
  unlockCountNode.textContent = `${state.unlockedScenes.length} / ${SCENE_ORDER.length}`;
}

function renderPanels() {
  renderStoryPanel();
  renderChecklist();
  renderChoices();
  renderArchiveDialogue();
  setPanel(activePanel);
}

function renderAll() {
  renderHeader();
  renderStage();
  renderPanels();
  renderMap();
  renderArchiveDrawer();
  if (!endingScreen.hidden) {
    renderEnding();
  }
}

function goToScene(sceneId, options = {}) {
  if (!isSceneUnlocked(sceneId)) {
    showToast("这个地点还没有被点亮。");
    return;
  }
  state.currentScene = sceneId;
  state.currentViewpoint = options.viewId && viewIndex[options.viewId]?.sceneId === sceneId
    ? options.viewId
    : scenes[sceneId].entryViewId;
  archiveDialogueId = null;
  activePanel = getRecommendedPanel(sceneId);
  closeMapDrawer();
  persistState();
  renderAll();
}

function goToView(viewId) {
  const view = viewIndex[viewId];
  if (!view) {
    return;
  }
  state.currentScene = view.sceneId;
  state.currentViewpoint = view.id;
  archiveDialogueId = null;
  activePanel = "story";
  persistState();
  renderAll();
}

function collectArchive(archiveId, actionId) {
  const item = archiveIndex[archiveId];
  if (!item) {
    return;
  }

  markActionDone(item.sceneId, actionId);
  const progress = getSceneProgress(item.sceneId);
  if (!progress.collectiblesFound.includes(archiveId)) {
    progress.collectiblesFound = [...progress.collectiblesFound, archiveId];
  }
  if (!state.collectedArchives.includes(archiveId)) {
    state.collectedArchives = [...state.collectedArchives, archiveId];
  }

  selectedArchiveId = archiveId;
  closeRelicModal();
  archiveDialogueId = archiveId;
  activePanel = "archive-dialog";
  persistState();
  renderAll();
  showToast(`${item.title} 已收入档案柜`);
}

function completeScene(choiceId) {
  const scene = getScene();
  if (state.sceneChoices[scene.id]) {
    return;
  }
  const choice = sceneChoiceIndex[scene.id][choiceId];
  if (!choice) {
    return;
  }

  state.sceneChoices[scene.id] = choiceId;
  state.themeScores[choice.score] += 1;
  persistState();
  renderAll();

  const currentIndex = SCENE_ORDER.indexOf(scene.id);
  const nextSceneId = SCENE_ORDER[currentIndex + 1];
  if (nextSceneId) {
    if (!state.unlockedScenes.includes(nextSceneId)) {
      state.unlockedScenes = [...state.unlockedScenes, nextSceneId];
    }
    showToast(`${scenes[nextSceneId].title} 已解锁`);
    goToScene(nextSceneId);
    return;
  }

  endingScreen.hidden = false;
  renderEnding();
}

function triggerAction(actionId) {
  const action = actionIndex[actionId];
  if (!action) {
    return;
  }

  if (action.type === "navigate") {
    if (!canRunAction(action) && !isActionDone(action.id)) {
      return;
    }
    markActionDone(action.sceneId, action.id);
    goToView(action.targetViewId);
    return;
  }

  if (action.type === "collect") {
    if (isArchiveCollected(action.collectibleId)) {
      openArchiveDrawer(action.collectibleId);
      return;
    }
    if (!canRunAction(action)) {
      return;
    }
    collectArchive(action.collectibleId, action.id);
  }
}

function bootstrapState() {
  const saved = loadSavedState();
  continueGameButton.hidden = !saved.started;
  state = saved;
  archiveDialogueId = null;

  if (!previewMode && autoStartNew) {
    state = createInitialState();
    state.started = true;
    activePanel = "story";
    bootScreen.hidden = true;
    persistState();
    renderAll();
    clearBootParams();
    window.__maweiBootFallback = null;
    return;
  }

  if (!previewMode && autoResume) {
    state.started = true;
    activePanel = getRecommendedPanel(state.currentScene);
    bootScreen.hidden = true;
    renderAll();
    clearBootParams();
    window.__maweiBootFallback = null;
    return;
  }

  if (!state.started && !previewMode) {
    activePanel = "story";
    renderAll();
    return;
  }

  state.started = true;
  if (previewUnlockAll) {
    state.unlockedScenes = [...SCENE_ORDER];
  }
  if (previewScene && SCENE_ORDER.includes(previewScene)) {
    state.currentScene = previewScene;
  }
  if (!state.unlockedScenes.includes(state.currentScene)) {
    state.unlockedScenes = [...new Set([...state.unlockedScenes, state.currentScene])];
  }
  if (previewView && viewIndex[previewView]?.sceneId === state.currentScene) {
    state.currentViewpoint = previewView;
  } else if (viewIndex[state.currentViewpoint]?.sceneId !== state.currentScene) {
    state.currentViewpoint = scenes[state.currentScene].entryViewId;
  }

  activePanel = getRecommendedPanel(state.currentScene);
  bootScreen.hidden = true;
  if (previewMapDrawer) {
    openMapDrawer();
  }
  if (previewArchiveDrawer) {
    openArchiveDrawer();
  }
  renderAll();
}

function startNewGame() {
  state = createInitialState();
  state.started = true;
  archiveDialogueId = null;
  activePanel = "story";
  bootScreen.hidden = true;
  endingScreen.hidden = true;
  closeRelicModal();
  closeMapDrawer();
  closeArchiveDrawer();
  selectedArchiveId = null;
  persistState();
  renderAll();
  clearBootParams();
  window.__maweiBootFallback = null;
}

function continueGame() {
  state = loadSavedState();
  state.started = true;
  archiveDialogueId = null;
  activePanel = getRecommendedPanel(state.currentScene);
  bootScreen.hidden = true;
  renderAll();
  clearBootParams();
  window.__maweiBootFallback = null;
}

startGameButton.addEventListener("click", startNewGame);
continueGameButton.addEventListener("click", continueGame);
mapButton.addEventListener("click", openMapDrawer);
archiveButton.addEventListener("click", () => openArchiveDrawer());
resetButton.addEventListener("click", () => {
  if (window.confirm("要重新开始这场夜访吗？当前进度会被覆盖。")) {
    window.localStorage.removeItem(SAVE_KEY);
    startNewGame();
  }
});
archiveDialogContinueButton.addEventListener("click", closeArchiveDialogue);
archiveDialogOpenButton.addEventListener("click", () => {
  const archiveId = archiveDialogueId;
  closeArchiveDialogue();
  openArchiveDrawer(archiveId);
});
mapClose.addEventListener("click", closeMapDrawer);
mapCloseButton.addEventListener("click", closeMapDrawer);
archiveClose.addEventListener("click", closeArchiveDrawer);
archiveCloseButton.addEventListener("click", closeArchiveDrawer);
relicClose.addEventListener("click", closeRelicModal);
relicCancel.addEventListener("click", closeRelicModal);
relicConfirm.addEventListener("click", () => {
  if (pendingRelicId && pendingActionId) {
    collectArchive(pendingRelicId, pendingActionId);
  }
});
endingRestartButton.addEventListener("click", () => {
  window.localStorage.removeItem(SAVE_KEY);
  endingScreen.hidden = true;
  startNewGame();
});
endingCloseButton.addEventListener("click", () => {
  endingScreen.hidden = true;
  openArchiveDrawer();
});
backButton.addEventListener("click", () => {
  const currentView = getView();
  if (currentView.parentViewId) {
    goToView(currentView.parentViewId);
  }
});

actionsNode.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action-id]");
  if (!button) {
    return;
  }
  triggerAction(button.dataset.actionId);
});

choiceListNode.addEventListener("click", (event) => {
  const button = event.target.closest("[data-choice-id]");
  if (!button) {
    return;
  }
  completeScene(button.dataset.choiceId);
});

archiveGridNode.addEventListener("click", (event) => {
  const button = event.target.closest("[data-archive-id]");
  if (!button) {
    return;
  }
  selectedArchiveId = button.dataset.archiveId;
  renderArchiveDrawer();
});

mapNodes.forEach((node) => {
  node.addEventListener("click", () => {
    goToScene(node.dataset.sceneTarget);
  });
});

panelTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setPanel(button.dataset.panelTab);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }
  if (activePanel === "archive-dialog") {
    closeArchiveDialogue();
  } else if (!relicModal.hidden) {
    closeRelicModal();
  } else if (!endingScreen.hidden) {
    endingScreen.hidden = true;
  } else if (archiveDrawer.getAttribute("aria-hidden") === "false") {
    closeArchiveDrawer();
  } else if (mapDrawer.getAttribute("aria-hidden") === "false") {
    closeMapDrawer();
  }
});

bootstrapState();
