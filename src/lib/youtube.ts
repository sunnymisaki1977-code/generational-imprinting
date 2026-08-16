import { cache } from "react";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export const getYoutubeVideos = cache(async (): Promise<YouTubeVideo[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.warn("Missing YouTube API keys");
    return [];
  }

  // 將頻道 ID (UC...) 轉換為上傳播放清單 ID (UU...)
  // 這是取得頻道所有影片最節省 Quota 的方式
  const uploadsPlaylistId = channelId.replace(/^UC/, "UU");

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`;
    const response = await fetch(url, { next: { revalidate: 3600 } }); // 快取 1 小時

    if (!response.ok) {
      throw new Error(`YouTube API failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
});
