import { CardDescription } from "@/components/ui/card";
import { apiClient } from "@/lib/apiClient";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function MainSection() {

    const { data, error } = await apiClient.get(`/api/sections/main/article`);
    if (error) {
        return <div className="text-center">{error}</div>;
    }
    if (!data || !data.imageUrl) {
        // Handle the case where data is missing or imageUrl is missing
        return (
            <div className="text-center">
                Article does not exist. Please push the article and wait for a minute
            </div>
        ); // Or return a placeholder, etc.
    }
    return (
        <section className="mb-6">
            <article className="relative overflow-hidden">
                <div className="relative aspect-[21/9]">
                    <Image
                        src={data.imageUrl}
                        alt="Featured article image"
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="py-6">
                    <Link href={`/articles/${data.slug}`}>
                        <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
                        <CardDescription>{data.description}</CardDescription>
                    </Link>
                </div>
            </article>
        </section>
    );
}
