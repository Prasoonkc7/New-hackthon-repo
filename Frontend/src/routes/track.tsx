import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, ErrorState, StatusBadge, StatusTimeline } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import type { RescueRequest } from "@/lib/types";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track a request — JalRakshak" }] }),
  component: Track,
});

function Track() {
  const [reference, setReference] = useState("");
  const [request, setRequest] = useState<RescueRequest | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const search = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setRequest(null);
    try {
      const result = await api.getRescueByReference(reference);
      if (!result) setError("No request was found for that reference.");
      else setRequest(result);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load this request."); }
    finally { setBusy(false); }
  };
  return (
    <>
      <PageHeader title="Track a request" description="Enter the reference shown after a request is accepted by the service. A record does not mean a rescue team has been dispatched." />
      <main className="mx-auto max-w-2xl space-y-5 px-4 py-8 sm:px-6">
        <form className="card-surface flex gap-2 p-5" onSubmit={search}>
          <Input required placeholder="JR-RQ-..." value={reference} onChange={(e) => setReference(e.target.value)} aria-label="Request reference" />
          <Button disabled={busy}>{busy ? "Loading…" : "Track"}</Button>
        </form>
        {error && <ErrorState message={error} />}
        {request && <section className="card-surface space-y-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm text-muted-foreground">Reference</p><h2 className="text-2xl font-bold">{request.reference}</h2></div><StatusBadge status={request.status} /></div>
          <StatusTimeline steps={["submitted", "under_review", "assigned", "in_progress", "resolved"]} current={request.status} />
          <dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">District</dt><dd>{request.district}</dd></div><div><dt className="text-muted-foreground">People</dt><dd>{request.people}</dd></div><div className="sm:col-span-2"><dt className="text-muted-foreground">Description</dt><dd>{request.description}</dd></div></dl>
        </section>}
      </main>
    </>
  );
}
