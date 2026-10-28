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
  // 华北
  { name: '石家庄', lng: 114.47, lat: 38.03 },
  { name: '太原', lng: 112.53, lat: 37.87 },
  { name: '呼和浩特', lng: 111.80, lat: 40.82 },
  // 东北
  { name: '沈阳', lng: 123.40, lat: 41.83 },
  { name: '长春', lng: 125.32, lat: 43.88 },
  { name: '哈尔滨', lng: 126.63, lat: 45.75 },
  // 华东
  { name: '济南', lng: 117.00, lat: 36.65 },
  { name: '南京', lng: 118.78, lat: 32.04 },
  { name: '杭州', lng: 120.19, lat: 30.26 },
  { name: '合肥', lng: 117.27, lat: 31.86 },
  { name: '福州', lng: 119.30, lat: 26.08 },
  { name: '南昌', lng: 115.89, lat: 28.68 },
  // 中南
  { name: '郑州', lng: 113.65, lat: 34.76 },
  { name: '武汉', lng: 114.31, lat: 30.52 },
  { name: '长沙', lng: 112.98, lat: 28.20 },
  { name: '广州', lng: 113.23, lat: 23.13 },
  { name: '南宁', lng: 108.32, lat: 22.82 },
  { name: '海口', lng: 110.35, lat: 20.02 },
  // 西南
  { name: '成都', lng: 104.07, lat: 30.67 },
  { name: '贵阳', lng: 106.71, lat: 26.57 },
  { name: '昆明', lng: 102.73, lat: 25.04 },
  { name: '拉萨', lng: 91.13, lat: 29.65 },
  // 西北
  { name: '西安', lng: 108.95, lat: 34.27 },
  { name: '兰州', lng: 103.85, lat: 36.06 },
  { name: '西宁', lng: 101.74, lat: 36.56 },
  { name: '银川', lng: 106.28, lat: 38.47 },
  { name: '乌鲁木齐', lng: 87.62, lat: 43.82 },
  // 特别行政区
  { name: '香港', lng: 114.17, lat: 22.30 },
  { name: '澳门', lng: 113.55, lat: 22.20 },
  // 台湾
  { name: '台北', lng: 121.50, lat: 25.05 },
];