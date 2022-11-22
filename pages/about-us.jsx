import Head from 'next/head';
import qs from 'querystring';
import Layout from '../components/Layout';
import Image from 'next/image';
import NewImage from '../components/Image';
import { staticFetcher, useWindowDimensions } from '../lib/hooks';

import AboutUsBg from '../assets/img/about-us.svg';

export default function Page({ pageOptions }) {
  const { width } = useWindowDimensions();
  const { supporters, title, introHeader, description, bodyText } = pageOptions;

  return (
    <Layout title={title}>
      <Head>
        <meta name="description" content={description} />
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
                __html: description,
              }}></h1>
          </div>
        </div>
      </div>
      <div className="container">
        <div
          className="pb-7 pt-4 lg:py-14 article-body"
          dangerouslySetInnerHTML={{ __html: bodyText }}></div>
        <div className="divider-b"></div>
      </div>
      <div className="container flex flex-col lg:flex-row mt-8 lg:mt-14 lg:mb-6 items-start">
        <h2 className="text-black lg:w-1/4 lg:justify-start">Contact Us</h2>
        <div className="w-full">
          <p>
            Spotted outdated information, or have suggestions for improvements?
            Contact us via our feedback form.{' '}
          </p>
          <p>
            For direct enquiries:{' '}
            <a href="mailto:hello@recyclopedia.sg">hello@recyclopedia.sg</a>
          </p>
        </div>
      </div>
      <div className="container divider-b mt-12 lg:mt-16"></div>
      <div className="container flex flex-col lg:flex-row mt-8 lg:mt-14 lg:mb-6 items-start">
        <h2 className="text-black lg:w-1/4 lg:justify-start">
          Be part of the project
        </h2>
        <div className="w-full">
          <p>
            If you are passionate about zero waste and would like to contribute,
            drop us a line at{' '}
            <a href="mailto:hello@recyclopedia.sg">hello@recyclopedia.sg</a>
          </p>
          <p>
            For direct enquiries:{' '}
            <a href="mailto:hello@recyclopedia.sg">hello@recyclopedia.sg</a>
          </p>
        </div>
      </div>
      {supporters && supporters.length > 1 && (
        <>
          <div className="container divider-b mt-12 lg:mt-16"></div>
          <div className="container flex flex-col lg:flex-row mt-8 lg:mt-12 items-start">
            <h2 className="text-black lg:w-1/4 lg:justify-start">
              Proudly Supported by
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
                    layout="fixed"
                    placeholder={supporter.image.placeholder}
                    source={supporter.image}
                  />
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const { data: pageOptions } = await staticFetcher(
    `${process.env.API_URL}/about-us-page?${qs.stringify({
      populate: ['supporters', 'supporters.image'],
    })}`,
    process.env.API_KEY,
  );

  return { props: { pageOptions } };
}
