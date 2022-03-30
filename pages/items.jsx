import { useEffect, useState } from 'react';
import { useScrollDirection } from 'react-use-scroll-direction';
import Head from 'next/head';
import { useViewportScroll, useMotionValue } from 'framer-motion';

import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import { useWindowDimensions } from '../lib/hooks';
import InfiniteLoader from '../components/InfiniteLoader';

const db = [
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

export default function Page() {
  const x = useMotionValue(0);
  const [items, setItems] = useState([]);
  const { scrollDirection } = useScrollDirection();
  const [itemsFinishedLoading, setItemsFinishedLoading] = useState(false);
  const { scrollY } = useViewportScroll();
  const { width } = useWindowDimensions();

  useEffect(() => {
    setItems([...db]);
  }, []);

  useEffect(() => {
    if (scrollDirection === 'UP' && width < 1080) {
      x.set(52);
    } else if (scrollDirection === 'DOWN') {
      x.set(0);
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY, scrollDirection]);

  // todo dummy loading
  const handleLoad = () => {
    if (items.length < 30) {
      const timeout = setTimeout(() => {
        setItems([...items, ...db]);
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      setItemsFinishedLoading(true);
    }
  };

  return (
    <Layout showHeaderInitially={true} showHeaderOn="UP" hideHeaderOn="DOWN">
      <Head>
        <title>Recyclopedia - Items</title>
        <meta name="description" content="Recyclopedia" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="bg-teal py-4 lg:pt-10 text-white">
        <div className="container max-w-[800px]">
          <h2 className="text-white lg:justify-start">
            <i className="far fa-box text-3xl mr-3 mt-1" />
            Items
          </h2>
          <p className="text-lg leading-tight ">
            Find the best option to give your items a second life.
          </p>
        </div>
      </section>
      <SearchBar
        top={x}
        className="py-2 sticky lg:relative transition-all duration-200"
        wrapperClassName="max-w-[800px]"
        inactiveBackgroundColor="#28C9AA"
        activeBackgroundColor="#28C9AA"
      />
      <div className="bg-teal pb-2 lg:pb-10"></div>
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 lg:gap-x-7 lg:gap-y-6 mt-6">
          {items.map((item, key) => (
            <Card
              key={key}
              className="w-full"
              uniqueKey={`card-${key}`}
              content={item}
            />
          ))}
        </div>
      </div>
      {!itemsFinishedLoading && <InfiniteLoader handleEnter={handleLoad} />}
    </Layout>
  );
}
