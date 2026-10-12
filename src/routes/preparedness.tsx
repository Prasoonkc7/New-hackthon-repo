import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/preparedness")({
  head: () => ({
    meta: [
      { title: "Preparedness — JalRakshak" },
      { name: "description", content: "Preparedness on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Preparedness — JalRakshak" },
      { property: "og:description", content: "Preparedness on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Preparedness" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
