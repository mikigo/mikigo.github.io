/** 城市配置文件 — 经纬度会自动投影到地图 SVG 坐标 */
export interface City {
  name: string;
  lng: number; // 经度
  lat: number; // 纬度
}

export const visitedCities: City[] = [
  { name: '重庆', lng: 106.53, lat: 29.53 },
  { name: '南宁', lng: 108.32, lat: 22.82 },
  { name: '成都', lng: 104.07, lat: 30.67 },
  { name: '西安', lng: 108.95, lat: 34.27 },
  { name: '桂林', lng: 110.28, lat: 25.29 },
  { name: '北海', lng: 109.12, lat: 21.48 },
  { name: '防城港', lng: 108.35, lat: 21.70 },
  { name: '青岛', lng: 120.38, lat: 36.07 },
  { name: '三亚', lng: 109.51, lat: 18.25 },
  { name: '自贡', lng: 104.78, lat: 29.35 },
  { name: '大理', lng: 100.23, lat: 25.61 },
  { name: '乐山', lng: 103.76, lat: 29.57 },
  { name: '绵阳', lng: 104.68, lat: 31.47 },
  { name: '资阳', lng: 104.65, lat: 30.13 },
  { name: '眉山', lng: 103.85, lat: 30.08 },
  { name: '德阳', lng: 104.40, lat: 31.14 },
];