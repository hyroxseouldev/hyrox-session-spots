import { getHyroxBoxCount } from "@/db/actions/hyroxbox";
import { getRegionCount, getRegionsWithCount } from "@/db/actions/region";
import { Box, Map, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalHyroxBoxes, totalRegions, regionsWithCount] = await Promise.all([
    getHyroxBoxCount(),
    getRegionCount(),
    getRegionsWithCount(),
  ]);

  const stats = [
    {
      name: "전체 HyroxBox",
      value: totalHyroxBoxes,
      icon: Box,
      color: "bg-blue-500",
      href: "/admin/hyroxbox",
    },
    {
      name: "전체 Region",
      value: totalRegions,
      icon: Map,
      color: "bg-green-500",
      href: "/admin/region",
    },
    {
      name: "평균 박스/지역",
      value:
        totalRegions > 0
          ? (totalHyroxBoxes / totalRegions).toFixed(1)
          : "0",
      icon: TrendingUp,
      color: "bg-purple-500",
      href: "#",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          대시보드
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          HyroxBox 관리 시스템 전체 현황
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${stat.color} p-3 rounded-lg text-white flex-shrink-0`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Region Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          지역별 HyroxBox 분포
        </h2>
        <div className="space-y-4">
          {regionsWithCount.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
              등록된 지역이 없습니다
            </p>
          ) : (
            regionsWithCount.map((region) => (
              <div
                key={region.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {region.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    코드: {region.code}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {region.hyroxboxCount}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    박스
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          빠른 작업
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/hyroxbox"
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
          >
            <Box className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                HyroxBox 관리
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                박스 추가, 수정, 삭제
              </p>
            </div>
          </Link>
          <Link
            href="/admin/region"
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
          >
            <Map className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                Region 관리
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                지역 추가, 수정, 삭제
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
