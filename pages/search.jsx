import fetch from 'node-fetch';
import qs from 'qs';
import { object, string, array } from 'yup';
import Head from 'next/head';
import { useMemo } from 'react';

import {
  staticFetcher,
  useSearchBarTopValue,
  useWindowDimensions,
} from '../lib/hooks';
import Layout from '../components/Layout';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import {
  AccordionHeader,
  AccordionProvider,
  AccordionBody,
} from '../components/Accordion';
import { Carousel, CarouselCard } from '../components/Carousel';

const SingleSearchType = ({
  type,
  query,
  items,
  pageOptions,
  showHeader = true,
}) => {
  const x = useSearchBarTopValue();
  return (
    <>
      {showHeader && (
        <>
          <section
            className={`py-4 lg:py-10 text-white`}
            style={{ backgroundColor: pageOptions.colour }}>
            <div className={`container ${items ? '' : 'container--narrow'}`}>
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
              <p className="text-lg leading-tight ">
                {items ? items.length : 0} search results for &quot;{query}
                &quot;
              </p>
            </div>
          </section>
          {typeof items === 'undefined' && (
            <SearchBar
              top={x}
              placeholderText="Try searching something else?"
              className="pt-0 pb-2 sticky lg:relative transition-all duration-200"
              searchType={[type]}
              wrapperClassName="max-w-[800px]"
              inactiveBackgroundColor={pageOptions.colour}
              activeBackgroundColor={pageOptions.colour}
            />
          )}
        </>
      )}
      <div className="container relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-4 gap-y-4 lg:gap-y-6 mt-6 ">
          {items &&
            items.map((item, key) => {
              let backgroundImage;

              switch (type) {
                case 'items':
                case 'resources':
                  backgroundImage = item.images[0]?.formats.large
                    ? item.images[0]?.formats.large.url
                    : item.images[0]?.url;
                  break;

                case 'items':
                case 'articles':
                  backgroundImage = item.coverImage.formats.large
                    ? item.coverImage.formats.large.url
                    : item.coverImage.url;
                  break;
              }
              return (
                <Card
                  key={key}
                  className="w-full"
                  uniqueKey={`card-${key}`}
                  content={{
                    backgroundImage,
                    headerText: item.title,
                    slug: item.slug,
                    contentType: type,
                  }}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

const MultiSearchType = ({ type, query, data, pageOptions }) => {
  const { width } = useWindowDimensions();
  const [headerTabs, contentTabs] = useMemo(() => {
    const headerTabs = [];

    const contentTabs = {
      All: (
        <div className="container">
          {Object.entries(data).map(([type, values], key) => {
            return (
              <div className="mt-6" key={key}>
                <h2 className="text-black block">
                  <i
                    className={`${
                      { Regular: 'far', Light: 'fal', Solid: 'fas' }[
                        pageOptions[type].data.iconStyle
                      ]
                    } fa-${pageOptions[type].data.icon} text-3xl mr-3 mt-1`}
                  />
                  {pageOptions[type].data.title}
                </h2>
                <Carousel
                  desktopControls={true}
                  showNav={false}
                  autoSlideSize={false}
                  slideWidth={width * 0.2}>
                  {values.map((item, itemKey) => {
                    let backgroundImage;

                    switch (type) {
                      case 'items':
                      case 'resources':
                        backgroundImage = item.images[0]?.formats.large
                          ? item.images[0]?.formats.large.url
                          : item.images[0]?.url;
                        break;

                      case 'items':
                        backgroundImage = item.coverImage.formats.large
                          ? item.coverImage.formats.large.url
                          : item.coverImage.url;
                        break;
                    }

                    return (
                      <CarouselCard key={itemKey} className="w-[20vw]">
                        <Card
                          className="w-full"
                          imgClassName="h-[200px]"
                          uniqueKey={`news-${item.slug}`}
                          content={{
                            backgroundImage,
                            headerText: item.title,
                            slug: item.slug,
                            contentType: type,
                          }}
                        />
                      </CarouselCard>
                    );
                  })}
                </Carousel>
              </div>
            );
          })}
        </div>
      ),
    };
    for (const [key, value] of Object.entries(data)) {
      if (value.length > 0) {
        headerTabs.push(key);
        contentTabs[key] = (
          <SingleSearchType
            showHeader={false}
            type={key}
            query={query}
            items={data[key]}
            pageOptions={pageOptions[key].data}
          />
        );
      }
    }
    return [headerTabs, contentTabs];
  }, [data, pageOptions, query]);

  return (
    <>
      <div className="container relative z-10 pt-4 lg:pt-10">
        <h1 className="text-black">Search Results</h1>
        <p className="text-lg leading-tight">
          You searched for &quot;{query}&quot;
        </p>
      </div>
      <AccordionProvider headers={['All', ...headerTabs]}>
        <AccordionHeader
          className="mt-6"
          carouselClassName="scroll-px-4"
          sliderClassName="lg:max-w-screen-lg mx-auto px-6"
        />
        <AccordionBody {...contentTabs} />
      </AccordionProvider>
    </>
  );
};

export default function Page(props) {
  return (
    <Layout showHeaderInitially={true} showHeaderOn="UP" hideHeaderOn="DOWN">
      <Head>
        <title>
          Recyclopedia - Search Results for &quot;{props.query}&quot;
        </title>
      </Head>
      {props.success && props.type.length === 1 && (
        <SingleSearchType
          type={props.type[0]}
          query={props.query}
          pageOptions={props.pageOptions[props.type[0]].data}
          items={props.data[props.type[0]]}
        />
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

        case 'donate':
          pageOptions['donate'] = await staticFetcher(
            `${ip}/donate-page`,
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
        .of(string().oneOf(['items', 'resources', 'articles', 'donate']))
        .required('Content type required'),
      query: string().required('Search query required').min(1),
    });

    const validation = await Schema.isValid(search);
    if (validation) {
      const promises = search.type.map((type) => {
        const populateFields = [];
        const filters = {};
        let contentType = type;
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

          case 'donate':
            contentType = 'resources';
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

        const queryString = `${
          process.env.API_URL
        }/${contentType}?${qs.stringify({
          populate: populateFields,
          sort: ['title'],
          pagination: 1000,
          filters,
        })}`;

        console.log(queryString);

        return fetch(queryString, {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }).then((resp) => resp.json());
      });

      const data = {};
      await Promise.all(promises).then((results) => {
        results.map((result, key) => {
          if (result.data.length > 0) {
            data[search.type[key]] = result.data;
          }
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
