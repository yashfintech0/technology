import { SectionArticleCard } from "@/components/section/section-article";
import { apiClient } from "@/lib/apiClient";
import { Article } from "@/types/article";
import React from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: Props) {
  const id = (await params).id;
  const { data, error } = await apiClient.get(`/api/articles/category/${id}`);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="px-5 py-5">
      <h1 className="text-2xl font-bold my-2">
        Category "{data.category.name}"
      </h1>
      {data.articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.articles.map((article: Article) => (
            <SectionArticleCard article={article} key={article.id} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">
              No Articles Found
            </h2>
            <p className="text-gray-600 mt-2">
              There are no articles in this category yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
