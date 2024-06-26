import fetch from 'node-fetch';
import qs from 'qs';
import { object, string, array } from 'yup';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';

import _find from 'lodash.find';
import pluralize from 'pluralize';
import algoliasearch from 'algoliasearch';

import { staticFetcher, staticPost, useWindowDimensions } from '../lib/hooks';
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
import { FeedbackModal, ReportBtn } from '../components/Report';
import { FAQCard } from './faq';
import { processTopics } from './feedback';

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
                  {items.length} search results for &quot;{query}&quot; in{' '}
                  <strong>{pageOptions.title}</strong>
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
                  key={`single-search-result-${key}`}
                  className="w-full"
                  uniqueKey={`card-${key}`}
                  prefixIcon={item.resourceIcon || ''}
                  cover={{
                    images: [image],
                    showImages: 1,
                    sizes: [
                      {
                        minBreakpoint: 'lg',
                        width: '240px',
                      },
                      {
                        minBreakpoint: 'md',
                        width: '40vw',
                      },
                      '200px',
                    ],
                  }}
                  content={{
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
          <h2 className="text-black block mt-4 lg:mt-10">
            0 results found for{' '}
            <span className="opacity-70">&quot;{query}&quot;</span>.
          </h2>
          <p className="mt-4 text-sm md:text-base">
            Try a different term, or expand your search.
            {query.split(' ').length > 1 && (
              <>
                <br />
                Search Tip: Simplify with keywords. For example, instead of
                searching “where to donate furniture”, search “furniture”.
              </>
            )}
          </p>
          <h3 className="mt-2">
            <Link
              href={`/search?${qs.stringify({
                contentType: [
                  'items',
                  'resources',
                  'articles',
                  'freecycling',
                  'shops',
                ].join(','),
                searchTerm: query,
              })}`}>
              <a className="text-coral hover:text-coral hover:opacity-80">
                Search the entire site{' '}
                <i className="p-2 far fa-arrow-right"></i>
              </a>
            </Link>
          </h3>
          <div className="divider-b mt-16"></div>
          <p className="mt-2 lg:text-base">
            Have something in mind you can’t find here? You can help us build up
            our database which in turn helps the community.{' '}
            <button
              onClick={_handleClick}
              className="inline lg:text-base hover:opacity-80 text-blue">
              Make a suggestion.
            </button>
          </p>
          <FeedbackModal
            openModal={openModal}
            defaultTopic="Make A Suggestion"
            handleClick={_handleClick}
          />
        </div>
      )}
    </>
  );
};

const MultiSearchType = ({ type, query, data, pageOptions, contactForm }) => {
  const { width } = useWindowDimensions();
  const contactFormTopics = processTopics(contactForm.Topics);
  const CardWidth = width > 1080 ? 23 : 40;
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
                        key={`${type}-${itemKey}`}
                        style={{
                          width:
                            width > 1080
                              ? `${(CardWidth / 100) * 1040}px`
                              : `${CardWidth}vw`,
                        }}>
                        <Card
                          className="w-full"
                          uniqueKey={`${type}-${itemKey}-${item.slug}`}
                          cover={{
                            images: [image],
                            showImages: 1,
                            sizes: [
                              {
                                minBreakpoint: 'lg',
                                width: '240px',
                              },
                              {
                                minBreakpoint: 'md',
                                width: '40vw',
                              },
                              '200px',
                            ],
                          }}
                          content={{
                            headerText: item.title,
                            slug: item.slug,
                            contentType: type,
                          }}
                        />
                      </CarouselCard>
                    );
                  })}
                  {values.length > 3 && (
                    <CarouselCard
                      key={`${type}-see-all`}
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
                  )}
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
      <div className={`container relative z-10 pt-4 lg:pt-10`}>
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
        wrapperClassName={`!border-1 max-w-[1000px]`}
      />
      {totalItemsCount > 0 && (
        <AccordionProvider headers={['All', ...headerTabs]}>
          <AccordionHeader
            className="mt-10"
            carouselClassName="scroll-px-4"
            sliderClassName="lg:max-w-screen-lg mx-auto px-6"
          />
          <AccordionBody carouselClassName="pb-0" {...contentTabs} />
        </AccordionProvider>
      )}
      {totalItemsCount === 0 && (
        <div className={`container relative z-10 text-base lg:text-lg`}>
          <h2 className="text-black block mt-4 lg:mt-10">0 results found</h2>
          <p className="mt-3">
            Double check your search, or try a different term.
          </p>
          <div className="bg-bg mt-10 lg:mt-4 p-3 lg:p-2 rounded-smd inline-flex flex-row lg:inline-block">
            <i className="far fa-lightbulb mr-3 lg:mr-2 mt-1"></i>
            <span>
              <strong>Search tip:</strong> Simplify with keywords. For example,
              instead of “where to donate furniture” search “furniture”
            </span>
          </div>
          <p className="mt-10 lg:mt-16 text-lg">
            Have something in mind you can’t find here? You can help us build up
            our database which in turn helps the community.{' '}
          </p>
          <button
            onClick={_handleClick}
            className=" block mt-5 hover:opacity-80 text-coral">
            Make a suggestion <i className="far fa-arrow-right"></i>
          </button>
          <FeedbackModal
            openModal={openModal}
            defaultTopic="Make a Suggestion"
            handleClick={_handleClick}
            topics={contactFormTopics}
          />

          <div className="mt-6 lg:mt-10 block w-full border-b-1 border-b-grey-light "></div>
        </div>
      )}
    </>
  );
};

