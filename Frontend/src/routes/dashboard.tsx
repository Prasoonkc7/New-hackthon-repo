import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, BarChart3, ClipboardList, FileWarning, ShieldCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, DemoBadge, ErrorState, ListSkeleton, Section, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useAlerts, useReports, useRescues, useWeather } from "@/hooks/use-data";
import { DISTRICTS } from "@/services/mock-data";
import { useI18n, type TKey } from "@/lib/i18n";
import type { HazardType, Severity } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Disaster dashboard — JalRakshak" }] }),
  component: Dashboard,
});

const severityColors: Record<Severity, string> = { low: "#14B8A6", moderate: "#F59E0B", high: "#DC2626", severe: "#991B1B" };

function Dashboard() {
  const { t } = useI18n();
  const alerts = useAlerts();
  const reports = useReports();
  const rescues = useRescues();
  const weather = useWeather();
  const [district, setDistrict] = useState("all");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const loading = alerts.isLoading || reports.isLoading || rescues.isLoading;
  const error = alerts.isError || reports.isError || rescues.isError;
  const retry = () => { void alerts.refetch(); void reports.refetch(); void rescues.refetch(); };

  const filteredAlerts = useMemo(() => (alerts.data ?? []).filter((a) => (district === "all" || a.district === district) && (severity === "all" || a.severity === severity)), [alerts.data, district, severity]);
  const filteredReports = useMemo(() => (reports.data ?? []).filter((r) => district === "all" || r.district === district), [reports.data, district]);
  const verified = filteredReports.filter((r) => r.status === "verified").length + filteredAlerts.filter((a) => a.verified).length;
  const hazardData = useMemo(() => {
    const counts = new Map<HazardType, number>();
    filteredReports.forEach((r) => counts.set(r.hazard, (counts.get(r.hazard) ?? 0) + 1));
    return Array.from(counts, ([key, value]) => ({ name: t(`hz.${key}` as TKey), value }));
  }, [filteredReports, t]);
  const severityData = useMemo(() => (["low", "moderate", "high", "severe"] as Severity[]).map((key) => ({ name: t(`sev.${key}` as TKey), value: filteredAlerts.filter((a) => a.severity === key).length, key })), [filteredAlerts, t]);

  return (
    <>
      <PageHeader title={t("page.dashboard")} description={t("home.demoNotice")} eyebrow={<DemoBadge />} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
          <label className="grid gap-1 text-sm font-medium">{t("filter.district")}
            <select className="h-9 rounded-md border bg-background px-3" value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="all">{t("common.all")}</option>{DISTRICTS.map((d) => <option key={d.district} value={d.district}>{d.district}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">{t("filter.severity")}
            <select className="h-9 rounded-md border bg-background px-3" value={severity} onChange={(e) => setSeverity(e.target.value as Severity | "all")}>
              <option value="all">{t("common.all")}</option>{(["low", "moderate", "high", "severe"] as Severity[]).map((s) => <option key={s} value={s}>{t(`sev.${s}` as TKey)}</option>)}
            </select>
          </label>
          <Button variant="ghost" onClick={() => { setDistrict("all"); setSeverity("all"); }}>{t("filter.all")}</Button>
        </div>
        <Section title={t("weather.title")} description={t("weather.forecastNote")}>
          {weather.isLoading ? <p className="text-sm text-muted-foreground">{t("common.loading")}</p> : weather.isError || weather.data?.status === "unavailable" ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
              <p>{weather.data?.message ?? t("weather.unavailable")}</p>
              <Button variant="outline" onClick={() => void weather.refetch()}>{t("common.retry")}</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">{t("weather.current")}</p>
                <p className="mt-2 text-3xl font-bold">{weather.data?.current_conditions?.temperature ?? "—"}°C</p>
                <p className="mt-2 text-sm">{t("weather.rain")}: {weather.data?.current_conditions?.rain ?? 0} mm</p>
                <p className="mt-3 text-xs text-muted-foreground">{t("common.source")}: {weather.data?.source} · {t("common.updated")}: {weather.data?.fetched_at ? new Date(weather.data.fetched_at).toLocaleString() : "—"}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-5">
                {(weather.data?.forecast ?? []).map((day) => <div key={day.date} className="rounded-lg border p-3 text-center text-sm"><p className="font-medium">{day.date}</p><p className="mt-2 font-semibold">{day.temperature_max ?? "—"}°C</p><p className="text-muted-foreground">{day.precipitation ?? 0} mm</p><p className="text-xs text-muted-foreground">{day.probability ?? 0}%</p></div>)}
              </div>
            </div>
          )}
        </Section>
        {loading ? <ListSkeleton rows={4} /> : error ? <ErrorState onRetry={retry} /> : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={AlertTriangle} label={t("dashboard.alerts")} value={filteredAlerts.length} />
              <Metric icon={FileWarning} label={t("dashboard.reports")} value={filteredReports.length} />
              <Metric icon={ClipboardList} label={t("dashboard.rescues")} value={(rescues.data ?? []).filter((r) => district === "all" || r.district === district).length} />
              <Metric icon={ShieldCheck} label={t("dashboard.verified")} value={verified} />
            </div>
            {filteredAlerts.length === 0 && filteredReports.length === 0 ? <Section title={t("page.noResults")}><p className="text-sm text-muted-foreground">{t("page.noResults")}</p></Section> : (
              <div className="grid gap-6 lg:grid-cols-2">
                <Section title={t("dashboard.byHazard")}><ChartShell empty={hazardData.length === 0}><ResponsiveContainer width="100%" height={280}><BarChart data={hazardData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#14B8A6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></ChartShell></Section>
                <Section title={t("dashboard.bySeverity")}><ChartShell empty={severityData.every((d) => d.value === 0)}><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={severityData.filter((d) => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>{severityData.filter((d) => d.value > 0).map((entry) => <Cell key={entry.key} fill={severityColors[entry.key]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartShell></Section>
              </div>
            )}
            <Section title={t("home.latestAlerts")}>
              <div className="grid gap-3 md:grid-cols-2">{filteredAlerts.map((alert) => <article key={alert.id} className="rounded-lg border p-4"><div className="flex justify-between gap-3"><h3 className="font-semibold">{alert.title}</h3><StatusBadge status={alert.verified ? "verified" : "unverified"} /></div><p className="mt-2 text-sm text-muted-foreground">{alert.district} · {alert.municipality}</p></article>)}</div>
            </Section>
          </>
        )}
      </main>
    </>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof AlertTriangle; label: string; value: number }) {
  return <div className="card-surface flex items-center gap-4 p-5"><span className="rounded-lg bg-accent p-3 text-teal"><Icon className="size-5" /></span><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></div></div>;
}

function ChartShell({ empty, children }: { empty: boolean; children: ReactNode }) {
  return empty ? <p className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">No chart data for these filters.</p> : children;
}
