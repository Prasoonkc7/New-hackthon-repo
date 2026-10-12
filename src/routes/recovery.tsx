import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/recovery")({
  head: () => ({
    meta: [
      { title: "Recovery assistance — JalRakshak" },
      { name: "description", content: "Recovery assistance on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Recovery assistance — JalRakshak" },
      { property: "og:description", content: "Recovery assistance on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Recovery assistance" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
