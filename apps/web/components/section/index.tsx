import { apiClient } from "@/lib/apiClient";
import React, { Fragment } from "react";
import SectionItem from "./section-item";
import { Section as SectionType } from "@/types/section";
import { SectionHeader } from "./section-header";

export default async function Section() {
  const { data, error } = await apiClient.get("/api/sections");
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <section>
      {data.length < 1 ? (
        <div>No section found</div>
      ) : (
        <Fragment>
          {data.sections.map((section: SectionType, index: number) => (
            <Fragment key={section.id}>
              <SectionHeader section={section} />
              <SectionItem section={section} />
            </Fragment>
          ))}
        </Fragment>
      )}
    </section>
  );
}
