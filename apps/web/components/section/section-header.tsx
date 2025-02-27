import { Section } from "@/types/section";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

interface Props {
  section: Section;
}

export function SectionHeader({ section }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">{section.name}</h2>
      <Button variant="ghost" size="sm" className="text-muted-foreground">
        See More <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
