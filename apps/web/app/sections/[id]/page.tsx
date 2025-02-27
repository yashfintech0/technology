import { SectionArticleCard } from "@/components/section/section-article";
import { apiClient } from "@/lib/apiClient";
import { Article } from "@/types/article";
import React from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: Props) {
  const id = (await params).id;
  const { data, error } = await apiClient.get(`/api/sections/${id}/articles`);

  // Handle errors

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-700">
            Failed to load articles. Please try again later.
          </p>
          <p className="text-sm text-gray-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">No Articles Found</h1>
          <p className="text-gray-700">
            There are no articles available in this section.
          </p>
        </div>
      </div>
    );
  }
  return (
    <main className="container mx-auto px-4 py-5">
      <h1 className="text-3xl font-bold mb-2">Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((article: Article) => (
          <SectionArticleCard article={article} key={article.id} />
        ))}
      </div>
    </main>
  );
}
