"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";

interface MainPageClientProps {
  regions: Array<{ id: number; name: string; code: string }>;
  initialRegionId?: number;
  initialSearch?: string;
}

export function MainPageClient({
  regions,
  initialRegionId,
  initialSearch,
}: MainPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch || "");
  const [selectedRegion, setSelectedRegion] = useState<string>(
    initialRegionId?.toString() || "all"
  );

  const updateURL = useCallback(
    (newRegion: string, newSearch: string) => {
      const params = new URLSearchParams(searchParams?.toString());

      if (newRegion && newRegion !== "all") {
        params.set("region", newRegion);
      } else {
        params.delete("region");
      }

      if (newSearch.trim()) {
        params.set("search", newSearch.trim());
      } else {
        params.delete("search");
      }

      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : "/");
    },
    [router, searchParams]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(selectedRegion, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedRegion, updateURL]);

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    updateURL(value, search);
  };

  const handleResetFilters = () => {
    setSelectedRegion("all");
    setSearch("");
    router.push("/");
  };

  const hasActiveFilters =
    selectedRegion !== "all" || (initialSearch && initialSearch.length > 0);

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

      {/* Region Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          지역
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">전체 지역</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
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
    </div>
  );
}
