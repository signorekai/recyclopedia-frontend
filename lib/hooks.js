import { useState, useEffect, useCallback } from 'react';

export function useWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';
  const getWindowDimensions = useCallback(() => {
    if (hasWindow) {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height,
      };
    } else {
      return { width: 0, height: 0 };
    }
  }, [hasWindow]);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getWindowDimensions, hasWindow]);

  return windowDimensions;
}
