import { useEffect } from 'react';
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
import { getLargestPossibleImage } from '../lib/functions';

const Cards = ({ columnCount = 3 }) => {
  const { data, loadNext, isFinished, error } = useFetchContent('items', {
    populate: ['images'],
  });

  return (
    <div className="container">
      <div
        className={`cards ${
          { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[
            columnCount
          ]
        }`}>
        {data &&
          data.map((items) => {
            return items.map((item, key) => (
              <Card
                key={key}
                className="w-full"
                uniqueKey={`card-${key}`}
                content={{
                  images: item.images,
                  headerText: item.title,
                  contentType: 'items',
                  slug: item.slug,
                }}
              />
            ));
          })}
      </div>
      {!isFinished && <InfiniteLoader handleEnter={loadNext} />}
    </div>
  );
};

export default function Page({ fallback, pageOptions }) {
  const x = useSearchBarTopValue();

  return (
    <Layout headerContainerStyle={{ backgroundColor: pageOptions.colour }}>
      <Head>
        <title>Recyclopedia - {pageOptions.title}</title>
        <meta name="description" content={pageOptions.subtitle} />
      </Head>
      <section
        className="py-4 lg:pt-10 text-white"
        style={{ backgroundColor: pageOptions.colour }}>
        <div className="container ">
          <h1 className="text-white">
            <i
              className={`${
                { Regular: 'far', Light: 'fal', Solid: 'fas' }[
                  pageOptions.iconStyle
                ]
              } fa-${pageOptions.icon} text-3xl mr-3 mt-1`}
            />
            {pageOptions.title}
          </h1>
          <p className="text-lg leading-tight ">{pageOptions.subtitle}</p>
        </div>
      </section>
      <SearchBar
        top={x}
        className="z-20 py-2 sticky lg:relative transition-all duration-200"
        wrapperClassName="max-w-[1040px]"
        searchSuggestionsClass=""
        inactiveBackgroundColor={pageOptions.colour}
        activeBackgroundColor={pageOptions.colour}
      />
      <SWRConfig value={{ fallback }}>
        <Cards columnCount={pageOptions.gridColumnCount} />
      </SWRConfig>
    </Layout>
  );
}

export async function getStaticProps() {
  const ip = process.env.API_URL;
  const pageQuery = {
    populate: ['resourceTags'],
  };

  const pageResponse = await fetch(
    `${ip}/items-page?${qs.stringify(pageQuery)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );

  const { data: pageOptions } = await pageResponse.json();

  const query = qs.stringify({
    populate: ['images'],
    fields: ['title', 'slug'],
    sort: ['visits:desc', 'title'],
    pagination: {
      page: 0,
      pageSize: ITEMS_PER_PAGE,
    },
  });

  const res = await fetch(`${ip}/items?${query}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
  const items = await res.json();

  const cacheQuery = qs.stringify({
    populate: ['images'],
    fields: ['title', 'slug'],
    page: 0,
    pageSize: ITEMS_PER_PAGE,
  });

  const fallback = {};
  fallback[`/api/items?${cacheQuery}`] = [items.data];
  return { props: { fallback, pageOptions } };

  // return { props: { items: items.data } };
}
