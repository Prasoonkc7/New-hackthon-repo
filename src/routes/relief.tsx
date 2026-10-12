import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/relief")({
  head: () => ({
    meta: [
      { title: "Relief supplies — JalRakshak" },
      { name: "description", content: "Relief supplies on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Relief supplies — JalRakshak" },
      { property: "og:description", content: "Relief supplies on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Relief supplies" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
