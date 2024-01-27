import Layout from '../components/Layout';
import Image from 'next/image';
import Link from '../components/Link';
import NewImage from '../components/Image';
import { staticFetcher, useWindowDimensions } from '../lib/hooks';

import AboutUsBg from '../assets/img/about-us.svg';
import { replaceCDNUri } from '../lib/functions';
import OpenGraph, { getOpengraphTags } from '../components/OpenGraph';
import Head from 'next/head';

export default function Page({ pageOptions }) {
  const { width } = useWindowDimensions();
  const { supporters, title, introHeader, description, bodyText, SEO } =
    pageOptions;

  const meta = getOpengraphTags({ title, description }, SEO);

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
      <div className="bg-teal relative">
        <div className="container lg:flex lg:py-12">
          <div className="pt-8 pr-2 lg:pl-4 lg:pr-0 lg:pt-8 lg:order-2 lg:-mr-24">
            <Image src={AboutUsBg} alt="" />
          </div>
          <div className="lg:w-3/5 pb-7 pt-6 lg:py-10 lg:order-1">
            <h2 className="text-black justify-start mt-0 lg:mt-4">
              {introHeader}
            </h2>
            <h1
              className="text-black"
              dangerouslySetInnerHTML={{
                __html: replaceCDNUri(description),
              }}></h1>
          </div>
        </div>
      </div>
      <div className="container">
        <div
          className="pt-8 pb-0 user-editable"
          dangerouslySetInnerHTML={{ __html: replaceCDNUri(bodyText) }}></div>
      </div>
      <div className="my-8 md:my-20">
        <div className="container divider-b "></div>
        <div className="container flex flex-col lg:flex-row mt-8 lg:my-12 items-start">
          <h2 className="text-black lg:w-1/4 lg:justify-start">Contact Us</h2>
          <div className="w-full md:w-3/4 md:pl-4">
            <p>
              Spotted outdated information, or have suggestions for
              improvements?
              <br />
              Contact us via our <Link href="/feedback">feedback form</Link>.
            </p>
            <p>
              <strong>
                Please note that we do not provide recycling or collection
                services. <br />
                Recyclopedia.sg is a reference website.
              </strong>
            </p>
            <p>
              For direct enquiries:{' '}
              <a href="mailto:hello@recyclopedia.sg">hello@recyclopedia.sg</a>
            </p>
          </div>
        </div>
        <div className="container divider-b mt-6"></div>
        <div className="container flex flex-col lg:flex-row mt-8 lg:my-12 items-start">
          <h2 className="text-black lg:w-1/4 lg:justify-start">
            Be part of the project
          </h2>
          <div className="w-full md:w-3/4 md:pl-4">
            <p>
              If you are passionate about zero waste and would like to
              contribute,
              <br />
              drop us a line at{' '}
              <a href="mailto:hello@recyclopedia.sg">hello@recyclopedia.sg</a>
            </p>
          </div>
        </div>
        {supporters && supporters.length >= 1 && (
          <>
            <div className="container divider-b mt-12 lg:mt-16"></div>
            <div className="container flex flex-col lg:flex-row mt-8 lg:mt-12 items-start">
              <h2 className="text-black lg:w-1/4 lg:justify-start">
                Featured On
              </h2>
              <div className="flex-1 mt-2 lg:mt-0 flex lg:grid items-center grid-cols-3 gap-x-4 gap-y-2">
                {supporters.map((supporter) => (
                  <a
                    href={supporter.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={supporter.name}>
                    <NewImage
                      className="max-h-[55px]"
                      width={supporter.image.width}
                      height={supporter.image.height}
                      layout="responsive"
                      placeholder={supporter.image.placeholder}
                      source={supporter.image}
                    />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { data: pageOptions } = await staticFetcher(
    `${process.env.API_URL}/about-us-page`,
    process.env.API_KEY,
    {
      populate: ['supporters', 'supporters.image', 'SEO', 'SEO.image'],
    },
  );

  return { props: { pageOptions } };
}
