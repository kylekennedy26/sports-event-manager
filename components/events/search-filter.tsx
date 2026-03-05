"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORT_TYPES } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function SearchFilter({
  currentSearch,
  currentSport,
}: {
  currentSearch?: string;
  currentSport?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Search events by name..."
        defaultValue={currentSearch}
        onChange={(e) => {
          const timeout = setTimeout(() => {
            updateParams("search", e.target.value);
          }, 300);
          return () => clearTimeout(timeout);
        }}
        className="flex-1"
      />
      <Select
        defaultValue={currentSport || "all"}
        onValueChange={(value) => updateParams("sport", value)}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filter by sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sports</SelectItem>
          {SPORT_TYPES.map((sport) => (
            <SelectItem key={sport} value={sport}>
              {sport}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}