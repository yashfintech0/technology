import { Section } from "@/types/section";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  section: Section;
}

export function SectionHeader({ section }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">{section.name}</h2>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        asChild
      >
        <Link href={`/sections/${section.id}`}>
          See More <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
}
