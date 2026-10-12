import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DemoBadge, EmptyState, ErrorState, Freshness, ListSkeleton, PageHeader, Section, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, type NewRecovery } from "@/services/api";
import { useRecovery } from "@/hooks/use-data";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { DISTRICTS } from "@/services/mock-data";
import type { RecoveryType } from "@/lib/types";

export const Route = createFileRoute("/recovery")({
  head: () => ({ meta: [{ title: "Recovery assistance — JalRakshak" }] }),
  component: Recovery,
});

function Recovery() {
  const { t } = useI18n();
  const { user } = useAuth();
  const applications = useRecovery();
  const [form, setForm] = useState<NewRecovery>({ type: "home_damage", household: "", district: "", municipality: "", description: "", estimatedLoss: undefined, hasEvidence: false });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [evidence, setEvidence] = useState<File | undefined>();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage("");
    if (!form.household.trim() || !form.district || !form.municipality.trim() || form.description.trim().length < 10) { setMessage(t("recovery.validation")); return; }
    setBusy(true);
    try { if (evidence && (evidence.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(evidence.type))) throw new Error(t("form.invalidEvidence")); const result = await api.createRecoveryApplication({ ...form, evidence }); setMessage(`${t("recovery.success")} ${result.reference}`); setForm({ type: "home_damage", household: "", district: "", municipality: "", description: "", estimatedLoss: undefined, hasEvidence: false }); setEvidence(undefined); void applications.refetch(); }
    catch (e) { setMessage(e instanceof Error ? e.message : t("common.error")); }
    finally { setBusy(false); }
  };
  return (
    <>
      <PageHeader title={t("nav.recovery")} description={t("recovery.description")} eyebrow={<DemoBadge />} />
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Section title={t("recovery.apply")}>
          <form className="grid gap-4" onSubmit={submit}>
            <label className="grid gap-1 text-sm font-medium">{t("recovery.type")}<select className="h-10 rounded-md border bg-background px-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as RecoveryType })}>{["home_damage", "business_damage", "agriculture", "household_needs", "temporary_housing", "infrastructure", "livelihood"].map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}</select></label>
            <label className="grid gap-1 text-sm font-medium">{t("recovery.household")}<Input required value={form.household} onChange={(e) => setForm({ ...form, household: e.target.value })} /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1 text-sm font-medium">{t("form.district")}<select className="h-10 rounded-md border bg-background px-3" required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}><option value="">{t("form.choose")}</option>{DISTRICTS.map((d) => <option key={d.district}>{d.district}</option>)}</select></label><label className="grid gap-1 text-sm font-medium">{t("form.municipality")}<Input required value={form.municipality} onChange={(e) => setForm({ ...form, municipality: e.target.value })} /></label></div>
            <label className="grid gap-1 text-sm font-medium">{t("form.description")}<Textarea required minLength={10} rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="grid gap-1 text-sm font-medium">{t("recovery.loss")}<Input type="number" min={0} value={form.estimatedLoss ?? ""} onChange={(e) => setForm({ ...form, estimatedLoss: e.target.value ? Number(e.target.value) : undefined })} /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.hasEvidence} onChange={(e) => setForm({ ...form, hasEvidence: e.target.checked })} />{t("recovery.evidence")}</label>
            <label className="grid gap-1 text-sm font-medium">{t("recovery.evidence")}<Input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setEvidence(event.target.files?.[0])} /><span className="text-xs text-muted-foreground">{evidence?.name ?? t("form.noEvidence")}</span></label>
            {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
            <Button disabled={busy}>{busy ? t("common.loading") : t("recovery.submit")}</Button>
          </form>
        </Section>
        <Section title={t("recovery.myApplications")}>
          {!user && <p className="mb-4 text-sm text-muted-foreground">{t("recovery.signInNotice")}</p>}
          {applications.isLoading ? <ListSkeleton rows={3} /> : applications.isError ? <ErrorState onRetry={() => void applications.refetch()} /> : (applications.data ?? []).length === 0 ? <EmptyState title={t("recovery.empty")} /> : <div className="space-y-3">{applications.data?.map((application) => <article key={application.id} className="rounded-lg border p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold">{application.reference}</h3><p className="text-sm text-muted-foreground">{application.type.replaceAll("_", " ")} · {application.district}</p></div><StatusBadge status={application.status} /></div><p className="mt-2 text-sm">{application.description}</p><Freshness at={application.updatedAt} /></article>)}</div>}
        </Section>
      </main>
    </>
  );
}
