import Head from 'next/head';
import Layout from '../components/Layout';
import { FeedbackForm } from '../components/Report';

import { staticFetcher } from '../lib/hooks';
import { replaceCDNUri } from '../lib/functions';
import OpenGraph from '../components/OpenGraph';

export default function Page({ pageOptions }) {
  const { title, bodyText, SEO } = pageOptions;

  return (
    <Layout title={title}>
      <OpenGraph
        defaultData={{
          title,
        }}
        SEO={SEO}
      />
      <div className="container container--narrow h-full pt-4 lg:pt-10">
        <h1 className="text-black">{title}</h1>
        <div
          className="mb-10 article-body article-body--wide"
          dangerouslySetInnerHTML={{ __html: replaceCDNUri(bodyText) }}></div>
        <FeedbackForm />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { data: pageOptions } = await staticFetcher(
    `${process.env.API_URL}/contact-us-page`,
    process.env.API_KEY,
  );

  return { props: { pageOptions } };
}
