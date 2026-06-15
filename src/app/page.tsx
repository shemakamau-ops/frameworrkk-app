export default function OpsHub() {
  return (
    <div style={s.shell}>
      {/* ── SIDEBAR ── */}
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.logo}>F</div>
          <div>
            <p style={s.brandName}>Framework</p>
            <p style={s.brandSub}>Command center for Shema, editor, and managers</p>
          </div>
        </div>

        <SideBlock title="Navigation">
          <nav style={s.nav}>
            {[
              ["Command Center", "Home",   "#command"],
              ["Tasks",          "42",     "#tasks"],
              ["Projects",       "9",      "#projects"],
              ["Content",        "12",     "#content"],
              ["Meetings",       "Weekly", "#meetings"],
              ["SOPs",           "10",     "#sops"],
              ["Scorecard",      "Live",   "#scorecard"],
            ].map(([label, meta, href]) => (
              <a key={href} href={href} style={s.navLink}>
                <span>{label}</span>
                <span style={s.navMeta}>{meta}</span>
              </a>
            ))}
          </nav>
        </SideBlock>

        <SideBlock title="Team">
          <div style={s.people}>
            <Person initial="S" name="Shema"    role="Owner · approvals · priorities" />
            <Person initial="E" name="Editor"   role="Video pipeline · post · delivery" />
            <Person initial="M" name="Managers" role="Task routing · follow-through" />
          </div>
        </SideBlock>

        <SideBlock title="Weekly rhythm">
          <div style={s.list}>
            <Item title="Monday"  body="Set priorities and assign work."   badge="Plan" />
            <Item title="Midweek" body="Check blockers and move tasks."    badge="Review" />
            <Item title="Friday"  body="Close loops and prep next week."   badge="Close" />
          </div>
        </SideBlock>
      </aside>

      {/* ── MAIN ── */}
      <main style={s.workspace}>

        {/* Topbar */}
        <header id="command" style={s.topbar}>
          <div>
            <h2 style={s.headline}>Operations hub base.</h2>
            <p style={s.headlineSub}>
              One shared site for the team to track priorities, content, projects, approvals,
              and meeting decisions. Built to keep everything visible without making anybody
              hold the business in their head.
            </p>
          </div>
          <div style={s.metaRow}>
            <Pill label="Week in focus:" value="June 16–22" />
            <Pill label="Status:" value="base live" />
            <Pill label="Next meeting:" value="Monday" />
          </div>
        </header>

        {/* Row 1 */}
        <div style={s.gridTwo}>
          <article style={s.priorityCard}>
            <h4 style={s.priorityTitle}>
              Top priority this week: keep the work visible, owned, and moving.
            </h4>
            <p style={s.priorityBody}>
              The base should answer three questions instantly: what matters now, who owns it,
              and what is blocked. Everything else hangs off that.
            </p>
            <div style={s.metricRow}>
              <Metric label="Active tasks"         value="42" note="Across all owners" />
              <Metric label="Projects live"        value="9"  note="In motion" />
              <Metric label="Items waiting review" value="7"  note="Need eyes" />
              <Metric label="Content ready"        value="12" note="Can publish" />
            </div>
          </article>

          <Panel id="scorecard" title="Scorecard snapshot" note="Weekly health check">
            <div style={s.list}>
              <Item title="Tasks completed"   body="Close open loops before opening new ones."   badge="18" badgeType="good" />
              <Item title="Tasks overdue"     body="Anything late needs a direct owner."          badge="4"  badgeType="warn" />
              <Item title="Approvals pending" body="Flag anything waiting on your eyes."          badge="7"  badgeType="warn" />
              <Item title="Deliverables sent" body="What actually left the building."             badge="11" badgeType="good" />
            </div>
          </Panel>
        </div>

        {/* Row 2 */}
        <div style={{ ...s.gridTwo, marginTop: 18 }}>
          <Panel id="tasks" title="Tasks" note="Owner · Status · Due · Project">
            <div style={s.table}>
              <div style={s.rowHeader}>
                <div>Task</div><div>Owner</div><div>Status</div><div>Due</div>
              </div>
              <TableRow task="Finish YouTube script drafts"      sub="Discovery content for next week"  owner="Shema"   status="In Progress"  statusType="good" due="Tomorrow" />
              <TableRow task="Edit the latest client reel batch" sub="First pass + export"              owner="Editor"  status="Needs Review" statusType="warn" due="Today" />
              <TableRow task="Approve thumbnail direction"       sub="2 options needed"                 owner="Shema"   status="Blocked"      statusType="warn" due="Wed" />
              <TableRow task="Update project notes"              sub="Keep latest context current"      owner="Manager" status="Ready"        statusType="good" due="Fri" />
            </div>
          </Panel>

          <Panel id="projects" title="Projects" note="Planning · Active · Review">
            <div style={s.kanban}>
              <KanbanCol title="Planning">
                <Item title="YouTube discovery system" body="Weekly content engine."      badge="Brief" />
                <Item title="Ops site build"           body="Shared hub foundation."     badge="Base" />
              </KanbanCol>
              <KanbanCol title="Active">
                <Item title="Georgia travel content"  body="Osmo Pocket capture plan."  badge="Live"  badgeType="good" />
                <Item title="Client delivery queue"   body="Editor-led post production." badge="Busy"  badgeType="warn" />
              </KanbanCol>
              <KanbanCol title="Review">
                <Item title="Approval check" body="Pending final eyes."   badge="Now"    badgeType="warn" />
                <Item title="Publish batch"  body="Ready after approval." badge="Queued" badgeType="good" />
              </KanbanCol>
            </div>
          </Panel>
        </div>

        {/* Row 3 */}
        <div style={{ ...s.gridTwo, marginTop: 18 }}>
          <Panel id="content" title="Content pipeline" note="Idea → Script → Film → Edit → Review → Publish">
            <div style={s.list}>
              <Item title="YouTube: positioning video"          body="Discovery piece for top-of-funnel viewers." badge="Script" badgeType="good" />
              <Item title="YouTube: one shoot / week of content" body="Practical breakdown for creatives."        badge="Film"   badgeType="warn" />
              <Item title="Shorts batch from Georgia"           body="Travel b-roll + voiceover clips."           badge="Edit" />
              <Item title="Client recap reel"                   body="Waiting final export / send."               badge="Ready" badgeType="good" />
            </div>
          </Panel>

          <Panel id="meetings" title="Meeting notes" note="Wins · Blockers · Decisions">
            <div style={s.list}>
              <Item title="Weekly leadership meeting" body="Start with wins, then scorecard, blockers, and actions." badge="Template" />
              <Item title="Decision log"              body="Track approvals and changes once, in one place."         badge="Clean"    badgeType="good" />
              <Item title="Action items"              body="Every meeting should end with owners and dates."          badge="Required" badgeType="warn" />
            </div>
          </Panel>
        </div>

        {/* Row 4 */}
        <div style={{ ...s.gridTwo, marginTop: 18 }}>
          <Panel id="sops" title="SOPs / Templates" note="Reusable workflows">
            <div style={s.list}>
              <Item title="Onboarding checklist" body="New team member gets context fast."      badge="SOP" />
              <Item title="Delivery workflow"    body="Keep the handoff consistent."            badge="SOP" />
              <Item title="Content workflow"     body="Script, film, edit, review, publish."    badge="SOP" />
              <Item title="Task update rules"    body="Every owner updates status on schedule." badge="SOP" />
            </div>
          </Panel>

          <Panel title="What the site should become later" note="Claude Code implementation target">
            <div style={s.list}>
              <Item title="Real database relations" body="Tasks linked to projects, content linked to projects, notes linked to tasks." badge="Phase 2" />
              <Item title="Role-specific views"     body="Editor, manager, and owner views with different permissions."                badge="Phase 2" />
              <Item title="Automations"             body="Notifications, due date reminders, status change flows."                    badge="Phase 3" />
              <Item title="File hub"                body="Scripts, exports, approvals, references, and final assets."                 badge="Phase 3" />
            </div>
          </Panel>
        </div>

        <footer style={s.footer}>
          Ops Hub Base · Framework · frameworkcrtv.com
        </footer>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={s.sideBlock}>
      <h3 style={s.sideTitle}>{title}</h3>
      {children}
    </section>
  );
}

