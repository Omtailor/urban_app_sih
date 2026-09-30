export type IssueType = "Pothole" | "Water Logging" | "Damaged Road" | "Streetlight Failure" | "Garbage" | "Traffic Anomaly";
export type Priority = "Critical" | "High" | "Medium" | "Low";
export type IssueStatus = "Pending" | "Assigned" | "In Progress" | "Resolved";
export type TimelineEvent = { time: string; title: string; description: string; complete: boolean };
export type Issue = {
  id: string; type: IssueType; priority: Priority; confidence: number; latitude: number; longitude: number;
  location: string; area: string; status: IssueStatus; department: string; detectedAt: string;
  description: string; image: string; gallery: string[]; timeline: TimelineEvent[]; isNew?: boolean;
};
export type ActivityItem = { id: string; title: string; detail: string; timestamp: string; tone: "info" | "success" | "warning" };
export type SimulationSpeed = "Slow" | "Normal" | "Fast";
export type AppSettings = { compact: boolean; animations: boolean; autoRefresh: boolean; mapTheme: "Standard" | "Contrast"; desktopNotifications: boolean; criticalAlerts: boolean; newIssueAlerts: boolean };
