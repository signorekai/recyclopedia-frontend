import Head from 'next/head';
import Layout from './Layout';
import { DateTime } from 'luxon';
import { addMissingTitleToImg, replaceCDNUri } from '../lib/functions';
import OpenGraph, { getOpengraphTags } from './OpenGraph';

function Plain({
  title = '',
  bodyText = <div></div>,
  description = '',
  updatedAt,
  SEO,
}) {
  const meta = getOpengraphTags(
    {
      title,
      description,
    },
    SEO,
  );

  return (
    <Layout
      showHeaderInitially={true}
      showHeaderOn=""
      hideHeaderOn=""
      title={title}>
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
      </Head>
      <div className="container mt-10">
        <h1 className="text-black pt-2 mb-0">{title}</h1>
        {(function () {
          const date = DateTime.fromISO(updatedAt).toLocaleString(
            DateTime.DATE_MED,
          );
          return (
            <span className="block mb-4">
              <h6 className="text-sm text-grey-mid mt-2">
                Last Updated: {date}
              </h6>
            </span>
          );
        })()}
        <article
          className="user-editable mt-4 text-lg"
          dangerouslySetInnerHTML={{
            __html: addMissingTitleToImg(replaceCDNUri(bodyText)),
          }}></article>
      </div>
    </Layout>
  );
}

export default Plain;
