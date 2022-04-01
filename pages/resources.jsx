import Head from 'next/head';
import qs from 'qs';
import useSWR, { SWRConfig } from 'swr';

import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import {
  useFetchContent,
  useSearchBarTopValue,
  ITEMS_PER_PAGE,
  SWRFetcher,
} from '../lib/hooks';
import InfiniteLoader from '../components/InfiniteLoader';
import {
  AccordionBody,
  AccordionHeader,
  AccordionProvider,
} from '../components/Accordion';

const resourceTagQuery = qs.stringify({
  sort: 'title',
  pagination: {
    page: 1,
    pageSize: 100000,
  },
});

const resourceCacheQuery = {
  populate: ['images'],
  page: 0,
  pageSize: ITEMS_PER_PAGE,
};

const ResourceTab = ({ tag }) => {
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 lg:gap-x-7 lg:gap-y-6 mt-6">
        {resources.map((items) => (
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
    </>
  );
};

const Cards = () => {
  const {
    data: resources,
    loadNext,
    isFinished,
  } = useFetchContent('resources', {
    populate: ['images'],
  });

  const { data: resourceTags } = useSWR(`/api/resource-tags`, SWRFetcher);

  const items = {};

  items['All'] = (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 lg:gap-x-7 lg:gap-y-6 mt-6">
        {resources.map((items) => (
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
    </>
  );

  resourceTags.map(({ title }, key) => {
    items[title] = <ResourceTab tag={title} />;
  });

  return (
    <div className="container">
      {resourceTags && (
        <AccordionProvider
          headers={['All', ...resourceTags.map(({ title }) => title)]}>
          <AccordionHeader />
          <AccordionBody {...items} />
        </AccordionProvider>
      )}
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
        className="py-2 sticky lg:relative transition-all duration-200 z-20"
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
  const resourceQuery = {
    populate: ['images'],
    fields: ['title'],
    pagination: {
      page: 1,
      pageSize: ITEMS_PER_PAGE,
    },
  };

  const resourceResponse = await fetch(
    `${ip}/api/resources?${qs.stringify(resourceQuery)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );
  const resources = await resourceResponse.json();

  ////////////////////////////////////////////////////////////////////

  const resourceTagResponse = await fetch(
    `${ip}/api/resource-tags?${resourceTagQuery}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );
  const resourceTags = await resourceTagResponse.json();

  ////////////////////////////////////////////////////////////////////

  const fallback = {};
  fallback[`/api/resources?${qs.stringify(resourceCacheQuery)}`] = [
    resources.data,
  ];
  fallback[`/api/resource-tags`] = resourceTags.data;

  const promises = resourceTags.data.map(async ({ title }) => {
    const query = qs.stringify({
      ...resourceQuery,
      filters: { resourceTags: { title: { $eq: title } } },
    });

    const response = await fetch(`${ip}/api/resources?${query}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    const result = await response.json();

    const cacheQuery = qs.stringify({
      ...resourceCacheQuery,
      tag: title,
    });

    fallback[`/api/resources?${cacheQuery}`] = [result.data];
    return true;
  });

  await Promise.all(promises);

  return { props: { fallback } };
}
