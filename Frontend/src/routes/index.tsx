import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, BellRing, FileWarning, House, MapPin, MapPinned, Package, Phone, ShieldAlert, ShieldCheck, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, ErrorState, Freshness, QueryState, Section, SeverityBadge, StatusBadge, VerifiedBadge } from "@/components/common";
import { LazyMap } from "@/components/map/LazyMap";
import { useAlerts, useDashboard, useReports } from "@/hooks/use-data";
import { useMarkers } from "@/hooks/use-markers";
import { useI18n } from "@/lib/i18n";
import { FloodImageCarousel } from "@/components/FloodImageCarousel";
import type { Alert, HazardReport } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JalRakshak — Nepal Flood Resilience & Recovery" },
      { name: "description", content: "Flood alerts, emergency help, shelters, relief and recovery support across Nepal (prototype)." },
    ],
  }),
  component: Index,
});

function SummaryCard({ to, label, value, icon: Icon }: { to: string; label: string; value: number; icon: typeof AlertTriangle }) {
  return (
    <Link to={to} className="card-surface group block p-4 transition-colors hover:border-teal hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring">
      <div className="flex items-center justify-between gap-3">
        <Icon className="size-5 text-teal" />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground group-hover:text-foreground">{label}</p>
    </Link>
  );
}

const severityStyles = {
  severe: "border-l-destructive bg-destructive/[0.04]",
  high: "border-l-orange-500 bg-orange-500/[0.04]",
  moderate: "border-l-amber-500 bg-amber-500/[0.04]",
  low: "border-l-sky-500 bg-sky-500/[0.04]",
} as const;

const severityIconStyles = {
  severe: "bg-destructive/10 text-destructive",
  high: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  moderate: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
} as const;

function AlertCard({ alert }: { alert: Alert }) {
  const severity = alert.severity in severityStyles ? alert.severity as keyof typeof severityStyles : "low";
  return (
    <article className={`group min-h-36 rounded-xl border border-l-4 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${severityStyles[severity]}`}>
      <div className="flex items-start gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${severityIconStyles[severity]}`}><BellRing className="size-4" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-5 text-foreground">{alert.title}</h3>
            <SeverityBadge severity={alert.severity} />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><MapPin className="size-3.5 shrink-0" />{alert.district} · {alert.municipality}</p>
          <div className="mt-3 flex items-center gap-2">
            {alert.isDemo ? <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ShieldAlert className="size-3.5" />Sample record</span> : <StatusBadge status={alert.verified ? "verified" : "unverified"} />}
          </div>
        </div>
      </div>
    </article>
  );
}

