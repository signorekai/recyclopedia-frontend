import { useRef, useEffect, Children, cloneElement } from 'react';
import { useScrollDrag, useWindowDimensions } from '../lib/hooks';
import { motion, useMotionValue } from 'framer-motion';

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
  autoSlideSize = false,
  autoScroll = true,
  scrollTo = 0,
  disableScroll = false,
  sliderStyle = {},
}) => {
  const transformX = useMotionValue(scrollTo);
  const carouselRef = useRef(null);
  const slidesContainer = useRef(null);
  const { onMouseDown, onMouseMove } = useScrollDrag(carouselRef, autoScroll);

  if (!autoSlideSize) {
    sliderStyle['width'] = `${children.length * 100}%`;
  }

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

  return (
    <div
      ref={carouselRef}
      onMouseDown={disableScroll ? () => {} : onMouseDown}
      onMouseMove={disableScroll ? () => {} : onMouseMove}
      className={`basic-carousel ${
        snapToChild && 'snap-x snap-mandatory'
      } ${className} ${disableScroll ? 'overflow-hidden' : ''}`}>
      <motion.div
        style={{
          ...sliderStyle,
          x: disableScroll ? transformX : 0,
        }}
        ref={slidesContainer}
        className={`basic-carousel__slider transition-transform duration-200 ${sliderClassName}`}>
        {children}
      </motion.div>
    </div>
  );
};
