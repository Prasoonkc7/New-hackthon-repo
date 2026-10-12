import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle2, LocateFixed, Save, Trash2, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DemoBadge, ErrorState, Notice, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, type NewRescue } from "@/services/api";
import { clearDraft, readDraft, writeDraft } from "@/services/drafts";
import { fileToDataUrl, queueRescue } from "@/services/offline";
import { useI18n, type TKey } from "@/lib/i18n";
import { useOnline } from "@/hooks/use-data";
import { LazyMap } from "@/components/map/LazyMap";

export const Route = createFileRoute("/request-help")({
  head: () => ({ meta: [{ title: "Request emergency help — JalRakshak" }] }),
  component: RequestHelp,
});

const schema = z.object({
  category: z.enum(["immediate_rescue", "evacuation", "medical", "stranded_family", "food_water", "shelter", "other"]),
  urgency: z.enum(["immediate_danger", "urgent", "standard"]),
  name: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  contactMethod: z.enum(["phone", "sms", "none"]),
  people: z.coerce.number().int().min(1).max(10000),
  description: z.string().min(10).max(2000),
  medicalConcerns: z.string().max(1000).optional(),
  hasImage: z.boolean(),
  location: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).optional(),
});

type FormValues = z.infer<typeof schema>;
const defaults: FormValues = { category: "immediate_rescue", urgency: "urgent", name: "", phone: "", contactMethod: "phone", people: 1, description: "", medicalConcerns: "", hasImage: false };

