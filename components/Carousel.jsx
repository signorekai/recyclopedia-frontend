import { useMotionValue } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useScrollDrag, useWindowDimensions } from '../lib/hooks';

export const CarouselCard = ({ children, className = '' }) => {
  return (
    <article className={`basic-carousel__card ${className}`}>
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
  mobileSlideSize = 75,
  desktopSlideSize = 25,
  slideSizeUnit = 'vw',
  autoScroll = true,
  scrollTo = 0,
}) => {
  const carouselRef = useRef(null);
  const slidesContainer = useRef(null);
  const { width } = useWindowDimensions();
  const events = useScrollDrag(carouselRef, autoScroll);

  // const scrollLeft = useMotionValue(scrollTo);
  const style = {};

  if (!autoSlideSize) {
    style['width'] = `${
      children.length * (width > 1080 ? desktopSlideSize : mobileSlideSize)
    }${slideSizeUnit}`;
  }

  useEffect(() => {
    console.log(scrollTo);
    carouselRef.current.scrollTo({
      left: scrollTo,
      behavior: 'smooth',
    });
  }, [scrollTo, slidesContainer]);

  return (
    <div
      ref={carouselRef}
      {...events}
      className={`basic-carousel ${
        snapToChild && 'snap-x snap-mandatory'
      } ${className}`}>
      <div
        ref={slidesContainer}
        className={`basic-carousel__slider ${sliderClassName}`}
        style={style}>
        {children}
      </div>
    </div>
  );
};
