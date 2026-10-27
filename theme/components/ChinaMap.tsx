import React from 'react';

/** 中国地图 SVG（简化但可辨识的轮廓）+ 成都脉冲标记 */
export const ChinaMap: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1000 850"
    aria-label="基于成都"
    style={{ width: '100%', height: 'auto' }}
  >
    {/* 中国轮廓 (基于真实地理坐标简化) */}
    <path
      d="
        M 930 120 L 940 135 L 945 155 L 940 175 L 930 195
        L 915 215 L 900 230 L 885 240 L 870 245 L 855 250
        L 840 260 L 825 275 L 815 290 L 810 310 L 805 330
        L 800 350 L 790 365 L 775 380 L 760 390 L 745 400
        L 735 415 L 728 430 L 725 445 L 720 460 L 710 470
        L 695 485 L 680 495 L 665 505 L 650 515 L 640 530
        L 635 545 L 625 555 L 610 565 L 595 575 L 580 590
        L 570 605 L 560 620 L 555 635 L 550 650 L 540 660
        L 525 665 L 510 660 L 495 650 L 480 640 L 465 630
        L 450 625 L 435 620 L 420 615 L 405 610 L 390 605
        L 375 595 L 365 580 L 355 565 L 345 550 L 335 540
        L 320 535 L 305 530 L 290 525 L 275 520 L 260 515
        L 250 505 L 240 490 L 230 475 L 225 455 L 215 440
        L 200 430 L 185 425 L 170 415 L 155 400 L 140 385
        L 125 370 L 110 355 L 95 340 L 85 320 L 80 300
        L 85 280 L 95 260 L 110 245 L 130 235 L 155 225
        L 180 220 L 210 215 L 240 210 L 270 205 L 300 200
        L 330 195 L 360 190 L 390 185 L 420 185 L 450 190
        L 480 195 L 510 200 L 540 205 L 570 210 L 600 215
        L 630 220 L 660 225 L 690 230 L 720 235 L 750 240
        L 780 245 L 810 250 L 840 255 L 870 260 L 895 265
        L 915 270 L 925 280 L 930 120 Z
      "
      fill="#e8ecf1"
      stroke="#bcc2c8"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* 海南岛 */}
    <ellipse cx="575" cy="660" rx="22" ry="16" fill="#e8ecf1" stroke="#bcc2c8" strokeWidth="1.5" />

    {/* 台湾 */}
    <ellipse cx="780" cy="535" rx="12" ry="28" fill="#e8ecf1" stroke="#bcc2c8" strokeWidth="1.5"
      transform="rotate(-15, 780, 535)" />

    {/* 成都 — 活跃脉冲标记 */}
    <circle cx="515" cy="475" r="7" fill="#5e6ad2">
      <animate
        attributeName="r"
        values="7;11;7"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="515" cy="475" r="3.5" fill="#fff" />
    <text x="515" y="498" textAnchor="middle" fontSize="11" fill="#5e6ad2" fontWeight="500">
      成都
    </text>
  </svg>
);

export default ChinaMap;