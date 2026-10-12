import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DemoBadge, ErrorState, ListSkeleton, PageHeader, Section, StatusBadge, VerifiedBadge } from "@/components/common";
import { LazyMap } from "@/components/map/LazyMap";
import { KIND_META, type MarkerKind } from "@/components/map/kinds";
import { useMarkers } from "@/hooks/use-markers";
import { DISTRICTS } from "@/services/mock-data";
import { useI18n, type TKey } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Live map — JalRakshak" }] }),
  component: MapPage,
});

function MapPage() {
  const { t } = useI18n();
  const query = useMarkers();
  const [district, setDistrict] = useState("all");
  const [kind, setKind] = useState<MarkerKind | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const items = useMemo(() => query.items.filter((item) => (district === "all" || item.district === district) && (kind === "all" || item.marker.kind === kind) && (!verifiedOnly || item.marker.verified)), [query.items, district, kind, verifiedOnly]);
  const selected = items.find((item) => item.marker.id === selectedId) ?? items[0];
  const kinds = Array.from(new Set(query.items.map((item) => item.marker.kind)));
  const retry = () => query.refetch();

  return (
    <>
      <PageHeader title={t("page.map")} description={t("home.demoNotice")} eyebrow={<DemoBadge />} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
          <label className="grid gap-1 text-sm font-medium">{t("filter.district")}
            <select className="h-9 rounded-md border bg-background px-3" value={district} onChange={(e) => setDistrict(e.target.value)}><option value="all">{t("common.all")}</option>{DISTRICTS.map((d) => <option key={d.district} value={d.district}>{d.district}</option>)}</select>
          </label>
          <label className="grid gap-1 text-sm font-medium">{t("filter.hazard")}
            <select className="h-9 rounded-md border bg-background px-3" value={kind} onChange={(e) => setKind(e.target.value as MarkerKind | "all")}><option value="all">{t("common.all")}</option>{kinds.map((k) => <option key={k} value={k}>{t(`map.kind.${k}` as TKey)}</option>)}</select>
          </label>
          <label className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm"><input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />{t("map.verifiedOnly")}</label>
          <Button variant="ghost" onClick={() => { setDistrict("all"); setKind("all"); setVerifiedOnly(false); }}>{t("filter.all")}</Button>
        </div>
        {query.isLoading ? <ListSkeleton rows={5} /> : query.isError ? <ErrorState onRetry={retry} /> : (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Section title={t("map.legend")} className="overflow-hidden p-0">
              <div className="h-[520px]"><LazyMap markers={items.map((item) => item.marker)} selectedId={selected?.marker.id} onSelect={setSelectedId} /></div>
              <div className="flex flex-wrap gap-3 border-t p-4">{Object.entries(KIND_META).map(([key, meta]) => <span key={key} className="inline-flex items-center gap-2 text-xs"><i className="size-3 rounded-full" style={{ backgroundColor: meta.color }} />{t(`map.kind.${key}` as TKey)}</span>)}</div>
            </Section>
            <div className="space-y-6">
              <Section title={t("map.list")}>
                {items.length === 0 ? <p className="text-sm text-muted-foreground">{t("map.noMarkers")}</p> : <div className="max-h-[520px] space-y-3 overflow-auto">{items.map((item) => <button key={item.marker.id} type="button" className={`w-full rounded-lg border p-4 text-left transition-colors hover:bg-muted ${selected?.marker.id === item.marker.id ? "border-teal bg-accent" : ""}`} onClick={() => setSelectedId(item.marker.id)}><div className="flex items-start justify-between gap-2"><span className="font-semibold">{item.marker.title}</span><VerifiedBadge verified={item.marker.verified} /></div><p className="mt-1 text-sm text-muted-foreground">{item.district}{item.municipality ? ` · ${item.municipality}` : ""}</p><p className="mt-2 text-xs text-muted-foreground">{t(`map.kind.${item.marker.kind}` as TKey)} · {item.isDemo ? t("home.demoNotice") : item.source}</p></button>)}</div>}
              </Section>
              {selected && <Section title={t("map.selected")}><h3 className="font-semibold">{selected.marker.title}</h3><p className="mt-2 text-sm">{selected.description}</p><div className="mt-3 flex flex-wrap gap-2"><StatusBadge status={selected.status} /><VerifiedBadge verified={selected.marker.verified} /></div><p className="mt-3 text-xs text-muted-foreground">{t("common.coordinates")}: {selected.marker.lat.toFixed(3)}, {selected.marker.lng.toFixed(3)}</p></Section>}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
