/**
   ===================================================================
   极简英文 (Minimal English · Read & Listen)
   Pure & Distraction-Free English Learning Application Logic
   ===================================================================
 */

// ==================== 1. INDEXEDDB AUDIO STORAGE ====================
const DB_NAME = 'MinimalEnglishDB';
const DB_VERSION = 1;
const STORE_NAME = 'audio_files';

function openAudioDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveAudioBlob(id, blob, filename) {
  const db = await openAudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, blob, filename, type: blob.type, updatedAt: Date.now() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

async function getAudioBlob(id) {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return null;
  }
}

async function deleteAudioBlob(id) {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {}
}

// ==================== 2. SEED DEFAULT DATA ====================
const DEFAULT_ARTICLE = {
  id: 'seed-article-1',
  title: 'Stay Hungry, Stay Foolish (求知若饥，虚心若愚)',
  content: `Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma — which is living with the results of other people's thinking. Don't let the noise of others' opinions drown out your own inner voice.

And most important, have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary.

Stay Hungry. Stay Foolish. I have always wished that for myself. And now, as you graduate to begin anew, I wish that for you.`,
  translation: `你的时间有限，所以不要浪费时间去过别人的生活。不要被教条所束缚——那意味着生活在别人思考的结果里。不要让其他人观点的杂音淹没你内心的声音。

最重要的是，要有勇气跟随你的心与直觉。它们早已在某种程度上知晓你真正渴望成为怎样的人。其余的一切都是次要的。

求知若饥，虚心若愚。我一直以此自勉。如今在你们毕业重新启程之际，我亦将此作为对你们的期许。`,
  createdAt: new Date().toISOString()
};

const DEFAULT_LESSONS = [
  {
    id: "lesson_1",
    title: "The Art of Active Listening (倾听的艺术)",
    category: "哲理美文",
    audioSourceType: "builtin",
    audioUrl: "sample_lesson1.mp3",
    audioBlobId: null,
    duration: 26.22,
    favorite: true,
    completed: false,
    updatedAt: Date.now(),
    sentences: [
      {
        id: "s_1",
        startTime: 0.0,
        endTime: 5.52,
        text: "To listen well is as powerful a means of influence as to talk well.",
        trans: "善于倾听和善于言辞具有同等强大的感染力。"
      },
      {
        id: "s_2",
        startTime: 5.52,
        endTime: 11.6,
        text: "True listening requires patience, curiosity, and an open heart.",
        trans: "真正的倾听需要耐心、好奇心和开放的心胸。"
      },
      {
        id: "s_3",
        startTime: 11.6,
        endTime: 19.34,
        text: "When you listen with focused attention, you notice the subtle nuances in pronunciation and tone.",
        trans: "当你全神贯注地倾听时，你会注意到发音与语调中的微妙细节。"
      },
      {
        id: "s_4",
        startTime: 19.34,
        endTime: 26.22,
        text: "Small daily habits of active listening will quietly transform your English fluency.",
        trans: "每天坚持主动精听的微小习惯，会悄然重塑你的英语流利度。"
      }
    ],
    notes: "倾听的4个要点，重点练习弱读与连读"
  },
  {
    id: "lesson_2",
    title: "Airport Travel & Check-in (实用日常 · 机场值机)",
    category: "日常生活",
    audioSourceType: "builtin",
    audioUrl: "sample_lesson2.mp3",
    audioBlobId: null,
    duration: 27.98,
    favorite: false,
    completed: false,
    updatedAt: Date.now() - 3600000,
    sentences: [
      {
        id: "s_1",
        startTime: 0.0,
        endTime: 6.64,
        text: "Excuse me, could you tell me where I can check in for flight BA two four nine?",
        trans: "打扰一下，请问我在哪里可以办理英国航空 BA249 航班的值机手续？"
      },
      {
        id: "s_2",
        startTime: 6.64,
        endTime: 15.18,
        text: "Sure thing! Economy check-in is at counter C twelve, just past the security checkpoint.",
        trans: "没问题！经济舱值机在 C12 柜台，就在安检通道的正前方。"
      },
      {
        id: "s_3",
        startTime: 15.18,
        endTime: 21.8,
        text: "Thank you so much. Do I need to weigh my carry-on bag here as well?",
        trans: "非常感谢。请问我的随身行李也需要在这里称重吗？"
      },
      {
        id: "s_4",
        startTime: 21.8,
        endTime: 27.98,
        text: "Only if it looks oversized. Have a wonderful and safe flight today!",
        trans: "只有看起来超规时才需要。祝您今天旅途愉快、飞行平安！"
      }
    ],
    notes: "机场出行高频日常对话，适合影子跟读与听写"
  }
];

