import { useMotionValue, useViewportScroll } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useScrollDirection } from 'react-use-scroll-direction';

export function useWindowDimensions() {
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
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

export function useSearchBarTopValue() {
  const { scrollDirection } = useScrollDirection();
  const { scrollY } = useViewportScroll();
  const { width } = useWindowDimensions();
  const x = useMotionValue(0);

  useEffect(() => {
    if (scrollDirection === 'UP' && width < 1080) {
      x.set(52);
    } else if (scrollDirection === 'DOWN') {
      x.set(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY, scrollDirection]);

  return x;
}
