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

/**
 * @typedef {Object} CardContentProp
 * @property {string} headerText
 * @property {'articles'|'resources'|'items'|'donate'|'shops'} contentType
 * @property {string} slug
 */

/**
 * @typedef {Object} MultiImgCardContentProp
 * @property {Object[]} images
 * @augments CardContentProp
 */

/**
 * @typedef {Object} SingleImgCardContentProp
 * @property {Object} image
 * @augments CardContentProp
 */

/**
 * Card for items / resources
 * @param {Object} props
 * @param {MultiImgCardContentProp|SingleImgCardContentProp} props.content
 * @param {string} [props.className=""]
 * @param {string} [props.imagesWrapperClassName="aspect-square"]
 * @param {string} [props.imgClassName=""]
 * @param {'telegram'|'facebook'|''} [props.prefixIcon]
 * @returns
 */
const Card = ({
  content = {},
  className = '',
  uniqueKey,
  imagesWrapperClassName = 'aspect-square',
  imgClassName = '',
  prefixIcon = '',
}) => {
  return (
    <LinkWrapper content={content}>
      <AnimatePresence>
        {content.hasOwnProperty('headerText') ? (
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`${className}`}>
            <div className={`${imagesWrapperClassName} relative`}>
              {prefixIcon && prefixIcon.length > 0 && (
                <img
                  alt=""
                  className="absolute top-2 left-2 z-40 h-4 md:h-10"
                  src={`/img/${prefixIcon.toLowerCase()}.svg`}
                />
              )}
              {content.images && content.images.length > 1 && (
                <CarouselProvider
                  totalSlides={content.images.length}
                  naturalSlideWidth={240}
                  naturalSlideHeight={240}>
                  <Slider classNameAnimation="transition-transform duration-200">
                    {content.images.map((image, key) => (
                      <Slide key={key} index={key} style={{ paddingBottom: 0 }}>
                        <Image
                          className={`rounded-md group-hover:scale-110 transition-transform ${imgClassName}`}
                          alt={image.alternativeText}
                          source={image}
                          width={
                            image.width > image.height
                              ? image.width
                              : image.height
                          }
                          height={
                            image.width > image.height
                              ? image.width
                              : image.height
                          }
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
                  wrapperClassName="rounded-md"
                  className="group-hover:scale-110 transition-transform"
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
            <h4 className="text-lg text-blue group-hover:text-blue-light leading-tight mt-1 mb-4 px-1">
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
