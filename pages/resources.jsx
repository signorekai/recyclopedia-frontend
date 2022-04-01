import Head from 'next/head';
import qs from 'qs';
import { SWRConfig } from 'swr';

import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import {
  useFetchContent,
  useSearchBarTopValue,
  ITEMS_PER_PAGE,
} from '../lib/hooks';
import InfiniteLoader from '../components/InfiniteLoader';

const Cards = () => {
  const { data, loadNext, isFinished } = useFetchContent('resources', {
    populate: ['images'],
  });

  return (
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
                      !!item.images && item.images.length > 0
                        ? item.images[0].formats.small
                          ? item.images[0].formats.small.url
                          : item.images[0].url
                        : '',
                    headerText: item.title,
                    contentType: 'resources',
                    slug: item.slug,
                  }}
                />
              ))}
            </>
          ))}
      </div>
      {!isFinished && <InfiniteLoader handleEnter={loadNext} />}
    </div>
  );
};

export default function Page({ fallback }) {
  const x = useSearchBarTopValue();

  return (
    <Layout showHeaderInitially={true} showHeaderOn="UP" hideHeaderOn="DOWN">
      <Head>
        <title>Recyclopedia - Items</title>
        <meta name="description" content="Recyclopedia" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="bg-blue-light py-4 lg:pt-10 text-white">
        <div className="container max-w-[800px]">
          <h2 className="text-white lg:justify-start">
            <i className="far fa-recycle text-3xl mr-3 mt-1" />
            Recycle
          </h2>
          <p className="text-lg leading-tight ">
            Solutions that are part of the permanent landscape of recycling.
          </p>
        </div>
      </section>
      <SearchBar
        top={x}
        placeholderText="Search Resources"
        className="py-2 sticky lg:relative transition-all duration-200"
        wrapperClassName="max-w-[800px]"
        inactiveBackgroundColor="#224DBF"
        activeBackgroundColor="#224DBF"
      />
      <div className="bg-blue-light pb-2 lg:pb-10"></div>
      <SWRConfig value={{ fallback }}>
        <Cards />
      </SWRConfig>
    </Layout>
  );
}

export async function getStaticProps() {
  const ip = process.env.API_URL;
  const query = qs.stringify({
    populate: ['images'],
    pagination: {
      page: 0,
      pageSize: ITEMS_PER_PAGE,
    },
  });

  const res = await fetch(`${ip}/api/resources?${query}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
  const items = await res.json();

  const cacheQuery = qs.stringify({
    populate: ['images'],
    page: 0,
    pageSize: ITEMS_PER_PAGE,
  });

  const fallback = {};
  fallback[`/api/resources?${cacheQuery}`] = [items.data];
  return { props: { fallback } };

  // return { props: { items: items.data } };
}