function Person({ initial, name, role }: { initial: string; name: string; role: string }) {
  return (
    <div style={s.person}>
      <div style={s.avatar}>{initial}</div>
      <div>
        <strong style={{ display: "block", fontSize: 13 }}>{name}</strong>
        <small style={{ color: "var(--muted)", fontSize: 12 }}>{role}</small>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div style={s.pill}>
      <span style={{ color: "var(--muted)" }}>{label}</span>{" "}
      <strong style={{ color: "var(--accent-2)" }}>{value}</strong>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div style={s.metric}>
      <small style={{ color: "var(--muted)", display: "block", fontSize: 12, marginBottom: 6 }}>{label}</small>
      <strong style={{ fontSize: 26, letterSpacing: "-0.05em", color: "var(--accent)" }}>{value}</strong>
      <span style={{ display: "block", color: "var(--muted)", fontSize: 12, marginTop: 6 }}>{note}</span>
    </div>
  );
}

function Panel({ id, title, note, children }: {
  id?: string; title: string; note?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} style={s.panel}>
      <div style={s.panelHeader}>
        <h3 style={s.panelTitle}>{title}</h3>
        {note && <div style={s.panelNote}>{note}</div>}
      </div>
      <div style={s.panelBody}>{children}</div>
    </section>
  );
}

