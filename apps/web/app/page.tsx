import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { NewsTicker } from "@/components/news-ticker";
import { AdBanner } from "@/components/ad-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Button variant="ghost" size="sm" className="text-muted-foreground">
        See More <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

function ArticleCard({
  image,
  title,
  readTime,
}: {
  image: string;
  category: string;
  title: string;
  readTime: string;
}) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="py-4 px-0">
        <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{readTime} Read</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NewsTicker />
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">NewsDaily CMS</h1>
            <Navbar />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Featured Section */}
            <section className="mb-6">
              <article className="relative overflow-hidden">
                <div className="relative aspect-[21/9]">
                  <Image
                    src="/placeholder.svg"
                    alt="Featured article image"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="py-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Record-Breaking, Stunning Performance Leads The Swimmer To A
                    Victory, Securing Their Place In History
                  </h2>
                  <p className="text-muted-foreground">10 Minutes Read</p>
                </div>
              </article>
            </section>

            {/* Trending Section */}
            <section className="mb-12">
              <SectionHeader title="Trending Now" />
              <div className="grid md:grid-cols-2 gap-6">
                <ArticleCard
                  image="/placeholder.svg?height=200&width=400"
                  category="World"
                  title="A Quiet Moment in the Crowd: A Monk Dives Into the News"
                  readTime="6 Minutes"
                />
                <ArticleCard
                  image="/placeholder.svg?height=200&width=400"
                  category="Travel"
                  title="Romania and Bulgaria fully join Europe's borderless travel zone"
                  readTime="10 Minutes"
                />
                <ArticleCard
                  image="/placeholder.svg?height=200&width=400"
                  category="Technology"
                  title="Emerging Startups Showcase Innovations at Local Tech"
                  readTime="12 Minutes"
                />
                <ArticleCard
                  image="/placeholder.svg?height=200&width=400"
                  category="Sports"
                  title="Championship Finals Set New Attendance Records"
                  readTime="8 Minutes"
                />
              </div>
            </section>

            {/* Latest News Section */}
            <section>
              <SectionHeader title="Latest News" />
              <div className="grid gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="border-none shadow-none">
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
                          <h3 className="font-semibold mb-2">
                            Latest Political Developments Shape Global Economic
                            Policies
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            Analysis of recent political decisions and their
                            impact on international markets and trade
                            relations...
                          </p>
                          <p className="text-sm text-muted-foreground">
                            15 Minutes Read
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar - Advertisements */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="lg:sticky lg:top-24">
              <AdBanner />
              <div className="my-6">
                <AdBanner />
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold mb-4">Most Read</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {i}
                      </span>
                      <div>
                        <h4 className="font-medium line-clamp-2 mb-1">
                          Breaking News: Major Scientific Discovery Announced
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          8 Minutes Read
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <AdBanner />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
