import type { ActivityItem, Issue, IssueStatus, IssueType, Priority } from "@/lib/urbaneye-types";
import potholeImage from "@/assets/pothole.jpg";
import waterloggingImage from "@/assets/waterlogging.jpg";
import damagedRoadImage from "@/assets/damaged-road.jpg";
import streetlightImage from "@/assets/streetlight.jpg";
import garbageImage from "@/assets/garbage.jpg";
import trafficImage from "@/assets/traffic.jpg";

export const issueTypes: IssueType[] = ["Pothole", "Water Logging", "Damaged Road", "Streetlight Failure", "Garbage", "Traffic Anomaly"];
export const priorities: Priority[] = ["Critical", "High", "Medium", "Low"];
export const statuses: IssueStatus[] = ["Pending", "Assigned", "In Progress", "Resolved"];
export const departments: Record<IssueType, string> = {
  Pothole: "Road Maintenance", "Water Logging": "Drainage Department", "Damaged Road": "Road Maintenance",
  "Streetlight Failure": "Electrical Department", Garbage: "Sanitation Department", "Traffic Anomaly": "Traffic Department",
};
const locations = [
  ["LBS Road, Ghatkopar", "Ghatkopar", 19.079, 72.908], ["S.V. Road, Andheri", "Andheri", 19.1197, 72.8468],
  ["Powai Main Road", "Powai", 19.1176, 72.906], ["Linking Road, Bandra", "Bandra", 19.0596, 72.8295],
  ["Lal Bahadur Shastri Marg, Kurla", "Kurla", 19.0726, 72.8845], ["Station Road, Vikhroli", "Vikhroli", 19.1118, 72.9289],
  ["Dr. Ambedkar Road, Dadar", "Dadar", 19.0178, 72.8478], ["BKC Connector", "BKC", 19.0676, 72.8691],
  ["Sion Circle", "Sion", 19.0434, 72.8636], ["Eastern Express Highway, Chembur", "Chembur", 19.0522, 72.9],
  ["Western Express Highway, Goregaon", "Goregaon", 19.1663, 72.8526], ["JVLR, Jogeshwari", "Jogeshwari", 19.1362, 72.8697],
] as const;
const imageByType: Record<IssueType, string> = {
  Pothole: potholeImage,
  "Water Logging": waterloggingImage,
  "Damaged Road": damagedRoadImage,
  "Streetlight Failure": streetlightImage,
  Garbage: garbageImage,
  "Traffic Anomaly": trafficImage,
};
const descriptions: Record<IssueType, string> = {
  Pothole: "Pothole detected near the carriageway with visible road-surface damage.",
  "Water Logging": "Water accumulation detected near a roadside drainage area.",
  "Damaged Road": "Damaged road surface detected with visible cracking and uneven pavement.",
  "Streetlight Failure": "Streetlight appears inactive during the monitored period.",
  Garbage: "Garbage accumulation detected near a roadside public area.",
  "Traffic Anomaly": "Unusual traffic density detected near the monitored corridor.",
};
const priorityPattern: Priority[] = ["High", "Critical", "Medium", "Low", "Medium", "High", "Low", "Medium"];
const statusPattern: IssueStatus[] = ["Pending", "In Progress", "Assigned", "Resolved", "Resolved", "Pending", "Resolved", "In Progress"];
export const makeTimeline = (detectedAt: string, status: IssueStatus) => {
  const d = new Date(detectedAt); const t = (m: number) => new Date(d.getTime() + m * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return [
    { time: t(0), title: "Issue detected", description: "AI monitoring event recorded", complete: true },
    { time: t(1), title: "Classification completed", description: "Issue type and confidence assigned", complete: true },
    { time: t(2), title: "Location identified", description: "Coordinates mapped", complete: true },
    { time: t(4), title: "Priority assigned", description: "Operational priority calculated", complete: true },
    { time: status, title: status === "Resolved" ? "Issue resolved" : status === "In Progress" ? "Work in progress" : status === "Assigned" ? "Department assigned" : "Pending resolution", description: status === "Pending" ? "Awaiting department action" : "Status updated by operations", complete: status !== "Pending" },
  ];
};
export const seedIssues: Issue[] = Array.from({ length: 42 }, (_, index) => {
  const type = issueTypes[index % issueTypes.length] ?? "Pothole"; const place = locations[index % locations.length] ?? locations[0];
  const priority = priorityPattern[index % priorityPattern.length] ?? "Medium"; const status = statusPattern[index % statusPattern.length] ?? "Pending";
  const detectedAt = new Date(Date.now() - (index * 17 + 2) * 60000).toISOString(); const image = imageByType[type];
  return { id: `ISS-${1042 - index}`, type, priority, confidence: 78 + ((index * 7) % 21), latitude: place[2] + ((index % 3) - 1) * .006, longitude: place[3] + ((index % 4) - 1.5) * .006, location: place[0], area: place[1], status, department: departments[type], detectedAt, description: descriptions[type], image, gallery: [image, image, image], timeline: makeTimeline(detectedAt, status) };
});
export const seedActivities: ActivityItem[] = seedIssues.slice(0, 20).map((issue, index) => ({ id: `ACT-${index}`, title: index % 4 === 2 ? "Issue resolved" : index % 4 === 1 ? "Issue assigned" : "New issue detected", detail: `${issue.type} · ${issue.location}`, timestamp: issue.detectedAt, tone: index % 4 === 2 ? "success" : index % 4 === 1 ? "warning" : "info" }));
export const trendData = Array.from({ length: 30 }, (_, i) => ({ day: `${i + 1} Sep`, issues: 11 + ((i * 7) % 15) + Math.round(Math.sin(i / 3) * 5) }));
export function generateMockIssue(sequence: number, selected: IssueType[]): Issue {
  const pool = selected.length ? selected : issueTypes; const type = pool[sequence % pool.length] ?? "Pothole"; const place = locations[(sequence * 5) % locations.length] ?? locations[0];
  const priority = priorityPattern[(sequence * 3) % priorityPattern.length] ?? "Medium"; const detectedAt = new Date().toISOString(); const image = imageByType[type];
  return { id: `ISS-${1100 + sequence}`, type, priority, confidence: 86 + (sequence % 12), latitude: place[2] + ((sequence % 5) - 2) * .003, longitude: place[3] + ((sequence % 4) - 1.5) * .003, location: place[0], area: place[1], status: "Pending", department: departments[type], detectedAt, description: descriptions[type], image, gallery: [image, image, image], timeline: makeTimeline(detectedAt, "Pending"), isNew: true };
}
