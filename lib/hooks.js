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

export function useScrollDrag(ref) {
  const [initMouseX, setinitMouseX] = useState(0);
  const [initScrollX, setInitScrollX] = useState(0);

  const events = {
    onMouseDown: ({ nativeEvent: e }) => {
      setinitMouseX(e.clientX);
      setInitScrollX(ref.current.scrollLeft);
    },
    onMouseMove: ({ nativeEvent: e }) => {
      if (e.buttons > 0) {
        e.preventDefault();
        ref.current.scrollTo({
          left: initScrollX + initMouseX - e.clientX,
          behavior: 'smooth',
        });
      }
    },
  };

  return events;
}