export default function Page(props) {
  const { faqResults } = props;
  const contactFormTopics = processTopics(props.contactForm.Topics);

  return (
    <Layout title={`Search Results for "${props.query}"`}>
      {props.success && props.type.length === 1 && (
        <SingleSearchType
          type={props.type[0]}
          query={props.query}
          pageOptions={props.pageOptions[props.type[0]].data}
          items={props.data[props.type[0]] || []}
        />
      )}
      {props.success && props.type.length > 1 && <MultiSearchType {...props} />}
      {faqResults.length > 0 && (
        <div className="container border-t-1 my-6 border-t-grey-light">
          <h2 className="h2--left mt-6 mb-0">
            Results from Frequently Asked Questions (FAQ)
          </h2>
          {faqResults.map((item) => {
            const slug = item.slug
              ? sanitizeHtml(item.slug.value, {
                  allowedTags: [],
                  allowedAttributes: {},
                })
              : '';
            return (
              <FAQCard
                href={`/faq#${slug}`}
                className="!px-0 faq-search-results"
                slug={slug}
                openByDefault={true}
                disableAccordion={true}
                key={item.header.value}
                header={item.header.value}
                content={item.content.value}
              />
            );
          })}
        </div>
      )}
      <ReportBtn
        defaultTopic={`Search results for "${props.query}"`}
        delay={3000}
        topics={contactFormTopics}
      />
    </Layout>
  );
}

const SEARCH_TYPES = ['items', 'resources', 'articles', 'freecycling', 'shops'];

