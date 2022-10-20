import Head from 'next/head';
import { SWRConfig } from 'swr';
import qs from 'qs';

import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import {
  useFetchContent,
  useSearchBarTopValue,
  ITEMS_PER_PAGE,
  staticFetcher,
} from '../lib/hooks';
import InfiniteLoader from '../components/InfiniteLoader';
import {
  AccordionBody,
  AccordionHeader,
  AccordionProvider,
} from '../components/Accordion';

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
    <div className="container">
      {categories && (
        <AccordionProvider headers={['All', ...categories]}>
          <AccordionHeader />
          <AccordionBody {...cards} />
        </AccordionProvider>
      )}
    </div>
  );
};

export default function Page({ fallback, pageOptions, categories }) {
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
      <div className="container mt-4 lg:mt-6">
        <h4 className="text-grey-dark text-sm lg:text-lg font-thin">
          Sorted by Popularity
        </h4>
      </div>
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
    populate: ['resourceTags'],
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
