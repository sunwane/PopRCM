"use client";
import { useState } from "react";
import { EpisodesTab } from "./EpisodesTab";
import { SeriesTab } from "./SeriesTab";
import { RecommendTab } from "./RecommendTab";
import { Movie } from "@/types/Movies";
import { Series } from "@/types/Series";

export interface DetailsTabProps {
  movieInfo: Movie;
  relatedSeries?: Series[];
  recommendations?: Movie[];
}

export function DetailsTab({ movieInfo, relatedSeries = [], recommendations = [] }: DetailsTabProps) {
  const [activeTab, setActiveTab] = useState<'episodes' | 'series' | 'recommended'>('episodes');

  const tabs = [
    { id: 'episodes', label: 'Tập phim', component: EpisodesTab },
    { id: 'series', label: 'Series', component: SeriesTab },
    { id: 'recommended', label: 'Gợi ý', component: RecommendTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || EpisodesTab;

  return (
    <div className="w-full">
      {/* Tab Header */}
      <div className="flex border-b-2 border-[#343434] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-(--hover) border-b-2 border-(--hover) -mb-0.5"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab.id as 'episodes' | 'series' | 'recommended')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="text-white">
        <ActiveComponent 
          movieInfo={movieInfo}
          relatedSeries={relatedSeries}
          recommendedMovies={recommendations}
        />
      </div>
    </div>
  );
}