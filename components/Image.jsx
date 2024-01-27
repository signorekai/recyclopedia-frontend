import { useRef, useEffect } from 'react';
import orderBy from 'lodash.orderby';
import { useElementSize } from '../lib/hooks';

import NextImage from 'next/image';

/**
 *
 * @param {Object} props
 * @param {"responsive"|"fixed"} [props.layout="responsive"]
 * @param {string} [props.wrapperClassName]
 * @param {string} [props.className]
 * @param {string} props.alt
 * @returns
 */
export default function Image({
  layout = 'responsive',
  width,
  height,
  alt,
  source = {},
  className = '',
  wrapperClassName = '',
  style = {},
  priority = false,
}) {
  const src = source.url || '';
  const formats = source.formats || {};

  const orderedFormats = orderBy(formats, 'width');
  const [ref, { width: elemWidth, height: elemHeight }] = useElementSize({
    width,
    height,
  });

  let actualSrc = src;

  const acceptedLayout = ['responsive', 'fixed'];
  if (acceptedLayout.indexOf(layout) === -1) {
    layout = 'responsive';
  }

  if (elemWidth > 0) {
    for (let x = 0; x < orderedFormats.length; x++) {
      if (
        orderedFormats[x].width >= elemWidth &&
        orderedFormats[x].height >= elemHeight
      ) {
        actualSrc = orderedFormats[x].url;
        break;
      }
    }

    if (actualSrc.length === 0) {
      actualSrc = src;
    }
  }

  actualSrc = actualSrc.replace(
    /recyclopedia.ap-south-1.linodeobjects.com/g,
    'cdn.recyclopedia.sg',
  );

  const responsiveStyles = {
    maxWidth: width,
    maxHeight: height,
    width: '100%',
    height: '100%',
    aspectRatio: `${width} / ${height}`,
  };

  const fixedStyles = {
    width,
    height,
  };

  return (
    <span
      ref={ref}
      className={`inline-flex justify-center items-center w-[initial] h-[initial] relative overflow-hidden inset-0 ${wrapperClassName}`}
      style={layout === 'responsive' ? responsiveStyles : fixedStyles}>
      {actualSrc.length > 0 && (
        <img
          fetchpriority={priority ? 'high' : 'low'}
          nopin="nopin"
          src={actualSrc}
          alt={
            source.name !== source.alternativeText
              ? source.alternativeText
              : alt
          }
          className={`object-cover object-center absolute w-0 h-0 min-w-full max-w-full min-h-full max-h-full ${className}`}
          style={style}
        />
      )}
      {actualSrc.length === 0 && (
        <div className="w-full h-full bg-grey group-hover:bg-grey-light transition-colors" />
      )}
    </span>
  );
}
