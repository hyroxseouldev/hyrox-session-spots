import { MapPin, Instagram, DollarSign } from "lucide-react";
import Link from "next/link";
import { HyroxBoxWithRegion } from "@/db/actions/hyroxbox";

interface HyroxBoxCardProps {
  hyroxbox: HyroxBoxWithRegion;
}

export function HyroxBoxCard({ hyroxbox }: HyroxBoxCardProps) {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {hyroxbox.name}
              </h3>
              {hyroxbox.region && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {hyroxbox.region.name}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {hyroxbox.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {hyroxbox.description}
            </p>
          )}

          {/* Details */}
          <div className="space-y-2">
            {hyroxbox.address && (
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{hyroxbox.address}</span>
              </div>
            )}

            {hyroxbox.price && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span>{hyroxbox.price.toLocaleString()}원</span>
              </div>
            )}

            {hyroxbox.instagramId && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Instagram className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`https://instagram.com/${hyroxbox.instagramId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  @{hyroxbox.instagramId}
                </a>
              </div>
            )}
          </div>

          {/* Features */}
          {hyroxbox.features && (
            <div className="flex flex-wrap gap-2">
              {hyroxbox.features.split(",").map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {feature.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {hyroxbox.naverMapUrl && (
            <Link
              href={hyroxbox.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              지도
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
