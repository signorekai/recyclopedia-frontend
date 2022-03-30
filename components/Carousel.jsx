import { useRef } from 'react';
import { useScrollDrag, useWindowDimensions } from '../lib/hooks';

export const CarouselCard = ({ children, className = '' }) => {
  return (
    <article className={`carousel__card ${className}`}>{children}</article>
  );
};

// https://codesandbox.io/s/z22v9qj5rx?file=%2Fsrc%2Findex.js%3A493-506

export const Carousel = ({ children, className = '' }) => {
  const carouselRef = useRef(null);
  const slidesContainer = useRef(null);
  const { width } = useWindowDimensions();
  const events = useScrollDrag(carouselRef);

  return (
    <div ref={carouselRef} {...events} className={`carousel ${className}`}>
      <div
        ref={slidesContainer}
        className="carousel__slider"
        style={{
          width: `${children.length * (width > 1080 ? 25 : 75)}vw`,
        }}>
        {children}
      </div>
    </div>
  );
};
