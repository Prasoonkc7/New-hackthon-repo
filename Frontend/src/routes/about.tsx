import { createFileRoute } from "@tanstack/react-router";
import { Database, LockKeyhole, Map, ShieldCheck } from "lucide-react";
import { PageHeader, Section } from "@/components/common";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About and privacy — JalRakshak" }] }),
  component: About,
});

function About() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t("about.title")} description={t("about.description")} />
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-2">
        <Section title={t("about.mission")}><Map className="mb-3 size-8 text-teal" /><p className="text-sm text-muted-foreground">{t("about.missionText")}</p></Section>
        <Section title={t("about.privacy")}><LockKeyhole className="mb-3 size-8 text-teal" /><p className="text-sm text-muted-foreground">{t("about.privacyText")}</p></Section>
        <Section title={t("about.data")}><Database className="mb-3 size-8 text-teal" /><p className="text-sm text-muted-foreground">{t("about.dataText")}</p></Section>
        <Section title={t("about.safety")}><ShieldCheck className="mb-3 size-8 text-teal" /><p className="text-sm text-muted-foreground">{t("about.safetyText")}</p></Section>
      </main>
    </>
  );
}
