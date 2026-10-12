import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live map — JalRakshak" },
      { name: "description", content: "Live map on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Live map — JalRakshak" },
      { property: "og:description", content: "Live map on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Live map" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
