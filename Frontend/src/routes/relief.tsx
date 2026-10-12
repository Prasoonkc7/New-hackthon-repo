import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { DemoBadge, EmptyState, ErrorState, ListSkeleton, PageHeader, Section, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, type NewRelief } from "@/services/api";
import { useInventory, useRelief } from "@/hooks/use-data";
import { useI18n } from "@/lib/i18n";
import { DISTRICTS } from "@/services/mock-data";

export const Route = createFileRoute("/relief")({
  head: () => ({ meta: [{ title: "Relief supplies — JalRakshak" }] }),
  component: Relief,
});

function Relief() {
  const { t } = useI18n();
  const requests = useRelief();
  const inventory = useInventory();
  const [form, setForm] = useState<NewRelief>({ item: "water", quantity: 1, area: "", district: "", urgency: "medium" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage("");
    if (!form.area || !form.district || form.quantity < 1) { setMessage(t("relief.validation")); return; }
    setBusy(true);
    try { await api.createReliefRequest(form); setForm({ item: "water", quantity: 1, area: "", district: "", urgency: "medium" }); setMessage(t("relief.success")); void requests.refetch(); }
    catch (e) { setMessage(e instanceof Error ? e.message : t("common.error")); }
    finally { setBusy(false); }
  };
  return (
    <>
      <PageHeader title={t("nav.relief")} description={t("relief.description")} eyebrow={<DemoBadge />} />
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Section title={t("relief.requestTitle")}>
          <form className="grid gap-4" onSubmit={submit}>
            <label className="grid gap-1 text-sm font-medium">{t("relief.item")}<select className="h-10 rounded-md border bg-background px-3" value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value as NewRelief["item"] })}>{["food", "water", "blankets", "hygiene", "first_aid", "medicine", "accommodation", "other"].map((item) => <option key={item} value={item}>{item.replace("_", " ")}</option>)}</select></label>
            <label className="grid gap-1 text-sm font-medium">{t("relief.quantity")}<Input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></label>
            <label className="grid gap-1 text-sm font-medium">{t("relief.area")}<Input required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /></label>
            <label className="grid gap-1 text-sm font-medium">{t("form.district")}<select className="h-10 rounded-md border bg-background px-3" required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}><option value="">{t("form.choose")}</option>{DISTRICTS.map((d) => <option key={d.district}>{d.district}</option>)}</select></label>
            <label className="grid gap-1 text-sm font-medium">{t("relief.urgency")}<select className="h-10 rounded-md border bg-background px-3" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value as NewRelief["urgency"] })}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
            {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
            <Button disabled={busy}>{busy ? t("common.loading") : t("relief.submit")}</Button>
          </form>
        </Section>
        <div className="space-y-5">
          <Section title={t("relief.available")}><DataState loading={inventory.isLoading} error={inventory.isError} empty={(inventory.data ?? []).length === 0} retry={() => void inventory.refetch()}>{inventory.data?.map((item) => <div key={item.id} className="flex items-center justify-between border-t py-3 text-sm"><span><b>{item.item.replace("_", " ")}</b> · {item.district}<br /><span className="text-muted-foreground">{item.provider}</span></span><span>{item.quantity} {item.confirmed ? "· confirmed" : "· needs confirmation"}</span></div>)}</DataState></Section>
          <Section title={t("relief.requests")}><DataState loading={requests.isLoading} error={requests.isError} empty={(requests.data ?? []).length === 0} retry={() => void requests.refetch()}>{requests.data?.map((item) => <div key={item.id} className="flex items-center justify-between border-t py-3 text-sm"><span><b>{item.item.replace("_", " ")}</b> · {item.area}, {item.district}</span><StatusBadge status={item.status} /></div>)}</DataState></Section>
        </div>
      </main>
    </>
  );
}

function DataState({ loading, error, empty, retry, children }: { loading: boolean; error: boolean; empty: boolean; retry: () => void; children: ReactNode }) {
  if (loading) return <ListSkeleton rows={3} />;
  if (error) return <ErrorState onRetry={retry} />;
  if (empty) return <EmptyState />;
  return <div>{children}</div>;
}
