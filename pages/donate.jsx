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
        className={`grid grid-cols-2 ${
          { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[
            columnCount
          ]
        } gap-x-2 gap-y-4 lg:gap-x-7 lg:gap-y-6 lg:mt-6`}>
        {resources.map((items) => {
          return items.map((item, key) => (
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
        className={`grid grid-cols-2 md:grid-cols-3 ${
          { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[
            columnCount
          ]
        } gap-x-2 gap-y-4 lg:gap-x-7 lg:gap-y-6 lg:mt-6`}>
        {resources.map((items) => {
          return items.map((item, key) => (
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
    <Layout showHeaderInitially={true} showHeaderOn="UP" hideHeaderOn="DOWN">
      <Head>
        <title>Recyclopedia - {pageOptions.title}</title>
        <meta name="description" content={pageOptions.subtitle} />
      </Head>
      <section
        className="py-4 lg:pt-10 text-white"
        style={{ backgroundColor: pageOptions.colour }}>
        <div className="container container--narrow">
          <h1 className="text-white lg:justify-start">
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
      <SearchBar
        top={x}
        placeholderText={`Search ${pageOptions.title}`}
        className="py-2 sticky lg:relative transition-all duration-200 z-20"
        wrapperClassName="max-w-[800px]"
        inactiveBackgroundColor={pageOptions.colour}
        activeBackgroundColor={pageOptions.colour}
      />
      <SWRConfig value={{ fallback }}>
        <Cards tags={resourceTags} columnCount={pageOptions.gridColumnCount} />
      </SWRConfig>
    </Layout>
  );
}

export async function getStaticProps() {
  const ip = process.env.API_URL;
  const fallback = {};

  const pageQuery = {
    populate: ['resourceTags'],
  };

  const pageResponse = await fetch(
    `${ip}/api/donate-page?${qs.stringify(pageQuery)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );

  const { data: pageOptions } = await pageResponse.json();

  const resourceQueryTemplate = {
    populate: ['images'],
    fields: ['title', 'slug'],
    pagination: {
      page: 1,
      pageSize: ITEMS_PER_PAGE,
    },
  };

  // get data of every related resourceTag
  const promises = pageOptions.resourceTags.map(async ({ title }) => {
    const query = qs.stringify({
      ...resourceQueryTemplate,
      filters: { resourceTags: { title: { $eq: title } } },
    });

    const response = await fetch(`${ip}/api/resources?${query}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    const result = await response.json();

    const cacheQuery = qs.stringify({
      ...strapiAPIQueryTemplate,
      tag: title,
    });

    fallback[`/api/resources?${cacheQuery}`] = [result.data];
    return true;
  });

  // get data of all resources in all resourceTag
  const titles = pageOptions.resourceTags.map(({ title }) => title);

  const query = qs.stringify({
    ...resourceQueryTemplate,
    filters: { resourceTags: { title: { $in: titles } } },
  });

  const response = await fetch(`${ip}/api/resources?${query}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
  const result = await response.json();

  const cacheQuery = qs.stringify({
    ...strapiAPIQueryTemplate,
    tag: titles.join(','),
  });

  fallback[`/api/resources?${cacheQuery}`] = [result.data];
  await Promise.all(promises);

  return { props: { fallback, pageOptions, resourceTags: titles } };
}
