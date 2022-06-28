import { useRef, useEffect, useState, useCallback, Children } from 'react';
import { motion, useElementScroll, useMotionValue } from 'framer-motion';

import {
  useElementDimensions,
  useScrollDrag,
  useWindowDimensions,
} from '../lib/hooks';

import { debounce } from '../lib/functions';

export const CarouselCard = ({
  children,
  wrapperClassName = '',
  className = '',
  style = {},
  featured,
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

export const Carousel = ({
  children,
  className = '',
  snapToChild = true,
  sliderClassName = '',
  slideWidth = 0,
  autoSlideSize = false,
  scrollTo = 0,
  disableScroll = false,
  sliderStyle = {},
  desktopControls = true,
}) => {
  const transformX = useMotionValue(scrollTo);
  const carouselRef = useRef(null);
  const slidesContainerRef = useRef(null);
  const { scrollXProgress, scrollX } = useElementScroll(carouselRef);
  const { width } = useWindowDimensions();
  const [showPreviousBtn, setShowPreviousBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(true);

  let scrollAmount =
    slideWidth === 0 ? carouselRef.current?.offsetWidth : slideWidth + 8;

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
      carouselRef.current.offsetWidth >= slidesContainerRef.current.offsetWidth
    ) {
      setShowNextBtn(false);
      setShowPreviousBtn(false);
    } else {
      setShowNextBtn(true);
    }
  }, [carouselRef, slidesContainerRef]);

  const _handleScrollBtn = (direction = -1) => {
    carouselRef.current.scrollBy({
      left: scrollAmount * direction * 2,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (disableScroll) {
      transformX.set(scrollTo * -1);
    } else {
      console.log(scrollTo);
      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableScroll, scrollTo, carouselRef]);

  useEffect(() => {
    _checkButtons();
  }, [_checkButtons, carouselRef, slidesContainerRef, slideWidth]);

  useEffect(() => {
    const debouncedFunction = debounce((scroll) => {
      const progress = scrollXProgress.get();
      const carouselWidth = carouselRef.current.offsetWidth;

      if (progress >= 0.95) {
        setShowNextBtn(false);
      }

      if (scroll > 20) {
        setShowPreviousBtn(true);
      } else {
        setShowPreviousBtn(false);
      }

      if (progress <= 0.05) {
        setShowNextBtn(true);
      }
    }, 100);

    const unsubscribeX = scrollX.onChange(debouncedFunction);

    return () => {
      unsubscribeX();
    };
  }, [carouselRef, slidesContainerRef]);

  return (
    <div className="relative">
      {desktopControls && width > 1080 && showPreviousBtn && (
        <button
          onClick={() => _handleScrollBtn()}
          className="basic-carousel__control basic-carousel__control--prev"></button>
      )}
      <div
        ref={carouselRef}
        className={`basic-carousel ${
          snapToChild && 'snap-x snap-mandatory'
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
      {desktopControls && showNextBtn && width > 1080 && (
        <button
          onClick={() => _handleScrollBtn(1)}
          className="basic-carousel__control basic-carousel__control--next"></button>
      )}
    </div>
  );
};
