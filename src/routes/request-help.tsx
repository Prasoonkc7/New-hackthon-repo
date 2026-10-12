import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/request-help")({
  head: () => ({
    meta: [
      { title: "Request emergency help — JalRakshak" },
      { name: "description", content: "Request emergency help on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Request emergency help — JalRakshak" },
      { property: "og:description", content: "Request emergency help on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Request emergency help" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
