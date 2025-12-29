import { useState, useMemo } from 'react';
import { Episode } from '@/types/Movies';
import { Movie } from '@/types/Movies';
import { LoadingEffect } from '@/components/ui/LoadingEffect';

export interface PlayListProps {
  movie: Movie;
  episodes: Episode[];
  currentEpisode?: Episode;
  onEpisodeSelect: (episode: Episode, serverName?: string, movieId?: string) => void;
  loading?: boolean;
  watchedEpisodes?: Set<string>;
}

const EPISODES_PER_PAGE = 20;

export function PlayList({ movie, episodes, currentEpisode, onEpisodeSelect, loading, watchedEpisodes }: PlayListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServer, setSelectedServer] = useState('');
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);

  // Extract unique server names from episodes
  const availableServers = useMemo(() => {
    const serverSet = new Set<string>();
    episodes.forEach(episode => {
      if (episode.serverName) {
        serverSet.add(episode.serverName);
      }
    });
    return Array.from(serverSet);
  }, [episodes]);

  // Set default server
  useMemo(() => {
    if (availableServers.length > 0 && !selectedServer) {
      setSelectedServer(availableServers[0]);
    }
  }, [availableServers, selectedServer]);

  // Filter episodes by selected server
  const filteredEpisodes = useMemo(() => {
    if (!selectedServer) return episodes;
    return episodes.filter(episode => episode.serverName === selectedServer);
  }, [episodes, selectedServer]);

  // Calculate pagination based on filtered episodes
  const totalPages = Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE);
  const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
  const endIndex = startIndex + EPISODES_PER_PAGE;
  const currentEpisodes = filteredEpisodes.slice(startIndex, endIndex);

  // Generate episode ranges for display
  const getEpisodeRanges = () => {
    const ranges = [];
    for (let i = 0; i < totalPages; i++) {
      const start = i * EPISODES_PER_PAGE + 1;
      const end = Math.min((i + 1) * EPISODES_PER_PAGE, filteredEpisodes.length);
      ranges.push({ label: `${start} - ${end}`, page: i + 1 });
    }
    return ranges;
  };

  const handleServerSelect = (serverName: string) => {
    setSelectedServer(serverName);
    setCurrentPage(1); // Reset to first page when server changes
    setIsServerDropdownOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEpisodeSelect = (episode: Episode) => {
    onEpisodeSelect(episode, selectedServer, movie.id);
  };

  return (
    <div className="bg-(--background) rounded-lg border-2 border-(--surface-divine) min-h-[400px] max-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="bg-[#141B2D] p-4 rounded-t-lg border-b-2 border-(--surface-divine)">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Danh sách phát</h3>
            <p className="text-gray-400 text-sm">Phần {movie.seasonNumber || 1}</p>
          </div>
          
          {/* Server Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsServerDropdownOpen(!isServerDropdownOpen)}
              className="flex items-center gap-2 bg-(--background) border-2 border-(--border-blue) rounded-lg px-3 py-2 text-white hover:bg-(--hover) transition-colors"
            >
              <span className="text-sm font-medium">{selectedServer || 'Chọn server'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isServerDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isServerDropdownOpen && availableServers.length > 0 && (
              <div className="absolute top-full right-0 mt-1 bg-(--background) border-2 border-(--border-blue) rounded-lg shadow-lg z-10 min-w-[120px]">
                {availableServers.map((serverName) => (
                  <button
                    key={serverName}
                    onClick={() => handleServerSelect(serverName)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-(--surface)/80 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedServer === serverName ? 'bg-(--surface) text-blue-400' : 'text-white'
                    }`}
                  >
                    {serverName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom Episode Range Pagination */}
        {totalPages > 1 && (
          <div className="overflow-x-auto no-scrollbar mt-2">
            <div className="flex gap-2 min-w-max">
              {getEpisodeRanges().map((rangeObj) => (
                <button
                  key={rangeObj.page}
                  onClick={() => handlePageChange(rangeObj.page)}
                  className={`px-3 py-1 text-sm rounded-md border transition-colors whitespace-nowrap ${
                    currentPage === rangeObj.page
                      ? 'bg-(--primary)/40 border-2 border-(--border-blue) text-white'
                      : 'bg-white/15 border-none'
                  }`}
                >
                  {rangeObj.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Episodes Grid */}
      <div className="overflow-y-auto no-scrollbar max-h-[calc(100vh-330px)] rounded-b-lg">
        {loading ? (
          <LoadingEffect message="Đang tải danh sách tập..." />
        ) : (
          <div className="flex flex-col">
          {currentEpisodes.map((episode) => {
            const isCurrentEpisode = currentEpisode?.id === episode.id;
            const isWatched = watchedEpisodes?.has(episode.id) || false;
            
            return (
              <button
                key={episode.id}
                onClick={() => handleEpisodeSelect(episode)}
                className={`px-4 py-3 flex items-center text-sm font-medium gap-3 hover:bg-white/10 relative ${
                  isCurrentEpisode
                    ? 'bg-(--hover)/25'
                    : isWatched
                    ? 'bg-gray-800/60 text-gray-400' // Darker background for watched episodes
                    : 'bg-(--background) border-(--border-blue) text-gray-300 hover:border-blue-400 hover:text-white'
                }`}
              >
                {/* Watched indicator */}
                {isWatched && !isCurrentEpisode && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
                
                <img
                  src={movie.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                  alt={`Tập ${episode.episodeNumber}`}
                  className={`h-14 aspect-video object-cover rounded-sm ${
                    isWatched && !isCurrentEpisode ? 'opacity-60' : ''
                  }`}
                />
                <div className="flex flex-col text-left pr-2">
                  <div className={isWatched && !isCurrentEpisode ? 'text-gray-500' : ''}>
                    Tập {episode.episodeNumber}
                  </div>
                  <div className={`line-clamp-1 max-w-[250px] ${
                    isWatched && !isCurrentEpisode 
                      ? 'text-gray-500' 
                      : 'text-gray-400'
                  }`}>
                    {episode.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
