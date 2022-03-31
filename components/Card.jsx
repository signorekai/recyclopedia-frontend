import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Link from 'next/link';
import ContentLoader from 'react-content-loader';

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

const Card = ({ content = {}, className = '', uniqueKey }) => {
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
            <div
              className="pb-[100%] bg-cover bg-center rounded-[4px] group-hover:opacity-90 transition-all duration-200 bg-grey-light"
              style={{
                backgroundImage: `url(${content.backgroundImage})`,
              }}></div>
            {content.hasOwnProperty('subHeaderText') && (
              <h6 className="tag">{content.subHeaderText}</h6>
            )}
            <h4 className="text-lg leading-tight mt-2 px-1">
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
