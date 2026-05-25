// 성경 지도 데이터 — 실제 위경도 좌표 (Leaflet용)

export const locations = [
  // ── 서부 지중해 ──
  { id: "rome", name: "로마", nameEn: "Rome", lat: 41.9, lng: 12.5, region: "로마제국", importance: 2,
    events: [
      { title: "바울의 로마 도착과 투옥", verse: "사도행전 28장", era: "신약" },
      { title: "바울이 로마서·에베소서 등을 기록", verse: "로마서 1:7", era: "신약" },
    ] },
  { id: "puteoli", name: "보디올", nameEn: "Puteoli", lat: 40.8, lng: 14.1, region: "로마제국", importance: 0,
    events: [
      { title: "바울이 로마로 가는 도중 상륙", verse: "사도행전 28:13", era: "신약" },
    ] },
  { id: "malta", name: "멜리데", nameEn: "Malta", lat: 35.9, lng: 14.5, region: "로마제국", importance: 1,
    events: [
      { title: "바울 파선 후 3개월 체류, 독사에 물려도 해 없음", verse: "사도행전 28:1-6", era: "신약" },
    ] },

  // ── 그리스 ──
  { id: "philippi", name: "빌립보", nameEn: "Philippi", lat: 41.0, lng: 24.3, region: "그리스", importance: 1,
    events: [
      { title: "유럽 최초의 교회 — 루디아의 회심", verse: "사도행전 16:12-15", era: "신약" },
      { title: "바울과 실라 옥중 찬양 — 지진", verse: "사도행전 16:25-26", era: "신약" },
    ] },
  { id: "thessalonica", name: "데살로니가", nameEn: "Thessalonica", lat: 40.6, lng: 22.9, region: "그리스", importance: 1,
    events: [
      { title: "바울이 교회를 세우고 서신을 보냄", verse: "데살로니가전서 1:1", era: "신약" },
    ] },
  { id: "athens", name: "아테네", nameEn: "Athens", lat: 37.97, lng: 23.72, region: "그리스", importance: 1,
    events: [
      { title: "바울의 아레오바고 설교", verse: "사도행전 17:22-31", era: "신약" },
    ] },
  { id: "corinth", name: "고린도", nameEn: "Corinth", lat: 37.91, lng: 22.88, region: "그리스", importance: 1,
    events: [
      { title: "바울이 18개월간 사역, 교회 설립", verse: "사도행전 18장", era: "신약" },
    ] },
  { id: "crete", name: "그레데", nameEn: "Crete", lat: 35.24, lng: 24.9, region: "그리스", importance: 0,
    events: [
      { title: "바울의 로마행 중 폭풍", verse: "사도행전 27장", era: "신약" },
      { title: "디도가 목회한 교회", verse: "디도서 1:5", era: "신약" },
    ] },

  // ── 소아시아 (요한계시록 7교회) ──
  { id: "ephesus", name: "에베소", nameEn: "Ephesus", lat: 37.94, lng: 27.34, region: "소아시아", importance: 2,
    events: [
      { title: "바울의 3년간 사역", verse: "사도행전 19장", era: "신약" },
      { title: "계시록 제1교회 — 처음 사랑을 회복하라", verse: "요한계시록 2:1-7", era: "신약" },
    ] },
  { id: "smyrna", name: "서머나", nameEn: "Smyrna", lat: 38.42, lng: 27.14, region: "소아시아", importance: 1,
    events: [
      { title: "계시록 제2교회 — 죽도록 충성하라", verse: "요한계시록 2:8-11", era: "신약" },
    ] },
  { id: "pergamum", name: "버가모", nameEn: "Pergamum", lat: 39.12, lng: 27.18, region: "소아시아", importance: 1,
    events: [
      { title: "계시록 제3교회 — 사탄의 권좌가 있는 곳", verse: "요한계시록 2:12-17", era: "신약" },
    ] },
  { id: "thyatira", name: "두아디라", nameEn: "Thyatira", lat: 38.92, lng: 27.84, region: "소아시아", importance: 0,
    events: [
      { title: "계시록 제4교회 / 루디아의 출신지", verse: "요한계시록 2:18-29", era: "신약" },
    ] },
  { id: "sardis", name: "사데", nameEn: "Sardis", lat: 38.49, lng: 28.04, region: "소아시아", importance: 0,
    events: [
      { title: "계시록 제5교회 — 살았다 하나 죽은 자", verse: "요한계시록 3:1-6", era: "신약" },
    ] },
  { id: "philadelphia", name: "빌라델비아", nameEn: "Philadelphia", lat: 38.35, lng: 28.39, region: "소아시아", importance: 0,
    events: [
      { title: "계시록 제6교회 — 열린 문", verse: "요한계시록 3:7-13", era: "신약" },
    ] },
  { id: "laodicea", name: "라오디게아", nameEn: "Laodicea", lat: 37.84, lng: 29.11, region: "소아시아", importance: 0,
    events: [
      { title: "계시록 제7교회 — 미지근한 교회", verse: "요한계시록 3:14-22", era: "신약" },
    ] },
  { id: "patmos", name: "밧모섬", nameEn: "Patmos", lat: 37.32, lng: 26.55, region: "소아시아", importance: 1,
    events: [
      { title: "사도 요한이 유배되어 계시록 기록", verse: "요한계시록 1:9", era: "신약" },
    ] },
  { id: "derbe_lystra", name: "더베/루스드라", nameEn: "Derbe & Lystra", lat: 37.45, lng: 32.5, region: "소아시아", importance: 0,
    events: [
      { title: "바울 1차 선교 — 돌에 맞음 / 디모데 고향", verse: "사도행전 14:19", era: "신약" },
    ] },
  { id: "tarsus", name: "다소", nameEn: "Tarsus", lat: 36.92, lng: 34.9, region: "소아시아", importance: 1,
    events: [
      { title: "사도 바울의 출생지", verse: "사도행전 22:3", era: "신약" },
    ] },
  { id: "cyprus", name: "구브로", nameEn: "Cyprus", lat: 35.0, lng: 33.0, region: "소아시아", importance: 1,
    events: [
      { title: "바나바의 고향, 바울 1차 선교 첫 방문지", verse: "사도행전 13:4", era: "신약" },
    ] },

  // ── 시리아 ──
  { id: "antioch", name: "안디옥", nameEn: "Antioch", lat: 36.2, lng: 36.16, region: "시리아", importance: 2,
    events: [
      { title: "처음 '그리스도인'이라 불림", verse: "사도행전 11:26", era: "신약" },
      { title: "바울의 세 차례 선교여행 출발지", verse: "사도행전 13:1-3", era: "신약" },
    ] },
  { id: "damascus", name: "다메섹", nameEn: "Damascus", lat: 33.51, lng: 36.29, region: "시리아", importance: 2,
    events: [
      { title: "사울(바울)의 회심", verse: "사도행전 9:1-19", era: "신약" },
      { title: "아브라함 시대의 고대 도시", verse: "창세기 14:15", era: "구약" },
    ] },
  { id: "tyre_sidon", name: "두로/시돈", nameEn: "Tyre & Sidon", lat: 33.27, lng: 35.2, region: "시리아", importance: 1,
    events: [
      { title: "예수님이 수로보니게 여인의 믿음을 칭찬", verse: "마가복음 7:24-30", era: "신약" },
      { title: "솔로몬 성전의 백향목 공급", verse: "열왕기상 5장", era: "구약" },
    ] },

  // ── 이스라엘 ──
  { id: "dan", name: "단", nameEn: "Dan", lat: 33.25, lng: 35.65, region: "이스라엘", importance: 0,
    events: [
      { title: "이스라엘 최북단 / 여로보암 금송아지", verse: "열왕기상 12:29", era: "구약" },
    ] },
  { id: "mtCarmel", name: "갈멜산", nameEn: "Mt. Carmel", lat: 32.74, lng: 35.05, region: "이스라엘", importance: 1,
    events: [
      { title: "엘리야와 바알 선지자 450명 대결", verse: "열왕기상 18장", era: "구약" },
    ] },
  { id: "nazareth", name: "나사렛", nameEn: "Nazareth", lat: 32.7, lng: 35.3, region: "갈릴리", importance: 2,
    events: [
      { title: "예수님이 자라신 곳 / 수태고지", verse: "누가복음 1:26-38", era: "신약" },
    ] },
  { id: "cana", name: "가나", nameEn: "Cana", lat: 32.75, lng: 35.34, region: "갈릴리", importance: 1,
    events: [
      { title: "첫 기적 — 물을 포도주로", verse: "요한복음 2:1-11", era: "신약" },
    ] },
  { id: "capernaum", name: "가버나움", nameEn: "Capernaum", lat: 32.88, lng: 35.57, region: "갈릴리", importance: 2,
    events: [
      { title: "예수님 공생애의 본부", verse: "마태복음 4:13", era: "신약" },
      { title: "중풍병자 치유, 백부장의 종 치유", verse: "마가복음 2장", era: "신약" },
    ] },
  { id: "caesarea", name: "가이사랴", nameEn: "Caesarea", lat: 32.5, lng: 34.89, region: "이스라엘", importance: 1,
    events: [
      { title: "고넬료 회심 — 이방인에게 성령 임함", verse: "사도행전 10장", era: "신약" },
      { title: "바울이 황제에게 호소", verse: "사도행전 25:11", era: "신약" },
    ] },
  { id: "joppa", name: "욥바", nameEn: "Joppa", lat: 32.05, lng: 34.75, region: "이스라엘", importance: 1,
    events: [
      { title: "요나가 배를 타고 도망친 항구", verse: "요나 1:3", era: "구약" },
      { title: "베드로의 환상 / 도르가 부활", verse: "사도행전 9-10장", era: "신약" },
    ] },
  { id: "samaria", name: "사마리아", nameEn: "Samaria", lat: 32.28, lng: 35.19, region: "사마리아", importance: 1,
    events: [
      { title: "예수님과 사마리아 여인", verse: "요한복음 4장", era: "신약" },
      { title: "북이스라엘의 수도", verse: "열왕기상 16:24", era: "구약" },
    ] },
  { id: "shechem", name: "세겜", nameEn: "Shechem", lat: 32.21, lng: 35.28, region: "사마리아", importance: 0,
    events: [
      { title: "아브라함 첫 제단 / 여호수아 고별 연설", verse: "여호수아 24:1", era: "구약" },
    ] },
  { id: "jerusalem", name: "예루살렘", nameEn: "Jerusalem", lat: 31.78, lng: 35.23, region: "유다", importance: 3,
    events: [
      { title: "다윗이 수도로 삼음", verse: "사무엘하 5:6-7", era: "구약" },
      { title: "솔로몬 성전 건축", verse: "열왕기상 6장", era: "구약" },
      { title: "바벨론에 의해 성전 파괴 (BC 586)", verse: "열왕기하 25장", era: "구약" },
      { title: "예수님의 십자가와 부활", verse: "마태복음 27-28장", era: "신약" },
      { title: "오순절 성령 강림과 교회 탄생", verse: "사도행전 2장", era: "신약" },
    ] },
  { id: "bethany", name: "베다니", nameEn: "Bethany", lat: 31.77, lng: 35.26, region: "유다", importance: 1,
    events: [
      { title: "나사로의 부활", verse: "요한복음 11장", era: "신약" },
      { title: "예수님의 승천", verse: "누가복음 24:50-51", era: "신약" },
    ] },
  { id: "bethlehem", name: "베들레헴", nameEn: "Bethlehem", lat: 31.7, lng: 35.2, region: "유다", importance: 2,
    events: [
      { title: "예수 그리스도의 탄생", verse: "누가복음 2:4-7", era: "신약" },
      { title: "다윗의 고향 / 룻과 보아스", verse: "사무엘상 16:1", era: "구약" },
    ] },
  { id: "jericho", name: "여리고", nameEn: "Jericho", lat: 31.87, lng: 35.46, region: "유다", importance: 1,
    events: [
      { title: "여호수아가 성벽 무너뜨림", verse: "여호수아 6장", era: "구약" },
      { title: "삭개오 회심 / 소경 바디매오 치유", verse: "누가복음 19장", era: "신약" },
    ] },
  { id: "hebron", name: "헤브론", nameEn: "Hebron", lat: 31.53, lng: 35.1, region: "유다", importance: 1,
    events: [
      { title: "아브라함·이삭·야곱 장지 막벨라 굴", verse: "창세기 23장", era: "구약" },
      { title: "다윗이 처음 왕이 된 곳 (7년)", verse: "사무엘하 2:1-4", era: "구약" },
    ] },
  { id: "gaza", name: "가사", nameEn: "Gaza", lat: 31.5, lng: 34.46, region: "유다", importance: 0,
    events: [
      { title: "삼손이 블레셋 신전을 무너뜨림", verse: "사사기 16:30", era: "구약" },
      { title: "빌립이 에디오피아 내시를 만남", verse: "사도행전 8:26", era: "신약" },
    ] },
  { id: "beersheba", name: "브엘세바", nameEn: "Beersheba", lat: 31.25, lng: 34.79, region: "유다", importance: 0,
    events: [
      { title: "아브라함의 언약 — 이스라엘 최남단", verse: "창세기 21:31", era: "구약" },
    ] },

  // ── 이집트 / 시내 ──
  { id: "egypt", name: "이집트", nameEn: "Egypt", lat: 30.05, lng: 31.23, region: "이집트", importance: 2,
    events: [
      { title: "요셉이 총리가 됨", verse: "창세기 41장", era: "구약" },
      { title: "이스라엘 400년 노예 / 10가지 재앙", verse: "출애굽기 1-12장", era: "구약" },
      { title: "아기 예수님의 피난", verse: "마태복음 2:13-15", era: "신약" },
    ] },
  { id: "sinai", name: "시내산", nameEn: "Mt. Sinai", lat: 28.54, lng: 33.97, region: "시내", importance: 2,
    events: [
      { title: "불타는 떨기나무 / 십계명 수여", verse: "출애굽기 3장, 20장", era: "구약" },
      { title: "금송아지 사건", verse: "출애굽기 32장", era: "구약" },
      { title: "엘리야가 세미한 소리로 하나님을 만남", verse: "열왕기상 19장", era: "구약" },
    ] },
  { id: "ethiopia", name: "에디오피아 (구스)", nameEn: "Ethiopia / Cush", lat: 15.0, lng: 38.0, region: "아프리카", importance: 1,
    events: [
      { title: "에디오피아 내시의 회심과 침례", verse: "사도행전 8:26-39", era: "신약" },
    ] },
  { id: "arabia", name: "아라비아", nameEn: "Arabia", lat: 25.0, lng: 40.0, region: "아라비아", importance: 0,
    events: [
      { title: "바울이 회심 후 3년간 머묾", verse: "갈라디아서 1:17", era: "신약" },
    ] },

  // ── 메소포타미아 / 페르시아 ──
  { id: "haran", name: "하란", nameEn: "Haran", lat: 36.86, lng: 39.03, region: "메소포타미아", importance: 1,
    events: [
      { title: "아브라함이 부친과 머문 곳", verse: "창세기 11:31", era: "구약" },
      { title: "야곱이 라반에게서 14년간 일함", verse: "창세기 29장", era: "구약" },
    ] },
  { id: "nineveh", name: "니느웨", nameEn: "Nineveh", lat: 36.36, lng: 43.15, region: "메소포타미아", importance: 1,
    events: [
      { title: "요나의 선교 — 도시 전체가 회개", verse: "요나 3장", era: "구약" },
      { title: "앗수르 제국의 수도", verse: "나훔 1:1", era: "구약" },
    ] },
  { id: "babylon", name: "바벨론", nameEn: "Babylon", lat: 32.54, lng: 44.42, region: "메소포타미아", importance: 2,
    events: [
      { title: "바벨탑 사건", verse: "창세기 11장", era: "구약" },
      { title: "유다 포로 / 다니엘의 사자 굴", verse: "다니엘 6장", era: "구약" },
      { title: "사드락·메삭·아벳느고의 풀무불", verse: "다니엘 3장", era: "구약" },
    ] },
  { id: "ur", name: "우르", nameEn: "Ur", lat: 30.96, lng: 46.1, region: "메소포타미아", importance: 1,
    events: [
      { title: "아브라함의 고향 — 하나님의 부르심", verse: "창세기 11:31", era: "구약" },
    ] },
  { id: "shushan", name: "수산", nameEn: "Susa", lat: 32.19, lng: 48.24, region: "페르시아", importance: 1,
    events: [
      { title: "에스더가 왕비가 된 페르시아 궁전", verse: "에스더 1:2", era: "구약" },
      { title: "느헤미야가 왕의 술관원이던 곳", verse: "느헤미야 1:1", era: "구약" },
    ] },
  { id: "persepolis", name: "페르세폴리스", nameEn: "Persepolis", lat: 29.93, lng: 52.89, region: "페르시아", importance: 0,
    events: [
      { title: "페르시아 제국의 수도 — 고레스의 칙령", verse: "에스라 1:1-4", era: "구약" },
    ] },
];

