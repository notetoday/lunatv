import { NextResponse } from 'next/server';

import { getCacheTime } from '@/lib/config';

export const runtime = 'nodejs';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // 尝试使用新版 API v0
    const response = await fetch('https://api.bgm.tv/v0/calendar', {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'notetoday/lunatv/100.1.3',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const cacheTime = await getCacheTime();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
        'CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
        'Vercel-CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('获取番剧日历失败:', (error as Error).message);
    // 返回空数组，避免页面崩溃
    // 注意：此接口依赖 bgm.tv API，如果服务不可用将返回空数据
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  }
}
