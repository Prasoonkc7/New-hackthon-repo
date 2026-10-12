import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Disaster dashboard — JalRakshak" },
      { name: "description", content: "Disaster dashboard on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Disaster dashboard — JalRakshak" },
      { property: "og:description", content: "Disaster dashboard on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Disaster dashboard" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
