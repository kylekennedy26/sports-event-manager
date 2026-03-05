import { EventForm } from "@/components/events/event-form";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <EventForm />
      </Suspense>
    </div>
  );
}