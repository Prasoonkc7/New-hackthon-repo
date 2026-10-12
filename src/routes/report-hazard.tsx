import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/report-hazard")({
  head: () => ({
    meta: [
      { title: "Report a hazard — JalRakshak" },
      { name: "description", content: "Report a hazard on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Report a hazard — JalRakshak" },
      { property: "og:description", content: "Report a hazard on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Report a hazard" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
