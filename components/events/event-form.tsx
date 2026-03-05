"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORT_TYPES, Event } from "@/lib/types";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import { useState } from "react";

const venueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  address: z.string().optional(),
});

const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  sport_type: z.string().min(1, "Sport type is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  venues: z.array(venueSchema).min(1, "At least one venue is required"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm({ event }: { event?: Event }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!event;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event?.name || "",
      sport_type: event?.sport_type || "",
      date: event?.date
        ? new Date(event.date).toISOString().slice(0, 16)
        : "",
      description: event?.description || "",
      venues: event?.venues?.map((v) => ({
        name: v.name,
        address: v.address || "",
      })) || [{ name: "", address: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "venues",
  });

  async function onSubmit(values: EventFormValues) {
    setLoading(true);

    const payload = {
      ...values,
      date: new Date(values.date).toISOString(),
      venues: values.venues.map((v) => ({
        name: v.name,
        address: v.address || undefined,
      })),
    };

    const result = isEditing
      ? await updateEvent(event!.id, payload)
      : await createEvent(payload);

    setLoading(false);

    if (result.success) {
      toast.success(isEditing ? "Event updated!" : "Event created!");
      router.push("/dashboard");
    } else {
      toast.error(result.error || "Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer Basketball Tournament" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SPORT_TYPES.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the event..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Venues</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", address: "" })}
            >
              <Plus className="mr-2 h-3 w-3" />
              Add Venue
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start">
              <div className="flex-1 space-y-2">
                <FormField
                  control={form.control}
                  name={`venues.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Venue name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`venues.${index}.address`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Address (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="mt-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {form.formState.errors.venues?.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.venues.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Event" : "Create Event"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}