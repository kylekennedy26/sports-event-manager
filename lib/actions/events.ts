"use server";

import { createClient } from "@/lib/supabase/server";
import { safeAction } from "@/lib/safe-action";
import { ActionResponse, Event } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getEvents(
  search?: string,
  sportFilter?: string
): Promise<ActionResponse<Event[]>> {
  return safeAction(async () => {
    const supabase = await createClient();

    let query = supabase
      .from("events")
      .select("*, venues(*)")
      .order("date", { ascending: true });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (sportFilter && sportFilter !== "all") {
      query = query.eq("sport_type", sportFilter);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data as Event[];
  });
}

export async function getEvent(id: string): Promise<ActionResponse<Event>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("events")
      .select("*, venues(*)")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data as Event;
  });
}

export async function createEvent(
  formData: {
    name: string;
    sport_type: string;
    date: string;
    description?: string;
    venues: { name: string; address?: string }[];
  }
): Promise<ActionResponse<Event>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({
        name: formData.name,
        sport_type: formData.sport_type,
        date: formData.date,
        description: formData.description || null,
        user_id: user.id,
      })
      .select()
      .single();

    if (eventError) throw new Error(eventError.message);

    if (formData.venues.length > 0) {
      const { error: venueError } = await supabase.from("venues").insert(
        formData.venues.map((v) => ({
          event_id: event.id,
          name: v.name,
          address: v.address || null,
        }))
      );

      if (venueError) throw new Error(venueError.message);
    }

    revalidatePath("/dashboard");
    return event as Event;
  });
}

export async function updateEvent(
  id: string,
  formData: {
    name: string;
    sport_type: string;
    date: string;
    description?: string;
    venues: { name: string; address?: string }[];
  }
): Promise<ActionResponse<Event>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .update({
        name: formData.name,
        sport_type: formData.sport_type,
        date: formData.date,
        description: formData.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (eventError) throw new Error(eventError.message);

    // Delete existing venues and re-insert
    const { error: deleteError } = await supabase
      .from("venues")
      .delete()
      .eq("event_id", id);

    if (deleteError) throw new Error(deleteError.message);

    if (formData.venues.length > 0) {
      const { error: venueError } = await supabase.from("venues").insert(
        formData.venues.map((v) => ({
          event_id: id,
          name: v.name,
          address: v.address || null,
        }))
      );

      if (venueError) throw new Error(venueError.message);
    }

    revalidatePath("/dashboard");
    return event as Event;
  });
}

export async function deleteEvent(id: string): Promise<ActionResponse> {
  return safeAction(async () => {
    const supabase = await createClient();

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard");
  });
}