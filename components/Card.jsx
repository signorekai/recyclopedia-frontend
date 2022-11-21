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
 * @param {'telegram'|'facebook'|'sponsored'|''} [props.prefixIcon]
 * @param {JSX} [props.bookmarkBtn]
 * @returns
 */
const Card = ({
  content = {},
  className = '',
  uniqueKey,
  imagesWrapperClassName = 'aspect-square',
  imgClassName = '',
  prefixIcon = '',
  bookmarkBtn = <></>,
}) => {
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
            className={`no-underline ${className} rounded-md overflow-hidden`}>
            <div className={`${imagesWrapperClassName}`}>
              <PrefixIcon type={prefixIcon} />
              {content.images && content.images.length > 1 && (
                <CarouselProvider
                  totalSlides={content.images.length}
                  naturalSlideWidth={240}
                  naturalSlideHeight={240}>
                  <Slider
                    className="rounded-md overflow-hidden"
                    classNameAnimation="transition-transform duration-200">
                    {content.images.map((image, key) => (
                      <Slide
                        key={`${image.url}-${key}`}
                        index={key}
                        className="rounded-md overflow-hidden"
                        style={{ paddingBottom: 0, lineHeight: 0 }}>
                        <LinkWrapper passHref content={content}>
                          <Image
                            className={`group-hover:scale-110 transition-transform ${imgClassName}`}
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
                        </LinkWrapper>
                      </Slide>
                    ))}
                  </Slider>
                  <DotGroup className="z-30" />
                </CarouselProvider>
              )}
              {((typeof content.images === 'undefined' &&
                content.image.hasOwnProperty('url')) ||
                (content.images && content.images.length === 1)) && (
                <LinkWrapper passHref content={content}>
                  <Image
                    wrapperClassName="rounded-md"
                    className="group-hover:scale-110 transition-transform"
                    source={content.images ? content.images[0] : content.image}
                    alt={`Photo of ${content.headerText}`}
                  />
                </LinkWrapper>
              )}
              {typeof content.images === 'undefined' &&
                !content.image.hasOwnProperty('url') && (
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