const DEFAULT_VOCAB = [
  {
    id: 'seed-word-1',
    word: 'dogma',
    phonetic: '/ˈdɒɡ.mə/',
    translation: '教条，教义',
    contextSentence: "Don't be trapped by dogma — which is living with the results of other people's thinking.",
    sourceType: 'article',
    sourceId: 'seed-article-1',
    sourceTitle: 'Stay Hungry, Stay Foolish',
    mastered: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-word-2',
    word: 'intuition',
    phonetic: '/ˌɪn.tʃuːˈɪʃ.ən/',
    translation: '直觉，本能感知',
    contextSentence: "And most important, have the courage to follow your heart and intuition.",
    sourceType: 'article',
    sourceId: 'seed-article-1',
    sourceTitle: 'Stay Hungry, Stay Foolish',
    mastered: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-word-3',
    word: 'nuances',
    phonetic: '/ˈnjuː.ɒns/',
    translation: '微妙差异，细微之处',
    contextSentence: "When you listen with focused attention, you notice the subtle nuances in pronunciation and tone.",
    sourceType: 'lesson',
    sourceId: 'lesson_1',
    sourceTitle: 'The Art of Active Listening',
    mastered: false,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SETTINGS = {
  theme: 'warm',
  font: 'serif',
  fontSize: 18,
  deepseekKey: '',
  autoPauseSec: 2,
  rewindStep: 5
};

// ==================== 2.1 SIMILAR WORDS PRESET REPO (形近词真题库) ====================
const DEFAULT_SIMILAR_PRESETS = [
  {
    id: "preset_adapt_adopt_adept",
    groupTitle: "adapt · adopt · adept",
    level: "四级 (CET-4) / 考研",
    confusePoint: "核心元音字母 a / o / e 微差，极易在阅读中视线扫过造成语义误判，在写作中拼写混淆。",
    words: [
      {
        word: "adapt",
        phonetic: "/əˈdæpt/",
        pos: "v.",
        meaning: "适应，适合；改编，改造",
        anchor: "字母 a ➔ 联想 action (采取行动) 才能【适应】新环境；alter (改变) 成为【改编】",
        collocation: "adapt to the new environment (适应新环境) / adapt a novel into a movie (把小说改编成电影)",
        example: "It took him several months to adapt to the university life."
      },
      {
        word: "adopt",
        phonetic: "/əˈdɒpt/",
        pos: "v.",
        meaning: "采纳，采用；收养，领养",
        anchor: "字母 o ➔ 联想 option (做出选项) 从而【采纳】建议；圈出孩子【领养】",
        collocation: "adopt a new approach (采纳新方法) / adopt a child (领养孩子)",
        example: "The school decided to adopt a more flexible teaching schedule."
      },
      {
        word: "adept",
        phonetic: "/əˈdept/",
        pos: "adj. / n.",
        meaning: "熟练的，精通的；内行，老手",
        anchor: "字母 e ➔ 联想 expert (专家)，代表技能【熟练、内行】",
        collocation: "be adept at communication (精于沟通) / an adept negotiator (熟练的谈判专家)",
        example: "She is particularly adept at handling difficult customer complaints."
      }
    ],
    story: {
      title: "达人的职场蜕变",
      en: "The **adept** engineer decided to **adopt** a brand-new framework, and then quickly **adapted** his legacy code to the updated system.",
      cn: "这位**经验熟练的 (adept)** 工程师决定**采纳 (adopt)** 一套全新的技术架构，随后迅速**调整改造 (adapted)** 了原有的旧代码以适应该系统。"
    },
    mnemonicFormula: "a (action) 行动求适应，o (option) 选择来采纳，e (expert) 专家最熟练！",
    examTips: "四级高频考点：adapt to 必接介词 to（适应于...）；adopt 为及物动词（adopt measures 采纳措施）。"
  },
  {
    id: "preset_defect_defend_defeat_desert",
    groupTitle: "defect · defend · defeat · desert · deficit",
    level: "四级 / 考研 / 雅思",
    confusePoint: "全部以 de- 开头且辅音高度近似，听力极易听串，阅读中若扫读过快极易判断相反或误读逻辑。",
    words: [
      {
        word: "defect",
        phonetic: "/ˈdiːfekt/ (n.) /dɪˈfekt/ (v.)",
        pos: "n. / v.",
        meaning: "n. 缺点，瑕疵，缺陷；v. 变节，背叛",
        anchor: "词根 fect (= do 做)，做坏了、掉落了 ➔ 【缺陷】",
        collocation: "manufacturing defect (制造缺陷) / genetic defect (基因缺陷)",
        example: "The software had a fatal defect that caused sudden crashes."
      },
      {
        word: "defend",
        phonetic: "/dɪˈfend/",
        pos: "v.",
        meaning: "保卫，防御；辩护",
        anchor: "词根 fend (= strike 击打/抵挡) ➔ 抵挡住敌人的攻击 ➔ 【防御/保卫】",
        collocation: "defend against attacks (防御攻击) / defend one's opinion (为观点辩护)",
        example: "The lawyer defended his client with compelling evidence."
      },
      {
        word: "defeat",
        phonetic: "/dɪˈfiːt/",
        pos: "v. / n.",
        meaning: "击败，战胜；失败",
        anchor: "de- + feat (做到底)，彻底做掉对手 ➔ 【击败/战胜对手】",
        collocation: "suffer a defeat (遭受失败) / defeat the opponent (击败对手)",
        example: "Our team defeated the rival team in the final match."
      },
      {
        word: "desert",
        phonetic: "/ˈdezət/ (n.) /dɪˈzɜːt/ (v.)",
        pos: "n. / v.",
        meaning: "n. 沙漠，荒原；v. 遗弃，抛弃",
        anchor: "一个 s 是沙漠 (desert)，两个 s 是甜点甜品 (dessert，吃甜品想要双份)",
        collocation: "desert island (荒岛) / desert one's post (擅离职守)",
        example: "He refused to desert his teammates during the crisis."
      },
      {
        word: "deficit",
        phonetic: "/ˈdefɪsɪt/",
        pos: "n.",
        meaning: "赤字，亏损，不足额",
        anchor: "词根 fic (= make/do 做)，做出来的数额不够 ➔ 【财政赤字/亏损】",
        collocation: "trade deficit (贸易逆差) / budget deficit (财政预算赤字)",
        example: "The company managed to turn the financial deficit into a surplus."
      }
    ],
    story: {
      title: "边疆卫士的坚守",
      en: "Despite a severe equipment **defect** and a heavy budget **deficit**, the soldiers swore never to **desert** their post, but to **defend** their border territory and completely **defeat** any invaders.",
      cn: "尽管装备存在严重**缺陷 (defect)** 且预算陷入**赤字 (deficit)**，战士们誓死绝不**擅离/抛弃 (desert)** 阵地，定要誓死**保卫 (defend)** 边疆领土并彻底**击败 (defeat)** 任何侵略者。"
    },
    mnemonicFormula: "fect 做坏有缺陷，fend 挡击来防卫；feat 彻底击败之，单 s 沙漠双 s 甜！",
    examTips: "四级听力与阅读常考：deserted (废弃的荒无人烟的)；trade deficit (贸易赤字)。"
  },
  {
    id: "preset_stationery_stationary",
    groupTitle: "stationery · stationary",
    level: "四级 (CET-4) / 高考",
    confusePoint: "读音完全一模一样（同音词），仅倒数第二个字母 e 与 a 之差，写作拼写致命陷阱。",
    words: [
      {
        word: "stationery",
        phonetic: "/ˈsteɪʃənri/",
        pos: "n.",
        meaning: "文具，信纸信封",
        anchor: "含有字母 **e** ➔ 联想 **Envelope (信封)** 或 **Eraser (橡皮)**、**pEn (钢笔)**，文具都带 e！",
        collocation: "stationery shop (文具店) / office stationery (办公文具)",
        example: "She bought notebooks and pens at the local stationery store."
      },
      {
        word: "stationary",
        phonetic: "/ˈsteɪʃənri/",
        pos: "adj.",
        meaning: "静止的，不动的，固定的",
        anchor: "含有字母 **a** ➔ 联想 **Anchor (船锚)**，抛锚之后船就【静止不动】了！",
        collocation: "stationary vehicle (停着的静止车辆) / remain stationary (保持静止)",
        example: "The traffic was completely stationary for over an hour."
      }
    ],
    story: {
      title: "堵车中的文具采购",
      en: "While the bus remained completely **stationary** in the highway jam, Tom sketched his new book cover on a sheet of fine **stationery**.",
      cn: "当公交车在高速路堵车中完全**静止不动 (stationary)** 时，汤姆在一张精致的**信纸/文具 (stationery)** 上勾勒了他的新书封面。"
    },
    mnemonicFormula: "e 是 Envelope 信纸做文具，a 是 Anchor 锚定不动成静止！",
    examTips: "四级阅读和写作真题常考：stationary bicycle (健身房动感单车/固定自行车)。"
  },
  {
    id: "preset_complement_compliment",
    groupTitle: "complement · compliment",
    level: "四级 / 六级 / 考研",
    confusePoint: "发音几乎相同，仅中间字母 e 与 i 的区别，极难分辨。",
    words: [
      {
        word: "complement",
        phonetic: "/ˈkɒmplɪment/",
        pos: "v. / n.",
        meaning: "补充，补足；互补物",
        anchor: "含有字母 **e** ➔ 联想 **complete (完成/健全)**，用来补齐使之完整的 ➔ 【补充/互补】",
        collocation: "complement each other (互相补充，相得益彰) / a nice complement to (对...的良好补充)",
        example: "Their unique skills complement each other perfectly in teamwork."
      },
      {
        word: "compliment",
        phonetic: "/ˈkɒmplɪmənt/",
        pos: "n. / v.",
        meaning: "赞美，称赞，恭维",
        anchor: "含有字母 **i** ➔ 联想 **I (我)**，我最喜欢听别人的【夸奖和赞美】！",
        collocation: "pay sb a compliment (赞赏某人) / return the compliment (礼尚往来)",
        example: "He paid her a sincere compliment on her excellent presentation."
      }
    ],
    story: {
      title: "搭档间的默契",
      en: "Whenever John paid Mary a heartfelt **compliment** on her design, she replied that their mutual collaboration was the ideal **complement** that brought the project to perfection.",
      cn: "每当约翰真诚地**称赞 (compliment)** 玛丽的设计时，玛丽总会回应说，彼此的默契协作才是让项目趋于完美的绝佳**互补 (complement)**。"
    },
    mnemonicFormula: "e 是 complete 求补充，i 是 爱我 (I) 爱赞美！",
    examTips: "四级常见语法：主语补足语叫 subject complement；写作高频词组：complement each other (相辅相成)。"
  },
  {
    id: "preset_access_assess_excess",
    groupTitle: "access · assess · excess",
    level: "四级 / 六级 / 考研",
    confusePoint: "双写字母（cc / ss）与前缀混淆，发音与外观极度形似。",
    words: [
      {
        word: "access",
        phonetic: "/ˈækses/",
        pos: "n. / v.",
        meaning: "进入；接触/使用的机会或权利；访问",
        anchor: "ac- (向着) + cess (行走) ➔ 走过去 ➔ 【进入/获取权限】",
        collocation: "have access to the internet (有权使用互联网) / easy access (便捷通道)",
        example: "Students have free access to the university digital library."
      },
      {
        word: "assess",
        phonetic: "/əˈses/",
        pos: "v.",
        meaning: "评估，评定，估算",
        anchor: "as- + sess (坐)，坐在旁边审查考核 ➔ 【评估/评定】",
        collocation: "assess the damage (评估损失) / assess student performance (评估学生表现)",
        example: "The committee will carefully assess the environmental impact of the project."
      },
      {
        word: "excess",
        phonetic: "/ɪkˈses/ (n.) /ˈekses/ (adj.)",
        pos: "n. / adj.",
        meaning: "过度，过量，无节制；额外的",
        anchor: "ex- (超出) + cess (走) ➔ 走过头了 ➔ 【过量/超出】",
        collocation: "in excess of (超过) / excess baggage (超重行李)",
        example: "An excess of sugar in one's diet can lead to serious health issues."
      }
    ],
    story: {
      title: "数据审计师的提醒",
      en: "Before granting database **access**, the security officer must **assess** the user risk to prevent an **excess** of confidential downloads.",
      cn: "在授予数据库**访问权限 (access)** 之前，安全主管必须全面**评估 (assess)** 用户风险，以防出现**过度/过量 (excess)** 的机密数据下载。"
    },
    mnemonicFormula: "access 走通有权限，assess 坐下细评估，ex 走过头成过量！",
    examTips: "四级阅读最高频搭配：have access to (可以利用/获取)；assess the situation (审时度势)。"
  },
  {
    id: "preset_principal_principle",
    groupTitle: "principal · principle",
    level: "四级 / 六级 / 高考",
    confusePoint: "结尾 pal 与 ple 的差异，读音相同，词性与词义极其容易在写作中写反。",
    words: [
      {
        word: "principal",
        phonetic: "/ˈprɪnsəpl/",
        pos: "adj. / n.",
        meaning: "adj. 主要的，最重要的；n. 校长；资本，本金",
        anchor: "结尾 **pal** ➔ 联想 **pal (好朋友/人)**，校长是你的好朋友 (The principal is your pal)；人最重要的 ➔ 【主要的】",
        collocation: "principal reason (主要原因) / school principal (中小学校长)",
        example: "Lack of funding is the principal obstacle to our research."
      },
      {
        word: "principle",
        phonetic: "/ˈprɪnsəpl/",
        pos: "n.",
        meaning: "原则，准则；科学原理",
        anchor: "结尾 **ple** ➔ 联想 **rule (规则)**，都是以 **le** 结尾！代表处事的【准则/原则】",
        collocation: "in principle (原则上) / stick to principles (坚守原则) / basic principles (基本原理)",
        example: "He refused to compromise his moral principles for money."
      }
    ],
    story: {
      title: "校长的育人准则",
      en: "Our school **principal** gave a speech emphasizing that integrity is the **principal** **principle** all students should uphold.",
      cn: "我们学校的**校长 (principal)** 发表讲话强调：诚信是全体学生应当秉持的最**主要的 (principal)** 道德**准则 (principle)**。"
    },
    mnemonicFormula: "pal 是朋友当校长/主要的，ple 类似 rule 是原则原理！",
    examTips: "四级完型/选词填空高频：on principle (出于原则)；principal cause (首要诱因)。"
  },
  {
    id: "preset_emigrate_immigrate_migrate",
    groupTitle: "emigrate · immigrate · migrate",
    level: "四级 / 六级 / 雅思",
    confusePoint: "迁出 (e-) 与迁入 (im-) 经常混淆，阅读社科类文章容易理解反方向。",
    words: [
      {
        word: "emigrate",
        phonetic: "/ˈemɪɡreɪt/",
        pos: "v.",
        meaning: "移居国外，迁居他乡（强调迁出）",
        anchor: "前缀 **e-** (= exit 迁出/离开)，从本国离开去往外国 ➔ 常用搭配 **emigrate from**",
        collocation: "emigrate from China to Canada (从中国移居加拿大)",
        example: "His grandparents emigrated from Europe in the early 1900s."
      },
      {
        word: "immigrate",
        phonetic: "/ˈɪmɪɡreɪt/",
        pos: "v.",
        meaning: "移入，迁入（强调迁入并定居）",
        anchor: "前缀 **im-** (= in 进内/迁入)，进入新国家定居 ➔ 常用搭配 **immigrate to / into**",
        collocation: "immigrate to Australia (移民进入澳大利亚)",
        example: "Thousands of skilled workers immigrate to this country every year."
      },
      {
        word: "migrate",
        phonetic: "/maɪˈɡreɪt/",
        pos: "v.",
        meaning: "迁徙（鸟类/动物季节性迁徙）；随工作流动",
        anchor: "无特定内外前缀，泛指鸟类每年季节性【迁徙】或农民工人口流动",
        collocation: "birds migrate south for winter (鸟类南迁过冬) / migrate to urban areas (涌入城市)",
        example: "These swallows migrate thousands of miles each autumn."
      }
    ],
    story: {
      title: "候鸟与迁徙者",
      en: "Watching the birds **migrate** south across the horizon, Maria recalled how her family **emigrated** from their homeland and finally **immigrated** into a peaceful coastal city.",
      cn: "望着鸟群在天际向南**迁徙 (migrate)**，玛丽亚回想起自己的家庭当年如何从祖国**迁出移居 (emigrated)**，并最终作为新移民**迁入定居 (immigrated)** 在这座宁静的沿海城市。"
    },
    mnemonicFormula: "e (exit) 离开故土迁出，im (in) 迁入新国定居，migrate 候鸟四海迁徙！",
    examTips: "四级/雅思常见名词：immigrant (入境移民)；emigrant (移居国外的侨民)；migration (迁徙)。"
  },
  {
    id: "preset_sensible_sensitive",
    groupTitle: "sensible · sensitive",
    level: "四级 (CET-4) / 高考",
    confusePoint: "同源自 sense，但后缀 -ible 与 -itive 赋予了完全不同的褒贬与性格指向。",
    words: [
      {
        word: "sensible",
        phonetic: "/ˈsensəbl/",
        pos: "adj.",
        meaning: "明智的，通情达理的，实用的",
        anchor: "sense (理智) + ible (能够有理智的) ➔ 头脑清醒、做事【明智有分寸】",
        collocation: "a sensible decision (明智的决定) / sensible advice (切合实际的建议)",
        example: "It is sensible to save a portion of your income every month."
      },
      {
        word: "sensitive",
        phonetic: "/ˈsensətɪv/",
        pos: "adj.",
        meaning: "敏感的；易受伤害的；灵敏的",
        anchor: "sense (感觉) + itive (极其容易感应的) ➔ 情感细腻【敏感】、皮肤过敏或仪器灵敏",
        collocation: "sensitive skin (敏感肌) / sensitive to criticism (对批评敏感脆弱)",
        example: "She is very sensitive and easily gets upset by harsh words."
      }
    ],
    story: {
      title: "明智的沟通艺术",
      en: "It is always **sensible** to choose your words gently when talking with a deeply **sensitive** friend.",
      cn: "在与一位内心极度**敏感脆弱 (sensitive)** 的朋友交谈时，慎重委婉地斟酌措辞永远是极其**明智分寸 (sensible)** 的做法。"
    },
    mnemonicFormula: "sensible 有理智是明智，sensitive 太感应是敏感！",
    examTips: "四级常考写作：make a sensible choice (做出明智抉择)；be sensitive to (对...极其敏锐/敏感)。"
  }
];

// ==================== 3. APP STATE & STORAGE ====================
class AppState {
  constructor() {
    this.articles = this.loadArticles();
    this.lessons = this.loadLessons();
    this.vocab = this.loadVocab();
    this.settings = this.loadSettings();
    this.cache = this.loadStorage('minimal_word_cache', {});
    this.similarHistory = this.loadStorage('minimal_similar_history', DEFAULT_SIMILAR_PRESETS.slice(0, 4));
    this.currentSimilarGroup = DEFAULT_SIMILAR_PRESETS[0];

    // Runtime state
    this.currentTab = 'viewArticles';
    this.currentArticleId = null;
    this.currentLessonId = null;
    this.activeInspectorWord = null;
    this.showArticleTranslation = false;
    this.showLessonTranslation = false;
    this.isBlindMode = false;
    this.loopMode = 'single'; // 'sequential', 'single', 'ab'
    this.playbackRate = 1.0;
    this.abRange = { a: null, b: null };
    this.currentSentenceIndex = -1;
    this.dictationIndex = 0;
    this.activeAudioUrl = null;
    this.autoPauseTimeout = null;
    this.isPausedForRepeat = false;
  }

  loadStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  loadArticles() {
    const articles = this.loadStorage('minimal_articles', null);
    if (articles && Array.isArray(articles) && articles.length > 0) return articles;
    localStorage.setItem('minimal_articles', JSON.stringify([DEFAULT_ARTICLE]));
    return [DEFAULT_ARTICLE];
  }

  loadLessons() {
    const lessons = this.loadStorage('minimal_listener_lessons', null);
    if (lessons && Array.isArray(lessons) && lessons.length > 0) return lessons;
    localStorage.setItem('minimal_listener_lessons', JSON.stringify(DEFAULT_LESSONS));
    return JSON.parse(JSON.stringify(DEFAULT_LESSONS));
  }

  loadVocab() {
    // 1. Check unified vocab
    const unified = this.loadStorage('minimal_unified_vocab', null);
    if (unified && Array.isArray(unified) && unified.length > 0) return unified;

    // 2. Migration from individual old apps
    const oldReaderWords = this.loadStorage('minimal_words', []);
    const oldListenerVocab = this.loadStorage('minimal_listener_vocab', []);

    const merged = [];
    const seen = new Set();

    if (Array.isArray(oldReaderWords)) {
      for (const w of oldReaderWords) {
        const clean = (w.word || '').toLowerCase().trim();
        if (clean && !seen.has(clean)) {
          seen.add(clean);
          merged.push({
            id: w.id || 'word_' + Math.random().toString(36).slice(2, 9),
            word: w.word,
            phonetic: w.phonetic || '',
            translation: w.translation || '',
            contextSentence: w.contextSentence || '',
            sourceType: 'article',
            sourceId: w.articleId || '',
            sourceTitle: w.articleTitle || '阅读文章',
            mastered: !!w.mastered,
            createdAt: w.createdAt || new Date().toISOString()
          });
        }
      }
    }

    if (Array.isArray(oldListenerVocab)) {
      for (const v of oldListenerVocab) {
        const clean = (v.word || '').toLowerCase().trim();
        if (clean && !seen.has(clean)) {
          seen.add(clean);
          merged.push({
            id: 'word_' + Math.random().toString(36).slice(2, 9),
            word: v.word,
            phonetic: v.phonetic || '',
            translation: v.meaning || '',
            contextSentence: v.contextSentence || '',
            sourceType: 'lesson',
            sourceId: '',
            sourceTitle: '精听课程',
            mastered: false,
            createdAt: new Date(v.date || Date.now()).toISOString()
          });
        }
      }
    }

    if (merged.length > 0) {
      localStorage.setItem('minimal_unified_vocab', JSON.stringify(merged));
      return merged;
    }

    localStorage.setItem('minimal_unified_vocab', JSON.stringify(DEFAULT_VOCAB));
    return JSON.parse(JSON.stringify(DEFAULT_VOCAB));
  }

  loadSettings() {
    const saved = this.loadStorage('minimal_settings', null);
    const oldListenerSettings = this.loadStorage('minimal_listener_settings', {});
    return {
      ...DEFAULT_SETTINGS,
      ...(oldListenerSettings || {}),
      ...(saved || {})
    };
  }

  saveArticles() {
    localStorage.setItem('minimal_articles', JSON.stringify(this.articles));
  }

  saveLessons() {
    localStorage.setItem('minimal_listener_lessons', JSON.stringify(this.lessons));
  }

  saveVocab() {
    localStorage.setItem('minimal_unified_vocab', JSON.stringify(this.vocab));
    updateVocabBadges();
  }

  saveSettings() {
    localStorage.setItem('minimal_settings', JSON.stringify(this.settings));
  }

  saveSimilarHistory() {
    localStorage.setItem('minimal_similar_history', JSON.stringify(this.similarHistory));
  }

  getWord(wordStr) {
    if (!wordStr) return null;
    const clean = wordStr.toLowerCase().trim();
    return this.vocab.find(v => v.word.toLowerCase().trim() === clean);
  }

  addOrUpdateWord(item) {
    const clean = item.word.toLowerCase().trim();
    const idx = this.vocab.findIndex(v => v.word.toLowerCase().trim() === clean);
    if (idx >= 0) {
      this.vocab[idx] = { ...this.vocab[idx], ...item };
    } else {
      this.vocab.unshift(item);
    }
    this.saveVocab();
  }

  removeWord(wordStr) {
    const clean = wordStr.toLowerCase().trim();
    this.vocab = this.vocab.filter(v => v.word.toLowerCase().trim() !== clean);
    this.saveVocab();
  }
}

const state = new AppState();

// ==================== 4. UTILITIES & HELPERS ====================
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toastMsg');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function speakWord(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

// Update Top Badge & Bottom Navigation Badges
function updateVocabBadges() {
  const unmasteredCount = state.vocab.filter(v => !v.mastered).length;
  const badge = document.getElementById('vocabBadgeCount');
  if (badge) {
    if (unmasteredCount > 0) {
      badge.textContent = unmasteredCount > 99 ? '99+' : unmasteredCount;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }

  const vocabTotal = document.getElementById('vocabTotalCount');
  if (vocabTotal) vocabTotal.textContent = `${state.vocab.length} 词`;

  // Update top brand badge if currently in Vocab tab
  if (state.currentTab === 'viewVocab') {
    const topBadge = document.getElementById('brandBadge');
    if (topBadge) topBadge.textContent = `${state.vocab.length} 词`;
  }
}

// Apply settings to DOM
function applySettings() {
  document.body.setAttribute('data-theme', state.settings.theme);
  document.body.setAttribute('data-font', state.settings.font);
  document.documentElement.style.setProperty('--article-font-size', `${state.settings.fontSize}px`);

  // Update settings inputs if present
  const fontDisplay = document.getElementById('fontSizeDisplay');
  if (fontDisplay) fontDisplay.textContent = `${state.settings.fontSize}px`;
  const fontSlider = document.getElementById('fontSizeSlider');
  if (fontSlider) fontSlider.value = state.settings.fontSize;

  const pauseSelect = document.getElementById('settingAutoPauseSec');
  if (pauseSelect) pauseSelect.value = state.settings.autoPauseSec;
  const rewindSelect = document.getElementById('settingRewindStep');
  if (rewindSelect) rewindSelect.value = state.settings.rewindStep;

  // Active theme pill
  document.querySelectorAll('.theme-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.themeVal === state.settings.theme);
  });
  document.querySelectorAll('.font-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.fontVal === state.settings.font);
  });

  // DeepSeek status tag
  const statusTag = document.getElementById('deepseekStatusTag');
  const clearBtn = document.getElementById('btnClearDeepseekKey');
  if (statusTag) {
    if (state.settings.deepseekKey) {
      statusTag.textContent = '已连接';
      statusTag.style.backgroundColor = 'var(--success-light)';
      statusTag.style.color = 'var(--success)';
      if (clearBtn) clearBtn.style.display = 'block';
    } else {
      statusTag.textContent = '未开启';
      statusTag.style.backgroundColor = 'var(--accent-light)';
      statusTag.style.color = 'var(--accent)';
      if (clearBtn) clearBtn.style.display = 'none';
    }
  }
}

// ==================== 5. DICTIONARY & AI DEFINITIONS ====================
async function fetchDeepSeekDefinition(word, sentence, apiKey) {
  const normWord = word.toLowerCase().trim();
  const cleanSentence = sentence ? sentence.trim() : '';

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `你是一个极简英文词典引擎。请根据用户提供的目标单词及其所在原句上下文，返回合法的 JSON 对象。格式严格如下：
{
  "phonetic": "/美音国际音标/",
  "contextMeaning": "该单词在本文句子语境下的精准中文释义（简练核心）",
  "generalTranslation": "该单词最常用的中文释义（2-3个常用义项，顿号分隔）",
  "definitions": [
    {"pos": "词性如 vt. 或 n.", "def": "简短中文释义与英文要点"}
  ]
}`
        },
        {
          role: 'user',
          content: `目标单词: "${normWord}"\n原句语境: "${cleanSentence}"`
        }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

async function fetchFreeDictionaryDefinition(word) {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
  if (!res.ok) throw new Error('Not found in free dictionary');
  const data = await res.json();
  const entry = data[0];

  let phonetic = entry.phonetic || '';
  if (!phonetic && entry.phonetics && entry.phonetics.length > 0) {
    const pWithText = entry.phonetics.find(p => p.text);
    if (pWithText) phonetic = pWithText.text;
  }

  const definitions = [];
  if (entry.meanings) {
    for (const m of entry.meanings.slice(0, 3)) {
      if (m.definitions && m.definitions[0]) {
        definitions.push({
          pos: m.partOfSpeech || '',
          def: m.definitions[0].definition
        });
      }
    }
  }

  return {
    phonetic: phonetic || `/${word}/`,
    contextMeaning: '',
    generalTranslation: '常用词汇',
    definitions
  };
}

async function lookupWord(word, sentence) {
  const clean = word.toLowerCase().trim();
  const cacheKey = `${clean}:::${(sentence || '').slice(0, 50)}`;

  if (state.cache[cacheKey]) {
    return state.cache[cacheKey];
  }

  // 1. Try DeepSeek AI if configured
  if (state.settings.deepseekKey) {
    try {
      const aiResult = await fetchDeepSeekDefinition(clean, sentence, state.settings.deepseekKey);
      state.cache[cacheKey] = aiResult;
      try { localStorage.setItem('minimal_word_cache', JSON.stringify(state.cache)); } catch (e) {}
      return aiResult;
    } catch (e) {
      console.warn('DeepSeek query failed, falling back:', e);
    }
  }

  // 2. Try Free Dictionary API
  try {
    const freeResult = await fetchFreeDictionaryDefinition(clean);
    state.cache[cacheKey] = freeResult;
    try { localStorage.setItem('minimal_word_cache', JSON.stringify(state.cache)); } catch (e) {}
    return freeResult;
  } catch (e) {}

  // 3. Fallback default
  return {
    phonetic: `/${clean}/`,
    contextMeaning: '',
    generalTranslation: '英文重点生词',
    definitions: []
  };
}

// ==================== 6. WORD INSPECTOR BOTTOM SHEET ====================
let currentInspectorData = null;

async function openWordInspector(word, sentence, sourceType, sourceId, sourceTitle) {
  const clean = word.toLowerCase().trim();
  if (!clean) return;

  currentInspectorData = {
    word: clean,
    sentence: sentence || '',
    sourceType: sourceType || 'article',
    sourceId: sourceId || '',
    sourceTitle: sourceTitle || '极简英文'
  };

  const sheet = document.getElementById('wordBottomSheet');
  const backdrop = document.getElementById('sheetBackdrop');
  const wordEl = document.getElementById('sheetWord');
  const phoneticEl = document.getElementById('sheetPhonetic');
  const transText = document.getElementById('sheetTranslationText');
  const transInput = document.getElementById('sheetTranslationInput');
  const aiBox = document.getElementById('sheetAiContextBox');
  const aiText = document.getElementById('sheetAiContextText');
  const ctxBox = document.getElementById('sheetContextBox');
  const ctxText = document.getElementById('sheetContextText');
  const defsContainer = document.getElementById('sheetDefinitionsContainer');
  const btnSave = document.getElementById('btnToggleSaveWord');

  wordEl.textContent = clean;
  phoneticEl.textContent = '/.../';
  transText.textContent = '查询释义中...';
  transInput.value = '';
  transInput.style.display = 'none';
  aiBox.style.display = 'none';
  defsContainer.innerHTML = '';

  // Context sentence with target word highlighted
  if (sentence) {
    ctxBox.style.display = 'block';
    const regex = new RegExp(`(\\b${clean}\\w*\\b)`, 'gi');
    ctxText.innerHTML = escapeHtml(sentence).replace(regex, '<span style="background:var(--highlight-word-bg); font-weight:700; color:var(--highlight-word-text); padding:0 2px; border-radius:3px;">$1</span>');
  } else {
    ctxBox.style.display = 'none';
  }

  // Check if word is already saved in vocabulary
  const existing = state.getWord(clean);
  if (existing) {
    btnSave.textContent = existing.mastered ? '已掌握 · 点击重新学习' : '✓ 已在生词本 · 标记掌握/移出';
    btnSave.style.backgroundColor = 'var(--text-secondary)';
    if (existing.translation) {
      transText.textContent = existing.translation;
      transInput.value = existing.translation;
    }
    if (existing.phonetic) {
      phoneticEl.textContent = existing.phonetic;
    }
  } else {
    btnSave.textContent = '+ 记入生词本';
    btnSave.style.backgroundColor = 'var(--accent)';
  }

  // Open Sheet
  sheet.classList.add('active');
  backdrop.classList.add('active');

  // Async fetch definition
  try {
    const res = await lookupWord(clean, sentence);
    phoneticEl.textContent = res.phonetic || `/${clean}/`;
    
    if (res.contextMeaning) {
      aiBox.style.display = 'block';
      aiText.textContent = res.contextMeaning;
    }

    if (!existing || !existing.translation) {
      transText.textContent = res.contextMeaning || res.generalTranslation || '常用词汇';
      transInput.value = transText.textContent;
    }

    if (res.definitions && res.definitions.length > 0) {
      defsContainer.innerHTML = res.definitions.map(d => `
        <div class="meaning-item">
          <strong>${escapeHtml(d.pos)}</strong> ${escapeHtml(d.def)}
        </div>
      `).join('');
    }
  } catch (err) {
    transText.textContent = '已就绪（支持手动添加释义笔记）';
  }
}

function closeWordInspector() {
  document.getElementById('wordBottomSheet')?.classList.remove('active');
  document.getElementById('sheetBackdrop')?.classList.remove('active');
}

// ==================== 7. ARTICLE MANAGEMENT & READER VIEW ====================
function renderArticleList() {
  const container = document.getElementById('articleListContainer');
  const countEl = document.getElementById('articleTotalCount');
  const query = (document.getElementById('articleSearchInput')?.value || '').toLowerCase().trim();

  let list = state.articles;
  if (query) {
    list = list.filter(a => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query));
  }

  if (countEl) countEl.textContent = `${state.articles.length} 篇`;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 16px; color: var(--text-muted);">
        <p style="font-size:32px; margin-bottom:8px;">📖</p>
        <p style="font-size:14px;">暂无匹配文章，点击右上角「+ 存文章」开始存入你的第一篇英文文章！</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(art => {
    const totalWords = art.content.trim() ? art.content.trim().split(/\s+/).length : 0;
    const unknownCount = state.vocab.filter(v => v.sourceType === 'article' && v.sourceId === art.id && !v.mastered).length;
    const snippet = art.content.replace(/\s+/g, ' ').slice(0, 110) + '...';

    return `
      <div class="article-card" data-article-id="${art.id}">
        <div class="article-card-header">
          <h3 class="article-card-title">${escapeHtml(art.title)}</h3>
          <span class="badge-tag">${totalWords} 词</span>
        </div>
        <div class="article-card-meta">
          <span>${unknownCount} 个生词标记</span>
          <span>•</span>
          <span>${art.createdAt ? new Date(art.createdAt).toLocaleDateString() : '近期'}</span>
        </div>
        <p class="article-card-snippet">${escapeHtml(snippet)}</p>
      </div>
    `;
  }).join('');
}

