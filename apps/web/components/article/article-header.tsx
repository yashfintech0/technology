"use client";
import { CalculateAverageTimeToRead, serialize } from "@/lib/utils";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface props {
  data: any;
}

export default function ArticleHeader({ data }: props) {
  const [readTime, setReadTime] = useState<number>();
  useEffect(() => {
    const articleText = serialize(data.conten || []);
    setReadTime(CalculateAverageTimeToRead(articleText, 200));
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
      <p className="text-muted-foreground">{data.description}</p>
      <div className="flex items-center text-sm text-muted-foreground">
        <span>Published on {format(new Date(data.updatedAt), "PPP")}</span>
        <span className="mx-2">•</span>
        <span>{readTime} min read</span>
      </div>
    </div>
  );
}
