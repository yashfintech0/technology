import React, { Fragment } from "react";
import SectionItem from "./section-item";
import { Section as SectionType } from "@/types/section";
import { SectionHeader } from "./section-header";

interface Props {
  sections: SectionType[];
}

export default function Section({ sections }: Props) {
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
