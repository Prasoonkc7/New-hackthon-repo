import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/common";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JalRakshak — Nepal Flood Resilience & Recovery" },
      { name: "description", content: "Flood alerts, emergency help, shelters, relief and recovery support across Nepal (prototype)." },
      { property: "og:title", content: "JalRakshak — Nepal Flood Resilience & Recovery" },
      { property: "og:description", content: "Flood alerts, emergency help, shelters, relief and recovery support across Nepal (prototype)." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  return (
    <section className="hero-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <DemoBadge />
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">{t("hero.title")}</h1>
        <p className="mt-4 max-w-2xl text-lg opacity-85">{t("hero.sub")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="sos" size="lg" asChild><Link to="/request-help">{t("nav.sosLong")}</Link></Button>
          <Button variant="heroOutline" size="lg" asChild><Link to="/map">{t("hero.cta2")}</Link></Button>
        </div>
        <p className="mt-8 max-w-2xl text-sm opacity-75">{t("banner.official")}</p>
      </div>
    </section>
  );
}
