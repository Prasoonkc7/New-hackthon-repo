export function timeAgo(iso: string, lang: "en" | "ne" = "en") {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.round(diff / 60000);
  const h = Math.round(m / 60);
  const dd = Math.round(h / 24);
  if (lang === "ne") {
    if (m < 60) return `${m} मिनेट अघि`;
    if (h < 48) return `${h} घण्टा अघि`;
    return `${dd} दिन अघि`;
  }
  if (m < 60) return `${m} min ago`;
  if (h < 48) return `${h} h ago`;
  return `${dd} days ago`;
}

export const isStale = (iso: string, hours = 12) => Date.now() - new Date(iso).getTime() > hours * 3600_000;

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
