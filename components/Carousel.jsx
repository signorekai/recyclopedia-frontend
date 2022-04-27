import { useRef, useEffect, useState } from 'react';
import {
  useElementDimensions,
  useScrollDrag,
  useWindowDimensions,
} from '../lib/hooks';
import { motion, useElementScroll, useMotionValue } from 'framer-motion';

export const CarouselCard = ({ children, className = '', style = {} }) => {
  return (
    <article style={style} className={`basic-carousel__card ${className}`}>
      {children}
    </article>
  );
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
  const { scrollXProgress } = useElementScroll(carouselRef);
  const { width } = useWindowDimensions();
  const [showPreviousBtn, setShowPreviousBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(true);

  let scrollAmount =
    slideWidth === 0 ? carouselRef.current?.offsetWidth : slideWidth;

  if (!autoSlideSize) {
    if (slideWidth === 0) {
      sliderStyle['width'] = `${children.length * 100}%`;
    } else {
      sliderStyle['width'] = `${children.length * slideWidth}px`;
    }
  }

  const _checkButtons = () => {
    if (
      carouselRef.current &&
      carouselRef.current.offsetWidth < scrollAmount * children.length
    ) {
      setShowNextBtn(false);
      setShowPreviousBtn(false);
    }
  };

  const _handleScrollBtn = (direction = -1) => {
    _checkButtons();
    carouselRef.current.scrollBy({
      left: scrollAmount * direction * 2,
      behavior: 'smooth',
    });
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
  }, [disableScroll, scrollTo, carouselRef]);

  useEffect(() => {
    const unsubscribeX = scrollXProgress.onChange((value) => {
      if (
        carouselRef.current.offsetWidth < slidesContainerRef.current.offsetWidth
      ) {
        if (value > 0 && value < 0.95) {
          setShowPreviousBtn(true);
          setShowNextBtn(true);
        } else if (value >= 0.95) {
          setShowNextBtn(false);
        } else if (value === 0) {
          setShowPreviousBtn(false);
        }
      } else {
        setShowNextBtn(false);
        setShowPreviousBtn(false);
      }
    });

    _checkButtons();

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
