"use client";
import { useState } from "react";

const BORDER = "1px solid rgba(242,242,242,.12)";
const BORDER_STRONG = "1px solid rgba(242,242,242,.22)";

/* ── Status badge ── */
function Badge({ label, type }: { label: string; type?: "good" | "warn" | "neutral" }) {
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
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
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
    }}>
      {children}
    </a>
  );
}

export default function OpsHub() {
  const [activeSection, setActiveSection] = useState<"tasks" | "content" | "projects">("tasks");

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
        <NavLink href="#tasks">Tasks <span style={{ color: "var(--accent)", marginLeft: 6 }}>42</span></NavLink>
        <NavLink href="#projects">Projects <span style={{ color: "var(--accent)", marginLeft: 6 }}>9</span></NavLink>
        <NavLink href="#content">Content <span style={{ color: "var(--accent)", marginLeft: 6 }}>12</span></NavLink>
        <NavLink href="#meetings">Meetings</NavLink>
        <NavLink href="#sops">SOPs</NavLink>
        <NavLink href="#scorecard">Scorecard</NavLink>
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
          <div style={{
            display: "flex",
            gap: 10,
            flexShrink: 0,
          }}>
            <Badge label="Week: Jun 16–22" type="neutral" />
            <Badge label="7 need review" type="warn" />
            <Badge label="base live" type="good" />
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
                ["42", "Active tasks"],
                ["9",  "Projects"],
                ["7",  "Need review"],
                ["12", "Content ready"],
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
            {(["tasks", "content", "projects"] as const).map((tab) => (
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
                {tab}
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
