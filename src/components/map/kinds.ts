// Browser-safe shared map types (no leaflet import here).
export type MarkerKind =
  | "flood"
  | "landslide"
  | "blocked_road"
  | "damaged_bridge"
  | "emergency"
  | "shelter"
  | "relief_center"
  | "medical"
  | "other_hazard";

export interface MapMarker {
  id: string;
  kind: MarkerKind;
  lat: number;
  lng: number;
  title: string;
  verified: boolean;
}

export const KIND_META: Record<MarkerKind, { label: string; color: string; glyph: string }> = {
  flood: { label: "Flood report", color: "var(--chart-5)", glyph: "≈" },
  landslide: { label: "Landslide", color: "oklch(0.5 0.08 60)", glyph: "▲" },
  blocked_road: { label: "Blocked road", color: "var(--warning)", glyph: "⛔" },
  damaged_bridge: { label: "Damaged bridge", color: "oklch(0.55 0.15 40)", glyph: "⌒" },
  emergency: { label: "Emergency request", color: "var(--destructive)", glyph: "!" },
  shelter: { label: "Shelter", color: "var(--primary)", glyph: "⌂" },
  relief_center: { label: "Relief center", color: "var(--navy)", glyph: "▣" },
  medical: { label: "Medical facility", color: "var(--success)", glyph: "+" },
  other_hazard: { label: "Other hazard", color: "var(--muted-foreground)", glyph: "•" },
};

export const NEPAL_CENTER: [number, number] = [28.1, 84.1];
