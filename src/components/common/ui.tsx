import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IssueStatus, Priority } from "@/lib/urbaneye-types";

const priorityClass: Record<Priority, string> = { Critical: "badge-critical", High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
const statusClass: Record<IssueStatus, string> = { Pending: "status-pending", Assigned: "status-assigned", "In Progress": "status-progress", Resolved: "status-resolved" };
export function PriorityBadge({ value }: { value: Priority }) { return <span className={cn("badge", priorityClass[value])}><span className="h-1.5 w-1.5 rounded-full bg-current" />{value}</span>; }
export function StatusBadge({ value }: { value: IssueStatus }) { return <span className={cn("badge", statusClass[value])}>{value}</span>; }
export function Panel({ children, className }: { children: ReactNode; className?: string }) { return <section className={cn("panel", className)}>{children}</section>; }
export function PanelHeader({ title, action, subtitle }: { title: string; action?: ReactNode; subtitle?: string }) { return <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3"><div className="min-w-0"><h2 className="truncate text-sm font-bold text-foreground">{title}</h2>{subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}</div>{action}</div>; }
export function EmptyState({ label = "No issues found.", detail = "Try changing your filters." }: { label?: string; detail?: string }) { return <div className="grid min-h-48 place-items-center p-8 text-center"><div><SearchX className="mx-auto mb-3 h-8 w-8 text-muted-foreground"/><p className="font-semibold">{label}</p><p className="mt-1 text-sm text-muted-foreground">{detail}</p></div></div>; }
export function timeAgo(value: string) { const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000)); if (minutes < 1) return "just now"; if (minutes < 60) return `${minutes} min ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`; return `${Math.floor(hours / 24)}d ago`; }