export async function getServerSideProps({ req, query, res }) {
  const ip = process.env.API_URL;
  if (req.method === 'GET') {
    // doing search
    const search = {
      type: query?.contentType ? query.contentType.split(',') : SEARCH_TYPES,
      query: query?.searchTerm ? query.searchTerm : '',
    };

    if (query?.q) {
      search.query = query.q;
    }

    const pageOptions = {};

    await Promise.all(
      search.type.map(async (type) => {
        switch (type) {
          case 'items':
            pageOptions['items'] = await staticFetcher(
              `${ip}/items-page`,
              process.env.API_KEY,
            );
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
            return true;
            break;

          case 'freecycling':
            pageOptions['freecycling'] = await staticFetcher(
              `${ip}/donate-page`,
              process.env.API_KEY,
              {
                populate: ['resourceTags'],
              },
            );
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
            return true;
            break;
        }
      }),
    );

    const Schema = object({
      type: array()
        .ensure()
        .of(string().oneOf(SEARCH_TYPES))
        .required('Content type required'),
      query: string().required('Search query required').min(1),
    });

    let nullSearch = false;

    const validation = await Schema.isValid(search);
    if (validation) {
      const data = {};

      const client = algoliasearch(
        process.env.ALGOLIA_APP_ID,
        process.env.ALGOLIA_API_KEY,
      );

      if (search.query.match(/^(S|s){0,1}\d{6}$/g) !== null) {
        console.log('postal code search swap');
        search.query = 'postal code search';
      }

      const itemIndex = client.initIndex('production_api::item.item');
      const resourcesIndex = client.initIndex(
        'production_api::resource.resource',
      );

      const articlesIndex = client.initIndex('production_api::article.article');

      const faqIndex = client.initIndex('production_api::faq.faq');

      await itemIndex.search(search.query).then(({ hits }) => {
        hits.forEach((item) => {
          if (item.publishedAt !== null) {
            if (!data.items) data.items = [];

            data.items.push({
              id: item.objectID,
              title: item.title,
              alternateSearchTerms: item.alternateSearchTerms,
              slug: item.slug,
              images: item.images,
            });
          }
        });
      });

      const faqResults = [];
      await faqIndex.search(search.query).then(({ hits }) => {
        if (hits.length > 0) {
          const highlightResults = hits[0]._highlightResult;
          highlightResults.section.forEach(({ item }) => {
            item.forEach((match) => {
              if (
                match.header.matchLevel !== 'none' ||
                match.content.matchLevel !== 'none'
              ) {
                faqResults.push(match);
              }
            });
          });
        }
      });

      const resourceTagMap = [];
      for (const [key, { data: opt }] of Object.entries(pageOptions)) {
        if (opt.resourceTags) {
          opt.resourceTags.forEach((tag) => {
            resourceTagMap[tag.id] = key;
          });
        }
      }

      await resourcesIndex.search(search.query).then(({ hits }) => {
        hits.forEach((resource) => {
          resource.resourceTags.forEach((tag) => {
            const type = resourceTagMap[tag.id];
            const result = _find(data[type], ['id', resource.objectID]);
            if (result === undefined) {
              if (resource.publishedAt !== null) {
                if (data.hasOwnProperty(type) === false) {
                  data[type] = [];
                }
                data[type].push({
                  id: resource.objectID,
                  title: resource.title,
                  images: resource.images,
                  slug: resource.slug,
                });
              }
            } else {
              console.log(resource.title, 'already in', type);
            }
          });
        });
      });

      await articlesIndex.search(search.query).then(({ hits }) => {
        hits.forEach((article) => {
          if (article.publishedAt !== null) {
            if (!data.articles) data.articles = [];

            data.articles.push({
              id: article.objectID,
              title: article.title,
              slug: article.slug,
              coverImage: article.coverImage,
            });
          }
        });
      });

      // compiling search results for logging
      const compiled = {
        items: [],
        resources: [],
        articles: [],
      };

      for (const [type, results] of Object.entries(data)) {
        switch (type) {
          case 'items':
            results.map(({ id }) => {
              compiled.items.push(id);
            });
            break;

          case 'resources':
          case 'freecycling':
          case 'shops':
            results.map(({ id }) => {
              compiled.resources.push(id);
            });
            break;

          case 'articles':
            results.map(({ id }) => {
              compiled.articles.push(id);
            });
            break;
        }
      }

      search.type.forEach((type) => {
        switch (type) {
          case 'articles':
          case 'items':
            nullSearch = compiled[type].length === 0;
            break;

          case 'resources':
          case 'freecycling':
          case 'shops':
            nullSearch = compiled.resources.length === 0;
            break;
        }
      });

      const visitorId = getOrSetVisitorToken(req, res);

      if (nullSearch) {
        await fetch(`${ip}/searches`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              dateTime: new Date().toISOString(),
              query: search.query,
              itemResults: compiled.items,
              resourceResults: compiled.resources,
              articleResults: compiled.articles,
              type: query.contentType,
              visitorId,
            },
          }),
        });
      }

      const response = await staticPost(
        `${ip}/search-terms/upsert`,
        {
          data: {
            term: search.query,
          },
        },
        {
          method: 'put',
        },
      );

      const { data: contactForm } = await staticFetcher(
        `${process.env.API_URL}/contact-us-page`,
        process.env.API_KEY,
        {
          fields: ['id'],
          populate: ['Topics'],
        },
      );

      return {
        props: {
          success: true,
          ...search,
          contactForm,
          data,
          faqResults,
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
