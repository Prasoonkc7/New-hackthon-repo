import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Backpack, Droplets, Home, ShieldCheck } from "lucide-react";
import { DemoBadge, Notice, PageHeader, Section } from "@/components/common";
import { useI18n, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/preparedness")({
  head: () => ({ meta: [{ title: "Preparedness — JalRakshak" }] }),
  component: Preparedness,
});

function Preparedness() {
  const { t } = useI18n();
  const groups = [
    { icon: Backpack, title: t("prep.before"), items: ["prep.b1", "prep.b2", "prep.b3", "prep.b4"] },
    { icon: AlertTriangle, title: t("prep.during"), items: ["prep.d1", "prep.d2", "prep.d3", "prep.d4"] },
    { icon: ShieldCheck, title: t("prep.after"), items: ["prep.a1", "prep.a2", "prep.a3", "prep.a4"] },
  ] as const;
  return (
    <>
      <PageHeader title={t("nav.preparedness")} description={t("prep.general")} eyebrow={<DemoBadge />} />
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 sm:px-6">
        <Notice tone="warning" icon={<AlertTriangle className="size-5" />}>{t("prep.general")}</Notice>
        <div className="grid gap-5 md:grid-cols-3">{groups.map(({ icon: Icon, title, items }) => <Section key={title} title={title}><Icon className="mb-3 size-8 text-teal" /><ul className="space-y-3 text-sm text-muted-foreground">{items.map((item) => <li key={item} className="flex gap-2"><span className="text-teal">•</span>{t(item as TKey)}</li>)}</ul></Section>)}</div>
        <Section title={t("prep.kit")}><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-lg border p-4"><Backpack className="mb-2 text-teal" /><p className="font-medium">{t("prep.kitFood")}</p></div><div className="rounded-lg border p-4"><Droplets className="mb-2 text-teal" /><p className="font-medium">{t("prep.kitWater")}</p></div><div className="rounded-lg border p-4"><Home className="mb-2 text-teal" /><p className="font-medium">{t("prep.kitDocuments")}</p></div></div></Section>
      </main>
    </>
  );
}