function openReader(articleId) {
  const article = state.articles.find(a => a.id === articleId);
  if (!article) return;

  state.currentArticleId = articleId;
  const container = document.getElementById('readerContainer');
  const titleEl = document.getElementById('readerArticleTitle');
  const headerTitleEl = document.getElementById('readerHeaderTitle');
  const wordsEl = document.getElementById('readerArticleWords');
  const savedWordsEl = document.getElementById('readerArticleSavedWords');
  const contentArea = document.getElementById('readerContentArea');

  titleEl.textContent = article.title;
  headerTitleEl.textContent = article.title;

  const totalWords = article.content.trim() ? article.content.trim().split(/\s+/).length : 0;
  const unknownInArticle = state.vocab.filter(w => w.sourceId === articleId && !w.mastered);

  wordsEl.textContent = `${totalWords} 词`;
  savedWordsEl.textContent = `${unknownInArticle.length} 个生词已标记`;

  state.showArticleTranslation = false;
  contentArea.classList.remove('show-translation');
  const btnTranslate = document.getElementById('btnToggleTranslate');
  if (btnTranslate) {
    btnTranslate.classList.remove('active');
    btnTranslate.querySelector('span').textContent = '译';
  }

  // Tokenize paragraphs & words
  const paragraphs = article.content.split(/\n\s*\n/);
  const transParagraphs = article.translation ? article.translation.split(/\n\s*\n/) : [];

  contentArea.innerHTML = paragraphs.map((para, pIdx) => {
    const tokens = para.split(/([a-zA-Z]+(?:'[a-zA-Z]+)?)/g);
    const tokenHtml = tokens.map(token => {
      if (/^[a-zA-Z]+(?:'[a-zA-Z]+)?$/.test(token)) {
        const clean = token.toLowerCase();
        const wordObj = state.getWord(clean);
        const isUnknown = wordObj && !wordObj.mastered;
        return `<span class="word-token ${isUnknown ? 'unknown-highlight' : ''}" data-word="${escapeHtml(clean)}" data-para-idx="${pIdx}">${escapeHtml(token)}</span>`;
      }
      return escapeHtml(token);
    }).join('');

    const trans = transParagraphs[pIdx] ? `<div class="para-trans">${escapeHtml(transParagraphs[pIdx])}</div>` : '';
    return `<p class="reader-para" data-p-idx="${pIdx}">${tokenHtml}${trans}</p>`;
  }).join('');

  container.classList.add('active');
}

function closeReader() {
  document.getElementById('readerContainer')?.classList.remove('active');
  state.currentArticleId = null;
  state.showArticleTranslation = false;
  renderArticleList();
}

async function toggleArticleTranslation() {
  if (!state.currentArticleId) return;
  const article = state.articles.find(a => a.id === state.currentArticleId);
  if (!article) return;

  const btn = document.getElementById('btnToggleTranslate');
  const contentArea = document.getElementById('readerContentArea');
  const span = btn?.querySelector('span');

  if (state.showArticleTranslation) {
    state.showArticleTranslation = false;
    contentArea.classList.remove('show-translation');
    btn?.classList.remove('active');
    showToast('已隐藏中文对照');
    return;
  }

  if (article.translation) {
    state.showArticleTranslation = true;
    contentArea.classList.add('show-translation');
    btn?.classList.add('active');
    showToast('已显示全文中文对照');
    return;
  }

  // Translate with DeepSeek
  if (!state.settings.deepseekKey) {
    showToast('请先在「设置」中配置 DeepSeek API Key 开启一键全文翻译');
    return;
  }

  showToast('🤖 DeepSeek 正在翻译全文，请稍候...');
  if (span) span.textContent = '...';

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.settings.deepseekKey.trim()}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: '你是一个高水平的中英翻译大师。请将用户提供的英文文章翻译为优雅、地道、信达雅的中文。必须严格保持段落数量与原文一一对应，段落间用两个换行分隔。不要输出任何多余的寒暄或解释。'
          },
          {
            role: 'user',
            content: article.content
          }
        ]
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const translatedText = data.choices[0].message.content.trim();

    article.translation = translatedText;
    state.saveArticles();

    // Re-render reader with cached translation
    openReader(state.currentArticleId);
    state.showArticleTranslation = true;
    contentArea.classList.add('show-translation');
    btn?.classList.add('active');
    if (span) span.textContent = '译';
    showToast('✨ 全文对照翻译完成！');
  } catch (e) {
    if (span) span.textContent = '译';
    showToast('翻译请求失败，请检查网络或 API Key');
  }
}

