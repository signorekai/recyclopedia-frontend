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
  staticFetcher,
} from '../lib/hooks';
import InfiniteLoader from '../components/InfiniteLoader';
import {
  AccordionBody,
  AccordionHeader,
  AccordionProvider,
} from '../components/Accordion';

const strapiAPIQueryTemplate = {
  populate: ['images'],
  page: 0,
  pageSize: ITEMS_PER_PAGE,
};

const ResourceTab = ({ tag, columnCount = 3 }) => {
  const {
    data: resources,
    loadNext,
    isFinished,
    error,
  } = useFetchContent('resources', {
    tag,
  });

  return (
    <>
      <div
        className={`grid grid-cols-2 md:grid-cols-3 ${
          { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[
            columnCount
          ]
        } gap-x-2 gap-y-4 lg:gap-x-7 lg:gap-y-6 mt-6`}>
        {resources.map((items) => {
          return items.map((item, key) => (
            <Card
              key={key}
              className="w-full"
              uniqueKey={`card-${key}`}
              prefixIcon={item.resourceIcon || ''}
              content={{
                image: item.images ? item.images[0] : {},
                headerText: item.title,
                contentType: 'resources',
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

const Cards = ({ tags, columnCount = 3 }) => {
  const {
    data: resources,
    loadNext,
    isFinished,
  } = useFetchContent('resources', {
    populate: ['images'],
    tag: tags.join(','),
  });

  const items = {};
  items['All'] = (
    <>
      <div
        className={`cards ${
          { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[
            columnCount
          ]
        }`}>
        {resources.map((items) => {
          return items.map((item, key) => (
            <Card
              key={key}
              className="w-full"
              uniqueKey={`card-${key}`}
              prefixIcon={item.resourceIcon || ''}
              content={{
                image: item.images ? item.images[0] : {},
                headerText: item.title,
                contentType: 'resources',
                slug: item.slug,
              }}
            />
          ));
        })}
      </div>
      {!isFinished && <InfiniteLoader handleEnter={loadNext} />}
    </>
  );

  tags.map((tag, key) => {
    items[tag] = <ResourceTab columnCount={columnCount} key={key} tag={tag} />;
  });

  return (
    <div className="container">
      {tags && (
        <AccordionProvider headers={['All', ...tags.map((title) => title)]}>
          <AccordionHeader />
          <AccordionBody {...items} />
        </AccordionProvider>
      )}
    </div>
  );
};

export default function Page({ fallback, pageOptions, resourceTags }) {
  const x = useSearchBarTopValue();

  return (
    <Layout
      title={pageOptions.title}
      headerContainerStyle={{ backgroundColor: pageOptions.colour }}>
      <Head>
        <meta name="description" content={pageOptions.subtitle} />
      </Head>
      <section
        className="py-4 lg:py-10 text-white"
        style={{ backgroundColor: pageOptions.colour }}>
        <div className="container">
          <h1 className="text-white">
            <i
              className={`${
                { Regular: 'far', Solid: 'fas', Light: 'fal' }[
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
        <Cards tags={resourceTags} columnCount={pageOptions.gridColumnCount} />
      </SWRConfig>
    </Layout>
  );
}

export async function getStaticProps() {
  const ip = process.env.API_URL;
  const fallback = {};

  const { data: pageOptions } = await staticFetcher(
    `${ip}/resource-page`,
    process.env.API_KEY,
    {
      populate: ['resourceTags'],
    },
  );

  const resourceQueryTemplate = {
    populate: ['images'],
    sort: ['title'],
    fields: ['title', 'slug', 'resourceIcon'],
    publicationState: 'live',
    pagination: {
      page: 1,
      pageSize: ITEMS_PER_PAGE,
    },
  };

  // get data of every related resourceTag
  const promises = pageOptions.resourceTags.map(async ({ title }) => {
    const { data: result } = await staticFetcher(
      `${ip}/resources?${qs.stringify({
        ...resourceQueryTemplate,
        filters: { resourceTags: { title: { $eq: title } } },
      })}`,
      process.env.API_KEY,
    );

    fallback[
      `/api/resources?${qs.stringify({
        ...strapiAPIQueryTemplate,
        tag: title,
      })}`
    ] = [result];
    return true;
  });

  // get data of all resources in all resourceTag
  const titles = pageOptions.resourceTags.map(({ title }) => title);

  const { data: result } = await staticFetcher(
    `${ip}/resources?${qs.stringify({
      ...resourceQueryTemplate,
      filters: { resourceTags: { title: { $in: titles } } },
    })}`,
    process.env.API_KEY,
  );

  fallback[
    `/api/resources?${qs.stringify({
      ...strapiAPIQueryTemplate,
      tag: titles.join(','),
    })}`
  ] = [result];
  await Promise.all(promises);

  return { props: { fallback, pageOptions, resourceTags: titles } };
}
