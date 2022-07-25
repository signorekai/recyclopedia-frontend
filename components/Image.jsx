import { useRef, useEffect } from 'react';
import orderBy from 'lodash.orderby';
import { useElementSize } from '../lib/hooks';

/**
 *
 * @param {"responsive"|"fixed"} [layout]
 * @returns
 */
export default function Image({
  layout = 'responsive',
  width,
  height,
  alt,
  source = {},
  className = '',
  style = {},
}) {
  const src = source.url || '';
  const formats = source.formats || {};

  const orderedFormats = orderBy(formats, 'width');
  const [ref, { width: elemWidth, height: elemHeight }] = useElementSize();

  let actualSrc = '';

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
      className="inline-flex justify-center items-center w-[initial] h-[initial] relative overflow-hidden inset-0 bg-grey"
      style={layout === 'responsive' ? responsiveStyles : fixedStyles}>
      <img
        src={actualSrc}
        alt=""
        className={`object-cover object-center absolute w-0 h-0 min-w-full max-w-full min-h-full max-h-full ${className}`}
        style={style}
      />
    </span>
  );
}
