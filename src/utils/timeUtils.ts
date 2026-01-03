// Utility functions for time formatting
import Hls from "hls.js";

export const formatTime = (seconds: number): string => {
  // Đảm bảo chỉ lấy phần nguyên, loại bỏ số thập phân
  const totalSeconds = Math.floor(seconds);
  
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  // Luôn hiển thị theo định dạng hh:mm:ss
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 🎯 Format time ngắn gọn (ẩn giờ nếu = 0)
export const formatTimeCompact = (seconds: number): string => {
  const totalSeconds = Math.floor(seconds);
  
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};

export const formatProgressText = (currentTime: number, totalDuration?: number): string => {
  const current = formatTime(currentTime);
  
  if (totalDuration && totalDuration > 0) {
    const total = formatTime(totalDuration);
    return `${current} / ${total}`;
  }
  
  return current;
};

// 🎬 Hàm lấy thời lượng video từ URL (hỗ trợ cả MP4 và M3U8)
export function getVideoDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.crossOrigin = "anonymous";

    const cleanUp = () => {
      video.removeAttribute("src");
      video.load();
    };

    video.onloadedmetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        resolve(video.duration);
      } else {
        reject(new Error("Cannot get video duration"));
      }
      cleanUp();
    };

    video.onerror = () => {
      reject(new Error("Video load error"));
      cleanUp();
    };

    // Trường hợp m3u8
    if (url.endsWith(".m3u8")) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari (native HLS)
        video.src = url;
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
        });
        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // metadata sẽ được trigger sau đó
        });

        hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
          reject(new Error(`HLS Error: ${data.type}`));
          hls.destroy();
        });
      } else {
        reject(new Error("HLS not supported"));
      }
    } 
    // Trường hợp videoUrl (mp4 / embed)
    else {
      video.src = url;
    }
  });
}