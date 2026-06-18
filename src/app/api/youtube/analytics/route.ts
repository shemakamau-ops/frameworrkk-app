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

  const youtubeAnalytics = google.youtubeAnalytics({ version: "v2", auth: oauth2Client });

  // Last 28 days
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data } = await youtubeAnalytics.reports.query({
    ids: "channel==MINE",
    startDate,
    endDate,
    metrics: "views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,estimatedRevenue",
    dimensions: "day",
    sort: "day",
  });

  const rows = data.rows ?? [];

  const totals = rows.reduce(
    (acc, row) => ({
      views: acc.views + Number(row[1] ?? 0),
      watchMinutes: acc.watchMinutes + Number(row[2] ?? 0),
      avgViewDuration: acc.avgViewDuration + Number(row[3] ?? 0),
      subsGained: acc.subsGained + Number(row[4] ?? 0),
      subsLost: acc.subsLost + Number(row[5] ?? 0),
      revenue: acc.revenue + Number(row[6] ?? 0),
    }),
    { views: 0, watchMinutes: 0, avgViewDuration: 0, subsGained: 0, subsLost: 0, revenue: 0 }
  );

  return NextResponse.json({
    period: { startDate, endDate },
    totals: {
      ...totals,
      avgViewDuration: rows.length ? Math.round(totals.avgViewDuration / rows.length) : 0,
      netSubscribers: totals.subsGained - totals.subsLost,
      revenue: totals.revenue.toFixed(2),
    },
    daily: rows.map((row) => ({
      date: row[0],
      views: Number(row[1] ?? 0),
      watchMinutes: Number(row[2] ?? 0),
      avgViewDuration: Number(row[3] ?? 0),
      subsGained: Number(row[4] ?? 0),
      subsLost: Number(row[5] ?? 0),
      revenue: Number(row[6] ?? 0),
    })),
  });
}
