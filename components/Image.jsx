import orderBy from 'lodash.orderby';

export default function Image({
  layout = 'responsive',
  width,
  height,
  alt,
  src,
  sizes = '100vw',
  formats = [],
  className = '',
  style = {},
}) {
  let srcSet = '';
  const orderedFormats = orderBy(formats, 'width');

  const acceptedLayout = ['responsive', 'fixed'];
  if (acceptedLayout.indexOf(layout) === -1) {
    layout = 'responsive';
  }

  Object.values(orderedFormats).map((entry) => {
    srcSet += `${entry.url} ${entry.width}w, `;
  });
  srcSet += src;

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
      className="inline-flex justify-center items-center w-[initial] h-[initial] relative overflow-hidden inset-0"
      style={layout === 'responsive' ? responsiveStyles : fixedStyles}>
      <img
        sizes={sizes}
        width={width}
        height={height}
        src={src}
        alt={alt}
        srcSet={srcSet}
        className={`object-cover object-center absolute w-0 h-0 min-w-full max-w-full min-h-full max-h-full ${className}`}
        style={style}
      />
    </span>
  );
}
