/** 城市配置文件 — 经纬度会自动投影到地图 SVG 坐标 */
export interface City {
  name: string;
  lng: number; // 经度
  lat: number; // 纬度
}

export const visitedCities: City[] = [
  { name: '成都', lng: 104.07, lat: 30.67 },
];