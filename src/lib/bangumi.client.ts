'use client';

export interface BangumiCalendarData {
  weekday: {
    en: string;
  };
  items: {
    id: number;
    name: string;
    name_cn: string;
    rating: {
      score: number;
    };
    air_date: string;
    images: {
      large: string;
      common: string;
      medium: string;
      small: string;
      grid: string;
    };
  }[];
}

export async function GetBangumiCalendarData(): Promise<BangumiCalendarData[]> {
  const response = await fetch('/api/bangumi/calendar');
  const data = await response.json();
  
  // API v0 返回空数组或格式不同时处理
  if (!data || data.length === 0) {
    return [];
  }
  
  // 适配旧版 API 格式 (数组)
  if (Array.isArray(data)) {
    const filteredData = data.map((item: BangumiCalendarData) => ({
      ...item,
      items: item.items?.filter(bangumiItem => bangumiItem?.images) || []
    }));
    return filteredData;
  }
  
  // 适配新版 API v0 格式 (对象)
  // 如果返回的是单个对象，转换为数组格式
  return [];
}
