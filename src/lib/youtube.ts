import { cache } from "react";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export const getYoutubeVideos = cache(async (playlistId?: string): Promise<YouTubeVideo[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey) {
    console.warn("Missing YouTube API keys");
    return [];
  }

  // 如果沒有傳入 playlistId，預設使用頻道的上傳播放清單
  let targetPlaylistId = playlistId;
  if (!targetPlaylistId) {
    if (!channelId) {
       console.warn("Missing YouTube Channel ID");
       return [];
    }
    targetPlaylistId = channelId.replace(/^UC/, "UU");
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${targetPlaylistId}&maxResults=50&key=${apiKey}`;
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
    console.error(`Error fetching YouTube videos for playlist ${targetPlaylistId}:`, error);
    return [];
  }
});
