import Head from 'next/head';
import { motion } from 'framer-motion';
import qs from 'qs';

import Mailchimp from '../components/Mailchimp';

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

export default function Home({ items, newsItems }) {
  const { width } = useWindowDimensions();

  return (
    <Layout>
      <Head>
        <title>Recyclopedia</title>
        <meta
          name="description"
          content="All you need to know when you have something to throw."
        />
        <meta name="og:title" content="Recyclopedia" />
        <meta
          name="og:description"
          content="All you need to know when you have something to throw."
        />
      </Head>
      <div className="container divider-b">
        <div className="lg:w-3/4 mx-auto my-12 md:my-24">
          <h3 className="text-[2rem] leading-tight font-medium text-center">
            Want to keep up Singapore Zero-Waste happenings?
          </h3>
          <p className="mt-3 text-lg text-center">
            Sign up for Waste-Not News here. Get the latest info on new donation
            drives, recycling initiatives, zero-waste news, and the occasional
            life-hack for living lighter. No spam. You can unsubscribe any time.{' '}
            <a href="https://mailchi.mp/bf7c91fda049/recyclopediasg">
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