function RequestHelp() {
  const { t } = useI18n();
  const online = useOnline();
  const [result, setResult] = useState<Awaited<ReturnType<typeof api.createRescueRequest>> | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [evidence, setEvidence] = useState<File | undefined>();
  const [locationState, setLocationState] = useState<"idle" | "loading" | "captured" | "error">("idle");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [queuedLocalId, setQueuedLocalId] = useState<string | null>(null);
  const { register, handleSubmit, setValue, getValues, reset, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { ...defaults, ...readDraft<FormValues>("request-help") } });
  const selectedLocation = watch("location");

  useEffect(() => { const draft = readDraft<FormValues>("request-help"); if (draft) setDraftSaved(true); }, []);
  const save = () => { writeDraft("request-help", getValues()); setDraftSaved(true); };
  const clear = () => { clearDraft("request-help"); reset(defaults); setDraftSaved(false); };
  const submit = async (values: FormValues) => {
    setServiceError(null);
    try {
      if (evidence && (evidence.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(evidence.type))) throw new Error(t("form.invalidEvidence"));
      if (!online) {
        const localId = crypto.randomUUID();
        queueRescue({
          localId,
          createdAt: new Date().toISOString(),
          payload: values as unknown as Record<string, unknown>,
          evidence: evidence ? { name: evidence.name, type: evidence.type, dataUrl: await fileToDataUrl(evidence) } : undefined,
        });
        setQueuedLocalId(localId);
        clearDraft("request-help");
        setDraftSaved(false);
        return;
      }
      const created = await api.createRescueRequest({ ...values, evidence } as NewRescue);
      clearDraft("request-help");
      setDraftSaved(false);
      setResult(created);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : t("common.error"));
    }
  };
  const setLocation = (lat: number, lng: number) => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setLocationState("error");
      setLocationMessage(t("form.locationInvalid"));
      return;
    }
    setValue("location", { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) }, { shouldValidate: true, shouldDirty: true });
    setLocationState("captured");
    setLocationMessage(null);
  };
  const captureLocation = () => {
    setLocationMessage(null);
    if (!window.isSecureContext) { setLocationState("error"); setLocationMessage(t("form.locationSecure")); return; }
    if (!navigator.geolocation) { setLocationState("error"); setLocationMessage(t("form.locationUnsupported")); return; }
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation(position.coords.latitude, position.coords.longitude),
      (error) => { setLocationState("error"); setLocationMessage(error.code === error.PERMISSION_DENIED ? t("form.locationDenied") : error.code === error.TIMEOUT ? t("form.locationTimeout") : t("form.locationUnavailable")); },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  };
  if (result) return <Success reference={result.reference} onAgain={() => { setResult(null); reset(defaults); }} />;

  return (
    <>
      <PageHeader title={t("page.requestHelp")} description={t("form.privacy")} eyebrow={<DemoBadge />} />
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6">
        <Notice tone="danger" icon={<AlertTriangle className="size-5 text-destructive" />}><strong>{t("form.immediate")}</strong><p className="mt-1">{t("sos.warning")}</p></Notice>
        {!online && <Notice tone="warning">{t("form.notSubmitted")}</Notice>}
        {queuedLocalId && <Notice tone="info">Saved on this device with local ID {queuedLocalId}. It has not reached rescue teams. Reconnect and retry from the offline queue.</Notice>}
        {draftSaved && <Notice tone="info">{t("form.savedLocal")}</Notice>}
        {serviceError && <ErrorState message={serviceError} />}
        <form className="card-surface space-y-5 p-5" onSubmit={handleSubmit(submit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("form.category")} error={errors.category?.message}><select className="h-10 rounded-md border bg-background px-3" {...register("category")}>{(["immediate_rescue", "evacuation", "medical", "stranded_family", "food_water", "shelter", "other"] as const).map((v) => <option key={v} value={v}>{t(`category.${v}` as TKey)}</option>)}</select></Field>
            <Field label={t("form.urgency")} error={errors.urgency?.message}><select className="h-10 rounded-md border bg-background px-3" {...register("urgency")}>{(["immediate_danger", "urgent", "standard"] as const).map((v) => <option key={v} value={v}>{t(`urgency.${v}` as TKey)}</option>)}</select></Field>
            <Field label={t("form.people")} error={errors.people?.message}><Input type="number" min={1} {...register("people")} /></Field>
            <Field label={t("form.contactMethod")} error={errors.contactMethod?.message}><select className="h-10 rounded-md border bg-background px-3" {...register("contactMethod")}>{(["phone", "sms", "none"] as const).map((v) => <option key={v} value={v}>{t(`form.contact${v[0].toUpperCase()}${v.slice(1)}` as TKey)}</option>)}</select></Field>
            <Field label={t("form.name")} error={errors.name?.message}><Input {...register("name")} /></Field>
            <Field label={t("form.phone")} error={errors.phone?.message}><Input type="tel" {...register("phone")} /></Field>
          </div>
          <Field label={t("form.description")} error={errors.description?.message}><Textarea rows={5} {...register("description")} /></Field>
          <Field label={t("form.medicalConcerns")} error={errors.medicalConcerns?.message}><Textarea rows={3} {...register("medicalConcerns")} /></Field>
          <label className="grid gap-1 text-sm font-medium">{t("report.photo")}<Input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setEvidence(event.target.files?.[0])} /><span className="text-xs text-muted-foreground">{evidence?.name ?? t("form.noEvidence")}</span></label>
          <div className="space-y-3 rounded-lg border p-4" aria-labelledby="rescue-location-heading">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="rescue-location-heading" className="font-semibold">{t("form.rescueLocation")}</h2><p className="text-xs text-muted-foreground">{t("form.rescueLocationHelp")}</p></div>{selectedLocation && <span className="flex items-center gap-1 text-xs text-success" role="status" aria-live="polite"><CheckCircle2 className="size-4" />{locationState === "captured" ? t("form.locationCaptured") : t("form.locationSelected")}</span>}</div>
            {locationMessage && <p role="alert" aria-live="assertive" className="text-sm text-destructive">{locationMessage}</p>}
            <div className="flex flex-wrap items-center gap-2"><Button type="button" variant="outline" onClick={captureLocation} disabled={locationState === "loading"}><LocateFixed />{locationState === "loading" ? t("form.locationLoading") : t("form.useLocation")}</Button>{selectedLocation && <Button type="button" variant="ghost" onClick={() => { setValue("location", undefined, { shouldDirty: true }); setLocationState("idle"); setLocationMessage(null); }}><X />{t("form.clearLocation")}</Button>}<span className="text-xs text-muted-foreground">{t("form.locationPurpose")}</span></div>
            <div className="grid gap-3 sm:grid-cols-2"><Field label={t("form.latitude")} error={errors.location?.lat?.message}><Input type="number" step="0.000001" value={selectedLocation?.lat ?? ""} onChange={(event) => { const value = event.target.value; if (value === "") { setValue("location", undefined, { shouldDirty: true }); return; } setLocation(Number(value), selectedLocation?.lng ?? 0); }} /></Field><Field label={t("form.longitude")} error={errors.location?.lng?.message}><Input type="number" step="0.000001" value={selectedLocation?.lng ?? ""} onChange={(event) => { const value = event.target.value; if (value === "") { setValue("location", undefined, { shouldDirty: true }); return; } setLocation(selectedLocation?.lat ?? 0, Number(value)); }} /></Field></div>
            {selectedLocation ? <div className="h-64 overflow-hidden rounded-md border" role="application" aria-label={t("form.mapPreview")}><LazyMap markers={[]} userLocation={selectedLocation} target={{ ...selectedLocation, zoom: 12 }} selectable onLocationSelect={({ lat, lng }) => setLocation(lat, lng)} /></div> : <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">{t("form.locationOptional")}</p>}
            <p className="text-xs text-muted-foreground">{t("form.adjustLocation")}</p>
          </div>
          <div className="flex flex-wrap justify-between gap-3 border-t pt-4"><div className="flex gap-2"><Button type="button" variant="outline" onClick={save}><Save />{t("form.saveDraft")}</Button><Button type="button" variant="ghost" onClick={clear}><Trash2 />{t("form.clearDraft")}</Button></div><Button type="submit" variant="sos" disabled={isSubmitting}>{isSubmitting ? t("common.loading") : t("form.submit")}</Button></div>
        </form>
      </main>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="grid gap-1 text-sm font-medium">{label}{children}{error && <span className="text-xs font-normal text-destructive">{error}</span>}</label>; }
function Success({ reference, onAgain }: { reference: string; onAgain: () => void }) { const { t } = useI18n(); return <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6"><div className="card-surface p-8 text-center"><CheckCircle2 className="mx-auto size-12 text-success" /><h1 className="mt-4 text-2xl font-bold">{t("page.success")}</h1><p className="mt-4 text-muted-foreground">{t("page.reference")}</p><p className="mt-1 text-3xl font-bold text-teal">{reference}</p><p className="mt-4 text-sm text-muted-foreground">{t("home.demoNotice")}</p><div className="mt-6 flex justify-center gap-2"><Button onClick={onAgain}>{t("page.newRequest")}</Button><Button variant="outline" asChild><Link to="/track">{t("nav.track")}</Link></Button></div></div></main>; }
