import Head from 'next/head';
import Layout from '../components/Layout';
import { FeedbackForm } from '../components/Report';

import { staticFetcher } from '../lib/hooks';
import { replaceCDNUri } from '../lib/functions';
import OpenGraph, { getOpengraphTags } from '../components/OpenGraph';
import React from 'react';

export const processTopics = (topics) => {
  return topics.map((topic) => {
    return {
      label: topic.title,
      value: topic.title,
      showForm: topic.showForm,
      errorMsg: topic.errorMsg,
    };
  });
};

export default function Page({ pageOptions }) {
  const { title, bodyText, SEO, Topics } = pageOptions;

  const compiledTopics = processTopics(Topics);

  const meta = getOpengraphTags({ title }, SEO);

  return (
    <Layout title={title}>
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
      <div className="container container--narrow h-full pt-4 lg:pt-10">
        <h1 className="text-black">{title}</h1>
        <div
          className="mb-10 user-editable user-editable--wide"
          dangerouslySetInnerHTML={{ __html: replaceCDNUri(bodyText) }}></div>
        <FeedbackForm topics={compiledTopics} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { data: pageOptions } = await staticFetcher(
    `${process.env.API_URL}/contact-us-page`,
    process.env.API_KEY,
    {
      populate: ['SEO', 'SEO.image', 'Topics'],
    },
  );

  return { props: { pageOptions } };
}
