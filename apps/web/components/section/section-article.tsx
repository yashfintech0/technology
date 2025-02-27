import { Article } from "@/types/article";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

interface Props {
  article: Article;
}

export function SectionArticleCard({ article }: Props) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="py-4 px-0">
        <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-sm text-muted-foreground">{article.description}</p>
      </CardContent>
    </Card>
  );
}
