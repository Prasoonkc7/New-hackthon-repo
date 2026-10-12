import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { KIND_META, NEPAL_CENTER, type MapMarker } from "./kinds";

function icon(m: MapMarker, selected: boolean) {
  const meta = KIND_META[m.kind];
  const size = selected ? 34 : 26;
  // Verified = solid fill; unverified community report = dashed outline.
  const style = m.verified
    ? `background:${meta.color};color:var(--primary-foreground);border:2px solid var(--card);`
    : `background:var(--card);color:${meta.color};border:2px dashed ${meta.color};`;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="${style}width:${size}px;height:${size}px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;box-shadow:0 2px 6px rgb(0 0 0 / .25)">${meta.glyph}</div>`,
  });
}

function FlyTo({ target }: { target?: { lat: number; lng: number; zoom?: number } | null | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom ?? 11, { duration: 0.8 });
  }, [target, map]);
  return null;
}

function MapClick({ onSelect }: { onSelect?: (location: { lat: number; lng: number }) => void }) {
  useMapEvents({ click: (event) => onSelect?.({ lat: event.latlng.lat, lng: event.latlng.lng }) });
  return null;
}

export default function DisasterMap({
  markers,
  selectedId,
  onSelect,
  target,
  userLocation,
  onLocationSelect,
  selectable = false,
  height = "100%",
}: {
  markers: MapMarker[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  target?: { lat: number; lng: number; zoom?: number } | null;
  userLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  selectable?: boolean;
  height?: string;
}) {
  const icons = useMemo(() => new Map(markers.map((m) => [m.id, icon(m, m.id === selectedId)])), [markers, selectedId]);
  return (
    <MapContainer center={NEPAL_CENTER} zoom={7} minZoom={6} style={{ height, width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo target={target} />
      {selectable && <MapClick onSelect={onLocationSelect} />}
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={icons.get(m.id)}
          eventHandlers={{ click: () => onSelect?.(m.id) }}
          keyboard
          title={m.title}
        >
          <Tooltip direction="top" offset={[0, -12]}>{m.title}</Tooltip>
        </Marker>
      ))}
      {userLocation && <CircleMarker center={[userLocation.lat, userLocation.lng]} radius={8} pathOptions={{ color: "#14B8A6", fillOpacity: 0.6 }} />}
    </MapContainer>
  );
}