function Item({ title, body, badge, badgeType }: {
  title: string; body: string; badge: string; badgeType?: "good" | "warn" | "bad";
}) {
  const badgeStyle = {
    ...s.badge,
    ...(badgeType === "good" ? s.badgeGood : {}),
    ...(badgeType === "warn" ? s.badgeWarn : {}),
    ...(badgeType === "bad"  ? s.badgeBad  : {}),
  };
  return (
    <div style={s.item}>
      <div>
        <strong style={{ display: "block", fontSize: 14, marginBottom: 4 }}>{title}</strong>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>{body}</p>
      </div>
      <div style={badgeStyle}>{badge}</div>
    </div>
  );
}

function TableRow({ task, sub, owner, status, statusType, due }: {
  task: string; sub: string; owner: string;
  status: string; statusType: "good" | "warn" | "bad"; due: string;
}) {
  const badgeStyle = {
    ...s.badge,
    ...(statusType === "good" ? s.badgeGood : {}),
    ...(statusType === "warn" ? s.badgeWarn : {}),
    ...(statusType === "bad"  ? s.badgeBad  : {}),
  };
  return (
    <div style={s.tableRow}>
      <div>
        <strong style={{ display: "block", fontSize: 13 }}>{task}</strong>
        <span style={{ color: "var(--muted)", fontSize: 12 }}>{sub}</span>
      </div>
      <div style={{ fontSize: 13 }}>{owner}</div>
      <div><span style={badgeStyle}>{status}</span></div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{due}</div>
    </div>
  );
}

function KanbanCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={s.kanbanCol}>
      <h4 style={s.kanbanTitle}>{title}</h4>
      <div style={s.list}>{children}</div>
    </div>
  );
}

/* ── Styles ── */

