import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Article } from "@/types/article";
import { truncateValue } from "@/lib/utils";
interface Props {
  article: Article;
}

export default function SectionRowArticle({ article }: Props) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="py-4 px-0">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Latest news image"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-2">{article.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {truncateValue(article.description, 200)}
            </p>
            <p className="text-sm text-muted-foreground">15 Minutes Read</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
