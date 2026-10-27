import React from 'react';

/** 简化版中国地图 SVG + 成都标记 */
export const ChinaMap: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 600 500"
    aria-label="基于成都"
    style={{ width: '100%', height: 'auto' }}
  >
    {/* 中国轮廓 (简化版) */}
    <path
      d="M530 80 L540 90 L550 120 L555 150 L548 175 L540 200 L530 220
         L520 230 L510 215 L500 210 L490 195 L480 200 L475 220 L485 240
         L490 260 L500 280 L510 300 L520 315 L525 340 L515 360 L500 380
         L485 395 L470 400 L455 395 L440 380 L430 365 L420 350 L410 340
         L395 335 L380 340 L370 355 L360 370 L350 380 L340 370 L330 350
         L320 340 L310 330 L295 325 L280 320 L265 310 L255 295 L250 280
         L245 265 L240 250 L235 235 L225 220 L215 210 L210 195 L200 180
         L190 170 L180 160 L170 150 L165 140 L160 125 L155 110 L150 95
         L145 85 L155 75 L170 65 L190 60 L210 55 L230 50 L255 45 L280 42
         L310 40 L340 42 L370 45 L400 50 L430 55 L460 60 L485 68 L510 75
         Z"
      fill="#e8ecf1"
      stroke="#c0c6cc"
      strokeWidth="1.5"
    />

    {/* 成都 — 活跃标记 */}
    <circle cx="318" cy="295" r="7" fill="#5e6ad2">
      <animate
        attributeName="r"
        values="7;10;7"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="318" cy="295" r="4" fill="#fff" />

    {/* 北京 — 暗色标记 */}
    <circle cx="395" cy="185" r="4" fill="#c0c6cc" opacity="0.5" />

    {/* 深圳 — 暗色标记 */}
    <circle cx="380" cy="365" r="4" fill="#c0c6cc" opacity="0.5" />

    {/* 上海 — 暗色标记 */}
    <circle cx="450" cy="260" r="4" fill="#c0c6cc" opacity="0.5" />
  </svg>
);

export default ChinaMap;