function IncidentCard({ report }: { report: HazardReport }) {
  return (
    <article className={`min-h-36 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${report.status === "verified" ? "bg-card shadow-sm" : "border-dashed bg-muted/20"}`}>
      <div className="flex items-start gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${report.status === "verified" ? "bg-success/10 text-success" : "bg-warning/15 text-warning-foreground"}`}><Siren className="size-4" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-5">{report.municipality || report.district || "Location pending"}</h3>
            {report.isDemo ? <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground"><ShieldAlert className="size-3" />Sample record</span> : <VerifiedBadge verified={report.status === "verified"} />}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">{report.description}</p>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5 shrink-0" />{report.district || "Location pending"}<span aria-hidden="true">·</span><span>{new Date(report.observedAt).toLocaleDateString()}</span></p>
        </div>
      </div>
    </article>
  );
}

function Index() {
  const { t } = useI18n();
  const dashboard = useDashboard();
  const alerts = useAlerts();
  const reports = useReports();
  const markers = useMarkers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = markers.items.find((item) => item.marker.id === selectedId) ?? markers.items[0];
  const retryMap = () => markers.refetch();

  return (
    <>
      <section className="hero-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
          <DemoBadge />
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">{t("hero.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg opacity-85">{t("hero.sub")}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="sos" size="lg" asChild><Link to="/request-help"><Phone />{t("nav.sosLong")}</Link></Button>
            <Button variant="heroOutline" size="lg" asChild><Link to="/report-hazard"><FileWarning />{t("home.report")}</Link></Button>
          </div>
          <p className="mt-6 max-w-2xl text-sm opacity-75">{t("banner.official")}</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <FloodImageCarousel />
        <Section title={t("home.overview")} action={<DemoBadge />}>
          {dashboard.isLoading ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-muted" />)}</div> :
            dashboard.isError || !dashboard.data ? <ErrorState message={t("home.summaryError")} onRetry={() => void dashboard.refetch()} /> :
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard to="/dashboard" label={t("home.activeAlerts")} value={dashboard.data.activeAlerts} icon={AlertTriangle} />
                <SummaryCard to="/track" label={t("home.openRescues")} value={dashboard.data.openRescueRequests} icon={Phone} />
                <SummaryCard to="/shelters" label={t("home.availableShelters")} value={dashboard.data.availableShelters} icon={House} />
                <SummaryCard to="/relief" label={t("home.pendingRelief")} value={dashboard.data.unfulfilledReliefRequests} icon={Package} />
              </div>}
        </Section>

        <Section
          title={t("home.mapTitle")}
          description={t("home.mapDescription")}
          action={<Button variant="outline" size="sm" asChild><Link to="/map"><MapPinned />{t("home.openMap")}</Link></Button>}
        >
          {markers.isLoading ? <div className="h-[420px] animate-pulse rounded-lg bg-muted" /> :
            markers.isError ? <ErrorState onRetry={retryMap} /> :
              <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
                <div className="h-[420px] overflow-hidden rounded-lg border"><LazyMap markers={markers.items.map((item) => item.marker)} selectedId={selected?.marker.id} onSelect={setSelectedId} /></div>
                <div className="space-y-3">
                  {markers.items.length === 0 ? <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">{t("map.noMarkers")}</p> :
                    <div className="max-h-[420px] space-y-2 overflow-auto">{markers.items.slice(0, 6).map((item) => <button key={item.marker.id} type="button" onClick={() => setSelectedId(item.marker.id)} className={`w-full rounded-lg border p-3 text-left hover:bg-muted ${selected?.marker.id === item.marker.id ? "border-teal bg-accent" : ""}`}><div className="flex items-start justify-between gap-2"><span className="font-medium">{item.marker.title}</span><VerifiedBadge verified={item.marker.verified} /></div><p className="mt-1 text-xs text-muted-foreground">{item.district}{item.municipality ? ` · ${item.municipality}` : ""}</p><p className="mt-1 text-xs text-muted-foreground">{item.source}</p></button>)}</div>}
                  {selected && <div className="rounded-lg border bg-card p-4"><h3 className="font-semibold">{selected.marker.title}</h3><p className="mt-2 text-sm text-muted-foreground">{selected.description}</p><div className="mt-3 flex flex-wrap items-center gap-2"><StatusBadge status={selected.status} /><Freshness at={selected.reportedAt} /></div><p className="mt-2 text-xs text-muted-foreground">{t("common.source")}: {selected.source}</p></div>}
                </div>
              </div>}
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section className="border-t-4 border-t-orange-500/70" title={<span className="flex items-center gap-2"><AlertTriangle className="size-5 text-orange-600" />{t("home.latestAlerts")}<span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{alerts.data?.length ?? 0}</span></span>} action={<Button variant="ghost" size="sm" asChild><Link to="/dashboard">{t("home.viewAll")}<span aria-hidden="true"> →</span></Link></Button>}>
            <QueryState q={alerts} empty={<p className="text-sm text-muted-foreground">{t("home.noAlerts")}</p>}>
              {(items) => <div className="grid gap-3">{items.slice(0, 3).map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div>}
            </QueryState>
          </Section>
          <Section className="border-t-4 border-t-sky-500/70" title={<span className="flex items-center gap-2"><Siren className="size-5 text-sky-600" />{t("home.incidents")}<span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{reports.data?.filter((item) => item.status !== "rejected" && item.status !== "outdated").length ?? 0}</span></span>} action={<Button variant="outline" size="sm" asChild><Link to="/map"><MapPinned />{t("home.openMap")}</Link></Button>}>
            <QueryState q={reports} empty={<p className="text-sm text-muted-foreground">{t("home.noIncidents")}</p>}>
              {(items) => {
                const visible = items.filter((item) => item.status !== "rejected" && item.status !== "outdated").slice(0, 4);
                return visible.length === 0 ? <p className="text-sm text-muted-foreground">{t("home.noIncidents")}</p> : <div className="grid gap-3">{visible.map((report) => <IncidentCard key={report.id} report={report} />)}</div>;
              }}
            </QueryState>
          </Section>
        </div>

        <Section title={t("home.quickActions")}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto justify-start gap-3 whitespace-normal p-4 text-left" asChild><Link to="/report-hazard"><FileWarning className="size-5 text-teal" />{t("home.report")}</Link></Button>
            <Button variant="sos" className="h-auto justify-start gap-3 whitespace-normal p-4 text-left" asChild><Link to="/request-help"><Phone className="size-5" />{t("home.rescue")}</Link></Button>
            <Button variant="outline" className="h-auto justify-start gap-3 whitespace-normal p-4 text-left" asChild><Link to="/shelters"><House className="size-5 text-teal" />{t("home.shelter")}</Link></Button>
            <Button variant="outline" className="h-auto justify-start gap-3 whitespace-normal p-4 text-left" asChild><Link to="/preparedness"><ShieldCheck className="size-5 text-teal" />{t("home.preparedness")}</Link></Button>
          </div>
        </Section>
      </main>
    </>
  );
}
