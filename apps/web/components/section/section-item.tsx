"use client";
import { apiClient } from "@/lib/apiClient";
import { Article } from "@/types/article";
import { Section } from "@/types/section";
import React, { Fragment, useEffect, useState, useTransition } from "react";
import { SectionArticleCard } from "./section-article";
import SectionRowArticle from "./section-row-article";

interface Props {
  section: Section;
}

export default function SectionItem({ section }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, seterror] = useState<null | string>(null);
  const [articles, setarticles] = useState<Article[]>([]);
  useEffect(() => {
    startTransition(async () => {
      const { data, error } = await apiClient.get(
        `/api/sections/${section.id}/articles`,
      );
      if (error) {
        seterror(error);
      } else {
        setarticles(data);
      }
    });
  }, [section]);

  if (isPending) {
    return <div>loading...</div>;
  }

  return (
    <Fragment>
      {articles.length < 1 ? (
        <div>No articles found </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {articles.map((article, index) => {
            const isEven = index / 2 === 0;
            return isEven ? (
              <SectionArticleCard article={article} key={index} />
            ) : (
              <SectionRowArticle article={article} key={index} />
            );
          })}
        </div>
      )}
    </Fragment>
  );
}
