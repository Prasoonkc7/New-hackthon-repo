import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track a request — JalRakshak" },
      { name: "description", content: "Track a request on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Track a request — JalRakshak" },
      { property: "og:description", content: "Track a request on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Track a request" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