// Add/Edit Article Modal
function openArticleModal(articleId = null) {
  const modal = document.getElementById('articleModalBackdrop');
  const titleInput = document.getElementById('articleTitleInput');
  const contentInput = document.getElementById('articleContentInput');
  const modalTitle = document.getElementById('articleModalTitle');

  if (articleId) {
    const art = state.articles.find(a => a.id === articleId);
    if (!art) return;
    modalTitle.textContent = '编辑英语文章';
    titleInput.value = art.title;
    contentInput.value = art.content;
    modal.dataset.editId = articleId;
  } else {
    modalTitle.textContent = '存入新英语文章';
    titleInput.value = '';
    contentInput.value = '';
    delete modal.dataset.editId;
  }

  updateModalWordCount();
  modal.classList.add('active');
}

function closeArticleModal() {
  document.getElementById('articleModalBackdrop')?.classList.remove('active');
}

function updateModalWordCount() {
  const content = document.getElementById('articleContentInput')?.value || '';
  const count = content.trim() ? content.trim().split(/\s+/).length : 0;
  const countEl = document.getElementById('modalWordCount');
  if (countEl) countEl.textContent = `${count} 词`;
}

function saveArticleFromModal() {
  const modal = document.getElementById('articleModalBackdrop');
  const title = document.getElementById('articleTitleInput').value.trim();
  const content = document.getElementById('articleContentInput').value.trim();

  if (!title || !content) {
    showToast('请填写文章标题和英文正文');
    return;
  }

  const editId = modal.dataset.editId;
  if (editId) {
    const art = state.articles.find(a => a.id === editId);
    if (art) {
      art.title = title;
      art.content = content;
      art.translation = null; // Clear cached translation to trigger re-translation
    }
  } else {
    const newArt = {
      id: 'article_' + Date.now(),
      title,
      content,
      translation: null,
      createdAt: new Date().toISOString()
    };
    state.articles.unshift(newArt);
  }

  state.saveArticles();
  closeArticleModal();
  renderArticleList();
  showToast('文章已保存！');

  if (editId && state.currentArticleId === editId) {
    openReader(editId);
  }
}

// ==================== 8. LESSON MANAGEMENT & LISTENER VIEW ====================
let nativeAudio = null;

function renderLessonList() {
  const container = document.getElementById('lessonListContainer');
  const countEl = document.getElementById('lessonTotalCount');
  const query = (document.getElementById('lessonSearchInput')?.value || '').toLowerCase().trim();
  const activePill = document.querySelector('#lessonFilterPills .pill.active')?.dataset.filter || 'all';

  let list = state.lessons;

  if (activePill === 'in_progress') {
    list = list.filter(l => !l.completed);
  } else if (activePill === 'favorite') {
    list = list.filter(l => l.favorite);
  } else if (activePill === 'completed') {
    list = list.filter(l => l.completed);
  }

  if (query) {
    list = list.filter(l =>
      l.title.toLowerCase().includes(query) ||
      (l.category && l.category.toLowerCase().includes(query)) ||
      (l.sentences && l.sentences.some(s => s.text.toLowerCase().includes(query)))
    );
  }

  if (countEl) countEl.textContent = `${state.lessons.length} 篇`;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 16px; color: var(--text-muted);">
        <p style="font-size:32px; margin-bottom:8px;">🎧</p>
        <p style="font-size:14px;">暂无匹配听力，点击右上角「+ 存听力」存入你的专属精听素材！</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(lesson => {
    const sentenceCount = lesson.sentences ? lesson.sentences.length : 0;
    const durStr = formatTime(lesson.duration || 0);
    const preview = lesson.sentences && lesson.sentences[0] ? lesson.sentences[0].text : '暂无原文预览';

    return `
      <div class="lesson-card" data-lesson-id="${lesson.id}">
        <div class="lesson-card-header">
          <span class="lesson-badge">${escapeHtml(lesson.category || '日常精听')}</span>
          <span class="lesson-meta-text">⏱ ${durStr} · ${sentenceCount} 句</span>
        </div>
        <h3 class="lesson-title-text">${escapeHtml(lesson.title)}</h3>
        <p class="lesson-preview-box">${escapeHtml(preview)}</p>
        <div class="lesson-footer-row">
          <span>${lesson.audioSourceType === 'tts' ? '🗣️ 智能朗读' : '🎵 原生音频'}</span>
          <span style="cursor:pointer;" class="btn-toggle-fav" data-fav-id="${lesson.id}">${lesson.favorite ? '❤️ 已收藏' : '🤍 收藏'}</span>
        </div>
      </div>
    `;
  }).join('');
}

