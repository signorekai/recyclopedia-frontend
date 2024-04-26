import { replaceCDNUri, arrayOfResponsiveImages } from '../lib/functions';

const breakpoints = {
  md: 768,
  lg: 1040,
  mlg: 1200,
  xl: 1600,
  wide: 1920,
};

/**
 * @typedef MinBreakpointImageSize
 * @property {"md"|"lg"|"mlg"|"xl"|"wide"} minBreakpoint md - 768px, lg - 1040px, mlg - 1200px, xl - 1600px, wide - 1920px
 * @property {string} width
 */

/**
 * @typedef MaxBreakpointImageSize
 * @property {"md"|"lg"|"mlg"|"xl"|"wide"} maxBreakpoint md - 768px, lg - 1040px, mlg - 1200px, xl - 1600px, wide - 1920px
 * @property {string} width
 */

/**
 * @typedef MinImageSize
 * @property {string} width
 * @property {string} min
 */

/**
 * @typedef MaxImageSize
 * @property {string} width
 * @property {string} max
 */

/**
 * @typedef DefaultImageSize
 * @property {string} width
 */

/**
 * @typedef StrapiImage
 * @property {number} width
 * @property {number} height
 * @property {Object} formats
 * @property {string} url
 *
 */
/**
 * @typedef ImageProps
 * @property {"responsive"|"fill"|"fixed"} [layout="fill"]
 * @property {(MinBreakpointImageSize|MaxBreakpointImageSize|MinImageSize|MaxImageSize|DefaultImageSize|string)[]} sizes
 * @property {StrapiImage} source
 * @property {string} alt
 * @property {string} [className]
 * @property {Object} [style]
 * @property {boolean} [priority=false]
 * @property {"lazy"|"eager"} [loading]
 * @property {number} [width]
 * @property {number} [height]
 */

const createSrcset = (source) => {
  const responsiveImageFormats = [].concat(arrayOfResponsiveImages).reverse();
  let srcset = '';
  responsiveImageFormats.forEach((value) => {
    if (source.formats && source.formats.hasOwnProperty(value)) {
      srcset += `${replaceCDNUri(source.formats[value].url)} ${
        source.formats[value].width
      }w, `;
    }
  });
  srcset += `${replaceCDNUri(source.url)} ${source.width}w`;
  return srcset;
};

const createSizes = (sizes) =>
  sizes
    .map((size) => {
      let sizeString = '';
      if (size.hasOwnProperty('min')) {
        sizeString += `(min-width: ${size.min}) ${size.width}`;
      } else if (size.hasOwnProperty('max')) {
        sizeString += `(max-width: ${size.max}) ${size.width}`;
      } else if (size.hasOwnProperty('minBreakpoint')) {
        sizeString += `(min-width: ${breakpoints[size.minBreakpoint]}px) ${
          size.width
        }`;
      } else if (size.hasOwnProperty('maxBreakpoint')) {
        sizeString += `(max-width: ${breakpoints[size.maxBreakpoint]}px) ${
          size.width
        }`;
      } else if (size.hasOwnProperty('width')) {
        sizeString += `${size.width}`;
      } else if (typeof size === 'string') {
        sizeString += size;
      }
      return sizeString;
    })
    .join(', ');

/**
 *
 * @param {ImageProps} props
 * @returns
 */
export default function Image({
  layout,
  source,
  sizes = [],
  alt,
  style = {},
  loading,
  className = '',
  width,
  height,
}) {
  const srcset = createSrcset(source);
  const compiledSizes = createSizes(sizes);

  const fixedWrapperStyle = {
    position: 'relative',
    width: width,
    height: height,
  };
  const fixedImageStyle = {
    position: 'absolute',
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '100%',
    maxHeight: '100%',
  };

  const fillWrapperStyle = {
    position: 'absolute',
    width: 'initial',
    height: 'initial',
  };

  let wrapperClass =
    'new-box box-border block overflow-hidden border-0 m-0 p-0 inset-0';
  let imgClass = 'object-cover object-center h-full';

  let compiledWrapperStyle = {};
  let compiledImageStyle = {};

  if (layout === 'fixed') {
    compiledWrapperStyle = { ...fixedWrapperStyle };
    compiledImageStyle = { ...fixedImageStyle };
  } else if (layout === 'fill') {
    compiledWrapperStyle = { ...fillWrapperStyle };
  }

  return (
    <span className={wrapperClass} style={compiledWrapperStyle}>
      <img
        className={`${imgClass} ${className}`}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: `${source.width} / ${source.height}`,
          ...compiledImageStyle,
          ...style,
        }}
        loading={loading}
        decoding="async"
        srcSet={srcset}
        src={replaceCDNUri(source.url)}
        sizes={compiledSizes}
        alt={alt}
        title={alt}
      />
    </span>
  );
}
