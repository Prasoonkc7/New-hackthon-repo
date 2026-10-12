import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DemoBadge, EmptyState, ErrorState, Freshness, ListSkeleton, PageHeader, VerifiedBadge } from "@/components/common";
import { Input } from "@/components/ui/input";
import { useShelters } from "@/hooks/use-data";

export const Route = createFileRoute("/shelters")({
  head: () => ({ meta: [{ title: "Shelters — JalRakshak" }] }),
  component: Shelters,
});

function Shelters() {
  const query = useShelters();
  const [search, setSearch] = useState("");
  const results = useMemo(() => (query.data ?? []).filter((s) => `${s.name} ${s.district} ${s.municipality}`.toLowerCase().includes(search.toLowerCase())), [query.data, search]);
  return (
    <>
      <PageHeader title="Shelters and evacuation information" description="Availability is only confirmed when a shelter has a recent verified update. Follow local authority instructions." eyebrow={<DemoBadge />} />
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 sm:px-6">
        <Input placeholder="Search shelter, district, or municipality" value={search} onChange={(e) => setSearch(e.target.value)} />
        {query.isLoading ? <ListSkeleton rows={4} /> : query.isError ? <ErrorState onRetry={() => void query.refetch()} /> : results.length === 0 ? <EmptyState title="No shelters found" /> : (
          <div className="grid gap-4 md:grid-cols-2">{results.map((s) => {
            const remaining = s.capacity == null || s.occupancy == null ? null : Math.max(s.capacity - s.occupancy, 0);
            return <article key={s.id} className="card-surface space-y-3 p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{s.name}</h2><p className="text-sm text-muted-foreground">{s.address}, {s.municipality}, {s.district}</p></div><VerifiedBadge verified={s.verified} /></div><div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-muted px-2 py-1">{remaining == null ? "Capacity not confirmed" : `${remaining} places reported`}</span>{s.water && <span className="rounded-full bg-muted px-2 py-1">Water</span>}{s.food && <span className="rounded-full bg-muted px-2 py-1">Food</span>}{s.medical && <span className="rounded-full bg-muted px-2 py-1">Medical</span>}{s.accessible && <span className="rounded-full bg-muted px-2 py-1">Accessible</span>}</div><Freshness at={s.updatedAt} /></article>;
          })}</div>
        )}
      </main>
    </>
  );
}