const s: Record<string, React.CSSProperties> = {
  shell: {
    maxWidth: "var(--max)",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "var(--sidebar) 1fr",
    minHeight: "100vh",
  },
  sidebar: {
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
    background: "linear-gradient(180deg, rgba(17,17,17,.95), rgba(13,13,13,.97))",
    borderRight: "1px solid var(--line)",
    padding: "26px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 22,
    backdropFilter: "blur(20px)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingBottom: 8,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    background: "linear-gradient(145deg, rgba(235,106,46,.25), rgba(235,106,46,.08))",
    border: "1px solid rgba(235,106,46,.3)",
    display: "grid",
    placeItems: "center",
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    color: "var(--accent)",
    fontSize: 18,
  },
  brandName: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: ".02em",
    color: "var(--text)",
  },
  brandSub: {
    margin: "2px 0 0",
    color: "var(--muted)",
    fontSize: 11,
    lineHeight: 1.4,
  },
  sideBlock: {
    background: "rgba(255,255,255,.025)",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius-lg)",
    padding: 16,
  },
  sideTitle: {
    margin: "0 0 12px",
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: ".14em",
  },
  nav: { display: "grid", gap: 6 },
  navLink: {
    textDecoration: "none",
    color: "var(--text)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "11px 13px",
    borderRadius: 13,
    border: "1px solid transparent",
    fontSize: 13,
  },
  navMeta: {
    color: "var(--muted)",
    fontFamily: "var(--font-mono)",
    fontSize: 11,
  },
  people: { display: "grid", gap: 10 },
  person: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 13,
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.06)",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    fontWeight: 800,
    color: "#0D0D0D",
    background: "linear-gradient(145deg, #F5B524, #EB6A2E)",
    flexShrink: 0,
  },
  workspace: { padding: 28, minWidth: 0 },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 22,
  },
  headline: {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 46px)",
    fontWeight: 900,
    letterSpacing: "-0.05em",
    lineHeight: 0.96,
  },
  headlineSub: {
    margin: "10px 0 0",
    color: "var(--muted)",
    maxWidth: 720,
    lineHeight: 1.6,
    fontSize: 15,
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  pill: {
    padding: "11px 14px",
    borderRadius: 999,
    border: "1px solid var(--line)",
    background: "rgba(255,255,255,.03)",
    fontSize: 13,
    whiteSpace: "nowrap",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "1.1fr .9fr",
    gap: 18,
  },
  panel: {
    background: "linear-gradient(180deg, var(--panel), rgba(13,13,13,.95))",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow)",
    overflow: "hidden",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "18px 18px 0",
  },
  panelTitle: {
    margin: 0,
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    textTransform: "uppercase",
    letterSpacing: ".14em",
    color: "var(--muted)",
  },
  panelNote: {
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    color: "var(--muted)",
    opacity: 0.7,
  },
  panelBody: { padding: 18 },
  priorityCard: {
    background: "linear-gradient(180deg, rgba(235,106,46,.16), rgba(235,106,46,.05))",
    border: "1px solid rgba(235,106,46,.2)",
    borderRadius: "var(--radius-xl)",
    padding: 22,
    display: "grid",
    gap: 16,
    minHeight: 270,
    boxShadow: "var(--shadow)",
  },
  priorityTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.04em",
    lineHeight: 1.05,
  },
  priorityBody: {
    margin: 0,
    color: "rgba(242,242,242,.8)",
    lineHeight: 1.6,
    fontSize: 14,
  },
  metricRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 12,
  },
  metric: {
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 16,
    padding: 14,
  },
  list: { display: "grid", gap: 10 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "flex-start",
    padding: "13px 15px",
    borderRadius: 14,
    background: "rgba(255,255,255,.035)",
    border: "1px solid rgba(255,255,255,.06)",
  },
  badge: {
    flexShrink: 0,
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.03)",
    color: "var(--muted)",
    whiteSpace: "nowrap",
    letterSpacing: ".06em",
    textTransform: "uppercase",
  },
  badgeGood: {
    borderColor: "rgba(74,222,128,.2)",
    color: "#86efac",
    background: "rgba(74,222,128,.06)",
  },
  badgeWarn: {
    borderColor: "rgba(235,106,46,.3)",
    color: "#f0a070",
    background: "rgba(235,106,46,.08)",
  },
  badgeBad: {
    borderColor: "rgba(248,113,113,.2)",
    color: "#fca5a5",
    background: "rgba(248,113,113,.06)",
  },
  table: { display: "grid", gap: 8 },
  rowHeader: {
    display: "grid",
    gridTemplateColumns: "1.5fr .7fr .7fr .7fr",
    gap: 10,
    alignItems: "center",
    padding: "0 13px 6px",
    color: "var(--muted)",
    fontFamily: "var(--font-mono)",
    textTransform: "uppercase",
    letterSpacing: ".12em",
    fontSize: 10,
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr .7fr .7fr .7fr",
    gap: 10,
    alignItems: "center",
    padding: "12px 13px",
    borderRadius: 13,
    background: "rgba(255,255,255,.035)",
    border: "1px solid rgba(255,255,255,.06)",
    fontSize: 13,
  },
  kanban: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },
  kanbanCol: {
    borderRadius: 16,
    background: "rgba(255,255,255,.025)",
    border: "1px solid var(--line)",
    padding: 14,
    minHeight: 200,
  },
  kanbanTitle: {
    margin: "0 0 12px",
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    textTransform: "uppercase",
    color: "var(--muted)",
    letterSpacing: ".14em",
  },
  footer: {
    marginTop: 22,
    color: "var(--muted)",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    textAlign: "center",
    padding: "8px 0 16px",
    letterSpacing: ".06em",
    opacity: 0.6,
  },
};
