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

  const { data } = await youtube.channels.list({
    part: ["snippet", "statistics", "contentDetails"],
    mine: true,
  });

  const channel = data.items?.[0];
  if (!channel) {
    return NextResponse.json({ error: "No channel found" }, { status: 404 });
  }

  return NextResponse.json({
    id: channel.id,
    title: channel.snippet?.title,
    description: channel.snippet?.description,
    thumbnail: channel.snippet?.thumbnails?.default?.url,
    subscribers: channel.statistics?.subscriberCount,
    views: channel.statistics?.viewCount,
    videos: channel.statistics?.videoCount,
    uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads,
  });
}
