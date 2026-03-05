import { getEvent } from "@/lib/actions/events";
import { EventForm } from "@/components/events/event-form";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function EditEventContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getEvent(id);

  if (!result.success || !result.data) {
    redirect("/dashboard");
  }

  return <EventForm event={result.data} />;
}

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <EditEventContent params={params} />
      </Suspense>
    </div>
  );
}