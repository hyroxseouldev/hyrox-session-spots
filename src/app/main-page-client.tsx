"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Search, X, Check } from "lucide-react";

interface RegionWithCount {
  id: number;
  name: string;
  code: string;
  hyroxboxCount: number;
}

interface MainPageClientProps {
  regions: RegionWithCount[];
  initialRegionIds?: number[];
  initialSearch?: string;
}

export function MainPageClient({
  regions,
  initialRegionIds = [],
  initialSearch,
}: MainPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch || "");
  const [selectedRegions, setSelectedRegions] = useState<Set<number>>(
    new Set(initialRegionIds)
  );

  const updateURL = useCallback(
    (newRegions: Set<number>, newSearch: string) => {
      const params = new URLSearchParams();

      if (newRegions.size > 0) {
        params.set("regions", Array.from(newRegions).join(","));
      }

      if (newSearch.trim()) {
        params.set("search", newSearch.trim());
      }

      // Reset to page 1 when filters change
      params.delete("page");

      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : "/");
    },
    [router]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(selectedRegions, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedRegions, updateURL]);

  const toggleRegion = (regionId: number) => {
    const newSelected = new Set(selectedRegions);
    if (newSelected.has(regionId)) {
      newSelected.delete(regionId);
    } else {
      newSelected.add(regionId);
    }
    setSelectedRegions(newSelected);
  };

  const handleResetFilters = () => {
    setSelectedRegions(new Set());
    setSearch("");
    router.push("/");
  };

  const hasActiveFilters =
    selectedRegions.size > 0 || (initialSearch && initialSearch.length > 0);

  const totalBoxes = regions.reduce(
    (sum, region) => sum + region.hyroxboxCount,
    0
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          검색
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 주소, 특징 검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Region Filter with Multi-Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          지역 ({selectedRegions.size > 0 ? `${selectedRegions.size}개 선택` : "전체"})
        </label>
        <div className="space-y-2 max-h-80 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 p-2">
          {regions.map((region) => {
            const isSelected = selectedRegions.has(region.id);
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => toggleRegion(region.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 dark:border-gray-500"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="font-medium">{region.name}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {region.hyroxboxCount}개
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <button
          onClick={handleResetFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
        >
          <X className="h-4 w-4" />
          필터 초기화
        </button>
      )}

      {/* Total Stats */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">전체 박스</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalBoxes}개
          </span>
        </div>
      </div>
    </div>
  );
}
