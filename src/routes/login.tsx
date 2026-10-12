import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — JalRakshak" },
      { name: "description", content: "Sign in on JalRakshak, a Nepal flood resilience prototype." },
      { property: "og:title", content: "Sign in — JalRakshak" },
      { property: "og:description", content: "Sign in on JalRakshak, a Nepal flood resilience prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Sign in" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EmptyState title="This section is not built yet." />
      </div>
    </>
  );
}
