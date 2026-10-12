import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin & verification — JalRakshak" },
      { name: "description", content: "Admin & verification on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Admin & verification — JalRakshak" },
      { property: "og:description", content: "Admin & verification on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Admin & verification" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
