import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Children,
} from 'react';
import {
  motion,
  useElementScroll,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion';

import { useWindowDimensions } from '../lib/hooks';

import { debounce } from '../lib/functions';

export const CarouselCard = ({
  children,
  wrapperClassName = '',
  className = '',
  style = {},
  featured = false,
}) => {
  if (featured) {
    return (
      <article
        className={`basic-carousel__card-wrapper snap-start ${wrapperClassName}`}>
        <div style={style} className={`basic-carousel__card ${className}`}>
          {children}
        </div>
        <div className="basic-carousel__card-highlight animate-featured"></div>
      </article>
    );
  } else {
    return (
      <article
        style={style}
        className={`basic-carousel__card snap-start ${className}`}>
        {children}
      </article>
    );
  }
};

// https://codesandbox.io/s/z22v9qj5rx?file=%2Fsrc%2Findex.js%3A493-506

/**
 *  Carousel component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.sliderClassName]
 * @param {number} [props.slideWidth=0]
 * @param {number} [props.scrollTo=0]
 * @param {boolean} [props.snapToChild=true]
 * @param {boolean} [props.desktopControls=true]
 * @param {boolean} [props.autoSlideSize=false]
 * @param {boolean} [props.disableScroll=false]
 * @param {string} [props.prevBtnClassName]
 * @param {string} [props.nextBtnClassName]
 * @param {JSX.ElementType} [props.children]
 * @returns {React.ReactElement}
 */
export const Carousel = ({
  children,
  className = '',
  snapToChild = true,
  sliderClassName = '',
  slideWidth = 0,
  autoSlideSize = false,
  scrollTo = 0,
  buttonOffset = 0,
  disableScroll = false,
  sliderStyle = {},
  desktopControls = true,
  prevBtnClassName = '',
  nextBtnClassName = '',
}) => {
  const transformX = useMotionValue(scrollTo);
  const carouselRef = useRef(null);
  const slidesContainerRef = useRef(null);
  const { scrollXProgress, scrollX } = useElementScroll(carouselRef);
  const { width } = useWindowDimensions();
  const [showPreviousBtn, setShowPreviousBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(true);

  let scrollAmount =
    slideWidth === 0 ? carouselRef.current?.offsetWidth * 0.5 : slideWidth + 8;
  const childrenCount = Children.count(children);

  if (!autoSlideSize) {
    if (slideWidth === 0) {
      sliderStyle['width'] = `${childrenCount * 100}%`;
    } else {
      sliderStyle['width'] = `${
        childrenCount * slideWidth + (childrenCount - 1) * 16
      }px`;
    }
  }

  const _checkButtons = useCallback(() => {
    if (
      carouselRef.current.offsetWidth >= slidesContainerRef.current.scrollWidth
    ) {
      setShowNextBtn(false);
      setShowPreviousBtn(false);
    } else {
      setShowNextBtn(true);
    }
  }, [carouselRef, slidesContainerRef]);

  const _handleScrollBtn = (direction = -1) => {
    carouselRef.current.scrollBy({
      left: scrollAmount * 1.1 * direction,
      behavior: 'smooth',
    });

    _checkButtons();
  };

  useEffect(() => {
    if (disableScroll) {
      transformX.set(scrollTo * -1);
    } else {
      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableScroll, scrollTo, carouselRef, children]);

  useEffect(() => {
    _checkButtons();
  }, [_checkButtons, carouselRef, slidesContainerRef]);

  useEffect(() => {
    const debouncedFunction = debounce((scroll) => {
      const progress = scrollXProgress.get();

      if (progress >= 0.95) {
        setShowNextBtn(false);
      } else {
        setShowNextBtn(true);
      }

      if (scroll > 20) {
        setShowPreviousBtn(true);
      } else {
        setShowPreviousBtn(false);
      }
    }, 100);

    const unsubscribeX = scrollX.onChange(debouncedFunction);

    return () => {
      unsubscribeX();
    };
  }, [carouselRef, slidesContainerRef]);

  return (
    <div className="relative">
      <AnimatePresence initial={false}>
        {desktopControls && showPreviousBtn && (
          <motion.button
            transition={{ ease: 'easeInOut', duration: 0.15 }}
            initial={{
              x: '-100%',
            }}
            animate={{
              x: '0%',
            }}
            exit={{
              x: '-100%',
            }}
            onClick={() => _handleScrollBtn()}
            className={`basic-carousel__control basic-carousel__control--prev group ${
              buttonOffset === 0 && 'items-center'
            } ${prevBtnClassName}`}></motion.button>
        )}
      </AnimatePresence>
      <div
        ref={carouselRef}
        className={`basic-carousel ${
          snapToChild && 'snap-x snap-mandatory scroll-px-1'
        } ${className} ${disableScroll ? 'overflow-hidden' : ''}`}>
        <motion.div
          style={{
            ...sliderStyle,
            x: disableScroll ? transformX : 0,
          }}
          ref={slidesContainerRef}
          className={`basic-carousel__slider transition-transform duration-200 ${sliderClassName}`}>
          {children}
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {desktopControls && showNextBtn && (
          <motion.button
            transition={{ ease: 'easeInOut', duration: 0.15 }}
            initial={{
              x: '100%',
            }}
            animate={{
              x: '0%',
            }}
            exit={{
              x: '100%',
            }}
            onClick={() => _handleScrollBtn(1)}
            className={`basic-carousel__control basic-carousel__control--next group ${
              buttonOffset === 0 && 'items-center'
            } ${nextBtnClassName}`}></motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
