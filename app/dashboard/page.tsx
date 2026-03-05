import { getEvents } from "@/lib/actions/events";
import { EventList } from "@/components/events/event-list";
import { SearchFilter } from "@/components/events/search-filter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { Suspense } from "react";

async function EventsContent({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sport?: string }>;
}) {
  const params = await searchParams;
  const result = await getEvents(params.search, params.sport);

  return (
    <>
      <SearchFilter
        currentSearch={params.search}
        currentSport={params.sport}
      />
      {result.success && result.data ? (
        <EventList events={result.data} />
      ) : (
        <p className="text-destructive">
          {result.error || "Failed to load events"}
        </p>
      )}
    </>
  );
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sport?: string }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sports Events</h1>
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <EventsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}