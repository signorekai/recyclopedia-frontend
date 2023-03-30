import Head from 'next/head';
import { DateTime } from 'luxon';

import Mailchimp from '../components/SubscribeForm';
import { staticFetcher } from '../lib/hooks';
import Layout from '../components/Layout';
import { getOpengraphTags } from '../components/OpenGraph';

export default function Home({ pageOptions }) {
  const { title, SEO, newsletters } = pageOptions;
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
        <div className="lg:w-3/4 mx-auto my-12">
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
      <div className="mx-auto w-full lg:max-w-min my-12">
        <h2 className="pl-4 lg:pl-0 text-center text-black">
          Past newsletters
        </h2>
        <ul className="!ml-0">
          {newsletters.map((newsletter, key) => {
            const date = DateTime.fromFormat(
              newsletter.dateOfPublish,
              "yyyy'-'MM'-'dd",
            ).toLocaleString(DateTime.DATE_SHORT);
            return (
              <li className="!list-none lg:min-w-max block text-lg" key={key}>
                {date} -{' '}
                <a
                  className=""
                  href={newsletter.url}
                  target="_blank"
                  rel="noopener noreferrer">
                  {newsletter.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { data: pageOptions } = await staticFetcher(
    `${process.env.API_URL}/newsletter-page`,
    process.env.API_KEY,
    {
      populate: ['SEO', 'SEO.image', 'newsletters'],
    },
  );

  return { props: { pageOptions } };
}
