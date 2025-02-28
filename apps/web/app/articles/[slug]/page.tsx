import { apiClient } from "@/lib/apiClient";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import ArticleHeader from "@/components/article/article-header";
import { Badge } from "@/components/ui/badge";

const ViewEditor = dynamic(() => import("@/components/Editor/vew-editor"), {
  loading: () => (
    <div className="space-y-2 my-5">
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-[250px] h-5" />
    </div>
  ),
});

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const articleData = async (slug: string) => {
  return await apiClient.get(`/api/articles/slug/${slug}`);
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;
  const { data, error } = await articleData(slug);

  if (error) {
    notFound();
  }

  return {
    title: data.title,
    description: data.description,
    keywords: data.tags.map((item: any) => item),
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://news.hiredsys.com/articles/${slug}`, // Replace with your actual domain
      siteName: "News Daily",
      images: [
        {
          url: data.imageUrl || "https://example.com/default-og-image.jpg", // Fallback image
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      type: "article",
      locale: "en_US",
    },
  };
}

export default async function page({ params }: Props) {
  const slug = (await params).slug;
  const { error, data } = await articleData(slug);
  if (error) throw new Error(error);
  return (
    <main className="max-w-4xl mx-auto px-4 py-5 md:py-10">
      <div className="mb-10">
        <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden">
          <Image
            src={data.imageUrl}
            alt={`${data.title} image`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <ArticleHeader data={data} />
      </div>{" "}
      <ViewEditor content={data.content} />
      <div className="space-x-2 my-5">
        {data.tags.map((topic: any, key: number) => (
          <Badge key={key} className="h-10 rounded-md" variant={"secondary"}>
            {topic}
          </Badge>
        ))}
      </div>
    </main>
  );
}
