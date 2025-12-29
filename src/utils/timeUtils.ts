// Utility functions for time formatting

export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
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