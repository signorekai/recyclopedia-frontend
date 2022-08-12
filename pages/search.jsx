import fetch from 'node-fetch';
import qs from 'qs';
import { object, string, array } from 'yup';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { staticFetcher, useWindowDimensions } from '../lib/hooks';
import Layout from '../components/Layout';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import {
  AccordionHeader,
  AccordionProvider,
  AccordionBody,
} from '../components/Accordion';
import { Carousel, CarouselCard } from '../components/Carousel';
import { getOrSetVisitorToken } from '../lib/analytics';
import { FeedbackModal } from '../components/Report';

const SingleSearchType = ({
  type,
  query,
  items,
  pageOptions,
  showHeader = true,
  className = '',
}) => {
  const [openModal, setOpenModal] = useState(false);
  const _handleClick = () => {
    setOpenModal(!openModal);
  };

  return (
    <>
      {showHeader && (
        <>
          <section
            className={`pt-4 pb-1 lg:pt-10 ${
              type === 'articles' ? 'text-black' : 'text-white'
            }`}
            style={{ backgroundColor: pageOptions.colour }}>
            <div
              className={`container ${
                items && items.length === 0 && `container--narrow`
              }`}>
              <h1
                className={`${
                  type === 'articles' ? 'text-black' : 'text-white'
                }`}>
                <i
                  className={`${
                    { Regular: 'far', Light: 'fal', Solid: 'fas' }[
                      pageOptions.iconStyle
                    ]
                  } fa-${pageOptions.icon} text-3xl mr-3 mt-1`}
                />
                {pageOptions.title}
              </h1>
              {items && items.length > 0 && (
                <p className="text-lg my-3 leading-tight">
                  {items.length} search results for &quot;{query}
                  &quot;
                </p>
              )}
            </div>
          </section>
          <SearchBar
            placeholderText={
              typeof items === 'undefined'
                ? `Try searching something else?`
                : 'Search for something else'
            }
            className="pt-0 pb-2 sticky lg:relative transition-all duration-200"
            showSuggestions={false}
            searchType={[type]}
            wrapperClassName={
              items && items.length > 0 ? `max-w-[1040px]` : `max-w-[800px]`
            }
            inactiveBackgroundColor={pageOptions.colour}
            activeBackgroundColor={pageOptions.colour}
          />
        </>
      )}
      {items && items.length > 0 && (
        <div className={`container relative z-10 ${className}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-4 gap-y-4 lg:gap-y-6 mt-6 ">
            {items.map((item, key) => {
              let image;

              switch (type) {
                case 'articles':
                  image = item.coverImage ? item.coverImage : {};
                  break;

                default:
                  image = item.images ? item.images[0] : {};
                  break;
              }
              return (
                <Card
                  key={key}
                  className="w-full"
                  uniqueKey={`card-${key}`}
                  content={{
                    image,
                    headerText: item.title,
                    slug: item.slug,
                    contentType: type,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
      {items && items.length === 0 && (
        <div
          className={`container relative container--narrow z-10 ${className}`}>
          <h2 className="text-black block mt-4 lg:mt-10">0 results found</h2>
          <p className="mt-4 text-sm md:text-base">
            Double check your search, or try a different term.
          </p>
          <p className="mt-8 lg:mt-12 lg:text-lg">
            Have something in mind you can’t find here? You can help us build up
            our database which in turn helps the community.{' '}
          </p>
          <button
            onClick={_handleClick}
            className="mt-4 hover:opacity-80 text-lg text-coral">
            Make a suggestion
            <i className="p-2 far fa-arrow-right" />
          </button>
          <FeedbackModal
            openModal={openModal}
            topic="Make A Suggestion"
            handleClick={_handleClick}
          />
        </div>
      )}
    </>
  );
};

const MultiSearchType = ({ type, query, data, pageOptions }) => {
  const { width } = useWindowDimensions();
  const CardWidth = width > 1080 ? 24 : 40;
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const _handleClick = () => {
    setOpenModal(!openModal);
  };

  const [headerTabs, contentTabs, totalItemsCount] = useMemo(() => {
    let totalItemsCount = 0;
    const headerTabs = [];

    const contentTabs = {
      All: (
        <div className="container">
          {Object.entries(data).map(([type, values], key) => {
            const truncatedResults = values.slice(0, 3);
            return (
              <div className="mt-6 divider-b divider-b-8" key={key}>
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
                  desktopControls={false}
                  showNav={false}
                  autoSlideSize={false}
                  slideWidth={
                    width > 1080
                      ? 1040 * (CardWidth / 100)
                      : width * (CardWidth / 100)
                  }>
                  {truncatedResults.map((item, itemKey) => {
                    let image;

                    switch (type) {
                      case 'articles':
                        image = item.coverImage ? item.coverImage : {};
                        break;

                      default:
                        image = item.images ? item.images[0] : {};
                        break;
                    }
                    return (
                      <CarouselCard
                        key={itemKey}
                        style={{
                          width:
                            width > 1080
                              ? `${(CardWidth / 100) * 1040}px`
                              : `${CardWidth}vw`,
                        }}>
                        <Card
                          className="w-full"
                          uniqueKey={`${type}-${item.slug}`}
                          content={{
                            image,
                            headerText: item.title,
                            slug: item.slug,
                            contentType: type,
                          }}
                        />
                      </CarouselCard>
                    );
                  })}
                  <CarouselCard
                    uniqueKey={`${type}-see-all`}
                    className="aspect-square"
                    style={{
                      width:
                        width > 1080
                          ? `${(CardWidth / 100) * 1040}px`
                          : `${CardWidth}vw`,
                    }}>
                    <button
                      onClick={() => {
                        const queryParams = router.query;
                        queryParams['section'] = type;
                        router.push(`?${qs.stringify(queryParams)}`, null, {
                          shallow: true,
                        });
                      }}
                      className="w-full h-full bg-coral text-white rounded-[4px]">
                      <i className="fal fa-search" />
                      <br />
                      View All Results
                    </button>
                  </CarouselCard>
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
      totalItemsCount += value.length;
    }
    return [headerTabs, contentTabs, totalItemsCount];
  }, [CardWidth, data, pageOptions, query, width]);

  return (
    <>
      <div
        className={`container relative z-10 pt-4 lg:pt-10 ${
          totalItemsCount === 0 && 'container--narrow'
        }`}>
        <h1 className="text-black">Search Results</h1>
      </div>
      <SearchBar
        placeholderText={
          totalItemsCount > 0 ? query : 'Search for something else'
        }
        searchType={type}
        showBottomSpacing={false}
        showSuggestions={false}
        className="mt-4"
        searchSuggestionsClassName="!bg-grey-white border-x-1 border-b-1 border-black"
        modalSearchBarWrapperClassName="!bg-blue-dark"
        wrapperClassName={`!border-1
          ${totalItemsCount > 0 ? `max-w-[1040px]` : `max-w-[800px]`}
        `}
      />
      {totalItemsCount > 0 && (
        <AccordionProvider headers={['All', ...headerTabs]}>
          <AccordionHeader
            className="mt-10"
            carouselClassName="scroll-px-4"
            sliderClassName="lg:max-w-screen-lg mx-auto px-6"
          />
          <AccordionBody {...contentTabs} />
        </AccordionProvider>
      )}
      <div className="border-b-1 mt-4 mb-6 lg:my-10 block w-full border-grey"></div>
      {totalItemsCount === 0 && (
        <div className={`container relative container--narrow z-10`}>
          <h2 className="text-black block mt-4 lg:mt-10">0 results found</h2>
          <p className="mt-4 text-sm md:text-base">
            Double check your search, or try a different term.
          </p>
          <p className="mt-8 lg:mt-12 lg:text-lg">
            Have something in mind you can’t find here? You can help us build up
            our database which in turn helps the community.{' '}
          </p>
          <button
            onClick={_handleClick}
            className="mt-4 hover:opacity-80 text-lg text-coral">
            Make a suggestion
            <i className="p-2 far fa-arrow-right" />
          </button>
          <FeedbackModal
            openModal={openModal}
            topic="Make A Suggestion"
            handleClick={_handleClick}
          />
        </div>
      )}
    </>
  );
};

export default function Page(props) {
  return (
    <Layout>
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
          items={props.data[props.type[0]] || []}
        />
      )}
      {props.success && props.type.length > 1 && <MultiSearchType {...props} />}
    </Layout>
  );
}

export async function getServerSideProps({ req, query, res }) {
  const ip = process.env.API_URL;
  if (req.method === 'GET') {
    // doing search
    const search = {
      type: query?.contentType ? query.contentType.split(',') : [],
      query: query?.searchTerm ? query.searchTerm : '',
    };

    const pageOptions = {};

    await Promise.all(
      search.type.map(async (type) => {
        switch (type) {
          case 'items':
            pageOptions['items'] = await staticFetcher(
              `${ip}/items-page`,
              process.env.API_KEY,
            );
            console.log('pageOptions fetched!');
            return true;
            break;

          case 'resources':
            pageOptions['resources'] = await staticFetcher(
              `${ip}/resource-page`,
              process.env.API_KEY,
              {
                populate: ['resourceTags'],
              },
            );
            console.log('pageOptions fetched!');
            return true;
            break;

          case 'donate':
            pageOptions['donate'] = await staticFetcher(
              `${ip}/donate-page`,
              process.env.API_KEY,
              {
                populate: ['resourceTags'],
              },
            );
            console.log('pageOptions fetched!');
            return true;
            break;

          case 'shops':
            pageOptions['shops'] = await staticFetcher(
              `${ip}/shops-page`,
              process.env.API_KEY,
              {
                populate: ['resourceTags'],
              },
            );
            return true;
            break;

          case 'articles':
            pageOptions['articles'] = await staticFetcher(
              `${ip}/news-and-tips-page`,
              process.env.API_KEY,
            );
            console.log('pageOptions fetched!');
            return true;
            break;
        }
      }),
    );

    const Schema = object({
      type: array()
        .ensure()
        .of(
          string().oneOf(['items', 'resources', 'articles', 'donate', 'shops']),
        )
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
          case 'shops':
            contentType = 'resources';
          case 'resources':
            // @todo add tag filtering
            const contentTypeTags = pageOptions[type].data.resourceTags.map(
              (tag) => ({
                resourceTags: {
                  id: {
                    $eq: tag.id,
                  },
                },
              }),
            );
            populateFields.push('images', 'resourceTags');
            filters.$and = [{}, {}];
            filters.$and[0].$or = contentTypeTags;

            filters.$and[1].$or = [
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

        return fetch(queryString, {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }).then((resp) => resp.json());
      });

      const data = {};
      await Promise.all(promises).then((results) => {
        results.map((result, key) => {
          if (result.data?.length > 0) {
            data[search.type[key]] = result.data;
          }
        });
      });

      const items = [];
      const resources = [];
      const articles = [];
      for (const [type, results] of Object.entries(data)) {
        switch (type) {
          case 'items':
            results.map(({ id }) => {
              items.push(id);
            });
            break;

          case 'resources':
          case 'donate':
          case 'shop':
            results.map(({ id }) => {
              resources.push(id);
            });
            break;

          case 'articles':
            results.map(({ id }) => {
              articles.push(id);
            });
            break;
        }
      }

      const visitorId = getOrSetVisitorToken(req, res);
      await fetch(`${process.env.API_URL}/searches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            dateTime: new Date().toISOString(),
            query: search.query,
            itemResults: items,
            resourceResults: resources,
            articleResults: articles,
            type: query.contentType,
            visitorId,
          },
        }),
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
        error: 'not GET',
      },
    };
  }
}
