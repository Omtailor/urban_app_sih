import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { generateMockIssue, makeTimeline, seedActivities, seedIssues } from "@/data/mock-data";
import type { ActivityItem, AppSettings, Issue, IssueStatus, IssueType, SimulationSpeed } from "@/lib/urbaneye-types";

type AppState = {
  issues: Issue[]; activities: ActivityItem[]; unread: number; isRunning: boolean; speed: SimulationSpeed; selectedTypes: IssueType[];
  settings: AppSettings; bellPulse: boolean; generateIssue: () => Issue; updateIssueStatus: (id: string, status: IssueStatus, department?: string) => void;
  setRunning: (value: boolean) => void; setSpeed: (value: SimulationSpeed) => void; setSelectedTypes: (types: IssueType[]) => void;
  setSettings: (value: AppSettings) => void; markAllRead: () => void;
};
const AppContext = createContext<AppState | undefined>(undefined);
const defaultSettings: AppSettings = { compact: false, animations: true, autoRefresh: true, mapTheme: "Standard", desktopNotifications: false, criticalAlerts: true, newIssueAlerts: true };
const speedMs: Record<SimulationSpeed, number> = { Slow: 15000, Normal: 11000, Fast: 8000 };

export function AppProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState(seedIssues); const [activities, setActivities] = useState(seedActivities); const [unread, setUnread] = useState(3);
  const [isRunning, setRunning] = useState(false); const [speed, setSpeed] = useState<SimulationSpeed>("Normal"); const [selectedTypes, setSelectedTypes] = useState<IssueType[]>(["Pothole", "Water Logging", "Damaged Road"]);
  const [settings, setSettingsState] = useState(defaultSettings); const [bellPulse, setBellPulse] = useState(false); const sequence = useRef(1);
  useEffect(() => { const saved = localStorage.getItem("urbaneye-state"); if (!saved) return; try { const parsed = JSON.parse(saved); if (parsed.issues) setIssues(parsed.issues); if (parsed.settings) setSettingsState(parsed.settings); if (parsed.speed) setSpeed(parsed.speed); } catch { localStorage.removeItem("urbaneye-state"); } }, []);
  useEffect(() => { localStorage.setItem("urbaneye-state", JSON.stringify({ issues, settings, speed })); }, [issues, settings, speed]);
  const generateIssue = useCallback(() => {
    const issue = generateMockIssue(sequence.current++, selectedTypes); setIssues((current) => [issue, ...current]); setUnread((current) => current + 1);
    const activity: ActivityItem = { id: `ACT-${Date.now()}`, title: "New issue detected", detail: `${issue.type} · ${issue.location}`, timestamp: issue.detectedAt, tone: "info" };
    setActivities((current) => [activity, ...current].slice(0, 30));
    setBellPulse(true); window.setTimeout(() => setBellPulse(false), 900);
    if (settings.newIssueAlerts) toast.error("New issue detected", { description: `${issue.type} · ${issue.location} · ${issue.confidence}% confidence`, action: { label: "View", onClick: () => { window.location.href = `/issues/${issue.id}`; } } });
    return issue;
  }, [selectedTypes, settings.newIssueAlerts]);
  useEffect(() => { if (!isRunning) return; const timer = window.setInterval(generateIssue, speedMs[speed]); return () => window.clearInterval(timer); }, [generateIssue, isRunning, speed]);
  const updateIssueStatus = useCallback((id: string, status: IssueStatus, department?: string) => {
    let changed: Issue | undefined;
    setIssues((current) => current.map((issue) => { if (issue.id !== id) return issue; changed = { ...issue, status, department: department ?? issue.department, timeline: makeTimeline(issue.detectedAt, status) }; return changed; }));
    if (changed) setActivities((current) => [{ id: `ACT-${Date.now()}`, title: status === "Resolved" ? "Issue resolved" : status === "In Progress" ? "Work started" : "Issue assigned", detail: `${changed?.type} · ${changed?.location}`, timestamp: new Date().toISOString(), tone: status === "Resolved" ? "success" as const : "warning" as const }, ...current]);
    toast.success(`Issue marked ${status.toLowerCase()}.`);
  }, []);
  const setSettings = (value: AppSettings) => setSettingsState(value);
  const value = useMemo(() => ({ issues, activities, unread, isRunning, speed, selectedTypes, settings, bellPulse, generateIssue, updateIssueStatus, setRunning, setSpeed, setSelectedTypes, setSettings, markAllRead: () => setUnread(0) }), [issues, activities, unread, isRunning, speed, selectedTypes, settings, bellPulse, generateIssue, updateIssueStatus]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error("useApp must be used within AppProvider"); return value; }
