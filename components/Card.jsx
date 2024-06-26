import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import ContentLoader from 'react-content-loader';

import Link from './Link';
import StrapiImage from './StrapiImage';
import NextImage from 'next/image';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import { replaceCDNUri } from '../lib/functions';

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

const PrefixIcon = ({ type }) => {
  const icon = type.toLowerCase();

  return (
    <>
      {icon && icon.length > 0 && icon !== 'sponsored' && icon !== 'none' && (
        <img
          alt=""
          className="absolute top-2 left-2 z-40 h-8 md:h-10"
          src={`/img/${icon + '.svg'}`}
        />
      )}
      {icon && icon.length > 0 && icon === 'sponsored' && (
        <div className="z-10 py-1 px-2 rounded-md tracking-2 absolute top-2 left-2 bg-grey-dark bg-opacity-70 text-white font-archivo font-bold text-xs uppercase">
          SPONSORED
        </div>
      )}
    </>
  );
};

const LinkWrapper = ({ children, content }) => {
  return (
    <>
      {content.hasOwnProperty('slug') &&
      content.hasOwnProperty('contentType') ? (
        <Link href={`/${content.contentType}/${content.slug}`} passHref>
          <a className="origin-center duration-200 transition-all hover:opacity-100 group no-underline">
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
 * @property {'articles'|'resources'|'items'|'freecycling'|'shops'} contentType
 * @property {string} slug
 */

/**
 * @typedef {Object} CoverPropProperties
 * @property {import('./StrapiImage').StrapiImage[]} images
 * @property {number} [showImages]
 * @property {(import('./StrapiImage').MinBreakpointImageSize|import('./StrapiImage').MaxBreakpointImageSize|import('./StrapiImage').MinImageSize|import('./StrapiImage').MaxImageSize|import('./StrapiImage').DefaultImageSize|string)[]} [sizes]
 * @property {"eager"|"lazy"} [loading]
 * @property {"responsive"|"fill"|"fixed"} [layout="fill"]
 * @property {string} [className]
 * @property {number} [width]
 * @property {number} [height]
 */

/**
 * @typedef {Object} MultiImgCardContentPropProperties
 * @property {Object[]} images
 */

/**
 * @typedef {Object} SingleImgCardContentPropProperties
 * @property {Object} image
 */

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {CardContentProp} props.content
 * @param {CoverPropProperties} [props.cover]
 * @param {string} [props.imagesWrapperClassName="aspect-square"]
 * @param {'telegram'|'facebook'|'sponsored'|''} [props.prefixIcon]
 * @param {JSX} [props.bookmarkBtn]
 * @param {string} props.uniqueKey
 */
const Card = ({
  content = {},
  cover = {},
  className = '',
  uniqueKey,
  imagesWrapperClassName = 'aspect-square rounded-md overflow-hidden',
  prefixIcon = '',
  bookmarkBtn = <></>,
}) => {
  // content.cover defaults
  if (cover.hasOwnProperty('images')) {
    cover.showImages = cover.showImages || cover.images.length;
    cover.layout = cover.layout || 'fill';
    cover.sizes = cover.sizes || [];
    cover.className =
      cover.className || 'group-hover:scale-110 transition-transform';
  }

  if (content.images || content.image) {
    console.error('DEPRECIATED PROP for <Card>', content);
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {bookmarkBtn}
        {content.hasOwnProperty('headerText') ? (
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`no-underline ${className} overflow-hidden`}>
            <div className={`${imagesWrapperClassName} relative`}>
              <PrefixIcon type={prefixIcon} />
              {cover &&
                cover.images &&
                (cover.showImages === 1 || cover.images.length === 1) && (
                  <LinkWrapper passHref content={content}>
                    <StrapiImage
                      layout={cover.layout}
                      className={cover.className}
                      alt={cover.images[0].alternativeText}
                      loading={cover.loading}
                      sizes={cover.sizes}
                      source={cover.images[0]}
                    />
                  </LinkWrapper>
                )}
              {cover &&
                cover.images &&
                cover.showImages !== 1 &&
                cover.images.length > 1 && (
                  <CarouselProvider
                    totalSlides={
                      cover.showImages === -1
                        ? cover.images.length
                        : cover.showImages
                    }
                    naturalSlideWidth={cover.width}
                    naturalSlideHeight={cover.height}>
                    <Slider
                      className="rounded-md overflow-hidden"
                      classNameAnimation="transition-transform duration-200">
                      {cover.images.map((image, key) => (
                        <Slide
                          key={image.url}
                          index={key}
                          className="rounded-md overflow-hidden"
                          style={{ paddingBottom: 0, lineHeight: 0 }}>
                          <LinkWrapper passHref content={content}>
                            <StrapiImage
                              layout={'fixed'}
                              width={`${cover.width}px`}
                              height={`${cover.height}px`}
                              className={cover.className}
                              sizes={cover.sizes}
                              alt={image.alternativeText}
                              source={image}
                            />
                          </LinkWrapper>
                        </Slide>
                      ))}
                    </Slider>
                    <DotGroup className="z-30" />
                  </CarouselProvider>
                )}
              {typeof cover === 'undefined' && (
                <div className="w-full h-full bg-grey-light rounded-md"></div>
              )}
            </div>
            <LinkWrapper passHref content={content}>
              {content.hasOwnProperty('subHeaderText') && (
                <h6 className="tag">{content.subHeaderText}</h6>
              )}
              <h4 className="text-lg text-blue group-hover:text-blue-light leading-tight mt-1 mb-4 px-1">
                {content.headerText}
              </h4>
            </LinkWrapper>
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
    </div>
  );
};

export default Card;
