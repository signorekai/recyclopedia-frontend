import { useEffect, useState } from 'react';
import Head from 'next/head';
import qs from 'qs';
import useSWRInfinite from 'swr/infinite';

import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import { useSearchBarTopValue, useWindowDimensions } from '../lib/hooks';
import InfiniteLoader from '../components/InfiniteLoader';

const itemsPerPage = 4;

export default function Page({ items: loadedItems }) {
  const x = useSearchBarTopValue();
  const [itemsFinishedLoading, setItemsFinishedLoading] = useState(false);

  const { data, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && previousPageData.length !== itemsPerPage) {
        setItemsFinishedLoading(true);
        return null;
      }

      const query = qs.stringify({
        page: pageIndex + 1,
        pageSize: itemsPerPage,
      });
      return `/api/items?${query}`;
    },
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((res) => {
          return res.data;
        }),
  );

  const handleLoad = () => {
    setSize(size + 1);
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
          {data &&
            data.map((items) => (
              <>
                {items.map((item, key) => (
                  <Card
                    key={key}
                    className="w-full"
                    uniqueKey={`card-${key}`}
                    content={{
                      backgroundImage:
                        item.images.length > 0 ? item.images[0].url : '',
                      headerText: item.title,
                      contentType: 'items',
                      slug: item.slug,
                    }}
                  />
                ))}
              </>
            ))}
        </div>
      </div>
      {!itemsFinishedLoading && <InfiniteLoader handleEnter={handleLoad} />}
    </Layout>
  );
}

export async function getStaticProps() {
  const ip = process.env.API_URL;
  const query = qs.stringify({
    populate: ['images'],
    pagination: {
      page: 1,
      pageSize: itemsPerPage,
    },
  });

  const res = await fetch(`${ip}/api/items?${query}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
  const items = await res.json();

  return { props: { items: items.data } };
}
