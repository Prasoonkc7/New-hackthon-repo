import { BellRing, LocateFixed, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useMarkers } from "@/hooks/use-markers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "jalrakshak-proximity-alerts";
const WARNING_RADIUS_METRES = 1000;
const HAZARD_KINDS = new Set([
  "flood",
  "landslide",
  "blocked_road",
  "damaged_bridge",
  "other_hazard",
]);

type Coordinates = { lat: number; lng: number };

function distanceMetres(a: Coordinates, b: Coordinates) {
  const earthRadius = 6_371_000;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latDelta = toRadians(b.lat - a.lat);
  const lngDelta = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const haversine =
    Math.sin(latDelta / 2) ** 2 + Math.sin(lngDelta / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function ProximityAlertMonitor() {
  const { items } = useMarkers();
  const hazards = useMemo(
    () => items.filter((item) => item.marker.verified && HAZARD_KINDS.has(item.marker.kind)),
    [items],
  );
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "enabled";
    } catch {
      return false;
    }
  });
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inside = useRef(new Set<string>());
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setLocation(null);
      setError(null);
      inside.current.clear();
      return;
    }
    if (!navigator.geolocation) {
      setError("This browser does not support location access.");
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const current = { lat: coords.latitude, lng: coords.longitude };
        setLocation(current);
        setError(null);
        const nearby = hazards
          .map((item) => ({ item, distance: distanceMetres(current, item.marker) }))
          .filter(({ distance }) => distance <= WARNING_RADIUS_METRES);
        const nearbyIds = new Set(nearby.map(({ item }) => item.marker.id));
        nearby
          .filter(({ item }) => !inside.current.has(item.marker.id))
          .sort((a, b) => a.distance - b.distance)
          .forEach(({ item, distance }) => {
            const distanceLabel =
              distance < 1000 ? `${Math.round(distance)} m` : `${(distance / 1000).toFixed(1)} km`;
            const message = `${item.marker.title} is approximately ${distanceLabel} away. Move to a safe location and follow official instructions.`;
            toast.warning("Danger area nearby", { description: message, duration: 10000 });
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("JalRakshak danger alert", { body: message });
            }
          });
        inside.current = nearbyIds;
      },
      (positionError) => {
        setError(
          positionError.code === positionError.PERMISSION_DENIED
            ? "Location permission was denied. Enable it to receive proximity alerts."
            : "Your location is currently unavailable.",
        );
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 15_000 },
    );
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    };
  }, [enabled, hazards]);

  const enable = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "enabled");
    } catch {
      // The monitor still works for this session if storage is unavailable.
    }
    setEnabled(true);
  };
  const disable = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Disabling the monitor must not depend on storage availability.
    }
    setEnabled(false);
  };

  if (!enabled) {
    return (
      <div className="fixed bottom-4 left-4 z-30 max-w-sm rounded-xl border bg-card p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <BellRing className="mt-0.5 size-5 shrink-0 text-teal" />
          <div className="min-w-0">
            <p className="font-semibold">Stay safe near danger areas</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Allow location access to receive automatic warnings within 1 km of verified hazards.
            </p>
            <Button className="mt-3" size="sm" onClick={enable}>
              <LocateFixed />
              Enable proximity alerts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-30 max-w-sm rounded-xl border bg-card p-3 text-sm shadow-lg",
        error && "border-destructive/40",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2 rounded-full",
            error ? "bg-destructive" : location ? "bg-success" : "bg-warning",
          )}
        />
        <span className="font-medium">
          {error ?? (location ? "Proximity alerts are active" : "Waiting for your location…")}
        </span>
        <button
          type="button"
          className="ml-auto text-muted-foreground hover:text-foreground"
          aria-label="Disable proximity alerts"
          onClick={disable}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
