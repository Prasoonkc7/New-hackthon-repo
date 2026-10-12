import { ClientOnly } from "@tanstack/react-router";
import { Component, lazy, Suspense, type ComponentProps, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common";

const DisasterMap = lazy(() => import("./DisasterMap"));

class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    if (this.state.failed)
      return <ErrorState message="The map could not be loaded. Use the list view instead." onRetry={() => this.setState({ failed: false })} />;
    return this.props.children;
  }
}

export function LazyMap(props: ComponentProps<typeof DisasterMap>) {
  const fallback = <Skeleton className="h-full min-h-64 w-full rounded-none" />;
  return (
    <ClientOnly fallback={fallback}>
      <MapBoundary>
        <Suspense fallback={fallback}>
          <DisasterMap {...props} />
        </Suspense>
      </MapBoundary>
    </ClientOnly>
  );
}
