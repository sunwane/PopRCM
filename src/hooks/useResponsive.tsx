import { useState, useEffect } from "react";

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateScreenType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1440);
      setIsDesktop(width >= 1440);
    };

    // Update screen type on load and resize
    updateScreenType();
    window.addEventListener("resize", updateScreenType);

    return () => {
      window.removeEventListener("resize", updateScreenType);
    };
  }, []);

  return { isMobile, isTablet, isDesktop };
}