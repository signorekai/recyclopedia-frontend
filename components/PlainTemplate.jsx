import Head from 'next/head';
import Layout from './Layout';
import { DateTime } from 'luxon';

function Plain({
  title = '',
  bodyText = <div></div>,
  description = '',
  updatedAt,
}) {
  return (
    <Layout showHeaderInitially={true} showHeaderOn="" hideHeaderOn="">
      <Head>
        <title>Recyclopedia - {title}</title>
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="og:title" content={`Recyclopedia - ${title}`} />
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
          className="article-body mt-4 text-lg"
          dangerouslySetInnerHTML={{ __html: bodyText }}></article>
      </div>
    </Layout>
  );
}

export default Plain;
