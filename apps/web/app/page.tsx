import { AdBanner } from "@/components/ad-banner";
import MainSection from "@/components/section/main";
import Section from "@/components/section";
import { apiClient } from "@/lib/apiClient";

export default async function page() {
  const { data, error } = await apiClient.get("/api/sections");
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <MainSection />
            <Section sections={data.sections} />
            <section className="mb-12"></section>
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
