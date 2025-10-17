import { Suspense } from "react";
import { getAllHyroxBoxes } from "@/db/actions/hyroxbox";
import { getAllRegions } from "@/db/actions/region";
import { HyroxBoxCard } from "@/components/hyroxbox-card";
import { HyroxBoxSkeleton } from "@/components/hyroxbox-skeleton";
import { Search, Filter } from "lucide-react";
import { MainPageClient } from "./main-page-client";
import { Hero } from "@/components/ui/animated-hero";

type SearchParams = Promise<{
  region?: string;
  search?: string;
}>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const regionId = params.region ? Number(params.region) : undefined;
  const search = params.search || undefined;

  // Fetch data with SSR
  const [hyroxboxes, regions] = await Promise.all([
    getAllHyroxBoxes({ regionId, search }),
    getAllRegions(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <Hero /> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                필터
              </h2>

              <MainPageClient
                regions={regions}
                initialRegionId={regionId}
                initialSearch={search}
              />

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  통계
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      전체 지역
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {regions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      전체 박스
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {hyroxboxes.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <Suspense fallback={<HyroxBoxGridSkeleton />}>
              {hyroxboxes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      검색 결과가 없습니다
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                      {regionId
                        ? "선택한 지역에 등록된 HyroxBox가 없습니다."
                        : "검색 조건과 일치하는 HyroxBox가 없습니다."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {hyroxboxes.map((hyroxbox) => (
                    <HyroxBoxCard key={hyroxbox.id} hyroxbox={hyroxbox} />
                  ))}
                </div>
              )}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

function HyroxBoxGridSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <HyroxBoxSkeleton key={i} />
      ))}
    </div>
  );
}
