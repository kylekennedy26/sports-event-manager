"use client";

import { Event } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { deleteEvent } from "@/lib/actions/events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function EventList({ events }: { events: Event[] }) {
  const router = useRouter();

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No events found.</p>
        <p className="text-sm mt-1">Create your first event to get started!</p>
      </div>
    );
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const result = await deleteEvent(id);
    if (result.success) {
      toast.success("Event deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete event");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <Card key={event.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg leading-tight">
                {event.name}
              </CardTitle>
              <Badge variant="secondary">{event.sport_type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>

            {event.venues && event.venues.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  {event.venues.map((v) => v.name).join(", ")}
                </span>
              </div>
            )}

            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            )}

            <div className="flex gap-2 mt-auto pt-3">
              <Link href={`/dashboard/events/${event.id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="mr-2 h-3 w-3" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(event.id, event.name)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}