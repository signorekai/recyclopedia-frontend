import Head from 'next/head';
import { motion } from 'framer-motion';
import qs from 'qs';

import SubscribeForm from '../components/SubscribeForm';

import {
  ITEMS_PER_PAGE,
  staticFetcher,
  useWindowDimensions,
} from '../lib/hooks';
import { Carousel, CarouselCard } from '../components/Carousel';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import Link from '../components/Link';
import Logo from '../components/Logo';
import StructuredData from '../components/StructuredData';
import OpenGraph, { getOpengraphTags } from '../components/OpenGraph';

import type { WebSite, SearchAction } from 'schema-dts';

type SearchActionWithQueryInput = SearchAction & {
  "query-input": string
}

export default function Home({
  items,
  newsItems,
  newsletter,
  donationDrives,
  pageOptions,
}) {
  const { width, isDesktop } = useWindowDimensions();
  const { SEO } = pageOptions;

  const meta = getOpengraphTags(
    {
      title: 'Home',
      description:
        'Everything you need to know when you have something to throw. A Singapore based directory of recommendations and advice on reducing your waste-karma with info on donation drives, recycle options, thrift shops, and more.',
    },
    SEO,
  ); 

  const searchAction: SearchActionWithQueryInput = {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://recyclopedia.sg/search?searchTerm={search_term_string}'
    },
    "query-input": "required name=search_term_string",
  }

  const structuredData: WebSite = {
    '@type': 'WebSite',
    name: 'Recyclopedia.sg',
    alternateName: 'Recyclopedia',
    url: 'https://recyclopedia.sg',
    potentialAction: searchAction,
  }

  return (
    <Layout>
      <Head>
        <StructuredData data={structuredData} />
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
      <div className="bg-mobile-banner md:bg-banner bg-no-repeat bg-contain">
        <div className="max-w-md lg:max-w-none pt-40 md:pt-24 lg:pt-32 mx-auto">
          <a className="lg:flex justify-center z-10 relative hidden">
            <Logo width={305} height={50} className="text-blue" />
          </a>
          <h3 className="text-center mb-4 lg:mt-2 px-2 leading-none text-black z-10 relative">
            All you need to know
            <span className="block md:inline"> when you have </span>
            <span className="block md:inline">something to throw</span>
          </h3>
          <SearchBar
            placeholderText={'Search for something'}
            activeBackgroundColor="#252B5C"
            className="lg:w-[720px]"
            wrapperClassName="z-20"
            showBottomSpacing={false}
          />
        </div>
        <div className="container container--narrow relative z-10 lg:mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-4 gap-y-4 lg:gap-y-6 mt-6 lg:mt-12 home-items-grid">
            {items.map((item, key) => (
              <Card
                key={key}
                className="w-full"
                uniqueKey={`card-${key}`}
                content={{
                  image: item.images ? item.images[0] : {},
                  headerText: item.title,
                  slug: item.slug,
                  contentType: 'items',
                }}
              />
            ))}
          </div>
          <Link href="/items">
            <a className="btn">View all Items</a>
          </Link>
        </div>
        <div className="container ">
          <div className="lg:w-3/4 mx-auto my-12 md:mt-24 md:mb-20">
            <h3 className="text-2xl lg:text-[2rem] leading-tight font-medium text-center">
              Are you based in Singapore?{' '}
              <span className="block lg:inline">So are we.</span>
            </h3>
            <p className="mt-3 text-lg text-center">
              Our recommendations are based on local knowledge: recycling
              facilities, thrift shops, upcycling projects, popular apps, and
              more!
            </p>
          </div>
        </div>
        <div className="container lg:container--wide">
          <Link href="/articles?section=Donation Drives" passHref>
            <a className="no-underline text-blue-light">
              <h2 className="mb-3 lg:mb-5">
                <i className="far fa-hand-heart text-3xl mr-3" /> Donation
                Drives & Events
                <i className="fa fa-arrow-right font-light text-coral text-lg ml-3 group-hover:translate-x-1" />
              </h2>
            </a>
          </Link>
          <div>
            <Carousel
              prevBtnClassName="hidden"
              nextBtnClassName="h-full pointer-events-none"
              desktopControls={isDesktop === false}
              autoSlideSize={false}
              slideWidth={width > 1080 ? 312 : 0.75 * width}>
              {donationDrives.map((item, key) => {
                if (item !== null) {
                  return (
                    <CarouselCard className="w-[75vw] lg:w-1/4">
                      <Card
                        imagesWrapperClassName="aspect-[320_/_240]"
                        imgClassName=""
                        uniqueKey={`donation-drive-${item.slug}`}
                        content={{
                          image: item.coverImage || {},
                          headerText: item.title,
                          slug: item.slug,
                          contentType: 'articles',
                        }}
                      />
                    </CarouselCard>
                  );
                }
              })}
            </Carousel>
          </div>
        </div>
        <div className="container container--wide mt-8 mb-6 lg:my-20">
          <div className="divide-y lg:divide-y-0 lg:divide-x divide-grey-light border-y-1 lg:border-y-0 border-grey-light lg:flex lg:flex-row">
            <motion.div
              initial="initial"
              whileInView="visible"
              viewport={{ once: true, amount: 'all', margin: '20%' }}
              variants={{
                initial: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              className="py-4 lg:px-6 lg:flex-1 lg:text-center group">
              <Link href="/resources" passHref>
                <a className="no-underline">
                  <h2>
                    <i className="far fa-recycle text-3xl mr-3 mt-1" />{' '}
                    Recycling++
                    <i className="fa fa-arrow-right font-light text-coral text-lg ml-3 group-hover:translate-x-1" />
                  </h2>
                  <h3 className="text-black group-hover:opacity-80">
                    There’s more than just blue bins. Find all the ways you can
                    keep your trash out of the incinerator.
                  </h3>
                </a>
              </Link>
            </motion.div>
            <motion.div
              initial="initial"
              whileInView="visible"
              viewport={{ once: true, amount: 'all', margin: '20%' }}
              variants={{
                initial: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              className="py-4 lg:px-6 lg:flex-1 lg:text-center group">
              <Link href="/freecycling" passHref>
                <a className="no-underline">
                  <h2>
                    <i className="far fa-box-heart text-3xl mr-3 mt-1" /> Where
                    to Freecycle
                    <i className="group-hover:translate-x-1 fa fa-arrow-right font-light text-coral text-lg ml-3" />
                  </h2>
                  <h3 className="text-black group-hover:opacity-80">
                    Donate, share, bless, giveaway. Extend the life of your
                    stuff by giving it to others.
                  </h3>
                </a>
              </Link>
            </motion.div>
            <motion.div
              initial="initial"
              whileInView="visible"
              viewport={{ once: true, amount: 'all', margin: '20%' }}
              variants={{
                initial: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              className="py-4 lg:px-6 lg:flex-1 lg:text-center group">
              <Link href="/shops" passHref>
                <a className="no-underline">
                  <h2>
                    <i className="far fa-shopping-bag text-3xl mr-3 mt-1" />{' '}
                    Shop
                    <i className="fa fa-arrow-right font-light text-coral text-lg ml-3 group-hover:translate-x-1" />
                  </h2>
                  <h3 className="text-black group-hover:opacity-80">
                    Support businesses that are part of the circular solution.
                    Find pre-loved, upcycled, and zero waste goodies here.
                  </h3>
                </a>
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="container lg:container--wide">
          <Link href="/articles" passHref>
            <a className="no-underline text-blue-light">
              <h2 className="mb-3 lg:mb-5">
                <i className="far fa-lightbulb-exclamation text-3xl mr-3" />{' '}
                News & Views
                <i className="fa fa-arrow-right font-light text-coral text-lg ml-3 group-hover:translate-x-1" />
              </h2>
            </a>
          </Link>
          <div>
            <Carousel
              prevBtnClassName="hidden"
              nextBtnClassName="h-full pointer-events-none"
              desktopControls={isDesktop === false}
              autoSlideSize={false}
              slideWidth={width > 1080 ? 312 : 0.75 * width}>
              {newsItems.map((item, key) => {
                if (item !== null) {
                  return (
                    <CarouselCard className="w-[75vw] md:w-1/4">
                      <Card
                        imagesWrapperClassName="aspect-[320_/_240]"
                        imgClassName=""
                        uniqueKey={`donation-drive-${item.slug}`}
                        content={{
                          image: item.coverImage || {},
                          headerText: item.title,
                          slug: item.slug,
                          contentType: 'articles',
                        }}
                      />
                    </CarouselCard>
                  );
                }
              })}
            </Carousel>
          </div>
        </div>
        <div className="container ">
          <div className="my-12 md:my-24">
            <h2 className="leading-tight font-semibold text-center text-black">
              {newsletter.header}
            </h2>
            <div className="lg:w-3/4 mx-auto">
              <div
                className="mt-3 text-lg text-center"
                dangerouslySetInnerHTML={{ __html: newsletter.body }}></div>
              <SubscribeForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const ip = process.env.API_URL;

  const { data: generalSettings } = await staticFetcher(
    `${ip}/general-setting?${qs.stringify({
      populate: [
        'homePageFeaturedArticles',
        'homePageFeaturedArticles.article.coverImage',
        'homePageFeaturedArticles.article.category',
        'homepageFeaturedDonationDrives',
        'homepageFeaturedDonationDrives.article.coverImage',
        'homepageFeaturedDonationDrives.article.category',
      ],
    })}`,
    process.env.API_KEY,
  );

  const { data: pageOptions } = await staticFetcher(
    `${ip}/home-page`,
    process.env.API_KEY,
    {
      populate: ['SEO', 'SEO.image'],
    },
  );

  let newsItems =
    generalSettings.homePageFeaturedArticles.map(
      (article) => article.article,
    ) || [];

  let donationDrives =
    generalSettings.homepageFeaturedDonationDrives.map(
      (article) => article.article,
    ) || [];

  const { data: items } = await staticFetcher(
    `${ip}/items?${qs.stringify({
      sort: ['visits:desc', 'title'],
      populate: ['images'],
      pagination: {
        page: 1,
        pageSize: ITEMS_PER_PAGE,
      },
    })}`,
    process.env.API_KEY,
  );

  return {
    props: {
      items,
      newsItems,
      donationDrives,
      pageOptions,
      newsletter: {
        header: generalSettings.newsletterHeader,
        body: generalSettings.newsletterBodyText,
      },
    },
  };
}
