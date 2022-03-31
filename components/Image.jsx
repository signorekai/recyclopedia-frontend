import orderBy from 'lodash.orderby';

export default function Image({ width, height, alt, src, formats = [] }) {
  let srcSet = '';
  const orderedFormats = orderBy(formats, 'width');

  Object.values(orderedFormats).map((entry) => {
    srcSet += `${entry.url} ${entry.width}w, `;
  });

  srcSet += src;
  return (
    <span
      className="inline-flex justify-center items-center w-[initial] h-[initial] relative overflow-hidden inset-0"
      style={{
        width,
        height,
      }}>
      <img
        sizes="100vw"
        width={width}
        height={height}
        src={src}
        alt={alt}
        srcSet={srcSet}
        className="object-cover object-center absolute w-0 h-0 min-w-full max-w-full min-h-full max-h-full"
      />
    </span>
  );
}
