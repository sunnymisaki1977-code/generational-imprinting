import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Helper to fetch Google Fonts as TTF dynamically, only for the characters we need!
async function getGoogleFont(text: string) {
  // Use Noto Serif TC
  const family = 'Noto+Serif+TC:wght@700';
  
  // We need to fetch CSS first with a user agent that forces TTF format instead of WOFF2
  const API = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  
  const css = await (
    await fetch(API, {
      headers: {
        // Mac Safari User Agent from a decade ago to force TTF
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    })
  ).text();

  // Extract the URL of the font from the CSS
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (!resource) {
    throw new Error('Failed to download font TTF url');
  }

  const res = await fetch(resource[1]);
  return await res.arrayBuffer();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 從網址列取得參數
    const imageUrl = searchParams.get('imageUrl');
    const blessing = searchParams.get('blessing') || '';
    const godName = searchParams.get('godName') || '';

    if (!imageUrl) {
      return new Response('Missing imageUrl', { status: 400 });
    }

    // 將相對路徑轉換為絕對路徑，因為 satori/fetch 在 Server 端不支援相對路徑
    let absoluteImageUrl = imageUrl;
    if (imageUrl.startsWith('/')) {
      absoluteImageUrl = `${request.nextUrl.origin}${imageUrl}`;
    }

    // 將所有需要用到的文字統整，以取得對應的字型 (只下載需要的字，省去幾十MB的下載時間)
    const allText = godName + blessing;
    
    // 如果有中文字，抓取字型
    let fontData = null;
    if (allText) {
      try {
        fontData = await getGoogleFont(allText);
      } catch (err) {
        console.error('Failed to load font:', err);
      }
    }

    return new ImageResponse(
      (
          <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#F8F6F0', // Rice color
            position: 'relative',
          }}
        >
          {/* 原神明圖卡底圖 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={absoluteImageUrl}
            alt="god"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />

          {/* 下半部的暗色漸層遮罩，讓文字能清楚顯現 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4), transparent)',
              padding: '40px',
            }}
          >
            {/* 祝福語文字 */}
            {blessing && (
              <div
                style={{
                  display: 'flex',
                  color: 'white',
                  fontSize: 54,
                  fontWeight: 700,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.4,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  fontFamily: '"Noto Serif TC"',
                }}
              >
                {blessing}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1920, // 9:16 長輩圖/手機直式比例
        fonts: fontData
          ? [
              {
                name: 'Noto Serif TC',
                data: fontData,
                style: 'normal',
                weight: 700,
              },
            ]
          : undefined,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
