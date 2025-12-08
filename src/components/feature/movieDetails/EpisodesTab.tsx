import { LoadingEffect } from "@/components/ui/LoadingEffect";
import { Movie, Episode } from "@/types/Movies";
import { Series } from "@/types/Series";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface EpisodesTabProps {
  movieInfo: Movie;
  seriesInfo?: Series;
  loading?: boolean;
}

export function EpisodesTab({ movieInfo, seriesInfo, loading }: EpisodesTabProps) {  
  // State cho server được chọn
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [hoveredEpisodeId, setHoveredEpisodeId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Lấy danh sách server names duy nhất từ episodes
  const serverNames = useMemo(() => {
    if (!movieInfo.episodes || movieInfo.episodes.length === 0) return [];
    
    const uniqueServers = [...new Set(movieInfo.episodes.map(ep => ep.serverName))];
    return uniqueServers.filter(Boolean); // Loại bỏ server name rỗng
  }, [movieInfo.episodes]);

  // Set server đầu tiên làm default nếu chưa chọn
  useEffect(() => {
    if (serverNames.length > 0 && !selectedServer) {
      setSelectedServer(serverNames[0]);
    }
  }, [serverNames, selectedServer]);

  // Lọc episodes theo server được chọn
  const filteredEpisodes = useMemo(() => {
    if (!movieInfo.episodes || !selectedServer) return [];
    
    return movieInfo.episodes
      .filter(ep => ep.serverName === selectedServer)
      .sort((a, b) => a.episodeNumber - b.episodeNumber);
  }, [movieInfo.episodes, selectedServer]);

  if (loading) {
    return <LoadingEffect message="Đang tải tập phim..." />;
  }

  return (
    <div className="space-y-4">
      {/* Series Part */}
      {seriesInfo && (
        <div>
          <div className="lg:text-lg md:text-[16px] sm:text-sm text-sm flex gap-1.5 items-center font-light">
            Loạt series: 
            <a href={`/allSeries/${seriesInfo.id}`} className="font-bold text-(--primary)">{seriesInfo.name}</a>
          </div>
          <div className="mt-3 relative">
            <img src={seriesInfo.posterUrl} alt={seriesInfo.name} 
            className="lg:max-h-128 md:max-h-96 sm:max-h-72 max-h-60 w-full object-cover rounded-xl" />
            <div className="absolute inset-0 bottom-0 left-0 bg-linear-to-t from-(--background) to-transparent rounded-b-xl"></div>
            <div className="absolute bottom-4 left-4 lg:text-xl md:text-lg sm:text-sm text-sm font-semibold">
              {seriesInfo.movieCount} phần
              <div className="flex items-center text-(--hover) font-medium lg:text-sm md:text-xs sm:text-xs text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block lg:w-4 lg:h-4 md:w-3 md:h-3 sm:w-3 sm:h-3 w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                  <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
                <div>Mẹo: Thay đổi giá trị dropdown bên dưới để chuyển tiếp linh hoạt giữa các phần</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Episodes Part */}
      <div>
        {/* Header với season info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1.5 relative">
            <img src="/icons/Part.png" alt="part" className="h-4 w-6" />
            {movieInfo.seasonNumber ? (
              <>
                <button
                  className="flex items-center space-x-2"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <div className="font-bold text-lg">Phần {movieInfo.seasonNumber}</div>
                  <img src="/icons/Down.png" alt="dropdown" className="h-2 w-3" />
                </button>
                {showDropdown && seriesInfo && (
                  <div className="absolute left-0 top-full mt-2 bg-(--surface) rounded-lg shadow-lg z-20 min-w-[120px]">
                    {seriesInfo.movies?.map((partMovie, idx, arr) => (
                      <button
                        key={partMovie.id}
                        className={`block w-full text-left px-4 py-2 hover:bg-(--primary) text-white
                          ${idx === 0 ? "rounded-t-lg" : ""}
                          ${idx === arr.length - 1 ? "rounded-b-lg" : ""}
                        `}
                        onClick={() => {
                          setShowDropdown(false);
                          if (partMovie.id !== movieInfo.id){
                            router.push(`/movie/${partMovie.id}`);
                          }
                        }}
                      >
                        Phần {partMovie.seasonNumber}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="font-bold text-lg ml-0.5">Phần 1</div>
            )}
          </div>
          <div className="text-gray-500 font-light text-xl">|</div>
          {/* Server Tabs */}
          {serverNames.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex flex-wrap gap-2">
                {serverNames.map((serverName) => (
                  <button
                    key={serverName}
                    onClick={() => setSelectedServer(serverName)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedServer === serverName
                        ? 'border-2 border-white/70 text-white shadow-lg'
                        : 'hover:text-white text-white/70'
                    }`}
                  >
                    {selectedServer === "Phụ đề" && (
                      <div>
                        <img src="/icons/CC.png" alt="subtitles" className="inline-block h-4 w-4 mr-2" />
                      </div>
                    )}
                    {selectedServer === "Thuyết minh" && (
                      <div>
                        <img src="/icons/Audio.png" alt="audio" className="inline-block h-4 w-4 mr-2" />
                      </div>
                    )}
                    {selectedServer === "Lồng tiếng" && (
                      <div>
                        <img src="/icons/Wave.png" alt="Dub" className="inline-block h-4 w-4 mr-2" />
                      </div>
                    )}
                    <div>{serverName}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Episodes Grid */}
        {filteredEpisodes.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {filteredEpisodes.map((episode) => (
              <button
                key={episode.id}
                className="bg-gray-700 hover:bg-(--hover) rounded-lg py-3 px-4 text-center transition-all duration-200 hover:shadow-lg text-white hover:text-black"
                onMouseEnter={() => setHoveredEpisodeId(episode.id)}
                onMouseLeave={() => setHoveredEpisodeId(null)}
                onClick={() => {
                  // TODO: Handle episode click - navigate to watch page
                  console.log('Play episode:', episode);
                }}
              >
                <div className="flex justify-center items-center space-x-2">
                  <img src={hoveredEpisodeId === episode.id ? "/icons/Play.png" : "/icons/PlayWhite.png"} alt="Play" className="h-3 w-3" />
                  <span className="lg:text-sm md:text-sm font-semibold text-xs">
                    Tập {episode.episodeNumber}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-dashed border-2 border-gray-700 rounded-lg">
            <div className="text-gray-400 text-sm">
              {serverNames.length === 0 
                ? "Không có tập phim nào được tìm thấy"
                : `Không có tập nào cho máy chủ "${selectedServer}"`
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
