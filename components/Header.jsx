import { useCallback, useEffect, useRef } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimation,
  useViewportScroll,
} from 'framer-motion';

import { debounce } from '../lib/functions';
import { useWindowDimensions } from '../lib/hooks';
import { useRouter } from 'next/router';

/**
 *
 * @param {boolean} [showHeaderInitially] Should component be shown initially
 * @param {('UP'|'DOWN'|'')} [showHeaderOn="UP"] Scroll direction to trigger component display
 * @param {('UP'|'DOWN'|'')} [hideHeaderOn='DOWN'] Scroll direction to trigger component hiding
 * @returns
 */
export default function Header({
  containerStyle = {},
  showHeaderInitially = true,
  showHeaderOn = 'UP',
  hideHeaderOn = 'DOWN',
  children,
}) {
  const { width } = useWindowDimensions();
  const { scrollY, scrollYProgress } = useViewportScroll();
  const scrollAmt = useRef(0);

  const spacerRef = useRef(false);
  const spacerAnimControl = useAnimation();

  const headerRef = useRef(false);
  const headerAnimControl = useAnimation();

  const containerRef = useRef(false);
  const containerAnimControl = useAnimation();
  const router = useRouter();

  const debouncedScrollHandler = useCallback(
    debounce(() => {
      if (
        window &&
        router.asPath === window.location.pathname &&
        containerRef.current !== 'null' &&
        width < 1080
      ) {
        let scrollDirection = 'DOWN';
        if (scrollAmt.current > scrollY.get()) {
          scrollDirection = 'UP';
        }

        if (scrollY.get() > containerRef.current?.offsetHeight) {
          containerAnimControl.set('default');
        } else {
          containerAnimControl.set('relative');
        }

        if (scrollDirection === showHeaderOn || scrollYProgress.get() === 1) {
          headerAnimControl.start('show');
        } else if (
          scrollDirection === hideHeaderOn &&
          scrollY.get() > containerRef.current?.offsetHeight
        ) {
          headerAnimControl.start('hide');
        }

        // set scroll
        scrollAmt.current = scrollY.get();
      }
    }, 200),
    [headerRef, width, containerRef],
  );

  useEffect(() => {
    headerAnimControl.set(showHeaderInitially ? 'show' : 'hide');
    spacerAnimControl.set({
      height: headerRef.current.offsetHeight,
    });

    if (width > 1080) {
      headerAnimControl.set('desktop');
      containerAnimControl.set('default');
    }

    if (window) {
      window.addEventListener('scroll', debouncedScrollHandler, {
        passive: true,
      });
      return () => {
        window.removeEventListener('scroll', debouncedScrollHandler);
      };
    }
  }, [
    containerAnimControl,
    debouncedScrollHandler,
    headerAnimControl,
    showHeaderInitially,
    spacerAnimControl,
    width,
  ]);

  return (
    <motion.div
      ref={containerRef}
      variants={{
        default: {
          position: 'inherit',
        },
        relative: {
          position: 'relative',
        },
        fixed: {
          position: 'fixed',
        },
      }}
      animate={containerAnimControl}
      style={{ position: 'relative', ...containerStyle }}>
      <motion.div ref={spacerRef} className="h-[52px] lg:h-[56px]" />
      <motion.header
        ref={headerRef}
        variants={{
          show: { y: '0' },
          hide: { y: '-120%' },
          desktop: { position: 'fixed', top: 0 },
        }}
        style={{
          y: showHeaderInitially ? 0 : '-100%',
          position: 'fixed',
        }}
        animate={headerAnimControl}
        className="header top-0">
        {children}
      </motion.header>
    </motion.div>
  );
}
