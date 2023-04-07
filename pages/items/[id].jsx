import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import qs from 'qs';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import sanitizeHtml from 'sanitize-html';

import Link from '../../components/Link';
import Layout from '../../components/Layout';
import { staticFetcher, useWindowDimensions } from '../../lib/hooks';
import { getLargestPossibleImage, replaceCDNUri } from '../../lib/functions';
import { Carousel, CarouselCard } from '../../components/Carousel';
import Card from '../../components/Card';
import NewImage from '../../components/Image';
import { ReportBtn } from '../../components/Report';
import { useRouter } from 'next/router';
import { BookmarkButton } from '../../components/BookmarkButton';
import Masonry from '../../components/Masonry';
import { getOpengraphTags } from '../../components/OpenGraph';
import StructuredData from '../../components/StructuredData';

const ItemTagLiterals = {
  Recycle: {
    bgColor: 'bg-blue-light',
    icon: 'fa-dumpster',
    label: 'Recycling Bins & Chutes',
    answer: 'Use Recycling Bins & Chutes.',
  },
  eWasteRecycle: {
    bgColor: 'bg-blue-light',
    icon: 'fa-bolt',
    label: 'eWaste Recycle',
    answer: 'Look for eWaste recycling options.',
  },
  RecycleElsewhere: {
    bgColor: 'bg-blue-light',
    icon: 'fa-map-marker-exclamation',
    label: 'Specialised Recycling',
    answer: 'Specialized Recycling is required.',
  },
  RecycleAsPaper: {
    bgColor: 'bg-blue-light',
    icon: 'fa-tree',
    label: 'Recycle as Paper',
    answer: 'Recycle it as paper.',
  },
  CharitableDonation: {
    bgColor: 'bg-coral',
    icon: 'fa-box-heart',
    label: 'Charitable Donation',
    answer: 'Donate it.',
  },
  GiveAway: {
    bgColor: 'bg-coral',
    icon: 'fa-box-heart',
    label: 'Freecycle / Give Away',
    answer: 'Freecycle it.',
  },
  Repair: {
    bgColor: 'bg-blue-dark',
    icon: 'fa-wrench',
    label: 'Repair',
    answer: 'Repair it.',
  },
  Reuse: {
    bgColor: 'bg-blue-dark',
    icon: 'fa-repeat',
    label: 'Reuse',
    answer: 'Reuse it.',
  },
  Trash: {
    bgColor: 'bg-grey-mid',
    icon: 'fa-trash-alt',
    label: 'Trash',
    answer: 'Trash it.',
  },
  Others: {
    bgColor: 'bg-blue-dark',
    icon: 'fa-leaf',
    label: 'Other',
    answer: "It's complicated.",
  },
  BuyOrSell: {
    bgColor: 'bg-blue-dark',
    icon: 'fa-store',
    label: 'Buy or Sell',
    answer: 'Buy or sell it.',
  },
  TipsAndSuggestions: {
    bgColor: 'bg-teal',
    icon: 'fa-lightbulb',
    label: 'Tips & Suggestions',
    answer: 'Some other tips & suggestions:',
  },
};

const RecommendationCard = ({ children, recommendation }) => (
  <div
    className={`p-4 pt-3 mt-3 lg:mt-0 rounded-md ${ItemTagLiterals[recommendation].bgColor}`}>
    {children}
  </div>
);

const RecommendationIcon = ({ recommendation }) => (
  <i
    className={`far text-3xl pr-3 pt-1 ${ItemTagLiterals[recommendation].icon}`}
  />
);

