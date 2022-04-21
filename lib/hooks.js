import { useMotionValue, useViewportScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useScrollDirection } from 'react-use-scroll-direction';
import { useSWRConfig } from 'swr';
import useSWRInfinite from 'swr/infinite';
import qs from 'qs';

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

export function useScrollDrag(ref, autoScroll) {
  const [initMouseX, setinitMouseX] = useState(0);
  const { width } = useWindowDimensions();
  const [initScrollX, setInitScrollX] = useState(0);

  const events = {
    onMouseDown: ({ nativeEvent: e }) => {
      if (width > 1080) {
        setinitMouseX(e.clientX);
        setInitScrollX(ref.current.scrollLeft);
      }
    },
    onMouseMove: ({ nativeEvent: e }) => {
      if (e.buttons > 0 && width > 1080) {
        e.preventDefault();
        if (autoScroll) {
          ref.current.scrollTo({
            left: initScrollX + initMouseX - e.clientX,
            behavior: 'smooth',
          });
        }
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

export const ITEMS_PER_PAGE = 4;

export const staticFetcher = (url, authKey, params = {}) => {
  let constructedURL = url;

  if (params !== {}) {
    constructedURL += `${/\?/.test(constructedURL) ? '&' : '?'}${qs.stringify(
      params,
    )}`;
  }

  return fetch(constructedURL, {
    headers: {
      Authorization: `Bearer ${authKey}`,
    },
  }).then((r) => r.json());
};

export const SWRFetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((res) => res.data);

export function useFetchContent(contentType = 'items', strapiParams = {}) {
  const [isFinished, setIsFinished] = useState(false);
  const { fallback } = useSWRConfig();

  const query = qs.stringify({
    populate: ['images'],
    page: 0,
    pageSize: ITEMS_PER_PAGE,
    ...strapiParams,
  });
  const initialAPIUrl = `/api/${contentType}?${query}`;

  const { data, size, setSize, error } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && previousPageData.length !== ITEMS_PER_PAGE) {
        return null;
      }
      const query = qs.stringify({
        populate: ['images'],
        page: pageIndex,
        pageSize: ITEMS_PER_PAGE,
        ...strapiParams,
      });
      return `/api/${contentType}?${query}`;
    },
    SWRFetcher,
    {
      persistSize: true,
      fallbackData: fallback[initialAPIUrl],
    },
  );

  const loadNext = () => {
    setSize(size + 1);
  };

  useEffect(() => {
    const isEmpty = data?.[0]?.length === 0;
    if (isEmpty || (data && data[data.length - 1]?.length < ITEMS_PER_PAGE)) {
      setIsFinished(true);
    }
  }, [data]);

  return { data, size, loadNext, isFinished, error };
}
