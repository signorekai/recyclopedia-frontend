import fetch from 'node-fetch';
import qs from 'qs';
import { object, string, array } from 'yup';
import Head from 'next/head';
import { useMemo } from 'react';

import { staticFetcher } from '../lib/hooks';
import Layout from '../components/Layout';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import { AccordionHeader, AccordionProvider } from '../components/Accordion';

const SingleSearchType = ({ type, query, data, pageOptions }) => {
  const currentPageOpts = pageOptions[type[0]].data;
  const items = data[type[0]];

  return (
    <>
      <section
        className="py-4 lg:py-10 text-white"
        style={{ backgroundColor: currentPageOpts.colour }}>
        <div className="container container--narrow">
          <h1 className="text-white">
            <i
              className={`${
                { Regular: 'far', Light: 'fal', Solid: 'fas' }[
                  currentPageOpts.iconStyle
                ]
              } fa-${currentPageOpts.icon} text-3xl mr-3 mt-1`}
            />
            {currentPageOpts.title}
          </h1>
          <p className="text-lg leading-tight ">
            Search results for &quot;{query}&quot;
          </p>
        </div>
      </section>
      <div className="container container--narrow relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-4 gap-y-4 lg:gap-y-6 mt-6 lg:mt-12 ">
          {items.map((item, key) => (
            <Card
              key={key}
              className="w-full"
              uniqueKey={`card-${key}`}
              content={{
                backgroundImage:
                  item.images.length > 0 ? item.images[0].url : '',
                headerText: item.title,
                slug: item.slug,
                contentType: 'items',
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const MultiSearchType = ({ type, query, data, pageOptions }) => {
  const [headerTabs, contentTabs] = useMemo(() => {
    const headerTabs = [];
    for (const [key, value] of Object.entries(data)) {
      if (value.length > 0) {
        headerTabs.push(key);
      }
    }
    return [headerTabs, data];
  }, [data]);

  return (
    <>
      <div className="container relative z-10 pt-4 lg:pt-10">
        <h1 className="text-black">Search Results</h1>
        <p className="text-lg leading-tight">
          You searched for &quot;{query}&quot;
        </p>
      </div>
      <AccordionProvider headers={headerTabs}>
        <AccordionHeader
          className="mt-6 lg:mt-16"
          carouselClassName="scroll-px-4"
          sliderClassName="lg:max-w-screen-lg mx-auto px-4"
        />
      </AccordionProvider>
    </>
  );
};

export default function Page(props) {
  console.log(props);
  return (
    <Layout showHeaderInitially={true} showHeaderOn="UP" hideHeaderOn="DOWN">
      <Head>
        <title>
          Recyclopedia - Search Results for &quot;{props.query}&quot;
        </title>
      </Head>
      {props.success && props.type.length === 1 && (
        <SingleSearchType {...props} />
      )}
      {props.success && props.type.length > 1 && <MultiSearchType {...props} />}
    </Layout>
  );
}

export async function getServerSideProps({ req, query }) {
  const ip = process.env.API_URL;
  if (req.method === 'GET') {
    // doing search
    const search = {
      type: query?.contentType ? query.contentType.split(',') : [],
      query: query?.searchTerm ? query.searchTerm : '',
    };

    const pageOptions = {};

    search.type.map(async (type) => {
      switch (type) {
        case 'items':
          pageOptions['items'] = await staticFetcher(
            `${ip}/items-page`,
            process.env.API_KEY,
          );
          break;

        case 'resources':
          pageOptions['resources'] = await staticFetcher(
            `${ip}/resource-page`,
            process.env.API_KEY,
            {
              populate: ['resourceTags'],
            },
          );
          break;

        case 'articles':
          pageOptions['articles'] = await staticFetcher(
            `${ip}/news-and-tips-page`,
            process.env.API_KEY,
          );
          break;
      }
    });

    const Schema = object({
      type: array()
        .ensure()
        .of(string().oneOf(['items', 'resources', 'articles']))
        .required('Content type required'),
      query: string().required('Search query required').min(1),
    });

    const validation = await Schema.isValid(search);
    if (validation) {
      const promises = search.type.map((type) => {
        const populateFields = [];
        const filters = {};
        switch (type) {
          case 'items':
            populateFields.push('images', 'itemCategory');
            filters['$or'] = [
              {
                title: { $containsi: search.query },
              },
              {
                alternateSearchTerms: { $containsi: search.query },
              },
            ];
            break;

          case 'resources':
            populateFields.push('images', 'resourceTags');
            filters['$or'] = [
              {
                title: { $containsi: search.query },
              },
              {
                description: { $containsi: search.query },
              },
            ];
            break;

          case 'articles':
            populateFields.push('coverImage', 'category');
            filters['$or'] = [
              {
                title: { $containsi: search.query },
              },
              {
                content: { $containsi: search.query },
              },
            ];
            break;
        }

        const queryString = `${process.env.API_URL}/${type}?${qs.stringify({
          populate: populateFields,
          sort: ['title'],
          pagination: { pageSize: search.type.length > 1 ? 4 : 1000 },
          filters,
        })}`;

        return fetch(queryString, {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }).then((resp) => resp.json());
      });

      const data = {};
      await Promise.all(promises).then((results) => {
        results.map((result, key) => {
          data[search.type[key]] = result.data;
        });
      });

      return {
        props: {
          success: true,
          ...search,
          data,
          pageOptions,
        },
      };
    } else {
      return {
        props: {
          success: false,
          error: 'failed verification',
        },
      };
    }
  } else {
    return {
      props: {
        success: false,
        error: 'not POST',
      },
    };
  }
}
