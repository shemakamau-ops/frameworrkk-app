type ContentPlatform = "YouTube" | "Instagram";

type ContentPost = {
  title: string;
  platform: ContentPlatform;
  topic: string;
  format: string;
  publishedAt: string;
  performance: number;
};

const demoContentFeed: ContentPost[] = [
  { title: "Positioning video", platform: "YouTube", topic: "positioning", format: "education", publishedAt: "2026-06-02", performance: 88 },
  { title: "One shoot / week of content", platform: "YouTube", topic: "content systems", format: "tutorial", publishedAt: "2026-06-05", performance: 84 },
  { title: "Georgia travel setup", platform: "YouTube", topic: "travel workflow", format: "behind the scenes", publishedAt: "2026-06-09", performance: 77 },
  { title: "Client reel breakdown", platform: "YouTube", topic: "client work", format: "case study", publishedAt: "2026-06-12", performance: 81 },
  { title: "Shoot day checklist", platform: "Instagram", topic: "content systems", format: "carousel", publishedAt: "2026-06-01", performance: 73 },
  { title: "Georgia b-roll pocket cam", platform: "Instagram", topic: "travel workflow", format: "reel", publishedAt: "2026-06-03", performance: 86 },
  { title: "Before editing, organize", platform: "Instagram", topic: "editing workflow", format: "reel", publishedAt: "2026-06-04", performance: 78 },
  { title: "Thumbnail direction notes", platform: "Instagram", topic: "positioning", format: "story", publishedAt: "2026-06-06", performance: 64 },
  { title: "How I batch scripts", platform: "Instagram", topic: "content systems", format: "reel", publishedAt: "2026-06-07", performance: 82 },
  { title: "Travel voiceover pass", platform: "Instagram", topic: "travel workflow", format: "reel", publishedAt: "2026-06-08", performance: 79 },
  { title: "Client recap teaser", platform: "Instagram", topic: "client work", format: "reel", publishedAt: "2026-06-10", performance: 83 },
  { title: "Desk reset for planning", platform: "Instagram", topic: "operations", format: "story", publishedAt: "2026-06-11", performance: 59 },
  { title: "Manager handoff rules", platform: "Instagram", topic: "operations", format: "carousel", publishedAt: "2026-06-13", performance: 68 },
  { title: "Script hook examples", platform: "Instagram", topic: "positioning", format: "carousel", publishedAt: "2026-06-14", performance: 80 },
  { title: "Editing queue mini update", platform: "Instagram", topic: "editing workflow", format: "story", publishedAt: "2026-06-15", performance: 66 },
];

export async function GET() {
  // Replace this demo feed with server-side YouTube Data API and Instagram Graph API calls.
  // Keep API keys in Vercel environment variables, never in client components.
  return Response.json(demoContentFeed);
}
