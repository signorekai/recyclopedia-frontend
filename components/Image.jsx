import orderBy from 'lodash.orderby';

export default function Image({
  width,
  height,
  alternativeText,
  url,
  formats = [],
}) {
  let srcSet = '';
  const orderedFormats = orderBy(formats, 'width');

  Object.values(orderedFormats).map((entry) => {
    srcSet += `${entry.url} ${entry.width}w, `;
  });

  srcSet += url;
  return (
    <span className="block w-[initial] h-[initial] absolute overflow-hidden inset-0">
      <img
        sizes="100vw"
        width={width}
        height={height}
        src={url}
        alt={alternativeText}
        srcSet={srcSet}
        className="object-cover object-center absolute w-0 h-0 min-w-full max-w-full min-h-full max-h-full"
      />
    </span>
  );
}
