"use client";

import React, { Fragment, useEffect, useState, useTransition } from "react";
import SectionItem from "./section-item";
import { Section as SectionType } from "@/types/section";
import { SectionHeader } from "./section-header";
import { apiClient } from "@/lib/apiClient";
import { Skeleton } from "../ui/skeleton";

export default function Section() {
  const [sections, setSections] = useState<SectionType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const { data, error } = await apiClient.get("/api/sections");
      if (error) {
        setError(error);
      } else {
        setSections(data.sections);
      }
    });
  }, []);

  if (isPending) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error loading sections: {error}</div>;
  }

  return (
    <section>
      {sections.length < 1 ? (
        <div>No section found</div>
      ) : (
        <Fragment>
          {sections.map((section: SectionType, index: number) => (
            <Fragment key={section.id}>
              <SectionHeader section={section} />
              <SectionItem section={section} row={index / 2 !== 0} />
            </Fragment>
          ))}
        </Fragment>
      )}
    </section>
  );
}
