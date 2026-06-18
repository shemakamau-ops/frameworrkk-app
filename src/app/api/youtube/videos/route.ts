import { auth } from "@/auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  // Get uploads playlist ID from channel
  const { data: channelData } = await youtube.channels.list({
    part: ["contentDetails"],
    mine: true,
  });

  const uploadsPlaylistId =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    return NextResponse.json({ error: "No uploads playlist found" }, { status: 404 });
  }

  // Get latest 20 videos from uploads playlist
  const { data: playlistData } = await youtube.playlistItems.list({
    part: ["snippet", "contentDetails"],
    playlistId: uploadsPlaylistId,
    maxResults: 20,
  });

  const videoIds = playlistData.items
    ?.map((item) => item.contentDetails?.videoId)
    .filter(Boolean) as string[];

  if (!videoIds?.length) {
    return NextResponse.json({ videos: [] });
  }

  // Get full stats for each video
  const { data: videoData } = await youtube.videos.list({
    part: ["snippet", "statistics"],
    id: videoIds,
  });

  const videos = videoData.items?.map((video) => ({
    id: video.id,
    title: video.snippet?.title,
    publishedAt: video.snippet?.publishedAt,
    thumbnail: video.snippet?.thumbnails?.medium?.url,
    views: Number(video.statistics?.viewCount ?? 0),
    likes: Number(video.statistics?.likeCount ?? 0),
    comments: Number(video.statistics?.commentCount ?? 0),
  }));

  return NextResponse.json({ videos });
}
