import { useEffect, useState, type ComponentType } from "react";
import type { Issue } from "@/lib/urbaneye-types";

type MapProps = { issues: Issue[]; className?: string };

export function LazyMap(props: MapProps) {
  const [MapView, setMapView] = useState<ComponentType<MapProps> | null>(null);

  useEffect(() => {
    let active = true;
    void import("./map-view").then(({ default: LoadedMap }) => {
      if (active) setMapView(() => LoadedMap);
    });
    return () => { active = false; };
  }, []);

  if (!MapView) return <div className={`${props.className ?? "h-[420px]"} skeleton rounded-lg`} aria-label="Loading map" />;
  return <MapView {...props} />;
}