async function openListener(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  state.currentLessonId = lessonId;
  const container = document.getElementById('listenerContainer');
  const titleEl = document.getElementById('listenerHeaderTitle');
  const streamEl = document.getElementById('sentencesStream');

  titleEl.textContent = lesson.title;
  state.currentSentenceIndex = -1;
  state.dictationIndex = 0;
  state.showLessonTranslation = false;
  state.isBlindMode = false;
  container.classList.remove('show-translation', 'blind-mode');

  document.getElementById('transModeLabel').textContent = '译';
  document.getElementById('blindModeLabel').textContent = '🙈 盲听';

  // Render Sentences
  streamEl.innerHTML = (lesson.sentences || []).map((sent, sIdx) => {
    const words = sent.text.split(/([a-zA-Z0-9'-]+)/g);
    const wordsHtml = words.map(w => {
      if (/^[a-zA-Z0-9'-]+$/.test(w)) {
        const clean = w.toLowerCase();
        const wordObj = state.getWord(clean);
        const isUnknown = wordObj && !wordObj.mastered;
        return `<span class="sentence-word ${isUnknown ? 'unknown-highlight' : ''}" data-word="${escapeHtml(clean)}" data-sent-idx="${sIdx}">${escapeHtml(w)}</span>`;
      }
      return escapeHtml(w);
    }).join('');

    const transHtml = sent.trans ? `<div class="sentence-trans">${escapeHtml(sent.trans)}</div>` : '';
    const tsStr = formatTime(sent.startTime);

    return `
      <div class="sentence-card" id="sentCard_${sIdx}" data-sent-idx="${sIdx}">
        <div class="sentence-header-row">
          <span class="sentence-ts" data-time="${sent.startTime}">[${tsStr}]</span>
          <button class="sentence-repeat-btn" data-repeat-idx="${sIdx}" title="单句循环重放">🔂</button>
        </div>
        <div class="sentence-text">${wordsHtml}</div>
        ${transHtml}
      </div>
    `;
  }).join('');

  // Setup Audio
  if (!nativeAudio) {
    nativeAudio = document.getElementById('nativeAudio');
  }

  if (state.activeAudioUrl) {
    URL.revokeObjectURL(state.activeAudioUrl);
    state.activeAudioUrl = null;
  }

  if (lesson.audioSourceType === 'file' && lesson.audioBlobId) {
    const blob = await getAudioBlob(lesson.audioBlobId);
    if (blob) {
      state.activeAudioUrl = URL.createObjectURL(blob);
      nativeAudio.src = state.activeAudioUrl;
    }
  } else if (lesson.audioUrl) {
    nativeAudio.src = lesson.audioUrl;
  } else {
    nativeAudio.removeAttribute('src');
  }

  nativeAudio.playbackRate = state.playbackRate;
  updatePlayPauseUI(false);
  container.classList.add('active');
}

function closeListener() {
  if (nativeAudio) {
    nativeAudio.pause();
    updatePlayPauseUI(false);
  }
  clearTimeout(state.autoPauseTimeout);
  document.getElementById('listenerContainer')?.classList.remove('active');
  state.currentLessonId = null;
  renderLessonList();
}

function updatePlayPauseUI(isPlaying) {
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  if (iconPlay && iconPause) {
    iconPlay.style.display = isPlaying ? 'none' : 'block';
    iconPause.style.display = isPlaying ? 'block' : 'none';
  }
}

// Add/Edit Lesson Modal
let pendingAudioBlob = null;
let pendingAudioFilename = null;

function openLessonModal(lessonId = null) {
  const modal = document.getElementById('modalEditLesson');
  const titleInput = document.getElementById('editTitle');
  const catInput = document.getElementById('editCategory');
  const transInput = document.getElementById('editTranscript');
  const notesInput = document.getElementById('editNotes');
  const urlInput = document.getElementById('editAudioUrl');
  const modalTitle = document.getElementById('editLessonModalTitle');

  pendingAudioBlob = null;
  pendingAudioFilename = null;
  document.getElementById('fileDropText').textContent = '点击或拖放音频文件 (MP3, M4A, WAV)';

  // Reset source tab to file
  document.querySelectorAll('.source-tab').forEach(b => b.classList.remove('active'));
  document.querySelector('.source-tab[data-source="file"]')?.classList.add('active');
  document.getElementById('panelSourceFile').style.display = 'block';
  document.getElementById('panelSourceUrl').style.display = 'none';
  document.getElementById('panelSourceTts').style.display = 'none';

  if (lessonId) {
    const lesson = state.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    modalTitle.textContent = '编辑听力素材与原文';
    titleInput.value = lesson.title;
    catInput.value = lesson.category || '日常学习';
    notesInput.value = lesson.notes || '';
    urlInput.value = lesson.audioUrl || '';

    // Reconstruct transcript
    if (lesson.sentences) {
      transInput.value = lesson.sentences.map(s => {
        const ts = formatTime(s.startTime);
        return `[${ts}] ${s.text}\n${s.trans || ''}`;
      }).join('\n\n');
    }

    modal.dataset.editId = lessonId;
  } else {
    modalTitle.textContent = '新增听力素材与原文';
    titleInput.value = '';
    catInput.value = '日常学习';
    transInput.value = '';
    notesInput.value = '';
    urlInput.value = '';
    delete modal.dataset.editId;
  }

  modal.classList.add('active');
}

function closeLessonModal() {
  document.getElementById('modalEditLesson')?.classList.remove('active');
}

function parseTranscript(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const sentences = [];
  let curTime = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tsMatch = line.match(/^\[(\d{1,2}):(\d{2}(?:\.\d+)?)\]\s*(.*)$/);

    if (tsMatch) {
      const min = parseFloat(tsMatch[1]);
      const sec = parseFloat(tsMatch[2]);
      const content = tsMatch[3].trim();
      const nextLine = lines[i + 1];
      let trans = '';

      if (nextLine && !nextLine.startsWith('[')) {
        trans = nextLine;
        i++;
      }

      sentences.push({
        id: 's_' + (sentences.length + 1),
        startTime: min * 60 + sec,
        endTime: (min * 60 + sec) + 5, // Default 5s length
        text: content,
        trans
      });
    } else {
      // Plain text sentences: auto split by punctuation
      const subSentences = line.match(/[^.!?]+[.!?]+|\S+/g) || [line];
      subSentences.forEach(sub => {
        const clean = sub.trim();
        if (clean) {
          sentences.push({
            id: 's_' + (sentences.length + 1),
            startTime: curTime,
            endTime: curTime + 5,
            text: clean,
            trans: ''
          });
          curTime += 5;
        }
      });
    }
  }

  // Adjust end times to match next start time
  for (let i = 0; i < sentences.length - 1; i++) {
    sentences[i].endTime = sentences[i + 1].startTime;
  }

  return sentences;
}

async function saveLessonFromModal(e) {
  e.preventDefault();
  const modal = document.getElementById('modalEditLesson');
  const title = document.getElementById('editTitle').value.trim();
  const category = document.getElementById('editCategory').value.trim() || '日常学习';
  const transcript = document.getElementById('editTranscript').value.trim();
  const notes = document.getElementById('editNotes').value.trim();
  const activeSourceTab = document.querySelector('.source-tab.active')?.dataset.source || 'file';
  const audioUrl = document.getElementById('editAudioUrl').value.trim();

  if (!title || !transcript) {
    showToast('请填写素材标题与听力原文');
    return;
  }

  const sentences = parseTranscript(transcript);
  if (sentences.length === 0) {
    showToast('听力原文格式未能识别，请检查内容');
    return;
  }

  const editId = modal.dataset.editId;
  let lesson = editId ? state.lessons.find(l => l.id === editId) : null;

  let audioBlobId = lesson ? lesson.audioBlobId : null;
  if (activeSourceTab === 'file' && pendingAudioBlob) {
    audioBlobId = 'blob_' + Date.now();
    await saveAudioBlob(audioBlobId, pendingAudioBlob, pendingAudioFilename);
  }

  const duration = sentences.length > 0 ? sentences[sentences.length - 1].endTime : 30;

  if (lesson) {
    lesson.title = title;
    lesson.category = category;
    lesson.audioSourceType = activeSourceTab;
    lesson.audioBlobId = audioBlobId;
    if (activeSourceTab === 'url') lesson.audioUrl = audioUrl;
    lesson.sentences = sentences;
    lesson.notes = notes;
    lesson.duration = duration;
    lesson.updatedAt = Date.now();
  } else {
    lesson = {
      id: 'lesson_' + Date.now(),
      title,
      category,
      audioSourceType: activeSourceTab,
      audioUrl: activeSourceTab === 'url' ? audioUrl : null,
      audioBlobId,
      duration,
      favorite: false,
      completed: false,
      updatedAt: Date.now(),
      sentences,
      notes
    };
    state.lessons.unshift(lesson);
  }

  state.saveLessons();
  closeLessonModal();
  renderLessonList();
  showToast('听力素材已保存！');

  openListener(lesson.id);
}

// ==================== 9. LISTENER AUDIO TIMELINE & PLAYBACK ====================
function setupAudioListeners() {
  nativeAudio = document.getElementById('nativeAudio');
  if (!nativeAudio) return;

  nativeAudio.addEventListener('timeupdate', () => {
    if (!state.currentLessonId) return;
    const lesson = state.lessons.find(l => l.id === state.currentLessonId);
    if (!lesson) return;

    const cur = nativeAudio.currentTime;
    const dur = nativeAudio.duration || lesson.duration || 1;

    // Update timeline
    const progressEl = document.getElementById('timelineProgress');
    const thumbEl = document.getElementById('timelineThumb');
    const curTimeEl = document.getElementById('timeCurrent');
    const durTimeEl = document.getElementById('timeDuration');

    const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
    if (progressEl) progressEl.style.width = `${pct}%`;
    if (thumbEl) thumbEl.style.left = `${pct}%`;
    if (curTimeEl) curTimeEl.textContent = formatTime(cur);
    if (durTimeEl) durTimeEl.textContent = formatTime(dur);

    // Active sentence check
    const sIdx = (lesson.sentences || []).findIndex(s => cur >= s.startTime && cur < s.endTime);
    if (sIdx !== -1 && sIdx !== state.currentSentenceIndex) {
      highlightActiveSentence(sIdx);
    }

    // Check sentence end auto-pause & single sentence repeat
    if (state.currentSentenceIndex !== -1 && lesson.sentences[state.currentSentenceIndex]) {
      const curSent = lesson.sentences[state.currentSentenceIndex];
      if (cur >= curSent.endTime - 0.15 && !state.isPausedForRepeat) {
        if (state.loopMode === 'single') {
          nativeAudio.currentTime = curSent.startTime;
          nativeAudio.play();
        } else if (state.settings.autoPauseSec > 0) {
          state.isPausedForRepeat = true;
          nativeAudio.pause();
          updatePlayPauseUI(false);
          clearTimeout(state.autoPauseTimeout);
          state.autoPauseTimeout = setTimeout(() => {
            state.isPausedForRepeat = false;
            nativeAudio.play();
            updatePlayPauseUI(true);
          }, state.settings.autoPauseSec * 1000);
        }
      }
    }
  });

  nativeAudio.addEventListener('play', () => updatePlayPauseUI(true));
  nativeAudio.addEventListener('pause', () => updatePlayPauseUI(false));
  nativeAudio.addEventListener('ended', () => {
    updatePlayPauseUI(false);
    if (state.loopMode === 'single' && state.currentSentenceIndex !== -1) {
      const lesson = state.lessons.find(l => l.id === state.currentLessonId);
      if (lesson && lesson.sentences[state.currentSentenceIndex]) {
        nativeAudio.currentTime = lesson.sentences[state.currentSentenceIndex].startTime;
        nativeAudio.play();
      }
    }
  });
}

function highlightActiveSentence(idx) {
  state.currentSentenceIndex = idx;
  document.querySelectorAll('.sentence-card').forEach((card, i) => {
    card.classList.toggle('active-sentence', i === idx);
  });

  const activeCard = document.getElementById(`sentCard_${idx}`);
  if (activeCard) {
    activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ==================== 10. DICTATION DRAWER ====================
function openDictationDrawer() {
  const lesson = state.lessons.find(l => l.id === state.currentLessonId);
  if (!lesson || !lesson.sentences || lesson.sentences.length === 0) {
    showToast('当前课程无原文句子');
    return;
  }

  const sheet = document.getElementById('dictationSheet');
  const backdrop = document.getElementById('dictationBackdrop');
  state.dictationIndex = Math.max(0, state.currentSentenceIndex);

  updateDictationStep();
  sheet.classList.add('active');
  backdrop.classList.add('active');
}

function closeDictationDrawer() {
  document.getElementById('dictationSheet')?.classList.remove('active');
  document.getElementById('dictationBackdrop')?.classList.remove('active');
}

function updateDictationStep() {
  const lesson = state.lessons.find(l => l.id === state.currentLessonId);
  if (!lesson) return;

  const badge = document.getElementById('dictationStepBadge');
  const textarea = document.getElementById('dictationTextarea');
  const diffBox = document.getElementById('dictationDiffBox');

  badge.textContent = `句 ${state.dictationIndex + 1}/${lesson.sentences.length}`;
  textarea.value = '';
  diffBox.style.display = 'none';

  // Play this sentence
  const sent = lesson.sentences[state.dictationIndex];
  if (sent && nativeAudio) {
    nativeAudio.currentTime = sent.startTime;
    nativeAudio.play();
  }
}

function checkDictation() {
  const lesson = state.lessons.find(l => l.id === state.currentLessonId);
  if (!lesson) return;
  const sent = lesson.sentences[state.dictationIndex];
  if (!sent) return;

  const typed = document.getElementById('dictationTextarea').value.trim();
  const diffBox = document.getElementById('dictationDiffBox');
  const diffContent = document.getElementById('diffViewContent');
  const diffTrans = document.getElementById('diffViewTrans');
  const scoreBadge = document.getElementById('diffScoreBadge');

  const targetTokens = sent.text.split(/\s+/);
  const typedTokens = typed.split(/\s+/).filter(Boolean);

  let matchCount = 0;
  const htmlParts = targetTokens.map((targetWord, i) => {
    const cleanTarget = targetWord.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const cleanTyped = typedTokens[i] ? typedTokens[i].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '';

    if (cleanTarget === cleanTyped) {
      matchCount++;
      return `<span class="diff-correct">${escapeHtml(targetWord)}</span>`;
    } else if (!cleanTyped) {
      return `<span class="diff-missing">${escapeHtml(targetWord)}</span>`;
    } else {
      return `<span class="diff-wrong" title="你键入了: ${escapeHtml(typedTokens[i])}">${escapeHtml(targetWord)}</span>`;
    }
  });

  const score = Math.round((matchCount / Math.max(1, targetTokens.length)) * 100);
  scoreBadge.textContent = `准确率: ${score}%`;
  diffContent.innerHTML = htmlParts.join(' ');
  diffTrans.textContent = sent.trans || '暂无中文翻译';
  diffBox.style.display = 'block';
}

// ==================== 11. UNIFIED VOCABULARY TAB ====================
function renderVocabList() {
  const container = document.getElementById('vocabListContainer');
  const query = (document.getElementById('vocabSearchInput')?.value || '').toLowerCase().trim();
  const activePill = document.querySelector('#vocabFilterPills .pill.active')?.dataset.vfilter || 'all';

  let list = state.vocab;

  if (activePill === 'article') {
    list = list.filter(v => v.sourceType === 'article');
  } else if (activePill === 'lesson') {
    list = list.filter(v => v.sourceType === 'lesson');
  } else if (activePill === 'mastered') {
    list = list.filter(v => v.mastered);
  }

  if (query) {
    list = list.filter(v =>
      v.word.toLowerCase().includes(query) ||
      (v.translation && v.translation.toLowerCase().includes(query)) ||
      (v.contextSentence && v.contextSentence.toLowerCase().includes(query))
    );
  }

  updateVocabBadges();

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 16px; color: var(--text-muted);">
        <p style="font-size:32px; margin-bottom:8px;">📝</p>
        <p style="font-size:14px;">生词本空空如也，在阅读文章或听力精听中轻点任意单词即可收录！</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(v => {
    const isArt = v.sourceType === 'article';
    const tagEmoji = isArt ? '📖' : '🎧';
    const tagText = `${tagEmoji} ${escapeHtml(v.sourceTitle || (isArt ? '阅读' : '听力'))}`;

    return `
      <div class="vocab-card ${v.mastered ? 'mastered' : ''}" data-word="${escapeHtml(v.word)}">
        <div class="vocab-card-header">
          <div class="vocab-word-row">
            <span class="vocab-word-title">${escapeHtml(v.word)}</span>
            <span class="vocab-phonetic-text">${escapeHtml(v.phonetic || '')}</span>
            <button class="btn-icon-subtle btn-speak-vocab" data-word="${escapeHtml(v.word)}" title="点击发音" style="width:26px; height:26px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </button>
          </div>
          <span class="vocab-source-tag" data-source-type="${v.sourceType}" data-source-id="${v.sourceId}">${tagText}</span>
        </div>

        <div class="vocab-trans-text">${escapeHtml(v.translation || '自定义生词')}</div>
        ${v.contextSentence ? `<div class="vocab-ctx-text">“${escapeHtml(v.contextSentence)}”</div>` : ''}

        <div class="vocab-footer-actions">
          <button class="btn-subtle btn-sm btn-vocab-similar" data-word="${escapeHtml(v.word)}" title="查看形近词辨析与趣味串记">
            🧩 形近词
          </button>
          <button class="btn-subtle btn-sm btn-toggle-master" data-word="${escapeHtml(v.word)}">
            ${v.mastered ? '重学' : '✓ 标记掌握'}
          </button>
          <button class="btn-subtle btn-sm btn-delete-vocab" data-word="${escapeHtml(v.word)}" style="color:var(--danger)">
            移除
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function exportVocabAsText() {
  if (state.vocab.length === 0) {
    showToast('生词本暂无内容可导出');
    return;
  }

  const content = state.vocab.map(v => {
    return `${v.word}  ${v.phonetic || ''}\n【释义】${v.translation || ''}\n【语境】${v.contextSentence || ''}\n【来源】${v.sourceType === 'article' ? '阅读' : '听力'} - ${v.sourceTitle || ''}\n${'-'.repeat(40)}`;
  }).join('\n\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `极简英文_生词本_${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('生词本文本已导出！');
}

// ==================== 12. DATA BACKUP & RESTORE ====================
function exportUnifiedBackup() {
  const data = {
    appName: 'Minimal English',
    version: 2,
    exportDate: new Date().toISOString(),
    articles: state.articles,
    lessons: state.lessons,
    vocab: state.vocab,
    similarHistory: state.similarHistory,
    settings: state.settings
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `极简英文_完整备份_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('备份文件已下载！');
}

function importUnifiedBackup(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.articles && Array.isArray(data.articles)) {
        state.articles = data.articles;
        state.saveArticles();
      }
      if (data.lessons && Array.isArray(data.lessons)) {
        state.lessons = data.lessons;
        state.saveLessons();
      }
      if (data.vocab && Array.isArray(data.vocab)) {
        state.vocab = data.vocab;
        state.saveVocab();
      }
      if (data.similarHistory && Array.isArray(data.similarHistory)) {
        state.similarHistory = data.similarHistory;
        state.saveSimilarHistory();
      }
      if (data.settings && typeof data.settings === 'object') {
        state.settings = { ...state.settings, ...data.settings };
        state.saveSettings();
        applySettings();
      }

      renderArticleList();
      renderLessonList();
      renderVocabList();
      renderSimilarHistory();
      showToast('数据备份恢复成功！');
    } catch (err) {
      showToast('备份文件格式有误，恢复失败');
    }
  };
  reader.readAsText(file);
}

// ==================== 12. SIMILAR WORDS (形近词智记 & 故事串记) ====================
function renderSimilarGroup(group) {
  if (!group) return;
  state.currentSimilarGroup = group;
  const container = document.getElementById('similarResultContainer');
  if (!container) return;

  const wordsHtml = (group.words || []).map((w, idx) => {
    const isSaved = !!state.getWord(w.word);
    return `
      <div class="similar-word-card">
        <div class="word-main-row">
          <div class="word-main-left">
            <span class="sim-word-head">${escapeHtml(w.word)}</span>
            <span class="sim-word-phonetic">${escapeHtml(w.phonetic || '')}</span>
            <span class="sim-word-pos">${escapeHtml(w.pos || '')}</span>
            <button class="btn-icon-subtle btn-speak-sim-word" data-word="${escapeHtml(w.word)}" title="发音" style="width:24px; height:24px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </button>
          </div>
          <button class="btn-subtle btn-sm btn-save-sim-word" data-word-idx="${idx}">
            ${isSaved ? '✓ 已收录' : '+ 生词本'}
          </button>
        </div>

        <div class="sim-word-meaning">${escapeHtml(w.meaning || '')}</div>

        ${w.anchor ? `
          <div class="sim-anchor-badge">
            <span>💡 <strong>记忆锚点：</strong>${escapeHtml(w.anchor)}</span>
          </div>
        ` : ''}

        ${w.collocation ? `
          <div class="sim-collocation-text">🎯 <strong>考点搭配：</strong>${escapeHtml(w.collocation)}</div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Format markdown bold in story text
  const enStoryFormatted = (group.story?.en || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  const cnStoryFormatted = (group.story?.cn || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  container.innerHTML = `
    <div class="similar-group-card">
      <div class="similar-group-header">
        <h3 class="similar-title-text">${escapeHtml(group.groupTitle || '形近易混词群')}</h3>
        <span class="similar-level-badge">${escapeHtml(group.level || '四级 (CET-4)')}</span>
      </div>

      ${group.confusePoint ? `
        <div class="similar-pain-banner">
          ⚠️ <strong>混淆痛点：</strong>${escapeHtml(group.confusePoint)}
        </div>
      ` : ''}

      <div class="similar-words-stack">
        ${wordsHtml}
      </div>

      ${group.story ? `
        <div class="similar-story-card">
          <div class="story-header-row">
            <span>📖 趣味串记小故事 · 一网打尽</span>
            ${group.story.title ? `<span style="font-size:11.5px; opacity:0.85;">「${escapeHtml(group.story.title)}」</span>` : ''}
          </div>
          <div class="story-en-text">${enStoryFormatted}</div>
          <div class="story-cn-text">${cnStoryFormatted}</div>
        </div>
      ` : ''}

      ${group.mnemonicFormula ? `
        <div class="similar-formula-box">
          ✨ <strong>速记口诀：</strong>${escapeHtml(group.mnemonicFormula)}
        </div>
      ` : ''}

      ${group.examTips ? `
        <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; padding: 2px 4px;">
          📌 <strong>考点锦囊：</strong>${escapeHtml(group.examTips)}
        </div>
      ` : ''}

      <div class="similar-actions-row">
        <button class="btn-primary btn-sm" id="btnSaveAllSimWords" style="flex:1; justify-content:center; padding:8px 12px;">
          📥 一键全组入生词本
        </button>
        <button class="btn-secondary btn-sm" id="btnCopySimCard" style="padding:8px 14px;">
          📋 复制文本
        </button>
      </div>
    </div>
  `;
}

function addToSimilarHistory(group) {
  if (!group || !group.words) return;
  const existingIdx = state.similarHistory.findIndex(h => h.groupTitle === group.groupTitle || h.id === group.id);
  if (existingIdx >= 0) {
    state.similarHistory.splice(existingIdx, 1);
  }
  state.similarHistory.unshift(group);
  if (state.similarHistory.length > 20) {
    state.similarHistory.pop();
  }
  state.saveSimilarHistory();
  renderSimilarHistory();
}

function renderSimilarHistory() {
  const container = document.getElementById('similarHistoryList');
  const countEl = document.getElementById('similarHistoryCount');
  if (!container) return;

  const list = state.similarHistory || [];
  if (countEl) countEl.textContent = `${list.length} 组`;

  if (list.length === 0) {
    container.innerHTML = '<div style="font-size:12px; color:var(--text-muted); padding:10px 0;">暂无记录，输入单词或点击上方真题精选开始探索！</div>';
    return;
  }

  container.innerHTML = list.map((item, idx) => {
    const wordsPreview = (item.words || []).map(w => w.word).join(' · ');
    return `
      <div class="similar-history-item" data-history-idx="${idx}">
        <div style="display:flex; flex-direction:column; gap:2px;">
          <div style="font-weight:700; font-size:13.5px; color:var(--text-primary);">${escapeHtml(item.groupTitle || wordsPreview)}</div>
          <div style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(wordsPreview)}</div>
        </div>
        <span class="badge-tag" style="font-size:10.5px;">${escapeHtml(item.level || '四级')}</span>
      </div>
    `;
  }).join('');
}

async function generateSimilarWords(rawInput, scope = 'CET-4') {
  const input = (rawInput || '').trim();
  const loadingBox = document.getElementById('similarLoadingBox');
  const resultBox = document.getElementById('similarResultContainer');

  if (!input) {
    showToast('请输入想要辨析的单词或形近词组');
    return;
  }

  // 1. Check if matches preset
  const inputClean = input.toLowerCase().replace(/[\/,\s]+/g, ' ').trim();
  const matchedPreset = DEFAULT_SIMILAR_PRESETS.find(p => {
    const pWords = p.words.map(w => w.word.toLowerCase());
    return pWords.some(w => inputClean.includes(w)) || p.groupTitle.toLowerCase().includes(inputClean);
  });

  // If no deepseek key
  if (!state.settings.deepseekKey) {
    if (matchedPreset) {
      renderSimilarGroup(matchedPreset);
      addToSimilarHistory(matchedPreset);
      showToast(`已加载精选真题形近词：${matchedPreset.groupTitle}`);
    } else {
      showToast('未检测到 DeepSeek Key，已为您加载四级标杆词组。可在「设置」填入 Key 启用任意词自由生成！');
      renderSimilarGroup(DEFAULT_SIMILAR_PRESETS[0]);
      addToSimilarHistory(DEFAULT_SIMILAR_PRESETS[0]);
    }
    return;
  }

  // 2. Call DeepSeek AI
  if (loadingBox) loadingBox.style.display = 'block';
  if (resultBox) resultBox.style.opacity = '0.35';

  try {
    const prompt = `用户输入目标单词: "${input}"\n学习/考试范围要求: "${scope}"\n\n请针对以上输入执行：
1. 若输入为单个单词，请在「${scope}」范围内找出与其拼写最形似、极易在阅读/听力中混淆的 1~3 个形近词构成词群；若为多个词，直接对此组词展开深度辨析。
2. 提炼出本组词在考试中的核心【混淆痛点】。
3. 对每个单词提炼出极为巧妙的【字母差异与记忆锚点】（例如通过关键不同字母联想到相关单词或图像，如 adapt 中的 a 联想 action 去适应）。
4. 编写一段妙趣横生、紧凑好记的【趣味串记小故事/情景例句】（把这组单词全部自然融入其中，重点词用 **包裹加粗**），并附带对应高亮中文翻译。
5. 给出简练易诵的【辨析速记口诀】与真题考点提示。

请严格返回合法的 JSON 对象，不包含任何 Markdown 代码块标签，格式如下：
{
  "groupTitle": "词1 · 词2 · 词3",
  "level": "${scope}",
  "confusePoint": "混淆痛点说明...",
  "words": [
    {
      "word": "单词",
      "phonetic": "/音标/",
      "pos": "词性如 v.",
      "meaning": "核心中文释义",
      "anchor": "关键字母差异与记忆锚点",
      "collocation": "真题常用搭配",
      "example": "典型例句"
    }
  ],
  "story": {
    "title": "故事小标题",
    "en": "英文小故事（重点词加粗）",
    "cn": "对应中文翻译（重点词加粗）"
  },
  "mnemonicFormula": "一句话速记口诀",
  "examTips": "考点提示"
}`;

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.settings.deepseekKey.trim()}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: '你是一位精通认知心理学与英语词汇记忆的大师。擅长用字母微差拆解、记忆锚点与趣味情景故事帮助学生彻底攻克形近混淆词。只输出合法 JSON，不输出任何多余废话。'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    let content = data.choices[0].message.content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/^```json\s*|^```\s*|```$/g, '');
    }

    const parsed = JSON.parse(content);
    parsed.id = 'ai_' + Date.now();
    parsed.createdAt = new Date().toISOString();

    renderSimilarGroup(parsed);
    addToSimilarHistory(parsed);
    showToast(`✨ DeepSeek 已为「${parsed.groupTitle}」生成专属记忆故事与辨析！`);
  } catch (err) {
    console.error('DeepSeek AI generate failed:', err);
    showToast(`AI 生成失败: ${err.message || '请检查网络或 API Key'}`);
    if (matchedPreset) renderSimilarGroup(matchedPreset);
  } finally {
    if (loadingBox) loadingBox.style.display = 'none';
    if (resultBox) resultBox.style.opacity = '1';
  }
}

// ==================== 13. APP INITIALIZATION & EVENT BINDINGS ====================
function switchTab(tabId) {
  state.currentTab = tabId;

  // View panels
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');

  // Bottom nav
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });

  // Top header elements
  const brandEmoji = document.getElementById('brandEmoji');
  const brandName = document.getElementById('brandName');
  const brandBadge = document.getElementById('brandBadge');
  const btnNewArticle = document.getElementById('btnNewArticle');
  const btnNewLesson = document.getElementById('btnNewLesson');
  const btnExportVocabText = document.getElementById('btnExportVocabText');

  btnNewArticle.style.display = 'none';
  btnNewLesson.style.display = 'none';
  btnExportVocabText.style.display = 'none';

  if (tabId === 'viewArticles') {
    brandEmoji.textContent = '📖';
    brandName.textContent = '极简英文 · 阅读';
    brandBadge.textContent = `${state.articles.length} 篇`;
    btnNewArticle.style.display = 'inline-flex';
    renderArticleList();
  } else if (tabId === 'viewLessons') {
    brandEmoji.textContent = '🎧';
    brandName.textContent = '极简英文 · 听力';
    brandBadge.textContent = `${state.lessons.length} 篇`;
    btnNewLesson.style.display = 'inline-flex';
    renderLessonList();
  } else if (tabId === 'viewSimilarWords') {
    brandEmoji.textContent = '🧩';
    brandName.textContent = '极简英文 · 形近词';
    brandBadge.textContent = 'AI 智记';
    if (!state.currentSimilarGroup) {
      renderSimilarGroup(DEFAULT_SIMILAR_PRESETS[0]);
    } else {
      renderSimilarGroup(state.currentSimilarGroup);
    }
    renderSimilarHistory();
  } else if (tabId === 'viewVocab') {
    brandEmoji.textContent = '📝';
    brandName.textContent = '极简英文 · 生词本';
    brandBadge.textContent = `${state.vocab.length} 词`;
    btnExportVocabText.style.display = 'inline-flex';
    renderVocabList();
  } else if (tabId === 'viewSettings') {
    brandEmoji.textContent = '⚙️';
    brandName.textContent = '极简英文 · 设置';
    brandBadge.textContent = '100% 本地';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applySettings();
  setupAudioListeners();

  // Initial renders
  renderArticleList();
  renderLessonList();
  renderVocabList();
  updateVocabBadges();
  switchTab('viewArticles');

  // --- Bottom Navigation Tab Click ---
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // --- Quick Theme Cycle Button in Header ---
  document.getElementById('btnQuickTheme')?.addEventListener('click', () => {
    const themes = ['warm', 'light', 'dark'];
    const curIdx = themes.indexOf(state.settings.theme);
    state.settings.theme = themes[(curIdx + 1) % themes.length];
    state.saveSettings();
    applySettings();
  });

  // --- Top Action Buttons ---
  document.getElementById('btnNewArticle')?.addEventListener('click', () => openArticleModal());
  document.getElementById('btnNewLesson')?.addEventListener('click', () => openLessonModal());
  document.getElementById('btnExportVocabText')?.addEventListener('click', exportVocabAsText);

  // --- Search & Filters ---
  document.getElementById('articleSearchInput')?.addEventListener('input', renderArticleList);
  document.getElementById('lessonSearchInput')?.addEventListener('input', renderLessonList);
  document.getElementById('vocabSearchInput')?.addEventListener('input', renderVocabList);

  document.querySelectorAll('#lessonFilterPills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#lessonFilterPills .pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderLessonList();
    });
  });

  document.querySelectorAll('#vocabFilterPills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#vocabFilterPills .pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderVocabList();
    });
  });

  // --- Click Article Card ---
  document.getElementById('articleListContainer')?.addEventListener('click', (e) => {
    const card = e.target.closest('.article-card');
    if (card) openReader(card.dataset.articleId);
  });

  // --- Click Lesson Card ---
  document.getElementById('lessonListContainer')?.addEventListener('click', (e) => {
    if (e.target.closest('.btn-toggle-fav')) {
      const id = e.target.closest('.btn-toggle-fav').dataset.favId;
      const lesson = state.lessons.find(l => l.id === id);
      if (lesson) {
        lesson.favorite = !lesson.favorite;
        state.saveLessons();
        renderLessonList();
      }
      return;
    }
    const card = e.target.closest('.lesson-card');
    if (card) openListener(card.dataset.lessonId);
  });

  // --- Reader Event Delegations ---
  document.getElementById('btnReaderBack')?.addEventListener('click', closeReader);
  document.getElementById('btnToggleTranslate')?.addEventListener('click', toggleArticleTranslation);
  document.getElementById('btnReaderEdit')?.addEventListener('click', () => {
    if (state.currentArticleId) openArticleModal(state.currentArticleId);
  });
  document.getElementById('btnReaderOptions')?.addEventListener('click', () => {
    const box = document.getElementById('readerTypographyBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('btnCloseReaderTypo')?.addEventListener('click', () => {
    document.getElementById('readerTypographyBox').style.display = 'none';
  });

  // Word Click Delegation in Reader
  document.getElementById('readerContentArea')?.addEventListener('click', (e) => {
    const target = e.target.closest('.word-token');
    if (!target) return;
    const word = target.dataset.word;
    const para = target.closest('.reader-para');
    const sentence = para ? para.textContent : '';
    const article = state.articles.find(a => a.id === state.currentArticleId);
    openWordInspector(word, sentence, 'article', state.currentArticleId, article ? article.title : '文章阅读');
  });

  // --- Listener Event Delegations ---
  document.getElementById('btnListenerBack')?.addEventListener('click', closeListener);
  document.getElementById('btnToggleBlind')?.addEventListener('click', () => {
    state.isBlindMode = !state.isBlindMode;
    const container = document.getElementById('listenerContainer');
    const label = document.getElementById('blindModeLabel');
    container.classList.toggle('blind-mode', state.isBlindMode);
    label.textContent = state.isBlindMode ? '👀 显现' : '🙈 盲听';
    showToast(state.isBlindMode ? '已开启磨耳朵盲听模式（轻触句子可刮开）' : '已恢复精听对照模式');
  });

  document.getElementById('btnToggleTrans')?.addEventListener('click', () => {
    state.showLessonTranslation = !state.showLessonTranslation;
    const container = document.getElementById('listenerContainer');
    container.classList.toggle('show-translation', state.showLessonTranslation);
    document.getElementById('btnToggleTrans')?.classList.toggle('active', state.showLessonTranslation);
  });

  document.getElementById('btnToggleDictation')?.addEventListener('click', openDictationDrawer);
  document.getElementById('btnEditCurrentLesson')?.addEventListener('click', () => {
    if (state.currentLessonId) openLessonModal(state.currentLessonId);
  });

  // Sentence interactions in Listener
  document.getElementById('sentencesStream')?.addEventListener('click', (e) => {
    // Reveal blurred sentence in blind mode
    if (state.isBlindMode && e.target.closest('.sentence-text')) {
      const textEl = e.target.closest('.sentence-text');
      textEl.classList.toggle('unmasked');
      return;
    }

    // Word click
    if (e.target.closest('.sentence-word')) {
      const wordEl = e.target.closest('.sentence-word');
      const word = wordEl.dataset.word;
      const card = wordEl.closest('.sentence-card');
      const sIdx = parseInt(card.dataset.sentIdx, 10);
      const lesson = state.lessons.find(l => l.id === state.currentLessonId);
      const sentence = (lesson && lesson.sentences[sIdx]) ? lesson.sentences[sIdx].text : '';
      openWordInspector(word, sentence, 'lesson', state.currentLessonId, lesson ? lesson.title : '听力课程');
      return;
    }

    // Single repeat button
    if (e.target.closest('.sentence-repeat-btn')) {
      const sIdx = parseInt(e.target.closest('.sentence-repeat-btn').dataset.repeatIdx, 10);
      const lesson = state.lessons.find(l => l.id === state.currentLessonId);
      if (lesson && lesson.sentences[sIdx] && nativeAudio) {
        nativeAudio.currentTime = lesson.sentences[sIdx].startTime;
        nativeAudio.play();
        highlightActiveSentence(sIdx);
      }
      return;
    }

    // Timestamp click
    if (e.target.closest('.sentence-ts')) {
      const time = parseFloat(e.target.closest('.sentence-ts').dataset.time);
      if (!isNaN(time) && nativeAudio) {
        nativeAudio.currentTime = time;
        nativeAudio.play();
      }
    }
  });

  // --- Player Bar Controls ---
  document.getElementById('btnPlayPause')?.addEventListener('click', () => {
    if (!nativeAudio) return;
    if (nativeAudio.paused) {
      nativeAudio.play().catch(() => {});
    } else {
      nativeAudio.pause();
    }
  });

  document.getElementById('btnRewind')?.addEventListener('click', () => {
    if (!nativeAudio) return;
    nativeAudio.currentTime = Math.max(0, nativeAudio.currentTime - state.settings.rewindStep);
  });

  document.getElementById('btnForward')?.addEventListener('click', () => {
    if (!nativeAudio) return;
    nativeAudio.currentTime = Math.min(nativeAudio.duration || 9999, nativeAudio.currentTime + state.settings.rewindStep);
  });

  document.getElementById('btnLoopMode')?.addEventListener('click', () => {
    const modes = ['sequential', 'single'];
    const curIdx = modes.indexOf(state.loopMode);
    state.loopMode = modes[(curIdx + 1) % modes.length];
    document.getElementById('loopModeText').textContent = state.loopMode === 'single' ? '单句' : '顺序';
    showToast(state.loopMode === 'single' ? '已开启「单句循环」' : '已开启「顺序播放」');
  });

  // Speed Menu
  const btnSpeed = document.getElementById('btnSpeedPicker');
  const speedMenu = document.getElementById('speedMenu');
  btnSpeed?.addEventListener('click', (e) => {
    e.stopPropagation();
    speedMenu?.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    speedMenu?.classList.remove('show');
  });

  document.querySelectorAll('.speed-item').forEach(item => {
    item.addEventListener('click', () => {
      const rate = parseFloat(item.dataset.rate);
      state.playbackRate = rate;
      if (nativeAudio) nativeAudio.playbackRate = rate;
      document.getElementById('speedValueLabel').textContent = `${rate}x`;
      document.querySelectorAll('.speed-item').forEach(i => i.classList.toggle('active', i === item));
    });
  });

  // Timeline scrubber seek
  document.getElementById('timelineBar')?.addEventListener('click', (e) => {
    if (!nativeAudio || !nativeAudio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    nativeAudio.currentTime = pos * nativeAudio.duration;
  });

  // --- Dictation Drawer Events ---
  document.getElementById('btnDictationClose')?.addEventListener('click', closeDictationDrawer);
  document.getElementById('dictationBackdrop')?.addEventListener('click', closeDictationDrawer);
  document.getElementById('btnDictationReplay')?.addEventListener('click', () => {
    const lesson = state.lessons.find(l => l.id === state.currentLessonId);
    if (lesson && lesson.sentences[state.dictationIndex] && nativeAudio) {
      nativeAudio.currentTime = lesson.sentences[state.dictationIndex].startTime;
      nativeAudio.play();
    }
  });
  document.getElementById('btnDictationCheck')?.addEventListener('click', checkDictation);
  document.getElementById('btnDictationNext')?.addEventListener('click', () => {
    const lesson = state.lessons.find(l => l.id === state.currentLessonId);
    if (!lesson) return;
    if (state.dictationIndex < lesson.sentences.length - 1) {
      state.dictationIndex++;
      updateDictationStep();
    } else {
      showToast('🎉 本篇听写已完成全部句子！');
    }
  });

  // --- Word Sheet Events ---
  document.getElementById('sheetBackdrop')?.addEventListener('click', closeWordInspector);
  document.getElementById('btnPronounceWord')?.addEventListener('click', () => {
    if (currentInspectorData?.word) speakWord(currentInspectorData.word);
  });

  document.getElementById('btnToggleEditDef')?.addEventListener('click', () => {
    const transInput = document.getElementById('sheetTranslationInput');
    const isHidden = transInput.style.display === 'none';
    transInput.style.display = isHidden ? 'block' : 'none';
    if (isHidden) transInput.focus();
  });

  document.getElementById('btnToggleSaveWord')?.addEventListener('click', () => {
    if (!currentInspectorData?.word) return;
    const word = currentInspectorData.word;
    const existing = state.getWord(word);

    if (existing && !existing.mastered) {
      state.removeWord(word);
      showToast(`已将「${word}」移出生词本`);
    } else {
      const transInput = document.getElementById('sheetTranslationInput');
      const trans = transInput.value.trim() || document.getElementById('sheetTranslationText').textContent.trim() || '自定义生词';
      const phonetic = document.getElementById('sheetPhonetic').textContent.trim();

      state.addOrUpdateWord({
        id: 'word_' + Date.now(),
        word,
        phonetic,
        translation: trans,
        contextSentence: currentInspectorData.sentence,
        sourceType: currentInspectorData.sourceType,
        sourceId: currentInspectorData.sourceId,
        sourceTitle: currentInspectorData.sourceTitle,
        mastered: false,
        createdAt: new Date().toISOString()
      });
      showToast(`已将「${word}」加入生词本！`);
    }

    closeWordInspector();
    renderVocabList();
    // Refresh highlights in reader/listener
    if (state.currentArticleId) openReader(state.currentArticleId);
  });

  // Jump from Word Inspector to Similar Words AI
  document.getElementById('btnInspectSimilar')?.addEventListener('click', () => {
    if (!currentInspectorData?.word) return;
    const word = currentInspectorData.word;
    closeWordInspector();
    closeReader();
    closeListener();
    switchTab('viewSimilarWords');
    const input = document.getElementById('inputSimilarTarget');
    if (input) input.value = word;
    const scope = document.getElementById('selectSimilarScope')?.value || 'CET-4';
    generateSimilarWords(word, scope);
  });

  // --- Vocab List Action Delegations ---
  document.getElementById('vocabListContainer')?.addEventListener('click', (e) => {
    // Jump to Similar Words from Vocab card
    if (e.target.closest('.btn-vocab-similar')) {
      const word = e.target.closest('.btn-vocab-similar').dataset.word;
      switchTab('viewSimilarWords');
      const input = document.getElementById('inputSimilarTarget');
      if (input) input.value = word;
      const scope = document.getElementById('selectSimilarScope')?.value || 'CET-4';
      generateSimilarWords(word, scope);
      return;
    }

    // Speak word
    if (e.target.closest('.btn-speak-vocab')) {
      const word = e.target.closest('.btn-speak-vocab').dataset.word;
      speakWord(word);
      return;
    }

    // Toggle master
    if (e.target.closest('.btn-toggle-master')) {
      const word = e.target.closest('.btn-toggle-master').dataset.word;
      const v = state.getWord(word);
      if (v) {
        v.mastered = !v.mastered;
        state.saveVocab();
        renderVocabList();
      }
      return;
    }

    // Delete word
    if (e.target.closest('.btn-delete-vocab')) {
      const word = e.target.closest('.btn-delete-vocab').dataset.word;
      state.removeWord(word);
      renderVocabList();
      showToast(`已移除「${word}」`);
      return;
    }

    // Jump to source
    if (e.target.closest('.vocab-source-tag')) {
      const tag = e.target.closest('.vocab-source-tag');
      const sType = tag.dataset.sourceType;
      const sId = tag.dataset.sourceId;
      if (sType === 'article' && sId) {
        openReader(sId);
      } else if (sType === 'lesson' && sId) {
        openListener(sId);
      }
    }
  });

  // --- Article Modal Events ---
  document.getElementById('btnCloseArticleModal')?.addEventListener('click', closeArticleModal);
  document.getElementById('btnCancelArticleModal')?.addEventListener('click', closeArticleModal);
  document.getElementById('btnSaveArticle')?.addEventListener('click', saveArticleFromModal);
  document.getElementById('articleContentInput')?.addEventListener('input', updateModalWordCount);

  // --- Lesson Modal Events ---
  document.getElementById('btnCloseEditModal')?.addEventListener('click', closeLessonModal);
  document.getElementById('btnCancelEditLesson')?.addEventListener('click', closeLessonModal);
  document.getElementById('formEditLesson')?.addEventListener('submit', saveLessonFromModal);

  // Audio source tabs inside modal
  document.querySelectorAll('.source-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.source-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const src = tab.dataset.source;
      document.getElementById('panelSourceFile').style.display = src === 'file' ? 'block' : 'none';
      document.getElementById('panelSourceUrl').style.display = src === 'url' ? 'block' : 'none';
      document.getElementById('panelSourceTts').style.display = src === 'tts' ? 'block' : 'none';
    });
  });

  // File Drop / Upload
  const fileDrop = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('editAudioFile');
  fileDrop?.addEventListener('click', () => fileInput.click());
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      pendingAudioBlob = file;
      pendingAudioFilename = file.name;
      document.getElementById('fileDropText').textContent = `已选音频: ${file.name}`;
    }
  });

  // Smart Format & Sample Template tools
  document.getElementById('btnToolFormat')?.addEventListener('click', () => {
    const textarea = document.getElementById('editTranscript');
    if (!textarea.value.trim()) return;
    const sentences = parseTranscript(textarea.value);
    textarea.value = sentences.map(s => {
      const ts = formatTime(s.startTime);
      return `[${ts}] ${s.text}${s.trans ? '\n' + s.trans : ''}`;
    }).join('\n\n');
    showToast('已完成智能规范分句！');
  });

  document.getElementById('btnToolSample')?.addEventListener('click', () => {
    document.getElementById('editTranscript').value = `[00:00.00] Welcome to today's English listening practice.
欢迎收听今天的英语精听练习。

[00:06.00] Consistent daily practice will bring amazing progress.
每天坚持练习会带来惊人的进步。

[00:12.00] Keep moving forward and never give up.
保持前进，永不放弃。`;
  });

  // --- Settings Events ---
  // Theme Panning
  document.querySelectorAll('.theme-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.settings.theme = pill.dataset.themeVal;
      state.saveSettings();
      applySettings();
    });
  });

  // Font Family
  document.querySelectorAll('.font-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.settings.font = pill.dataset.fontVal;
      state.saveSettings();
      applySettings();
    });
  });

  // Font Size Slider
  document.getElementById('fontSizeSlider')?.addEventListener('input', (e) => {
    state.settings.fontSize = parseInt(e.target.value, 10);
    state.saveSettings();
    applySettings();
  });

  // Font Smaller/Bigger inside Reader
  document.getElementById('btnFontSmaller')?.addEventListener('click', () => {
    state.settings.fontSize = Math.max(15, state.settings.fontSize - 1);
    state.saveSettings();
    applySettings();
  });
  document.getElementById('btnFontBigger')?.addEventListener('click', () => {
    state.settings.fontSize = Math.min(24, state.settings.fontSize + 1);
    state.saveSettings();
    applySettings();
  });

  // Listening Preferences
  document.getElementById('settingAutoPauseSec')?.addEventListener('change', (e) => {
    state.settings.autoPauseSec = parseInt(e.target.value, 10);
    state.saveSettings();
  });
  document.getElementById('settingRewindStep')?.addEventListener('change', (e) => {
    state.settings.rewindStep = parseInt(e.target.value, 10);
    state.saveSettings();
    const lbl = document.getElementById('pRewindLabel');
    if (lbl) lbl.textContent = `${state.settings.rewindStep}s`;
    const fwd = document.getElementById('pForwardLabel');
    if (fwd) fwd.textContent = `${state.settings.rewindStep}s`;
  });

  // DeepSeek Key Management
  const inputKey = document.getElementById('inputDeepseekKey');
  if (inputKey && state.settings.deepseekKey) {
    inputKey.value = state.settings.deepseekKey;
  }

  document.getElementById('btnToggleKeyVisibility')?.addEventListener('click', () => {
    if (inputKey) inputKey.type = inputKey.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('btnSaveDeepseekKey')?.addEventListener('click', async () => {
    const key = inputKey.value.trim();
    if (!key) {
      showToast('请输入有效的 API Key');
      return;
    }
    const testEl = document.getElementById('deepseekTestResult');
    testEl.style.display = 'block';
    testEl.style.color = 'var(--text-muted)';
    testEl.textContent = '正在测试连接 DeepSeek API...';

    try {
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'hi' }]
        })
      });

      if (res.ok) {
        state.settings.deepseekKey = key;
        state.saveSettings();
        applySettings();
        testEl.style.color = 'var(--success)';
        testEl.textContent = '✓ 连接成功！DeepSeek AI 语境查词与全文翻译已激活。';
        showToast('DeepSeek 连接成功并已保存！');
      } else {
        const err = await res.json().catch(() => ({}));
        testEl.style.color = 'var(--danger)';
        testEl.textContent = `连接失败: ${err.error?.message || '请检查 Key 是否有效'}`;
      }
    } catch (e) {
      testEl.style.color = 'var(--danger)';
      testEl.textContent = '网络连接异常，无法连通 api.deepseek.com';
    }
  });

  document.getElementById('btnClearDeepseekKey')?.addEventListener('click', () => {
    state.settings.deepseekKey = '';
    state.saveSettings();
    if (inputKey) inputKey.value = '';
    const testEl = document.getElementById('deepseekTestResult');
    if (testEl) testEl.style.display = 'none';
    applySettings();
    showToast('已清除 DeepSeek API Key');
  });

  // Backup Export & Import
  document.getElementById('btnBackupExport')?.addEventListener('click', exportUnifiedBackup);
  const backupFileInput = document.getElementById('backupFileInput');
  document.getElementById('btnBackupImportTrigger')?.addEventListener('click', () => {
    backupFileInput?.click();
  });
  backupFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importUnifiedBackup(file);
  });

  // Reset Demos
  document.getElementById('btnResetDemos')?.addEventListener('click', () => {
    if (confirm('确定要恢复官方示范素材吗？这将重新加载示例文章和听力课程。')) {
      state.articles = [DEFAULT_ARTICLE];
      state.lessons = JSON.parse(JSON.stringify(DEFAULT_LESSONS));
      state.saveArticles();
      state.saveLessons();
      renderArticleList();
      renderLessonList();
      showToast('已恢复官方示范素材！');
    }
  });

  // --- Similar Words Tab Events ---
  document.getElementById('btnGenSimilarAI')?.addEventListener('click', () => {
    const input = document.getElementById('inputSimilarTarget').value.trim();
    const scope = document.getElementById('selectSimilarScope').value;
    generateSimilarWords(input, scope);
  });

  document.getElementById('inputSimilarTarget')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = e.target.value.trim();
      const scope = document.getElementById('selectSimilarScope').value;
      generateSimilarWords(input, scope);
    }
  });

  document.getElementById('presetChipsContainer')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-btn');
    if (!chip) return;
    document.querySelectorAll('#presetChipsContainer .chip-btn').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const words = chip.dataset.words;
    document.getElementById('inputSimilarTarget').value = words;
    const scope = document.getElementById('selectSimilarScope').value;
    generateSimilarWords(words, scope);
  });

  document.getElementById('btnRandomSimilarPreset')?.addEventListener('click', () => {
    const randomPreset = DEFAULT_SIMILAR_PRESETS[Math.floor(Math.random() * DEFAULT_SIMILAR_PRESETS.length)];
    document.getElementById('inputSimilarTarget').value = randomPreset.words.map(w => w.word).join(' ');
    renderSimilarGroup(randomPreset);
    addToSimilarHistory(randomPreset);
    showToast(`已切换至真题组：${randomPreset.groupTitle}`);
  });

  // Similar Result Delegations: speak word, save single word, save all words, copy text
  document.getElementById('similarResultContainer')?.addEventListener('click', (e) => {
    // Speak word
    if (e.target.closest('.btn-speak-sim-word')) {
      const word = e.target.closest('.btn-speak-sim-word').dataset.word;
      speakWord(word);
      return;
    }

    // Save single word to vocab
    if (e.target.closest('.btn-save-sim-word')) {
      const btn = e.target.closest('.btn-save-sim-word');
      const idx = parseInt(btn.dataset.wordIdx, 10);
      const group = state.currentSimilarGroup;
      if (!group || !group.words || !group.words[idx]) return;

      const w = group.words[idx];
      const isSaved = !!state.getWord(w.word);

      if (isSaved) {
        state.removeWord(w.word);
        btn.textContent = '+ 生词本';
        showToast(`已将「${w.word}」移出生词本`);
      } else {
        state.addOrUpdateWord({
          id: 'word_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          word: w.word,
          phonetic: w.phonetic || '',
          translation: w.meaning || '',
          contextSentence: (group.story && group.story.en) ? group.story.en.replace(/\*\*/g, '') : (w.example || ''),
          sourceType: 'similar',
          sourceId: group.id || '',
          sourceTitle: `形近词: ${group.groupTitle}`,
          mastered: false,
          createdAt: new Date().toISOString()
        });
        btn.textContent = '✓ 已收录';
        showToast(`已将「${w.word}」加入生词本！`);
      }
      renderVocabList();
      return;
    }

    // Save all words in group to vocab
    if (e.target.closest('#btnSaveAllSimWords')) {
      const group = state.currentSimilarGroup;
      if (!group || !group.words) return;
      let addedCount = 0;
      group.words.forEach(w => {
        state.addOrUpdateWord({
          id: 'word_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          word: w.word,
          phonetic: w.phonetic || '',
          translation: w.meaning || '',
          contextSentence: (group.story && group.story.en) ? group.story.en.replace(/\*\*/g, '') : (w.example || ''),
          sourceType: 'similar',
          sourceId: group.id || '',
          sourceTitle: `形近词: ${group.groupTitle}`,
          mastered: false,
          createdAt: new Date().toISOString()
        });
        addedCount++;
      });
      renderSimilarGroup(group);
      renderVocabList();
      showToast(`🎉 已将全组 ${addedCount} 个形近词全部记入生词本！`);
      return;
    }

    // Copy card text
    if (e.target.closest('#btnCopySimCard')) {
      const group = state.currentSimilarGroup;
      if (!group) return;
      let text = `【${group.level || '形近词'}】${group.groupTitle}\n痛点：${group.confusePoint || ''}\n\n`;
      (group.words || []).forEach(w => {
        text += `• ${w.word} [${w.phonetic || ''}] (${w.pos || ''}) ${w.meaning || ''}\n  记忆锚点: ${w.anchor || ''}\n  搭配: ${w.collocation || ''}\n\n`;
      });
      if (group.story) {
        text += `【情景小故事】${group.story.title || ''}\n${group.story.en}\n${group.story.cn}\n\n`;
      }
      if (group.mnemonicFormula) {
        text += `【速记口诀】${group.mnemonicFormula}\n`;
      }
      navigator.clipboard.writeText(text).then(() => {
        showToast('卡片文本已复制到剪贴板！');
      }).catch(() => {
        showToast('复制成功');
      });
    }
  });

  // History item click
  document.getElementById('similarHistoryList')?.addEventListener('click', (e) => {
    const item = e.target.closest('.similar-history-item');
    if (!item) return;
    const idx = parseInt(item.dataset.historyIdx, 10);
    const group = state.similarHistory[idx];
    if (group) {
      renderSimilarGroup(group);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
