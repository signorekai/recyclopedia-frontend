import qs from 'qs';
import Head from 'next/head';
import { SWRConfig } from 'swr';

import Layout from './Layout';
import Card from './Card';
import {
  useFetchContent,
  useSearchBarTopValue,
  ITEMS_PER_PAGE,
  staticFetcher,
} from '../lib/hooks';
import InfiniteLoader from './InfiniteLoader';
import { AccordionBody, AccordionHeader, AccordionProvider } from './Accordion';

const strapiAPIQueryTemplate = {
  populate: ['images'],
  page: 0,
  pageSize: ITEMS_PER_PAGE,
};

const ResourceTab = ({ tag, columnCount = 3, contentType }) => {
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
                contentType,
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

const Cards = ({ tags, columnCount = 3, contentType }) => {
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
                contentType,
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
    items[tag] = (
      <ResourceTab
        contentType={contentType}
        columnCount={columnCount}
        key={key}
        tag={tag}
      />
    );
  });

  return (
    <>
      {tags && (
        <AccordionProvider headers={['All', ...tags.map((title) => title)]}>
          <div className="lg:container">
            <AccordionHeader className="px-4 lg:px-0" />
          </div>
          <AccordionBody className="container" {...items} />
        </AccordionProvider>
      )}
    </>
  );
};

export async function getListingStaticProps({ contentUrl }) {
  const API_URL = process.env.API_URL;
  const API_KEY = process.env.API_KEY;

  const fallback = {};

  const pageQuery = {
    populate: ['resourceTags'],
  };

  const { data: pageOptions } = await staticFetcher(
    `${API_URL}/${contentUrl}`,
    API_KEY,
    pageQuery,
  );

  const resourceQueryTemplate = {
    populate: ['images'],
    fields: ['title', 'slug'],
    publicationState: 'live',
    pagination: {
      page: 1,
      pageSize: ITEMS_PER_PAGE,
    },
  };

  // get data of every related resourceTag
  const promises = pageOptions.resourceTags.map(async ({ title }) => {
    const query = {
      ...resourceQueryTemplate,
      filters: { resourceTags: { title: { $eq: title } } },
    };

    const result = await staticFetcher(`${API_URL}/resources`, API_KEY, query);

    const cacheQuery = qs.stringify({
      ...strapiAPIQueryTemplate,
      tag: title,
    });

    fallback[`/api/resources?${cacheQuery}`] = [result.data];
    return true;
  });

  // get data of all resources in all resourceTag
  const titles = pageOptions.resourceTags.map(({ title }) => title);

  const query = {
    ...resourceQueryTemplate,
    filters: { resourceTags: { title: { $in: titles } } },
  };

  const result = await staticFetcher(`${API_URL}/resources`, API_KEY, query);

  const cacheQuery = qs.stringify({
    ...strapiAPIQueryTemplate,
    tag: titles.join(','),
  });

  console.log(186, `/api/resources?${cacheQuery}`);

  fallback[`/api/resources?${cacheQuery}`] = [result.data];
  await Promise.all(promises);

  return {
    fallback,
    pageOptions,
    resourceTags: titles,
  };
}

export default function ListingPage({
  fallback,
  pageOptions,
  resourceTags,
  contentType,
}) {
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
        <Cards
          contentType={contentType}
          tags={resourceTags}
          columnCount={pageOptions.gridColumnCount}
        />
      </SWRConfig>
    </Layout>
  );
}
