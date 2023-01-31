import Head from 'next/head';
import Layout from './Layout';
import { DateTime } from 'luxon';
import { replaceCDNUri } from '../lib/functions';

function Plain({
  title = '',
  bodyText = <div></div>,
  description = '',
  updatedAt,
}) {
  return (
    <Layout
      showHeaderInitially={true}
      showHeaderOn=""
      hideHeaderOn=""
      title={title}>
      <Head>
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
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
          dangerouslySetInnerHTML={{
            __html: replaceCDNUri(bodyText),
          }}></article>
      </div>
    </Layout>
  );
}

export default Plain;
