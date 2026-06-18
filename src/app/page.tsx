"use client";
import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const BORDER = "1px solid rgba(242,242,242,.12)";
const BORDER_STRONG = "1px solid rgba(242,242,242,.22)";

type BadgeTone = "good" | "warn" | "neutral";
type DashboardSection = "tasks" | "content" | "projects" | "intel" | "youtube";
type ContentPlatform = "YouTube" | "Instagram";

type ContentPost = {
  title: string;
  platform: ContentPlatform;
  topic: string;
  format: string;
  publishedAt: string;
  performance: number;
};

type ContentSuggestion = {
  type: string;
  title: string;
  reason: string;
  score: number;
};

type ContentIntel = {
  monthLabel: string;
  monthPosts: ContentPost[];
  totalPercent: number;
  primarySuggestion: ContentSuggestion;
  suggestions: ContentSuggestion[];
  topTopic: string;
  topFormat: string;
  repurposeCount: number;
  channelCounts: Record<ContentPlatform, number>;
};

const CONTENT_GOALS: Record<ContentPlatform | "total", number> = {
  total: 40,
  YouTube: 8,
  Instagram: 32,
};

const FALLBACK_CONTENT_FEED: ContentPost[] = [
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

function monthKey(dateValue: string | Date) {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getMonthLabel(month: string) {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Date(year, monthIndex, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function countBy<T extends Record<string, unknown>>(items: T[], key: keyof T) {
  return items.reduce<Record<string, number>>((totals, item) => {
    const value = String(item[key] || "Other");
    totals[value] = (totals[value] || 0) + 1;
    return totals;
  }, {});
}

function topByPerformance(items: ContentPost[], key: "topic" | "format") {
  const groups = items.reduce<Record<string, { count: number; performance: number }>>((totals, item) => {
    const value = item[key] || "Other";
    totals[value] ||= { count: 0, performance: 0 };
    totals[value].count += 1;
    totals[value].performance += item.performance || 0;
    return totals;
  }, {});

  return Object.entries(groups)
    .map(([name, data]) => ({ name, score: Math.round(data.performance / data.count), count: data.count }))
    .sort((a, b) => (b.score + b.count * 2) - (a.score + a.count * 2))[0] ?? { name: "content systems", score: 80, count: 1 };
}

function getContentIntel(feed: ContentPost[]): ContentIntel {
  const safeFeed = feed.length ? feed : FALLBACK_CONTENT_FEED;
  const nowKey = monthKey(new Date());
  const activeMonth = safeFeed.some((post) => monthKey(post.publishedAt) === nowKey)
    ? nowKey
    : monthKey([...safeFeed].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0].publishedAt);
  const monthPosts = safeFeed.filter((post) => monthKey(post.publishedAt) === activeMonth);
  const bestPost = [...safeFeed].sort((a, b) => (b.performance || 0) - (a.performance || 0))[0];
  const bestYouTube = [...safeFeed]
    .filter((post) => post.platform === "YouTube")
    .sort((a, b) => (b.performance || 0) - (a.performance || 0))[0] ?? bestPost;
  const topTopic = topByPerformance(safeFeed, "topic");
  const topFormat = topByPerformance(safeFeed, "format");
  const topicCounts = countBy(monthPosts, "topic");
  const missingProof = !monthPosts.some((post) => post.topic === "client work" && post.performance >= 80);
  const postedTotal = monthPosts.length;
  const totalPercent = Math.min(100, Math.round((postedTotal / CONTENT_GOALS.total) * 100));
  const rawChannelCounts = countBy(monthPosts, "platform");

  const suggestions: ContentSuggestion[] = [
    {
      type: "Follow-up",
      title: `Make a part two on ${topTopic.name}`,
      reason: `${topTopic.name} has the best mix of volume and performance in the current feed.`,
      score: Math.min(98, topTopic.score + 8),
    },
    {
      type: "Repurpose",
      title: `Cut "${bestYouTube.title}" into 5 short posts`,
      reason: "Turn the strongest long-form angle into Reels, Shorts, and Stories while the topic is warm.",
      score: 92,
    },
    {
      type: missingProof ? "Gap" : "Double down",
      title: missingProof ? "Add one client-results story" : `Push another ${bestPost.topic} post`,
      reason: missingProof
        ? "The mix is strong on process. A proof-based post would balance the feed and support selling."
        : `"${bestPost.title}" is your strongest signal, so the next move should stay close to that angle.`,
      score: missingProof ? 86 : Math.min(96, (bestPost.performance || 80) + 6),
    },
    {
      type: "Balance",
      title: "Keep Instagram volume steady this week",
      reason: `You have ${Object.keys(topicCounts).length} active topics. Rotate them so the feed does not lean too hard on one lane.`,
      score: 79,
    },
  ];

  return {
    monthLabel: getMonthLabel(activeMonth),
    monthPosts,
    totalPercent,
    primarySuggestion: suggestions[0],
    suggestions: suggestions.slice(1),
    topTopic: topTopic.name,
    topFormat: topFormat.name,
    repurposeCount: safeFeed.filter((post) => post.platform === "YouTube" && (post.performance || 0) >= 75).length,
    channelCounts: {
      YouTube: rawChannelCounts.YouTube || 0,
      Instagram: rawChannelCounts.Instagram || 0,
    },
  };
}

/* ── Status badge ── */
function YouTubeView({ videos, analytics }: { videos: VideoData[]; analytics: AnalyticsData | null }) {
  function fmtMins(mins: number) {
    if (mins >= 60) return `${(mins / 60).toFixed(1)}h`;
    return `${mins}m`;
  }
  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  const maxViews = Math.max(...(analytics?.daily.map(d => d.views) ?? [1]), 1);

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

      {/* Analytics strip */}
      {analytics ? (
        <>
          <div style={{ padding: "12px 22px 0", borderBottom: BORDER }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(242,242,242,.4)" }}>
              Last 28 days
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderBottom: BORDER_STRONG }}>
            {[
              ["Views",       analytics.totals.views.toLocaleString()],
              ["Watch time",  fmtMins(analytics.totals.watchMinutes)],
              ["Avg duration",`${Math.floor(analytics.totals.avgViewDuration / 60)}:${String(analytics.totals.avgViewDuration % 60).padStart(2,"0")}`],
              ["Net subs",    (analytics.totals.netSubscribers >= 0 ? "+" : "") + analytics.totals.netSubscribers],
              ["Revenue",     `$${analytics.totals.revenue}`],
            ].map(([label, val], i) => (
              <div key={label} style={{
                padding: "16px 14px",
                borderRight: i < 4 ? BORDER : "none",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(242,242,242,.4)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", color: label === "Revenue" ? "var(--accent-2)" : label === "Net subs" && analytics.totals.netSubscribers >= 0 ? "#86efac" : "#F2F2F2" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Sparkline bar chart */}
          <div style={{ padding: "14px 22px", borderBottom: BORDER_STRONG, display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
            {analytics.daily.map((day) => (
              <div key={day.date} title={`${fmtDate(day.date)}: ${day.views.toLocaleString()} views`} style={{
                flex: 1,
                height: `${Math.max(4, Math.round((day.views / maxViews) * 40))}px`,
                background: `rgba(235,106,46,${0.3 + (day.views / maxViews) * 0.7})`,
                borderRadius: 2,
                cursor: "default",
              }} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ padding: "18px 22px", borderBottom: BORDER_STRONG, fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(242,242,242,.3)" }}>
          Loading analytics…
        </div>
      )}

      {/* Video list */}
      <div style={{ padding: "10px 22px 6px", borderBottom: BORDER }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 60px 60px", gap: 12 }}>
          {["Video", "Views", "Likes", "Published"].map(h => (
            <span key={h} style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(242,242,242,.35)" }}>{h}</span>
          ))}
        </div>
      </div>

      {videos.length === 0 ? (
        <div style={{ padding: "18px 22px", fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(242,242,242,.3)" }}>Loading videos…</div>
      ) : (
        videos.map((v) => (
          <div key={v.id} style={{
            display: "grid",
            gridTemplateColumns: "1fr 70px 60px 60px",
            gap: 12,
            padding: "12px 22px",
            borderBottom: BORDER,
            alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumbnail} alt={v.title} style={{ width: 56, height: 32, objectFit: "cover", borderRadius: 3, flexShrink: 0, border: "1px solid rgba(255,255,255,.08)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>{v.views.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: "rgba(242,242,242,.5)" }}>{v.likes.toLocaleString()}</div>
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "rgba(242,242,242,.4)" }}>{fmtDate(v.publishedAt)}</div>
          </div>
        ))
      )}
    </div>
  );
}

function AuthButton() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  if (session) {
    return (
      <button onClick={() => signOut()} style={{
        marginLeft: "auto",
        padding: "0 22px",
        background: "none",
        border: "none",
        borderLeft: BORDER_STRONG,
        color: "rgba(242,242,242,.5)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}>
        {session.user?.name?.split(" ")[0]} · Sign out
      </button>
    );
  }
  return (
    <button onClick={() => signIn("google")} style={{
      marginLeft: "auto",
      padding: "0 22px",
      background: "none",
      border: "none",
      borderLeft: BORDER_STRONG,
      color: "var(--accent)",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      cursor: "pointer",
      whiteSpace: "nowrap",
    }}>
      Connect YouTube →
    </button>
  );
}

function Badge({ label, type }: { label: string; type?: BadgeTone }) {
  const color =
    type === "good"    ? "#86efac" :
    type === "warn"    ? "#f0a070" :
                         "rgba(242,242,242,.45)";
  return (
    <span style={{
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color,
      border: `1px solid ${color}`,
      padding: "3px 8px",
      borderRadius: 2,
    }}>
      {label}
    </span>
  );
}

/* ── Nav link ── */
function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a href={href} style={{
      flex: 1,
      borderLeft: BORDER_STRONG,
      padding: "16px 22px",
      color: "rgba(242,242,242,.7)",
      textDecoration: "none",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      transition: "color .15s",
    }} onClick={onClick}>
      {children}
    </a>
  );
}

function ProgressBar({ platform, count }: { platform: ContentPlatform; count: number }) {
  const goal = CONTENT_GOALS[platform];
  const percent = Math.min(100, Math.round((count / goal) * 100));

  return (
    <div style={{ padding: "14px 0", borderBottom: BORDER }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 12,
        marginBottom: 9,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{platform}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(242,242,242,.45)" }}>
          {count} / {goal} posted
        </span>
      </div>
      <div style={{
        height: 8,
        background: "rgba(242,242,242,.1)",
        border: BORDER,
        overflow: "hidden",
      }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          background: platform === "YouTube" ? "var(--accent)" : "var(--accent-2)",
          transition: "width .3s ease",
        }} />
      </div>
    </div>
  );
}

function ContentIntelView({ intel }: { intel: ContentIntel }) {
  const postedTotal = intel.monthPosts.length;

  return (
    <div id="content-intel" style={{ flex: 1, overflow: "auto" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 22px",
        borderBottom: BORDER,
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(242,242,242,.35)" }}>
          Content intelligence
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(242,242,242,.45)" }}>
          {intel.monthLabel}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", minHeight: "100%" }}>
        <section style={{
          flex: "1 1 460px",
          borderRight: BORDER_STRONG,
          padding: 22,
          minWidth: 0,
        }}>
          <Badge label="Next best move" type="good" />
          <h2 style={{
            margin: "18px 0 12px",
            fontSize: "clamp(28px, 4vw, 48px)",
            lineHeight: .95,
            letterSpacing: 0,
          }}>
            {intel.primarySuggestion.title}
          </h2>
          <p style={{
            margin: "0 0 22px",
            maxWidth: 620,
            color: "rgba(242,242,242,.72)",
            lineHeight: 1.6,
            fontSize: 14,
          }}>
            {intel.primarySuggestion.reason}
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 10,
            marginBottom: 22,
          }}>
            {[
              [intel.topTopic, "Strongest topic"],
              [intel.topFormat, "Best format"],
              [String(intel.repurposeCount), "Repurpose chances"],
            ].map(([value, label]) => (
              <div key={label} style={{ borderTop: `1px solid rgba(235,106,46,.32)`, paddingTop: 12 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "var(--accent)", lineHeight: 1.1 }}>{value}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(242,242,242,.4)", marginTop: 5, letterSpacing: ".06em", textTransform: "uppercase" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {intel.suggestions.map((suggestion) => (
            <div key={suggestion.title} style={{
              display: "grid",
              gridTemplateColumns: "1fr 54px",
              gap: 16,
              padding: "16px 0",
              borderTop: BORDER,
              alignItems: "center",
            }}>
              <div>
                <Badge label={suggestion.type} type="neutral" />
                <div style={{ fontSize: 14, fontWeight: 700, margin: "9px 0 4px" }}>{suggestion.title}</div>
                <div style={{ fontSize: 12, color: "rgba(242,242,242,.46)", fontFamily: "var(--font-mono)", lineHeight: 1.5 }}>
                  {suggestion.reason}
                </div>
              </div>
              <div style={{
                width: 54,
                height: 54,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, var(--accent-2), var(--accent))",
                color: "#0D0D0D",
                fontWeight: 900,
              }}>
                {suggestion.score}
              </div>
            </div>
          ))}
        </section>

        <aside style={{ flex: "1 1 300px", padding: 22, minWidth: 0 }}>
          <p style={{ margin: "0 0 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(242,242,242,.4)" }}>
            Monthly Progress
          </p>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            paddingBottom: 22,
            borderBottom: BORDER,
          }}>
            <div>
              <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1, letterSpacing: 0 }}>
                {postedTotal} / {CONTENT_GOALS.total}
              </div>
              <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(242,242,242,.42)", lineHeight: 1.5 }}>
                {Math.max(CONTENT_GOALS.total - postedTotal, 0)} posts left to hit the month.
              </div>
            </div>
            <div style={{
              width: 112,
              height: 112,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: `conic-gradient(var(--accent) ${intel.totalPercent * 3.6}deg, rgba(242,242,242,.1) 0deg)`,
              flexShrink: 0,
            }}>
              <div style={{
                width: 78,
                height: 78,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "#0D0D0D",
                border: BORDER,
                fontWeight: 900,
              }}>
                {intel.totalPercent}%
              </div>
            </div>
          </div>

          <ProgressBar platform="YouTube" count={intel.channelCounts.YouTube} />
          <ProgressBar platform="Instagram" count={intel.channelCounts.Instagram} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
            {["YouTube", "Instagram", "Monthly target: 40"].map((label) => (
              <span key={label} style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(242,242,242,.45)",
                border: BORDER,
                padding: "6px 8px",
              }}>
                {label}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

type ChannelData = {
  title: string;
  thumbnail: string;
  subscribers: string;
  views: string;
  videos: string;
};

type VideoData = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
};

type AnalyticsData = {
  period: { startDate: string; endDate: string };
  totals: {
    views: number;
    watchMinutes: number;
    avgViewDuration: number;
    subsGained: number;
    subsLost: number;
    netSubscribers: number;
    revenue: string;
  };
  daily: { date: string; views: number; watchMinutes: number; revenue: number }[];
};

export default function OpsHub() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("tasks");
  const [contentFeed, setContentFeed] = useState<ContentPost[]>(FALLBACK_CONTENT_FEED);
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const contentIntel = useMemo(() => getContentIntel(contentFeed), [contentFeed]);

  useEffect(() => {
    fetch("/api/youtube/channel")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setChannel(data); })
      .catch(() => {});

    fetch("/api/youtube/videos")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.videos) setVideos(data.videos); })
      .catch(() => {});

    fetch("/api/youtube/analytics")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.totals) setAnalytics(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/content-feed", { headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error("No content feed available");
        return response.json() as Promise<ContentPost[]>;
      })
      .then((feed) => {
        if (isMounted && Array.isArray(feed) && feed.length > 0) {
          setContentFeed(feed);
        }
      })
      .catch(() => {
        if (isMounted) setContentFeed(FALLBACK_CONTENT_FEED);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectSection = (section: DashboardSection) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActiveSection(section);
    window.requestAnimationFrame(() => {
      document.getElementById(section === "intel" ? "content-intel" : section)?.scrollIntoView({ block: "nearest" });
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#0D0D0D",
      color: "#F2F2F2",
    }}>

      {/* ── TOP LINE ── */}
      <div style={{ height: 3, background: "#F2F2F2", flexShrink: 0 }} />

      {/* ── NAV ── */}
      <nav style={{
        display: "flex",
        alignItems: "stretch",
        borderBottom: BORDER_STRONG,
        flexShrink: 0,
      }}>
        <div style={{
          padding: "16px 22px",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "rgba(242,242,242,.45)",
          letterSpacing: ".04em",
          minWidth: 220,
          borderRight: BORDER_STRONG,
        }}>
          © 2026 Framework
        </div>
        <NavLink href="#tasks" onClick={selectSection("tasks")}>Tasks <span style={{ color: "var(--accent)", marginLeft: 6 }}>42</span></NavLink>
        <NavLink href="#projects" onClick={selectSection("projects")}>Projects <span style={{ color: "var(--accent)", marginLeft: 6 }}>9</span></NavLink>
        <NavLink href="#content" onClick={selectSection("content")}>Content <span style={{ color: "var(--accent)", marginLeft: 6 }}>12</span></NavLink>
        <NavLink href="#content-intel" onClick={selectSection("intel")}>Suggestions <span style={{ color: "var(--accent)", marginLeft: 6 }}>New</span></NavLink>
        <NavLink href="#meetings">Meetings</NavLink>
        <NavLink href="#sops">SOPs</NavLink>
        <NavLink href="#scorecard">Scorecard</NavLink>
        <AuthButton />
      </nav>

      {/* ── HERO ROW ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        borderBottom: BORDER_STRONG,
        flexShrink: 0,
      }}>
        <div style={{
          padding: "22px",
          borderRight: BORDER_STRONG,
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 28,
          color: "var(--accent)",
          display: "flex",
          alignItems: "center",
        }}>
          F
        </div>
        <div style={{
          padding: "22px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}>
          <h1 style={{
            margin: 0,
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}>
            Operations Hub
          </h1>
          <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
            {channel && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, borderRight: BORDER, paddingRight: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={channel.thumbnail} alt={channel.title} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(235,106,46,.4)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(242,242,242,.6)" }}>{channel.title}</span>
              </div>
            )}
            <Badge label="Week: Jun 16–22" type="neutral" />
            <Badge label="7 need review" type="warn" />
            <Badge label={channel ? "YouTube connected" : "base live"} type="good" />
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr 280px",
        flex: 1,
        borderBottom: BORDER_STRONG,
      }}>

        {/* Left col: priority + scorecard */}
        <div style={{ borderRight: BORDER_STRONG, display: "flex", flexDirection: "column" }}>
          {/* Priority */}
          <div style={{ padding: "22px", borderBottom: BORDER, flex: 1 }}>
            <p style={{
              margin: "0 0 20px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "rgba(242,242,242,.4)",
            }}>
              Priority
            </p>
            <p style={{
              margin: "0 0 24px",
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(242,242,242,.85)",
            }}>
              Keep the work visible, owned, and moving. Three questions: what matters now,
              who owns it, what is blocked.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                [channel ? Number(channel.subscribers).toLocaleString() : "—", "Subscribers"],
                [channel ? Number(channel.views).toLocaleString() : "—",       "Total views"],
                [channel ? channel.videos : "—",                                "Videos"],
                ["82",                                                           "This month"],
              ].map(([val, label]) => (
                <div key={label} style={{
                  borderTop: `1px solid rgba(235,106,46,.3)`,
                  paddingTop: 10,
                }}>
                  <div style={{
                    fontSize: 28,
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                    color: "var(--accent)",
                    lineHeight: 1,
                  }}>{val}</div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(242,242,242,.4)",
                    marginTop: 4,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                  }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scorecard */}
          <div style={{ padding: "22px" }}>
            <p style={{
              margin: "0 0 14px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "rgba(242,242,242,.4)",
            }}>
              Scorecard
            </p>
            {[
              ["18", "Completed",   "good"],
              ["4",  "Overdue",     "warn"],
              ["7",  "Pending",     "warn"],
              ["11", "Delivered",   "good"],
            ].map(([val, label, type]) => (
              <div key={label} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: BORDER,
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(242,242,242,.6)", letterSpacing: ".04em" }}>{label}</span>
                <span style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: type === "good" ? "#86efac" : "#f0a070",
                }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Centre col: tabbed content */}
        <div style={{ display: "flex", flexDirection: "column", borderRight: BORDER_STRONG }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: BORDER_STRONG }}>
            {(["tasks", "content", "projects", "intel", "youtube"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveSection(tab)} style={{
                flex: 1,
                padding: "14px",
                background: "none",
                border: "none",
                borderRight: BORDER,
                borderBottom: activeSection === tab ? "2px solid var(--accent)" : "2px solid transparent",
                color: activeSection === tab ? "#F2F2F2" : "rgba(242,242,242,.4)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}>
                {tab === "intel" ? "suggestions" : tab === "youtube" ? "YouTube" : tab}
              </button>
            ))}
          </div>

          {/* Tasks */}
          {activeSection === "tasks" && (
            <div style={{ flex: 1, overflow: "auto" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 110px 80px",
                padding: "10px 22px",
                borderBottom: BORDER,
                gap: 12,
              }}>
                {["Task", "Owner", "Status", "Due"].map(h => (
                  <span key={h} style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(242,242,242,.35)" }}>{h}</span>
                ))}
              </div>
              {[
                ["Finish YouTube script drafts",      "Discovery content for next week",    "Shema",   "In Progress",  "good", "Tomorrow"],
                ["Edit latest client reel batch",     "First pass + export",                "Editor",  "Needs Review", "warn", "Today"],
                ["Approve thumbnail direction",       "2 options needed",                   "Shema",   "Blocked",      "warn", "Wed"],
                ["Update project notes",              "Keep latest context current",        "Manager", "Ready",        "good", "Fri"],
              ].map(([task, sub, owner, status, type, due]) => (
                <div key={task} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 90px 110px 80px",
                  padding: "16px 22px",
                  borderBottom: BORDER,
                  gap: 12,
                  alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{task}</div>
                    <div style={{ fontSize: 12, color: "rgba(242,242,242,.4)", fontFamily: "var(--font-mono)" }}>{sub}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(242,242,242,.6)" }}>{owner}</div>
                  <div><Badge label={status} type={type as "good" | "warn"} /></div>
                  <div style={{ fontSize: 12, color: "rgba(242,242,242,.5)", fontFamily: "var(--font-mono)" }}>{due}</div>
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          {activeSection === "content" && (
            <div style={{ flex: 1 }}>
              <div style={{ padding: "10px 22px", borderBottom: BORDER }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(242,242,242,.35)" }}>
                  Idea → Script → Film → Edit → Review → Publish
                </span>
              </div>
              {[
                ["YouTube: positioning video",           "Discovery piece for top-of-funnel.",     "Script", "good"],
                ["YouTube: one shoot / week of content", "Practical breakdown for creatives.",     "Film",   "warn"],
                ["Shorts batch from Georgia",            "Travel b-roll + voiceover clips.",       "Edit",   "neutral"],
                ["Client recap reel",                   "Waiting final export / send.",            "Ready",  "good"],
              ].map(([title, body, stage, type]) => (
                <div key={title as string} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 22px",
                  borderBottom: BORDER,
                  gap: 16,
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "rgba(242,242,242,.4)", fontFamily: "var(--font-mono)" }}>{body}</div>
                  </div>
                  <Badge label={stage as string} type={type as "good" | "warn" | "neutral"} />
                </div>
              ))}
            </div>
          )}

          {/* Projects kanban */}
          {activeSection === "projects" && (
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
              {[
                ["Planning", [["YouTube discovery system", "Brief"], ["Ops site build", "Base"]]],
                ["Active",   [["Georgia travel content", "Live"], ["Client delivery queue", "Busy"]]],
                ["Review",   [["Approval check", "Now"], ["Publish batch", "Queued"]]],
              ].map(([col, items]) => (
                <div key={col as string} style={{ borderRight: BORDER, padding: "16px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(242,242,242,.35)", marginBottom: 14 }}>
                    {col as string}
                  </div>
                  {(items as [string, string][]).map(([name, badge]) => (
                    <div key={name} style={{ padding: "12px 0", borderBottom: BORDER }}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{name}</div>
                      <Badge label={badge} type="neutral" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeSection === "intel" && (
            <ContentIntelView intel={contentIntel} />
          )}

          {activeSection === "youtube" && (
            <YouTubeView videos={videos} analytics={analytics} />
          )}
        </div>

        {/* Right col: team + rhythm + sops */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Team */}
          <div style={{ padding: "22px", borderBottom: BORDER }}>
            <p style={{ margin: "0 0 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(242,242,242,.4)" }}>
              Team
            </p>
            {[
              ["S", "Shema",    "Owner · approvals"],
              ["E", "Editor",   "Video pipeline"],
              ["M", "Managers", "Task routing"],
            ].map(([init, name, role]) => (
              <div key={name as string} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: BORDER,
              }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #F5B524, #EB6A2E)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#0D0D0D",
                  flexShrink: 0,
                }}>
                  {init}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "rgba(242,242,242,.4)", letterSpacing: ".03em" }}>{role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly rhythm */}
          <div style={{ padding: "22px", borderBottom: BORDER }}>
            <p style={{ margin: "0 0 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(242,242,242,.4)" }}>
              Weekly Rhythm
            </p>
            {[
              ["Monday",  "Plan",   "Set priorities."],
              ["Midweek", "Review", "Move blockers."],
              ["Friday",  "Close",  "Prep next week."],
            ].map(([day, tag, body]) => (
              <div key={day as string} style={{ padding: "10px 0", borderBottom: BORDER }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{day}</span>
                  <Badge label={tag as string} type="neutral" />
                </div>
                <div style={{ fontSize: 12, color: "rgba(242,242,242,.45)", fontFamily: "var(--font-mono)" }}>{body}</div>
              </div>
            ))}
          </div>

          {/* SOPs */}
          <div style={{ padding: "22px", flex: 1 }}>
            <p style={{ margin: "0 0 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(242,242,242,.4)" }}>
              SOPs
            </p>
            {["Onboarding checklist", "Delivery workflow", "Content workflow", "Task update rules"].map(sop => (
              <div key={sop} style={{
                padding: "9px 0",
                borderBottom: BORDER,
                fontSize: 12,
                color: "rgba(242,242,242,.65)",
                fontFamily: "var(--font-mono)",
                letterSpacing: ".02em",
              }}>
                → {sop}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DISPLAY NAME ── */}
      <div style={{
        padding: "10px 22px 0",
        overflow: "hidden",
        lineHeight: 0.88,
        flexShrink: 0,
      }}>
        <p style={{
          margin: 0,
          fontSize: "clamp(64px, 13vw, 180px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: "#F2F2F2",
          whiteSpace: "nowrap",
        }}>
          Shema Kamau
        </p>
      </div>

      {/* ── BOTTOM LINE ── */}
      <div style={{ height: 3, background: "#F2F2F2", flexShrink: 0, marginTop: 10 }} />
    </div>
  );
}