const AlternateTerms = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [active, setActive] = useState(true);
  const containerRef = useRef();
  const wrapperRef = useRef();

  const _handleClick = () => {
    if (active) {
      setCollapsed(!collapsed);
    }
  };

  useEffect(() => {
    const { offsetHeight: wrapperHeight } = wrapperRef.current
      ? wrapperRef.current
      : { offsetHeight: 0 };

    const { offsetHeight: containerHeight } = containerRef.current
      ? containerRef.current
      : { offsetHeight: 0 };
    setCollapsed(wrapperHeight > containerHeight);
    if (wrapperHeight === containerHeight) setActive(false);
  }, [containerRef, wrapperRef]);

  return (
    <div
      ref={containerRef}
      className={`${
        collapsed ? 'cursor-pointer max-h-5 lg:max-h-7' : ''
      } overflow-hidden relative`}>
      <div
        onClick={_handleClick}
        ref={wrapperRef}
        className={`text-sm lg:text-lg text-grey-dark max-w-full`}>
        {children}
      </div>
      {collapsed && (
        <div className="absolute h-full w-6 -right-2 top-0 lg:w-full lg:h-10 lg:top-auto lg:-bottom-4 lg:left-0 lg:right-auto bg-gradient-to-r lg:bg-gradient-to-b from-transparent to-white pointer-events-none" />
      )}
    </div>
  );
};

