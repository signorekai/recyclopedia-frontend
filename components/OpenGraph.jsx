import { replaceText, getLargestPossibleImage } from '../lib/functions';
import Head from 'next/head';

function OpenGraph({ defaultData, SEO, children }) {
  const meta = {
    title: '',
    description: '',
    ...defaultData,
  };

  if (meta.image === null || meta.image === false) {
    meta.image = `${process.env.NEXT_PUBLIC_LOCATION}/img/cover-image.jpg`;
  }

  console.log(15, SEO);

  if (SEO) {
    if (SEO.title) {
      meta.title = replaceText(SEO.title, [['%s', defaultData.title]]);
    }
    if (SEO.description) {
      meta.description = replaceText(SEO.description, [
        ['%s', defaultData.title],
      ]);
    }

    if (SEO.image !== null) {
      meta.image = getLargestPossibleImage(SEO.image, 'large', 'medium');
    }
  }

  return (
    <Head>
      <meta
        name="og:title"
        key="og:title"
        content={`${meta.title} | Recyclopedia.sg`}
      />
      {meta.description && meta.description.length > 0 && (
        <>
          <meta
            key="description"
            name="description"
            content={meta.description}
          />
          <meta
            property="og:description"
            key="og:description"
            content={meta.description}
          />
        </>
      )}
      <meta property="og:image" key="og:image" content={meta.image} />
      {children}
    </Head>
  );
}

export default OpenGraph;
