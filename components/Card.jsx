import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import ContentLoader from 'react-content-loader';

import Link from './Link';
import Image from './Image';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';

const variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
  },
};

const LinkWrapper = ({ children, content }) => {
  return (
    <>
      {content.hasOwnProperty('slug') &&
      content.hasOwnProperty('contentType') ? (
        <Link href={`/${content.contentType}/${content.slug}`} passHref>
          <a className="origin-center duration-200 transition-all hover:opacity-100 group">
            {children}
          </a>
        </Link>
      ) : (
        children
      )}
    </>
  );
};

const Card = ({
  content = {},
  className = '',
  uniqueKey,
  imgClassName = 'aspect-square',
}) => {
  return (
    <LinkWrapper content={content}>
      <AnimatePresence>
        {content.hasOwnProperty('headerText') ? (
          <motion.div
            variants={variants}
            initial="intial"
            animate="animate"
            exit="exit"
            className={`${className}`}>
            <div className={imgClassName}>
              {content.images && content.images.length > 1 && (
                <CarouselProvider
                  totalSlides={content.images.length}
                  naturalSlideWidth={100}
                  naturalSlideHeight={100}>
                  <Slider classNameAnimation="transition-transform duration-200">
                    {content.images.map((image, key) => (
                      <Slide key={key} index={key} style={{ paddingBottom: 0 }}>
                        <Image
                          className="rounded-md group-hover:scale-110 transition-transform"
                          alt={image.alternativeText}
                          source={image}
                          width={image.width}
                          height={image.width}
                        />
                      </Slide>
                    ))}
                  </Slider>
                  <DotGroup className="z-30" />
                </CarouselProvider>
              )}
              {((typeof content.images === 'undefined' &&
                content.image.hasOwnProperty('url')) ||
                (content.images && content.images.length === 1)) && (
                <Image
                  className="rounded-md group-hover:scale-110 transition-transform"
                  source={content.images ? content.images[0] : content.image}
                  alt={`Photo of ${content.headerText}`}
                />
              )}
              {typeof content.images === 'undefined' &&
                !content.image.hasOwnProperty('url') && (
                  <div className="w-full h-full bg-grey-light rounded-md"></div>
                )}
            </div>
            {content.hasOwnProperty('subHeaderText') && (
              <h6 className="tag">{content.subHeaderText}</h6>
            )}
            <h4 className="text-lg text-blue group-hover:text-blue-light leading-tight mt-2 px-1">
              {content.headerText}
            </h4>
          </motion.div>
        ) : (
          <motion.div
            variants={variants}
            initial="intial"
            animate="animate"
            exit="exit">
            <ContentLoader
              speed={2}
              width={163}
              height={207}
              uniqueKey={uniqueKey}
              className={className}
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb">
              <rect x="0" y="0" rx="4" ry="4" width="100%" height="163" />
              <rect x="0" y="172" rx="4" ry="4" width="138" height="15" />
              <rect x="0" y="192" rx="4" ry="4" width="119" height="15" />
            </ContentLoader>
          </motion.div>
        )}
      </AnimatePresence>
    </LinkWrapper>
  );
};

export default Card;