function Page({ data }) {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const modifier =
    data && data.images && data.images.length === 1 ? 0.5 : 0.335;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: `Recyclopedia - ${data.title}`,
          url: window.location.href,
        });
      }
    }
  };

  let desktopImageHeight = 0;
  const imageRatio = 1.34;

  if (width > 1080 && data && data.images) {
    const widths = [
      0,
      (1000 * 0.75) / imageRatio,
      1000 * 0.496,
      (1000 * 0.67) / imageRatio,
    ];

    if (widths[data.images.length]) {
      desktopImageHeight = widths[data.images.length];
    }
  }

  if (data) {
    const meta = getOpengraphTags(
      {
        description: `Where to recycle ${data.title.toLowerCase()} in Singapore. Find the best ways to recycle, upcycle or donate old, used, or new ${data.title.toLowerCase()}`,
        title: data.title,
        image:
          data.images.length > 0 &&
          getLargestPossibleImage(data.images[0], 'large', 'medium'),
      },
      data.SEO,
    );

    const structuredData = {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `How to recycle, upcycle or donate ${data.title}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `There are ${data.recommendations.length} ways to do it. 1. ${
              ItemTagLiterals[data.recommendations[0].recommendation].answer
            } ${sanitizeHtml(data.recommendations[0].recommendationText, {
              allowedTags: [],
              allowedAttributes: {},
            })}`,
          },
          // suggestedAnswer: [],
        },
      ],
    };

    if (data.recommendations.length > 1) {
      for (let x = 1; x < data.recommendations.length; x++) {
        structuredData.mainEntity[0].acceptedAnswer.text += ` ${x + 1}. ${
          ItemTagLiterals[data.recommendations[x].recommendation].answer
        } ${sanitizeHtml(data.recommendations[x].recommendationText, {
          allowedTags: [],
          allowedAttributes: {},
        })}`;
        // structuredData.mainEntity.suggestedAnswer.push({
        //   '@type': 'Answer',
        //   text: `${
        //     ItemTagLiterals[data.recommendations[x].recommendation].answer
        //   } ${sanitizeHtml(data.recommendations[x].recommendationText, {
        //     allowedTags: [],
        //     allowedAttributes: {},
        //   })}`,
        //   url: `${process.env.NEXT_PUBLIC_LOCATION}${
        //     router.asPath.split('#')[0]
        //   }#alternative-${x}`,
        // });
      }
    }

    return (
      <Layout title={data && data.title}>
        <StructuredData data={structuredData} />
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
        {width > 1080 ? (
          <div className="container">
            <div
              className="grid grid-cols-12 grid-rows-12 gap-2 mt-12"
              style={{
                height: desktopImageHeight,
              }}>
              {data.images.map((image, key) => (
                <div
                  key={key}
                  className={`overflow-hidden rounded-md ${
                    key === 0
                      ? 'row-span-full'
                      : {
                          2: 'row-span-full',
                          3: 'row-span-6',
                        }[data.images.length]
                  } ${
                    key === 0
                      ? {
                          1: 'col-span-9',
                          2: 'col-span-6',
                          3: 'col-span-8',
                        }[data.images.length]
                      : {
                          2: 'col-span-6',
                          3: 'col-span-4',
                        }[data.images.length]
                  }`}>
                  <NewImage
                    source={image}
                    wrapperClassName="h-full"
                    alt={`${data.title} Recycling in Singapore`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="page-icons">
              <Link href="javascript:history.go(-1)">
                <a className="page-icon-wrapper leading-none no-underline">
                  <i className="far fa-angle-left text-blue"></i>
                </a>
              </Link>
              <div className="flex flex-row gap-x-2">
                <button
                  onClick={handleShare}
                  className="page-icon-wrapper text-base leading-none">
                  <i className="far fa-external-link text-blue"></i>
                </button>
                <BookmarkButton
                  contentType="items"
                  slug={data.slug}
                  contentId={data.id}
                />
              </div>
            </div>
            {data.images && data.images.length > 1 && (
              <CarouselProvider
                naturalSlideWidth={width}
                naturalSlideHeight={width / imageRatio}
                totalSlides={data.images.length}>
                <Slider>
                  {data.images.map((image, key) => (
                    <Slide key={key} index={key} style={{ paddingBottom: 0 }}>
                      <NewImage
                        alt={`${data.title} Recycling in Singapore`}
                        source={image}
                        width={image.width > width ? image.width : width}
                        height={
                          image.width > width
                            ? image.width / imageRatio
                            : width / imageRatio
                        }
                      />
                    </Slide>
                  ))}
                </Slider>
                {data.images.length > 1 && <DotGroup className="z-30" />}
              </CarouselProvider>
            )}
            {data.images && data.images.length === 1 && (
              <div className="w-full" style={{ height: width * 0.75 }}>
                <NewImage
                  layout="responsive"
                  alt={`${data.title} Recycling in Singapore`}
                  source={data.images[0]}
                  width={data.images[0].width}
                  height={data.images[0].height}
                />
              </div>
            )}
          </>
        )}
        <div className="container">
          <section className="mt-3 lg:mt-5 divider-b lg:after:hidden">
            <h2 className="text-black mb-0 lg:text-3xl leading-tight justify-start">
              {data.title}{' '}
              <BookmarkButton
                contentType="items"
                slug={data.slug}
                contentId={data.id}
                className="page-icon-wrapper hidden lg:block shadow-none bg-grey-light ml-2 mt-1"
              />
            </h2>
            {data.alternateSearchTerms && (
              <AlternateTerms>
                {data.alternateSearchTerms
                  .split(', ')
                  .map((term) => term.charAt(0).toUpperCase() + term.slice(1))
                  .join(', ')}
              </AlternateTerms>
            )}
          </section>
          <motion.div
            viewport={{ once: true }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="lg:divider-b lg:divider-b-taller lg:mt-14">
            <section className="lg:grid grid-cols-4 lg:gap-x-4 mt-6">
              <div className="lg:col-span-1">
                <h5 className="text-left">
                  <i className="far fa-recycle mr-2 text-sm" />
                  Recyclable?
                </h5>
              </div>
              <div className="lg:col-span-3 flex flex-col mt-2 lg:mt-0 lg:flex-row gap-y-2 gap-x-5">
                <div
                  className={`summary-box ${
                    data.bluebin
                      ? 'border-green bg-green/5 text-green'
                      : 'border-red bg-red/5 text-red'
                  }`}>
                  <div className="flex items-center text-blue-light">
                    <i className="far fa-dumpster text-[32px] lg:text-4xl mr-3"></i>
                    <h2>Blue Bins & Chutes</h2>
                  </div>
                  <i
                    className={`fas ${
                      data.bluebin ? 'fa-check-circle' : 'fa-times-circle'
                    } text-[32px] lg:text-4xl`}></i>
                </div>
                <div
                  className={`summary-box ${
                    data.recycleElsewhere
                      ? 'border-green bg-green/5 text-green'
                      : 'border-red bg-red/5 text-red'
                  }`}>
                  <div className="flex items-center text-blue-light">
                    <i className="far fa-recycle text-[32px] lg:text-4xl mr-3"></i>
                    <h2>Other Recycling</h2>
                  </div>
                  <i
                    className={`fas ${
                      data.recycleElsewhere
                        ? 'fa-check-circle'
                        : 'fa-times-circle'
                    } text-[32px] lg:text-4xl`}></i>
                </div>
              </div>
            </section>
          </motion.div>
          {data.recommendations.map((item, key) => {
            return (
              <motion.div
                id={key === 0 ? 'recommended' : `alternative-${key}`}
                key={key}
                viewport={{ once: true }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="lg:divider-b lg:divider-b-taller scroll-mt-16">
                <section className="lg:grid grid-cols-4 lg:gap-x-4 mt-6">
                  <div className="lg:col-span-1">
                    <h5 className="text-left">
                      <i
                        className={`mr-2 text-sm
                            ${key === 0 ? 'far fa-star' : 'fas fa-check'}
                          `}
                      />
                      {key === 0 && 'Recommended'}
                      {key !== 0 && 'Alternative'}
                    </h5>
                  </div>
                  <div className="lg:col-span-3">
                    <RecommendationCard recommendation={item.recommendation}>
                      <h2 className="text-white mb-1 lg:justify-start">
                        <RecommendationIcon
                          recommendation={item.recommendation}
                        />
                        {ItemTagLiterals[item.recommendation].label}
                      </h2>
                      <div
                        className="text-white text-lg recommendation__box"
                        dangerouslySetInnerHTML={{
                          __html: replaceCDNUri(item.recommendationText),
                        }}
                      />
                    </RecommendationCard>
                    {item.otherText && (
                      <div
                        className="text-base lg:text-lg mt-2 lg:mt-4 px-2 inline-link"
                        dangerouslySetInnerHTML={{
                          __html: replaceCDNUri(item.otherText),
                        }}
                      />
                    )}
                  </div>
                  {width > 1080 ? (
                    <div
                      className={`col-start-2 col-span-3 ${
                        item.resourcesComp.length === 0 && 'hidden'
                      }`}>
                      <Masonry
                        items={item.resourcesComp}
                        columns={3}
                        className="mt-4"
                        card={({ resource }, key) => {
                          return (
                            <div key={`resource-${key}`} className="">
                              <CarouselCard
                                featured={resource.featured === true}
                                className={`w-full group rounded-md bg-white-pure border-grey-light group-active:border-grey-mid group-active:bg-bg overflow-hidden relative ${
                                  resource.featured === true
                                    ? 'm-[2px] basic-carousel__card--featured border-0'
                                    : ' border-1'
                                } `}>
                                <Link href={`/resources/${resource.slug}`}>
                                  <a className="no-underline group-hover:opacity-100 group-active:opacity-100 relative">
                                    {resource.resourceIcon &&
                                      resource.resourceIcon.length > 0 && (
                                        <img
                                          alt=""
                                          className="absolute top-2 left-2 z-40 h-4 md:h-10"
                                          src={`/img/${
                                            resource.resourceIcon.toLowerCase() +
                                            '.svg'
                                          }`}
                                        />
                                      )}
                                    <NewImage
                                      className="group-hover:scale-110 transition-transform"
                                      layout="responsive"
                                      source={
                                        resource.images
                                          ? resource.images[0]
                                          : {}
                                      }
                                      width={256}
                                      height={192}
                                      alt={`${resource.title} Recycling in Singapore`}
                                    />
                                    <h4 className="pb-2 px-3 text-blue group-hover:text-blue-dark text-lg">
                                      {resource.title}
                                    </h4>
                                  </a>
                                </Link>
                              </CarouselCard>
                            </div>
                          );
                        }}
                      />
                    </div>
                  ) : (
                    <section className="grid gap-y-2 my-4 divider-b after:mt-6">
                      {item.resourcesComp.map(({ resource }, key) => (
                        <Link
                          key={key}
                          href={`/resources/${resource.slug}`}
                          passHref>
                          <motion.a
                            initial={{
                              y: 30,
                              opacity: 0,
                            }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            whileInView={{ x: 0, y: 0, opacity: 1 }}
                            viewport={{ once: true, margin: '50px' }}
                            className={`no-underline ${
                              resource.featured === true
                                ? 'basic-carousel__card-wrapper'
                                : ''
                            } motion-controlled`}>
                            <div
                              className={`h-20 bg-white-pure border-1 rounded-md border-grey-light flex flex-row justify-between items-center relative overflow-hidden ${
                                resource.featured === true
                                  ? 'basic-carousel__card--featured'
                                  : ''
                              }`}>
                              <h4 className="px-4 text-blue-light">
                                {resource.title}
                              </h4>
                              {resource.images && resource.images.length > 0 ? (
                                <NewImage
                                  source={resource.images[0]}
                                  width={80}
                                  height={80}
                                  alt={`${resource.title} Recycling in Singapore`}
                                />
                              ) : (
                                <div className="w-20 h-20 bg-grey-light" />
                              )}
                              {resource.resourceIcon &&
                                resource.resourceIcon.length > 0 && (
                                  <img
                                    alt=""
                                    className="absolute top-2 right-14 z-40 h-4 md:h-10"
                                    src={`/img/${
                                      resource.resourceIcon.toLowerCase() +
                                      '.svg'
                                    }`}
                                  />
                                )}
                            </div>
                            {resource.featured === true && (
                              <motion.div
                                viewport={{ once: true }}
                                whileInView={{
                                  animation:
                                    'animateFeatured 7s 1 linear forwards',
                                }}
                                className="basic-carousel__card-highlight"
                              />
                            )}
                          </motion.a>
                        </Link>
                      ))}
                    </section>
                  )}
                </section>
              </motion.div>
            );
          })}
          {data.otherInfo && (
            <>
              <section className="lg:flex lg:flex-row lg:gap-x-2 mt-6">
                <h5 className="text-left lg:w-1/4">
                  <i className="far fa-info-circle mr-2 text-sm"></i>Info &
                  Insights
                </h5>
                <div
                  className="text-base lg:text-lg mt-2 lg:mt-0 flex-1 inline-link article-body info-insights"
                  dangerouslySetInnerHTML={{
                    __html: replaceCDNUri(data.otherInfo),
                  }}></div>
              </section>
              <div className="divider-b mt-8"></div>
            </>
          )}
          {(data.showSimilar === null || data.showSimilar === true) &&
            data.itemTag &&
            data.itemTag.items.length > 0 && (
              <>
                <section className="flex flex-col lg:grid lg:grid-cols-4 lg:gap-x-4 mt-6">
                  <div className="lg:col-span-1">
                    <h5 className="text-left">
                      <i className="far fa-clone mr-2 text-sm"></i>Similar Items
                    </h5>
                  </div>
                  <div className="lg:col-span-3">
                    <Masonry
                      expandedByDefault={width < 1080}
                      columns={width > 1080 ? 4 : 2}
                      items={data.itemTag.items}
                      card={(item, key) => (
                        <div key={`related-items-${key}`} className="w-full">
                          <Card
                            uniqueKey={`card-${key}`}
                            alt={`${item.title} Recycling in Singapore`}
                            prefixIcon={item.resourceIcon || ''}
                            content={{
                              image: item.images ? item.images[0] : {},
                              headerText: item.title,
                              contentType: 'items',
                              slug: item.slug,
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                </section>
                <div className="divider-b mt-4 mb-2"></div>
              </>
            )}
          {data.articles && data.articles.length > 0 && (
            <section className="flex flex-col lg:grid lg:grid-cols-4 lg:gap-x-4 mt-6">
              <div className="lg:col-span-1">
                <h5 className="text-left mb-2">
                  <i className="far fa-lightbulb-exclamation mr-2 text-sm"></i>
                  Read more
                </h5>
              </div>
              <div className={`lg:col-span-3 flex flex-col mb-8 lg:mb-12`}>
                {data.articles.map((article) => (
                  <div key={article.slug} className="w-full">
                    <Link key={article.slug} href={`/articles/${article.slug}`}>
                      <a className="group no-underline">
                        <div className="flex flex-row mb-8 gap-x-4 flex-wrap ">
                          <div className="w-1/4 md:aspect-[4/3]">
                            <NewImage
                              wrapperClassName="md:rounded-md"
                              className="aspect-[4/3] group-hover:scale-110 transition-transform"
                              sizes="270px"
                              alt={article.title}
                              source={article.coverImage || {}}
                              layout="responsive"
                            />
                          </div>
                          <div className="flex-1 mb-4">
                            <h5 className="text-left pt-2">
                              {article.category?.title}
                            </h5>
                            <h3 className="text-blue-dark group-hover:text-blue block">
                              {article.title}
                              <i className="fa fa-arrow-right ml-2 text-xs font-normal translate-y-[-2px] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"></i>
                            </h3>
                            <p className="hidden md:block text-black my-2 text-base leading-tight group-hover:opacity-60">
                              {article.excerpt && article.excerpt}
                            </p>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
          <span className="text-grey-dark text-sm mt-2 block">
            Last Updated:{' '}
            {data.hasOwnProperty('contentUpdatedAt') ? (
              <>
                {DateTime.fromISO(data.contentUpdatedAt).toLocaleString(
                  DateTime.DATE_MED,
                )}
              </>
            ) : (
              <>
                {DateTime.fromISO(data.updatedAt).toLocaleString(
                  DateTime.DATE_MED,
                )}
              </>
            )}
          </span>
          <div className="divider-b mt-2"></div>
          <ReportBtn
            item={data.id}
            record={`${data.title} (Items)`}
            delay={3000}
          />
        </div>
      </Layout>
    );
  } else {
    return <></>;
  }
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  // const res = await fetch('https://.../posts')
  // const posts = await res.json()

  const ip = process.env.API_URL;
  const queryParams = qs.stringify({
    sort: ['visits:desc', 'title'],
    pagination: {
      page: 1,
      pagesize: 20,
    },
  });

  const res = await fetch(`${ip}/items?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
  const result = await res.json();

  if (result.data.length === 0) {
    return { notFound: true };
  }
  // Get the paths we want to pre-render based on posts
  const paths = result.data.map((item) => ({
    params: { id: item.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const { id } = params;

  const results = await staticFetcher(
    `${process.env.API_URL}/items`,
    process.env.API_KEY,
    {
      populate: [
        'recommendations',
        'images',
        'articles',
        'articles.coverImage',
        'recommendations.resources',
        'recommendations.resources.images',
        'recommendations.resourcesComp',
        'recommendations.resourcesComp.resource',
        'recommendations.resourcesComp.resource.images',
        'itemTag',
        'itemTag.items',
        'itemTag.items.images',
        'SEO',
        'SEO.image',
      ],
      filters: {
        slug: {
          $eq: id,
        },
      },
    },
  );

  if (results.data.length === 0) {
    return { notFound: true };
  }

  const data = results.data[0];

  let relatedItems = [];
  let relatedItemsIndex = [];

  if (!!data.itemTag) {
    const unparsedRelatedItems = data.itemTag.items;

    while (
      relatedItems.length < unparsedRelatedItems.length - 1 &&
      relatedItems.length < 12
    ) {
      const x = Math.floor(Math.random() * unparsedRelatedItems.length);

      if (
        relatedItemsIndex.indexOf(x) === -1 &&
        unparsedRelatedItems[x].id !== data.id
      ) {
        relatedItems.push(unparsedRelatedItems[x]);
        relatedItemsIndex.push(x);
      }
    }
    data.itemTag.items = relatedItems;
  }

  return { props: { data } };
}

export default Page;
