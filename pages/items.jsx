import Head from 'next/head';
import { SWRConfig } from 'swr';
import qs from 'qs';

import Layout from '../components/Layout';
import Card from '../components/Card';
import { useFetchContent, ITEMS_PER_PAGE, staticFetcher } from '../lib/hooks';
import InfiniteLoader from '../components/InfiniteLoader';
import {
  AccordionBody,
  AccordionHeader,
  AccordionProvider,
} from '../components/Accordion';
import OpenGraph, { getOpengraphTags } from '../components/OpenGraph';

const itemsCacheParams = {
  populate: ['images'],
  page: 0,
  pageSize: ITEMS_PER_PAGE,
};

const Tab = ({ category, columnCount = 3 }) => {
  const {
    data: items,
    loadNext,
    isFinished,
    error,
  } = useFetchContent('items', {
    category,
  });

  return (
    <>
      <div
        className={`cards ${
          { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[
            columnCount
          ]
        }`}>
        {items &&
          items.map((itemBatch) => {
            return itemBatch.map((item, key) => (
              <Card
                key={key}
                className="w-full"
                uniqueKey={`card-${key}-${item.slug}`}
                prefixIcon={item.resourceIcon || ''}
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
    </>
  );
};

const Cards = ({ categories, columnCount = 3 }) => {
  const {
    data: items,
    loadNext,
    isFinished,
    error,
  } = useFetchContent('items', {
    populate: ['images'],
    category: categories.join('||'),
  });

  const cards = {};
  cards['All'] = (
    <>
      <div
        className={`cards ${
          { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[
            columnCount
          ]
        }`}>
        {items &&
          items.map((itemBatch) => {
            return itemBatch.map((item, key) => (
              <Card
                key={key}
                className="w-full"
                uniqueKey={`card-${key}-${item.slug}`}
                prefixIcon={item.resourceIcon || ''}
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
    </>
  );

  categories.map((category, key) => {
    cards[category] = (
      <Tab columnCount={columnCount} key={key} category={category} />
    );
  });

  return (
    <>
      {categories && (
        <AccordionProvider headers={['All', ...categories]}>
          <div className="lg:container">
            <AccordionHeader className="" />
          </div>
          <div className="container mt-4 lg:mt-6">
            <h4 className="text-grey-dark text-sm lg:text-lg font-thin">
              Sorted by Popularity
            </h4>
          </div>
          <AccordionBody className="container" {...cards} />
        </AccordionProvider>
      )}
    </>
  );
};

export default function Page({ fallback, pageOptions, categories }) {
  const { title, subtitle, SEO } = pageOptions;
  const meta = getOpengraphTags({ title, description: subtitle }, SEO);

  return (
    <Layout
      title={pageOptions.title}
      headerContainerStyle={{ backgroundColor: pageOptions.colour }}>
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
      <section
        className="py-4 lg:py-8 text-white"
        style={{ backgroundColor: pageOptions.colour }}>
        <div className="container ">
          <h1 className="text-white mb-2">
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
      <SWRConfig value={{ fallback }}>
        <Cards
          categories={categories}
          columnCount={pageOptions.gridColumnCount}
        />
      </SWRConfig>
    </Layout>
  );
}

export async function getStaticProps() {
  const ip = process.env.API_URL;

  const page = await staticFetcher(`${ip}/items-page`, process.env.API_KEY, {
    populate: ['resourceTags', 'SEO', 'SEO.image'],
  });
  const { data: pageOptions } = page;

  const { data: categories } = await staticFetcher(
    `${ip}/item-categories`,
    process.env.API_KEY,
    {
      sort: ['title'],
    },
  );

  const itemsParams = {
    populate: ['images'],
    fields: ['title', 'slug'],
    publicationState: 'live',
    sort: ['visits:desc', 'title'],
    pagination: {
      page: 0,
      pageSize: ITEMS_PER_PAGE,
    },
  };

  const { data: items } = await staticFetcher(
    `${ip}/items`,
    process.env.API_KEY,
    itemsParams,
  );

  const fallback = {
    [`/api/items?${qs.stringify({
      ...itemsCacheParams,
      category: categories.map(({ title }) => title).join('||'),
    })}`]: [items],
  };

  const promises = categories.map(async ({ title }) => {
    const { data: result } = await staticFetcher(
      `${ip}/items`,
      process.env.API_KEY,
      {
        ...itemsParams,
        filters: { itemCategory: { title: { $eq: title } } },
      },
    );

    fallback[
      `/api/items?${qs.stringify({ ...itemsCacheParams, category: title })}`
    ] = [result];
  });

  await Promise.all(promises);

  return {
    props: {
      fallback,
      pageOptions,
      categories: categories.map(({ title }) => title),
    },
  };
}
