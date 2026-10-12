import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/shelters")({
  head: () => ({
    meta: [
      { title: "Shelters — JalRakshak" },
      { name: "description", content: "Shelters on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Shelters — JalRakshak" },
      { property: "og:description", content: "Shelters on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Shelters" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