export const journeys = [
  { id: "abraham", name: "아브라함의 여정", color: "#B8860B", era: "구약",
    description: "갈대아 우르에서 하나님의 부르심을 받아 하란을 거쳐 가나안 땅으로. 기근으로 이집트까지 내려갔다가 돌아왔습니다.",
    path: ["ur", "haran", "damascus", "shechem", "jerusalem", "hebron", "egypt", "hebron"] },
  { id: "jacob", name: "야곱의 여정", color: "#7B68AE", era: "구약",
    description: "에서를 피해 하란으로 도망, 20년 후 가나안으로 귀환. 얍복강에서 하나님과 씨름하여 이스라엘이 되었습니다.",
    path: ["hebron", "shechem", "haran", "shechem", "hebron"] },
  { id: "exodus", name: "출애굽 여정", color: "#DC143C", era: "구약",
    description: "430년 노예 생활을 끝내고 홍해를 건너 시내산에서 율법을 받고 약속의 땅으로 들어갔습니다.",
    path: ["egypt", "sinai", "beersheba", "jericho", "jerusalem"] },
  { id: "jonah", name: "요나의 여정", color: "#0097A7", era: "구약",
    description: "니느웨로 가라는 명령을 피해 욥바에서 배를 타고 도망치다 물고기 뱃속에서 3일. 결국 니느웨에서 선교했습니다.",
    path: ["joppa", "nineveh"] },
  { id: "jesus", name: "예수님의 생애", color: "#4A78A0", era: "신약",
    description: "베들레헴 탄생 → 이집트 피난 → 나사렛 성장 → 갈릴리 사역 → 예루살렘 십자가와 부활.",
    path: ["bethlehem", "egypt", "nazareth", "cana", "capernaum", "samaria", "jericho", "bethany", "jerusalem"] },
  { id: "paul1", name: "바울 1차 선교", color: "#2E7D32", era: "신약",
    description: "바나바와 함께 안디옥에서 출발, 구브로와 소아시아 남부를 순회했습니다.",
    path: ["antioch", "cyprus", "derbe_lystra", "antioch"] },
  { id: "paul2", name: "바울 2차 선교", color: "#1565C0", era: "신약",
    description: "실라와 함께 유럽에 복음을 전함. 빌립보·데살로니가·아테네·고린도.",
    path: ["antioch", "tarsus", "derbe_lystra", "ephesus", "philippi", "thessalonica", "athens", "corinth", "ephesus", "antioch"] },
  { id: "paul3", name: "바울 3차 선교", color: "#E65100", era: "신약",
    description: "에베소 3년 사역, 소아시아·그리스 교회를 다시 방문했습니다.",
    path: ["antioch", "tarsus", "derbe_lystra", "ephesus", "philippi", "corinth", "philippi", "ephesus", "caesarea", "jerusalem"] },
  { id: "paul_rome", name: "바울의 로마행", color: "#6A1B9A", era: "신약",
    description: "황제에게 호소하여 호송. 폭풍으로 그레데·멜리데를 거쳐 로마 도착.",
    path: ["caesarea", "tyre_sidon", "crete", "malta", "puteoli", "rome"] },
  { id: "revelation", name: "요한계시록 7교회", color: "#C62828", era: "신약",
    description: "밧모섬에서 요한이 계시를 받아 소아시아의 일곱 교회에 보낸 편지.",
    path: ["patmos", "ephesus", "smyrna", "pergamum", "thyatira", "sardis", "philadelphia", "laodicea"] },
];

export function getLocationById(id) {
  return locations.find((l) => l.id === id);
}
