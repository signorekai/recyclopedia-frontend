import Head from 'next/head';
import qs from 'querystring';
import Layout from '../components/Layout';
import Image from 'next/image';
import NewImage from '../components/Image';
import { staticFetcher, useWindowDimensions } from '../lib/hooks';

import AboutUsBg from '../assets/img/about-us.svg';

export default function Page({ pageOptions }) {
  const { width } = useWindowDimensions();
  const { supporters, title, introHeader, description } = pageOptions;

  return (
    <Layout showHeaderInitially={true} showHeaderOn="UP" hideHeaderOn="DOWN">
      <Head>
        <title>Recyclopedia - {title}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="bg-teal relative">
        <div className="container">
          {width < 1080 && (
            <div className="-ml-8 md:mx-auto pt-4 pr-2">
              <Image src={AboutUsBg} alt="" />
            </div>
          )}
          <div className="lg:w-1/2 pb-7 pt-4 lg:py-20">
            <h1 className="text-white">{introHeader}</h1>
            <div
              className="text-lg"
              dangerouslySetInnerHTML={{
                __html: description,
              }}></div>
          </div>
        </div>
        {width >= 1080 && (
          <div className="absolute right-8 top-16">
            <Image src={AboutUsBg} alt="" />
          </div>
        )}
      </div>
      <div className="container flex flex-col lg:flex-row mt-8 lg:mt-12 items-start">
        <h2 className="text-black lg:w-1/4 lg:justify-start">Contact Us</h2>
        <div className="w-full lg:w-1/3 lg:pr-8">
          <p>
            Spotted outdated information, or have suggestions for improvements?
            Contact us via our feedback form.{' '}
          </p>
        </div>
        <div className="w-full lg:w-1/4 mt-4 lg:mt-0">
          <p>
            For direct enquiries:{' '}
            <a href="mailto:hello@recyclopedia.sg">hello@recyclopedia.sg</a>
          </p>
        </div>
      </div>
      <div className="container flex flex-col lg:flex-row mt-8 lg:mt-12 items-start">
        <h3 className="text-black lg:w-1/4 lg:justify-start">
          Proudly Supported by
        </h3>
        <div className="flex-1 grid items-center grid-cols-3 gap-x-4 gap-y-2">
          {supporters &&
            supporters.map((supporter) => (
              <a
                href={supporter.url}
                target="_blank"
                rel="noopener noreferrer"
                key={supporter.name}>
                <NewImage
                  className="max-h-[55px]"
                  width={supporter.image.width}
                  height={supporter.image.height}
                  layout="fixed"
                  placeholder={supporter.image.placeholder}
                  src={supporter.image.url}
                />
              </a>
            ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { data: pageOptions } = await staticFetcher(
    `${process.env.API_URL}/api/about-us-page?${qs.stringify({
      populate: ['supporters', 'supporters.image'],
    })}`,
    process.env.API_KEY,
  );

  return { props: { pageOptions } };
}
