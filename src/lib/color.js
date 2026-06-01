// 브랜드(책/카테고리) 색상을 "읽히는 톤"으로 보정하는 유틸.
//
// 일부 책 색상(예: 에스더 #E6B8AF, 금색 #FFD700)은 너무 밝아서
// 흰 글씨를 얹거나(넘버링 배지) 옅은 배경 위 글씨색으로 쓰면 희미하게 보인다.
// 글씨 색을 책마다 흰색/검은색으로 바꾸면 통일성이 깨지므로,
// 대신 "밝을 때만" 같은 색을 진하게 내려서 항상 흰 글씨가 읽히도록 한다.
// 이미 충분히 진한 색은 그대로 둔다.

function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r, g, b) {
  const to = (v) => Math.round(Math.max(0, Math.min(255, v)))
    .toString(16)
    .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hue2rgb(p, q, h + 1 / 3) * 255,
    g: hue2rgb(p, q, h) * 255,
    b: hue2rgb(p, q, h - 1 / 3) * 255,
  };
}

// 상대 휘도(WCAG)
function relLuminance(r, g, b) {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

// 흰색(휘도 1.0) 대비 대비비
function contrastWithWhite(r, g, b) {
  return 1.05 / (relLuminance(r, g, b) + 0.05);
}

// 밝은 색을 흰 글씨가 읽히는 진한 톤으로 보정한다.
// HSL 밝기가 아니라 실제 휘도(흰 글씨 대비비)를 기준으로 낮추므로
// 노랑/금색처럼 체감상 밝은 색도 확실히 진해진다.
// target: 목표 대비비(굵은 텍스트 기준 3:1, 여유 있게 3.2)
// minS: 너무 탁해지지 않도록 보장하는 최소 채도
export function deepenColor(hex, { target = 3.2, minS = 0.4 } = {}) {
  if (!hex || typeof hex !== "string") return hex;
  try {
    const { r, g, b } = hexToRgb(hex);
    let [h, s] = rgbToHsl(r, g, b);
    if (contrastWithWhite(r, g, b) >= target) return hex; // 이미 충분히 읽힘
    if (s < minS) s = minS;
    // 밝기를 단계적으로 낮춰 목표 대비비를 만족하는 톤을 찾는다.
    let best = hex;
    for (let l = 0.5; l >= 0.18; l -= 0.02) {
      const out = hslToRgb(h, s, l);
      best = rgbToHex(out.r, out.g, out.b);
      if (contrastWithWhite(out.r, out.g, out.b) >= target) break;
    }
    return best;
  } catch {
    return hex;
  }
}
