import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriorityBadge, StatusBadge } from "@/components/common/ui";
import type { Issue, Priority } from "@/lib/urbaneye-types";
const colors: Record<Priority, string> = { Critical: "#dc2626", High: "#f97316", Medium: "#f59e0b", Low: "#16a34a" };
const corridors: [number, number][][] = [[[19.166,72.85],[19.12,72.86],[19.07,72.87],[19.02,72.86]],[[19.14,72.93],[19.11,72.92],[19.07,72.90],[19.04,72.89]],[[19.13,72.90],[19.10,72.91],[19.07,72.90]]];
function Controls() { const map = useMap(); return <div className="absolute bottom-5 right-3 z-[500] grid gap-1"><Button size="icon" variant="secondary" aria-label="Zoom in" onClick={() => map.zoomIn()}><Plus /></Button><Button size="icon" variant="secondary" aria-label="Zoom out" onClick={() => map.zoomOut()}><Minus /></Button><Button size="icon" variant="secondary" aria-label="Reset map view" onClick={() => map.setView([19.076,72.8777], 11)}><LocateFixed /></Button></div>; }
export default function MapView({ issues, className = "h-[420px]" }: { issues: Issue[]; className?: string }) {
  const [ready, setReady] = useState(false); useEffect(() => { const timer = window.setTimeout(() => setReady(true), 350); return () => clearTimeout(timer); }, []);
  const markers = useMemo(() => issues.slice(0, 60), [issues]);
  if (!ready) return <div className={`${className} skeleton rounded-lg`} aria-label="Loading map" />;
  return <div className={`relative overflow-hidden rounded-lg ${className}`}><MapContainer center={[19.076,72.8777]} zoom={11} zoomControl={false} className="h-full w-full" scrollWheelZoom>
    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {corridors.map((line, index) => <Polyline key={index} positions={line} pathOptions={{ color: "#2563eb", weight: 3, opacity: .45, dashArray: "7 8" }} />)}
    {markers.map((issue) => <CircleMarker key={issue.id} center={[issue.latitude, issue.longitude]} radius={issue.isNew ? 10 : issue.priority === "Critical" ? 8 : 6} pathOptions={{ color: "#fff", weight: 2, fillColor: colors[issue.priority], fillOpacity: .95 }}><Popup><div className="min-w-48"><p className="font-bold">{issue.type} detected</p><p className="mt-1 text-xs">{issue.location}</p><div className="my-2 flex gap-1"><PriorityBadge value={issue.priority}/><StatusBadge value={issue.status}/></div><p className="text-xs">Confidence: <b>{issue.confidence}%</b></p><Button asChild size="sm" className="mt-3 w-full"><Link to="/issues/$id" params={{ id: issue.id }}>View details</Link></Button></div></Popup></CircleMarker>)}
    <Controls />
  </MapContainer><div className="map-legend"><p className="mb-2 text-[10px] font-bold uppercase text-muted-foreground">Priority</p>{Object.entries(colors).map(([label,color]) => <div key={label} className="flex items-center gap-2 text-[10px]"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{label}</div>)}</div></div>;
}
