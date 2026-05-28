// 성경 인물 가계도 데이터 (성경 본문 근거)
//
// 노드 구조:
//   { id?, name, note?, ellipsis?, spouse?, unions?, children? }
//   - id      : characters 테이블의 인물 id. 있으면 아바타 + 인물 페이지 링크.
//   - name    : 표시 이름 (id가 없거나 명단에 없을 때 사용).
//   - note    : 작은 설명.
//   - ellipsis: true면 "⋯ 여러 대" 생략 표기.
//   - spouse  : 배우자 노드 { id?, name, note? } (체인 모드에서 인라인 표기).
//   - unions  : [{ spouse?, label?, children: [node] }] — 배우자별 자녀 묶음(트리 모드).
//   - children: 배우자 구분이 없을 때의 자녀 배열(트리 모드, unions 한 개로 정규화됨).
//
// 모드:
//   - tree : 분기형 가계도(들여쓰기)
//   - chain: 직선형 계보(세로 목록) — chain: [node, ...] 사용

export const lineages = [
  // ── 1. 아담의 후손 ───────────────────────────────────────────
  {
    id: "adam",
    title: "아담의 후손",
    era: "창조 ~ 홍수",
    scripture: "창세기 4-5, 9-10장",
    accent: "#2D7A4F",
    desc: "최초의 인류 아담에서 시작해, 경건한 셋의 계보가 노아까지 이어집니다.",
    mode: "tree",
    root: {
      id: "adam",
      name: "아담",
      note: "최초의 사람",
      unions: [
        {
          spouse: { id: "eve", name: "하와" },
          children: [
            { id: "cain", name: "가인", note: "동생 아벨을 죽임" },
            { id: "abel", name: "아벨", note: "가인에게 죽임당함" },
            {
              name: "셋",
              note: "창 4:25 · 경건한 계보를 이음",
              children: [
                {
                  ellipsis: true,
                  note: "에노스 – 게난 – 마할랄렐 – 야렛 (창 5장)",
                  children: [
                    {
                      id: "enoch",
                      name: "에녹",
                      note: "하나님과 동행하여 죽음을 보지 않음",
                      children: [
                        {
                          id: "methuselah",
                          name: "므두셀라",
                          note: "969세, 성경 최장수",
                          children: [
                            {
                              name: "라멕",
                              children: [
                                {
                                  id: "noah",
                                  name: "노아",
                                  note: "방주로 구원받음",
                                  children: [
                                    { name: "셈", note: "셈족(히브리)의 조상" },
                                    { name: "함" },
                                    { name: "야벳" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // ── 2. 아브라함 가문 ─────────────────────────────────────────
  {
    id: "abraham",
    title: "아브라함 가문과 이스라엘 12지파",
    era: "족장 시대",
    scripture: "창세기 11, 16, 21, 25, 29-30, 35장",
    accent: "#B07830",
    desc: "믿음의 조상 아브라함에서 이삭·야곱을 거쳐 이스라엘 12지파가 형성됩니다.",
    mode: "tree",
    root: {
      name: "데라",
      note: "아브라함의 아버지 (창 11:27)",
      children: [
        {
          id: "abraham",
          name: "아브라함",
          note: "믿음의 조상",
          unions: [
            {
              spouse: { id: "sarah", name: "사라" },
              children: [
                {
                  id: "isaac",
                  name: "이삭",
                  note: "약속의 아들",
                  unions: [
                    {
                      spouse: { id: "rebekah", name: "리브가" },
                      children: [
                        { id: "esau", name: "에서", note: "에돔 족속의 조상" },
                        {
                          id: "jacob",
                          name: "야곱",
                          note: "'이스라엘' — 12지파의 아버지",
                          unions: [
                            {
                              spouse: { id: "leah", name: "레아" },
                              label: "레아의 자녀",
                              children: [
                                { name: "르우벤" },
                                { name: "시므온" },
                                { name: "레위", note: "제사장 지파 (모세·아론)" },
                                { id: "judah", name: "유다", note: "왕가·메시아 계보" },
                                { name: "잇사갈" },
                                { name: "스불론" },
                                { name: "디나", note: "딸" },
                              ],
                            },
                            {
                              spouse: { id: "rachel", name: "라헬" },
                              label: "라헬의 자녀",
                              children: [
                                { id: "joseph", name: "요셉", note: "애굽의 총리" },
                                { id: "benjamin", name: "베냐민" },
                              ],
                            },
                            {
                              spouse: { name: "빌하", note: "라헬의 여종" },
                              label: "빌하의 자녀",
                              children: [{ name: "단" }, { name: "납달리" }],
                            },
                            {
                              spouse: { name: "실바", note: "레아의 여종" },
                              label: "실바의 자녀",
                              children: [{ name: "갓" }, { name: "아셀" }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              spouse: { id: "hagar", name: "하갈", note: "사라의 여종" },
              children: [
                { id: "ishmael", name: "이스마엘", note: "아랍 민족의 조상" },
              ],
            },
            {
              spouse: { name: "그두라" },
              label: "그두라의 자녀",
              children: [{ name: "미디안 등 6명", note: "창 25:1-2" }],
            },
          ],
        },
        { name: "나홀" },
        {
          name: "하란",
          children: [{ id: "lot", name: "롯", note: "아브라함의 조카" }],
        },
      ],
    },
  },

  // ── 3. 메시아 계보 (유다 → 예수) ─────────────────────────────
  {
    id: "messiah",
    title: "메시아 계보 — 유다에서 예수까지",
    era: "족장 시대 ~ 신약",
    scripture: "룻기 4장, 마태복음 1장",
    accent: "#A03040",
    desc: "유다 지파에서 다윗 왕을 거쳐 예수 그리스도까지 이어지는 약속의 계보입니다. (마태복음 1장)",
    mode: "chain",
    chain: [
      { id: "judah", name: "유다", note: "야곱의 넷째 아들", spouse: { id: "tamar", name: "다말" } },
      { name: "베레스", note: "유다와 다말의 아들 (창 38장)" },
      { ellipsis: true, note: "헤스론 – 람 – 아미나답 – 나손 – 살몬 (룻 4:18-21)" },
      { id: "boaz", name: "보아스", note: "룻기의 주인공", spouse: { id: "ruth", name: "룻", note: "모압 여인" } },
      { name: "오벳", note: "나오미가 품에 안은 손자 (룻 4:16-17)" },
      { name: "이새", note: "베들레헴 사람" },
      { id: "david", name: "다윗", note: "이스라엘의 위대한 왕", spouse: { id: "bathsheba", name: "밧세바" } },
      { id: "solomon", name: "솔로몬", note: "성전을 지은 지혜의 왕" },
      { id: "rehoboam", name: "르호보암", note: "그의 때에 왕국이 둘로 나뉨" },
      { ellipsis: true, note: "유다 왕들: 아비야 – 아사 – 여호사밧 …" },
      { id: "hezekiah", name: "히스기야", note: "믿음의 개혁 왕" },
      { ellipsis: true, note: "므낫세 – 아몬" },
      { id: "josiah", name: "요시야", note: "율법책을 발견한 개혁 왕" },
      { ellipsis: true, note: "여고냐 — 바벨론 포로기" },
      { id: "zerubbabel", name: "스룹바벨", note: "포로 귀환 후 성전 재건" },
      { ellipsis: true, note: "여러 대 (마 1:13-16)" },
      { id: "joseph_carpenter", name: "요셉", note: "마리아의 남편", spouse: { id: "mary", name: "마리아" } },
      { id: "jesus", name: "예수 그리스도", note: "성령으로 잉태하심 (마 1:18, 눅 1:35)" },
    ],
  },

  // ── 4. 예수님 시대의 가정 ────────────────────────────────────
  {
    id: "nt-family",
    title: "예수님 시대의 가정",
    era: "신약",
    scripture: "누가복음 1장",
    accent: "#2B5EA7",
    desc: "마리아와 엘리사벳은 친족이었습니다 (눅 1:36). 예수님과 침례 요한도 친족 관계입니다.",
    mode: "tree",
    roots: [
      {
        id: "zechariah_priest",
        name: "사가랴",
        note: "제사장",
        unions: [
          {
            spouse: { id: "elizabeth", name: "엘리사벳", note: "마리아의 친족" },
            children: [
              { id: "john_baptist", name: "침례 요한", note: "예수님의 길을 예비함" },
            ],
          },
        ],
      },
      {
        id: "joseph_carpenter",
        name: "요셉",
        note: "목수",
        unions: [
          {
            spouse: { id: "mary", name: "마리아" },
            children: [
              { id: "jesus", name: "예수 그리스도", note: "성령으로 잉태하심 (눅 1:35)" },
            ],
          },
        ],
      },
    ],
  },
];
