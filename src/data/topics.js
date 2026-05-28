// 주제별 성경 데이터
// 각 주제: { id, title, color, desc, verses:[{ref, note}], characters:[인물id] }
// verse ref 는 정식 한글 책이름으로 표기해 구절 링크(parseVerseRef)가 동작하게 함.
// characters 는 실제 인물 id (없는 인물은 자동으로 건너뜀).

export const topics = [
  {
    id: "love",
    title: "사랑",
    color: "#B5436A",
    desc: "하나님의 본성이자 가장 큰 계명. 성경 전체를 관통하는 주제입니다.",
    verses: [
      { ref: "요한복음 3:16", note: "독생자를 주신 하나님의 사랑" },
      { ref: "고린도전서 13:4-7", note: "사랑은 오래 참고…" },
      { ref: "요한일서 4:8", note: "하나님은 사랑이심" },
      { ref: "마태복음 22:37-39", note: "가장 큰 계명" },
      { ref: "요한복음 13:34", note: "서로 사랑하라는 새 계명" },
    ],
    characters: ["jesus", "john_apostle", "ruth"],
  },
  {
    id: "faith",
    title: "믿음",
    color: "#2D7A4F",
    desc: "보이지 않는 것을 신뢰함. 구원과 하나님과의 동행의 토대입니다.",
    verses: [
      { ref: "히브리서 11:1", note: "믿음은 바라는 것들의 실상" },
      { ref: "히브리서 11:6", note: "믿음 없이는 기쁘시게 못함" },
      { ref: "에베소서 2:8", note: "믿음으로 받는 구원" },
      { ref: "로마서 10:17", note: "믿음은 들음에서 남" },
      { ref: "야고보서 2:17", note: "행함이 있는 믿음" },
    ],
    characters: ["abraham", "noah", "david"],
  },
  {
    id: "hope",
    title: "소망",
    color: "#1A7A5A",
    desc: "하나님의 약속에 근거한, 흔들리지 않는 기대입니다.",
    verses: [
      { ref: "예레미야 29:11", note: "평안과 미래와 희망의 계획" },
      { ref: "로마서 15:13", note: "소망의 하나님" },
      { ref: "히브리서 6:19", note: "영혼의 닻 같은 소망" },
      { ref: "베드로전서 1:3", note: "산 소망" },
      { ref: "로마서 8:24-25", note: "보이지 않는 것을 바람" },
    ],
    characters: ["abraham", "paul"],
  },
  {
    id: "forgiveness",
    title: "용서",
    color: "#5E4CA0",
    desc: "죄를 덮고 관계를 회복하시는 하나님의 마음과 우리의 부르심입니다.",
    verses: [
      { ref: "마태복음 6:14", note: "용서하면 용서받음" },
      { ref: "마태복음 18:21-22", note: "일흔 번씩 일곱 번이라도" },
      { ref: "골로새서 3:13", note: "주께서 용서하신 것같이" },
      { ref: "누가복음 23:34", note: "십자가 위의 용서" },
      { ref: "시편 103:12", note: "동이 서에서 먼 것같이" },
    ],
    characters: ["joseph", "stephen", "jesus"],
  },
  {
    id: "prayer",
    title: "기도",
    color: "#2B5EA7",
    desc: "하나님과 나누는 대화. 모든 상황에서 그분을 의지하는 통로입니다.",
    verses: [
      { ref: "마태복음 6:9-13", note: "주기도문" },
      { ref: "빌립보서 4:6", note: "염려 대신 기도와 간구" },
      { ref: "데살로니가전서 5:17", note: "쉬지 말고 기도하라" },
      { ref: "야고보서 5:16", note: "의인의 간구는 역사하는 힘이 큼" },
      { ref: "누가복음 18:1", note: "낙심하지 말고 기도할 것" },
    ],
    characters: ["hannah", "daniel", "jesus"],
  },
  {
    id: "suffering",
    title: "고난",
    color: "#B07830",
    desc: "시련 속에서도 선하게 일하시는 하나님을 신뢰하는 자리입니다.",
    verses: [
      { ref: "로마서 8:28", note: "모든 것이 합력하여 선을" },
      { ref: "로마서 5:3-4", note: "환난은 인내를…" },
      { ref: "야고보서 1:2-4", note: "시험을 기쁘게 여기라" },
      { ref: "베드로전서 4:12-13", note: "그리스도의 고난에 참여" },
      { ref: "시편 34:18", note: "마음이 상한 자를 가까이" },
    ],
    characters: ["job", "paul", "joseph"],
  },
  {
    id: "repentance",
    title: "회개",
    color: "#A03040",
    desc: "죄에서 돌이켜 하나님께로 마음과 삶의 방향을 바꾸는 것입니다.",
    verses: [
      { ref: "사도행전 3:19", note: "회개하고 돌이키라" },
      { ref: "누가복음 15:11-24", note: "돌아온 탕자" },
      { ref: "시편 51:10", note: "다윗의 회개 — 정한 마음을 창조" },
      { ref: "요엘 2:13", note: "옷이 아니라 마음을 찢으라" },
      { ref: "마가복음 1:15", note: "회개하고 복음을 믿으라" },
    ],
    characters: ["david", "zacchaeus", "peter"],
  },
];
