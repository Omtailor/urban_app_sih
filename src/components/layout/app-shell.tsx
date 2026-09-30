import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, BarChart3, Bell, ChevronDown, Eye, LayoutDashboard, Map, Menu, PanelLeftClose, PanelLeftOpen, Settings, Siren, Wrench, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, { to: "/map", label: "Live Map", icon: Map },
  { to: "/alerts", label: "Alerts", icon: Siren }, { to: "/issues", label: "Issues", icon: Wrench },
  { to: "/analytics", label: "Analytics", icon: BarChart3 }, { to: "/settings", label: "Settings", icon: Settings },
] as const;
const copy: Record<string, [string, string]> = {
  "/dashboard": ["Smart City Operations Dashboard", "Real-time monitoring of urban infrastructure and public safety"],
  "/map": ["Live Monitoring Map", "Real-time view of detected urban issues"], "/alerts": ["Alert Center", "Real-time notifications from the urban monitoring system"],
  "/issues": ["Urban Issues", "Manage and track all detected urban issues"], "/analytics": ["Urban Intelligence Analytics", "Insights and trends from monitored urban infrastructure"],
  "/settings": ["Settings", "Configure your operations workspace"],
};
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname }); const { unread, bellPulse, markAllRead, issues } = useApp();
  const [collapsed, setCollapsed] = useState(false); const [mobileOpen, setMobileOpen] = useState(false); const [notifications, setNotifications] = useState(false); const [profile, setProfile] = useState(false); const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => setMobileOpen(false), [path]); const page = path.startsWith("/issues/") ? ["Issue Details", "Detection information and tracking"] : copy[path] ?? copy["/dashboard"];
  const sidebar = <>
    <div className="flex h-17 items-center gap-3 border-b border-sidebar-border px-4">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><Eye className="h-5 w-5" /></div>
      {!collapsed && <div className="min-w-0"><p className="text-lg font-extrabold leading-none text-sidebar-foreground">UrbanEye</p><p className="mt-1 truncate text-[9px] text-sidebar-muted">Smart Cities. Safer Lives.</p></div>}
    </div>
    <nav className="flex-1 space-y-1 p-3">{nav.map((item) => <Link key={item.to} to={item.to} activeOptions={{ exact: item.to !== "/issues" }} className="nav-item" activeProps={{ className: "nav-item nav-active" }}><item.icon className="h-4 w-4 shrink-0" />{!collapsed && <span>{item.label}</span>}{item.to === "/alerts" && unread > 0 && !collapsed && <span className="ml-auto rounded-full bg-critical px-1.5 text-[10px] font-bold text-critical-foreground">{unread}</span>}</Link>)}</nav>
    {!collapsed && <div className="m-3 rounded-lg border border-sidebar-border bg-sidebar-accent p-3"><div className="flex items-center gap-2 text-[10px] font-bold uppercase text-success"><span className="status-dot" />System operational</div><p className="mt-1.5 text-[10px] text-sidebar-muted">All monitoring services active</p></div>}
  </>;
  return <div className="min-h-screen bg-background text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-40 hidden flex-col bg-sidebar transition-[width] duration-300 md:flex ${collapsed ? "w-18" : "w-60"}`}>{sidebar}<Button variant="ghost" size="icon" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)} className="absolute -right-4 top-20 h-8 w-8 rounded-full border border-sidebar-border bg-card shadow-sm"><>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</></Button></aside>
    <AnimatePresence>{mobileOpen && <><motion.button aria-label="Close navigation" className="fixed inset-0 z-40 bg-overlay md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} /><motion.aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar md:hidden" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}><Button variant="ghost" size="icon" aria-label="Close navigation" className="absolute right-2 top-3 text-sidebar-foreground" onClick={() => setMobileOpen(false)}><X /></Button>{sidebar}</motion.aside></>}</AnimatePresence>
    <div className={`min-w-0 transition-[margin] duration-300 ${collapsed ? "md:ml-18" : "md:ml-60"}`}>
      <header className="sticky top-0 z-30 grid h-17 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu /></Button>
        <div className="min-w-0"><h1 className="truncate text-sm font-extrabold sm:text-base">{page?.[0]}</h1><p className="hidden truncate text-[11px] text-muted-foreground sm:block">{page?.[1]}</p></div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3"><div className="hidden items-center gap-2 text-[10px] font-bold uppercase text-success lg:flex"><span className="status-dot" />System operational</div><div className="hidden text-right xl:block"><p className="text-xs font-semibold">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p><p className="text-[10px] text-muted-foreground">{now.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })}</p></div>
          <div className="relative"><Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => setNotifications(!notifications)} className={bellPulse ? "animate-wiggle" : ""}><Bell />{unread > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-critical px-1 text-[9px] font-bold text-critical-foreground">{unread}</span>}</Button>{notifications && <div className="dropdown right-0 w-80"><div className="flex items-center justify-between border-b border-border p-3"><p className="text-sm font-bold">Notifications</p><Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button></div>{issues.slice(0,3).map((issue) => <Link key={issue.id} to="/issues/$id" params={{ id: issue.id }} className="block border-b border-border p-3 hover:bg-accent"><p className="text-xs font-semibold">{issue.type} detected</p><p className="mt-1 text-[11px] text-muted-foreground">{issue.location}</p></Link>)}</div>}</div>
          <div className="relative"><Button variant="ghost" className="h-9 px-2" onClick={() => setProfile(!profile)}><span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">A</span><span className="hidden text-xs sm:inline">Admin</span><ChevronDown className="h-3 w-3" /></Button>{profile && <div className="dropdown right-0 w-44 p-2"><p className="px-2 py-1 text-xs font-semibold">Operations Admin</p><Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setProfile(false)}>Close menu</Button></div>}</div>
        </div>
      </header><main className="min-h-[calc(100vh-4.25rem)] p-3 sm:p-5">{children}</main>
    </div>
  </div>;
}
