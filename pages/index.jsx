import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { useWindowDimensions } from '../lib/hooks';
import { Carousel, CarouselCard } from '../components/Carousel';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';

const dummySuggestions = [
  {
    backgroundImage:
      'https://savanant.com/recyclopedia/wp-content/uploads/acrylic.jpg',
    headerText: 'Acrylic',
    slug: 'acrylic',
  },
  {
    backgroundImage:
      'https://savanant.com/recyclopedia/wp-content/uploads/aluminum_can.jpg',
    headerText: 'Aluminium Cans & Tabs',
    slug: 'aluminium-cans-tabs',
  },
  {
    backgroundImage:
      'https://savanant.com/recyclopedia/wp-content/uploads/corrugated_cardboard.jpg',
    headerText: 'Corrugated Cardboard',
    slug: 'corrugated-cardboard',
  },
  {
    backgroundImage:
      'https://savanant.com/recyclopedia/wp-content/uploads/dirty_food_container.jpg',
    headerText: 'Dirty Food Containers',
    slug: 'dirty-food-containers',
  },
];

export default function Home() {
  const [suggestedItems, setSuggestedItems] = useState([
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ]);
  const [newsItems, setNewsItems] = useState([{}, {}, {}, {}, {}, {}, {}]);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuggestedItems(dummySuggestions);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Layout showHeaderInitially={false} showHeaderOn="DOWN">
      <Head>
        <title>Recyclopedia</title>
        <meta name="description" content="Recyclopedia" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gradient-to-b from-coral to-purple h-72 lg:h-96 absolute top-0 w-full left-0 z-0"></div>
      <Link href="/">
        <a className="block text-center mt-20 lg:mt-28">
          <Image src="/img/logo.svg" alt="" width={172} height={28} />
        </a>
      </Link>
      <h3 className="text-center mb-4 leading-none text-white z-10 relative">
        All you need to know when you have something to throw
      </h3>
      <SearchBar activeBackgroundColor="#F1EDEA" className="lg:w-[720px]" />
      <div className="container container--narrow relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-4 gap-y-2 lg:gap-y-4 mt-6 lg:mt-12 home-items-grid">
          {suggestedItems.map((item, key) => (
            <Card
              key={key}
              className="w-full"
              uniqueKey={`card-${key}`}
              content={item}
            />
          ))}
        </div>
        <Link href="/items">
          <a className="btn">View all Items</a>
        </Link>
      </div>
      <div className="container container--wide mb-10">
        <div className="divide-y lg:divide-y-0 lg:divide-x divide-grey-light border-y-1 lg:border-y-0 border-grey-light lg:flex lg:flex-row">
          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={{ once: true, amount: 'all', margin: '20%' }}
            variants={{
              initial: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="py-5 px-3 lg:px-6 lg:flex-1 lg:text-center">
            <Link href="/recycle" passHref>
              <a>
                <h2>
                  <i className="far fa-recycle text-3xl mr-3 mt-1" /> Recycling
                  Options
                  <i className="fa fa-arrow-right font-light text-coral text-lg ml-3" />
                </h2>
              </a>
            </Link>
            <h3>
              Don’t let it just go to the landfill – give your waste a second
              life at the proper recycling channels available.
            </h3>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={{ once: true, amount: 'all', margin: '20%' }}
            variants={{
              initial: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="py-5 px-3 lg:px-6 lg:flex-1 lg:text-center">
            <Link href="/donate" passHref>
              <a>
                <h2>
                  <i className="far fa-box-heart text-3xl mr-3 mt-1" /> Where to
                  Donate
                  <i className="fa fa-arrow-right font-light text-coral text-lg ml-3" />
                </h2>
              </a>
            </Link>
            <h3>
              Have something in great condition that you don’t need anymore?
              Think about passing it on to someone else in need. You’ll reduce
              your impact and make their day.
            </h3>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={{ once: true, amount: 'all', margin: '20%' }}
            variants={{
              initial: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="py-5 px-3 lg:flex-1 lg:text-center">
            <Link href="/shop" passHref>
              <a>
                <h2>
                  <i className="far fa-shopping-bag text-3xl mr-3 mt-1" /> Shop
                  Sustainably
                  <i className="fa fa-arrow-right font-light text-coral text-lg ml-3" />
                </h2>
              </a>
            </Link>
            <h3>Make better choices, starting from how you consume.</h3>
          </motion.div>
        </div>
      </div>
      <div className="container lg:container--fluid">
        <h5>News & Tips</h5>
        <Carousel showNav={false} className="mt-3">
          {newsItems.map((item, key) => (
            <CarouselCard key={key} className="w-screen-3/4 lg:w-screen-1/4">
              <Card
                className="w-full"
                uniqueKey={`news-${key}`}
                key={`news-${key}`}
                value={item.value}
              />
            </CarouselCard>
          ))}
        </Carousel>
      </div>
    </Layout>
  );
}
