/** 城市配置文件 — 经纬度会自动投影到地图 SVG 坐标 */
export interface City {
  name: string;
  lng: number; // 经度
  lat: number; // 纬度
}

export const visitedCities: City[] = [
  // 直辖市
  { name: '北京', lng: 116.47, lat: 39.92 },
  { name: '上海', lng: 121.48, lat: 31.22 },
  { name: '天津', lng: 117.20, lat: 39.13 },
  { name: '重庆', lng: 106.53, lat: 29.53 },
  { name: '南宁', lng: 108.32, lat: 22.82 },
  { name: '成都', lng: 104.07, lat: 30.67 },
  { name: '西安', lng: 108.95, lat: 34.27 },
];