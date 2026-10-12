import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & privacy — JalRakshak" },
      { name: "description", content: "About & privacy on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "About & privacy — JalRakshak" },
      { property: "og:description", content: "About & privacy on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="About & privacy" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
