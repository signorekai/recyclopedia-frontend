import { useMotionValue, useViewportScroll } from 'framer-motion';
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useScrollDirection } from 'react-use-scroll-direction';
import { useSWRConfig } from 'swr';
import useSWRInfinite from 'swr/infinite';
import qs from 'qs';
import { debounce } from './functions';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useElementSize({ width = 0, height = 0 }) {
  const [ref, setRef] = useState(null);
  const [size, setSize] = useState({
    width,
    height,
  });

  const handleResize = useCallback(() => {
    // Set window width/height to state
    setSize({
      width: ref?.offsetWidth || 0,
      height: ref?.offsetHeight || 0,
    });
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useIsomorphicLayoutEffect(() => {
    handleResize();
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  return [setRef, size];
}

export function useWindowDimensions() {
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 390,
    height: 844,
    isDesktop: false,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isDesktop: window.innerWidth >= 1080,
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
  const scrollAmt = useRef(0);

  const debouncedScrollHandler = useCallback(
    debounce(() => {
      let scrollDirection = 'DOWN';
      if (scrollAmt.current > scrollY.get()) {
        scrollDirection = 'UP';
      }

      if (scrollDirection === 'UP' && width < 1080) {
        x.set(52);
      } else if (scrollDirection === 'DOWN') {
        x.set(0);
      }
      // set scroll
      scrollAmt.current = scrollY.get();
    }, 200),
    [width],
  );

  useEffect(() => {
    window.addEventListener('scroll', debouncedScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener('scroll', debouncedScrollHandler);
    };
  }, [debouncedScrollHandler]);

  return x;
}

export const ITEMS_PER_PAGE = 8;

export const staticPost = async (url, body, options = {}, urlParams = {}) => {
  const opts = {
    method: 'post',
    ...options,
  };

  const defaultHeaders = {
    Authorization: `Bearer ${process.env.API_KEY}`,
    'Content-Type': 'application/json',
  };

  if (opts.headers === false) {
    opts.headers = defaultHeaders;
  } else {
    opts.headers = {
      ...defaultHeaders,
      ...opts.headers,
    };
  }

  let constructedURL = url;

  if (urlParams !== {}) {
    constructedURL += `${/\?/.test(constructedURL) ? '&' : '?'}${qs.stringify(
      urlParams,
    )}`;
  }

  return fetch(constructedURL, {
    ...opts,
    body: JSON.stringify(body),
  })
    .then((r) => r.json())
    .catch(() => ({
      success: false,
    }));
};

export const staticFetcher = async (
  url,
  authKey,
  params = {},
  options = {},
) => {
  const opts = {
    method: 'get',
    ...options,
  };

  let constructedURL = url;

  if (params !== {}) {
    constructedURL += `${/\?/.test(constructedURL) ? '&' : '?'}${qs.stringify(
      params,
      {
        encodeValuesOnly: true,
      },
    )}`;
  }

  return fetch(constructedURL, {
    ...opts,
    headers: {
      Authorization: `Bearer ${authKey}`,
    },
  })
    .then((r) => r.json())
    .catch(() => ({
      success: false,
    }));
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
