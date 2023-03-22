import Head from 'next/head';

import Mailchimp from '../components/SubscribeForm';

import { staticFetcher, useWindowDimensions } from '../lib/hooks';
import Layout from '../components/Layout';
import { getOpengraphTags } from '../components/OpenGraph';

export default function Home({ pageOptions }) {
  const { width } = useWindowDimensions();
  const { title, SEO } = pageOptions;
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
      <div className="container divider-b">
        <div className="lg:w-3/4 mx-auto my-12 md:my-24">
          <h3 className="text-[2rem] leading-tight font-medium text-center">
            Want to keep up with Singapore&apos;s Zero-Waste happenings?
          </h3>
          <p className="mt-3 text-lg text-center">
            Sign up for Recyclopedia News here. Get the latest info on new
            donation drives, recycling initiatives, zero-waste news, and the
            occasional life-hack for living lighter. No spam. You can
            unsubscribe any time.{' '}
            <a href="https://mailchi.mp/d067d8c7e8ed/waste-not-news-5791">
              See a past issue here
            </a>
            .
          </p>
          <Mailchimp />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { data: pageOptions } = await staticFetcher(
    `${process.env.API_URL}/newsletter-page`,
    process.env.API_KEY,
    {
      populate: ['SEO', 'SEO.image'],
    },
  );

  return { props: { pageOptions } };
}
