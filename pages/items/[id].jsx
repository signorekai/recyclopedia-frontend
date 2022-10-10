import Head from 'next/head';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import qs from 'qs';
import { useState, useEffect, useRef } from 'react';

import Link from '../../components/Link';
import Layout from '../../components/Layout';
import { ITEMS_PER_PAGE, useWindowDimensions } from '../../lib/hooks';
import { getLargestPossibleImage } from '../../lib/functions';
import { Carousel, CarouselCard } from '../../components/Carousel';
import Card from '../../components/Card';
import NewImage from '../../components/Image';
import { ReportBtn } from '../../components/Report';
import { useRouter } from 'next/router';
import { BookmarkButton } from '../../components/BookmarkButton';

const ItemTagLiterals = {
  Recycle: {
    bgColor: 'bg-blue-light',
    icon: 'fa-dumpster',
    label: 'Recycling Bins & Chutes',
  },
  eWasteRecycle: {
    bgColor: 'bg-blue-light',
    icon: 'fa-bolt',
    label: 'eWaste Recycle',
  },
  RecycleElsewhere: {
    bgColor: 'bg-blue-light',
    icon: 'fa-map-marker-exclamation',
    label: 'Specialised Recycling',
  },
  RecycleAsPaper: {
    bgColor: 'bg-blue-light',
    icon: 'fa-tree',
    label: 'Recycle as Paper',
  },
  GiveAway: {
    bgColor: 'bg-coral',
    icon: 'fa-box-heart',
    label: 'Donate / Give Away',
  },
  Repair: {
    bgColor: 'bg-blue-dark',
    icon: 'fa-wrench',
    label: 'Repair / Reuse',
  },
  Trash: {
    bgColor: 'bg-grey-mid',
    icon: 'fa-trash-alt',
    label: 'Trash',
  },
  Others: {
    bgColor: 'bg-blue-dark',
    icon: 'fa-leaf',
    label: 'Other',
  },
  BuyOrSell: {
    bgColor: 'bg-blue-dark',
    icon: 'fa-store',
    label: 'Buy or Sell',
  },
  TipsAndSuggestions: {
    bgColor: 'bg-teal',
    icon: 'fa-lightbulb',
    label: 'Tips & Suggestions',
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
  const containerRef = useRef();
  const { width } = useWindowDimensions();
  const { offsetWidth, scrollWidth } = containerRef.current
    ? containerRef.current
    : { offsetWidth: 0, scrollWidth: 0 };

  const _handleClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <p
      onClick={_handleClick}
      ref={containerRef}
      className={`cursor-pointer text-sm lg:text-lg text-grey-dark max-w-full overflow-hidden ${
        collapsed ? 'whitespace-nowrap' : 'whitespace-normal'
      } relative `}>
      {children}
      {collapsed && scrollWidth > offsetWidth && (
        <div className="absolute h-full w-6 -right-2 top-0 lg:w-full lg:h-10 lg:top-auto lg:-bottom-4 lg:left-0 lg:right-auto bg-gradient-to-r lg:bg-gradient-to-b from-transparent to-white" />
      )}
    </p>
  );
};

function Page({ data }) {
  const { width, height } = useWindowDimensions();
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

  return (
    <>
      {data && (
        <Layout>
          <Head>
            <title>Recyclopedia - {data && data.title}</title>
            <meta name="description" content="Recyclopedia" />
            <meta
              property="og:url"
              content={`${process.env.NEXT_PUBLIC_LOCATION}${router.asPath}`}
            />
            <meta
              property="og:title"
              content={`Recyclopedia - ${data.title}`}
            />
            <meta
              property="og:description"
              content={`Learn what to do with ${data.title.toLowerCase()} here.`}
            />
            {data.images.length > 0 && (
              <meta
                property="og:image"
                content={getLargestPossibleImage(
                  data.images[0],
                  'large',
                  'medium',
                )}
              />
            )}
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
                    <NewImage source={image} wrapperClassName="h-full" alt="" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="page-icons">
                <Link href="/items">
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
                          alt={image.alternativeText}
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
                    alt={data.images[0].alternativeText}
                    source={data.images[0]}
                    width={data.images[0].width}
                    height={data.images[0].height}
                  />
                </div>
              )}
            </>
          )}
          <div className="container">
            <section className="mt-3 lg:mt-5 divider-b">
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
            {data.recommendations.map((item, key) => {
              return (
                <motion.div
                  key={key}
                  viewport={{ once: true }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="lg:divider-b lg:divider-b-taller">
                  <section
                    key={key}
                    className="lg:grid grid-cols-4 lg:gap-x-4 mt-6">
                    <div className="lg:col-span-1">
                      <h5 className="text-left">
                        <i
                          className={key === 0 ? 'far fa-star' : 'fas fa-check'}
                        />
                        {key === 0 && ' Recommended'}
                        {key !== 0 && ' Alternative'}
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
                            __html: item.recommendationText,
                          }}
                        />
                      </RecommendationCard>
                      {item.otherText && (
                        <div
                          className="text-base lg:text-lg mt-2 lg:mt-4 px-2 inline-link"
                          dangerouslySetInnerHTML={{
                            __html: item.otherText,
                          }}
                        />
                      )}
                    </div>
                    {width > 1080 ? (
                      <div
                        className={`col-start-2 col-span-3 ${
                          item.resourcesComp.length === 0 && 'hidden'
                        }`}>
                        <Carousel
                          key={item.id}
                          showNav={false}
                          slideWidth={256}
                          className={`gap-x-2 mt-6`}>
                          {item.resourcesComp.map(({ resource }, key) => {
                            return (
                              <CarouselCard
                                featured={resource.featured === true}
                                key={key}
                                className={`w-64 group rounded-md bg-white-pure border-grey-light group-active:border-grey-mid group-active:bg-bg overflow-hidden relative ${
                                  resource.featured === true
                                    ? 'm-[2px] basic-carousel__card--featured border-0'
                                    : ' border-1'
                                } `}>
                                <Link
                                  key={key}
                                  href={`/resources/${resource.slug}`}>
                                  <a className="no-underline group-hover:opacity-100 group-active:opacity-100 relative">
                                    {resource.resourceIcon &&
                                      resource.resourceIcon.length > 0 && (
                                        <img
                                          alt=""
                                          className="absolute top-2 left-2 z-40 h-4 md:h-10"
                                          src={`/img/${resource.resourceIcon.toLowerCase()}.svg`}
                                        />
                                      )}
                                    <NewImage
                                      className="group-hover:scale-110 transition-transform"
                                      layout="fixed"
                                      source={
                                        resource.images
                                          ? resource.images[0]
                                          : {}
                                      }
                                      width={256}
                                      height={192}
                                      alt={resource.title}
                                    />
                                    <h4 className="pb-2 px-3 text-blue group-hover:text-blue-dark text-lg">
                                      {resource.title}
                                    </h4>
                                  </a>
                                </Link>
                              </CarouselCard>
                            );
                          })}
                        </Carousel>
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
                                {resource.images &&
                                resource.images.length > 0 ? (
                                  <NewImage
                                    source={resource.images[0]}
                                    width={80}
                                    height={80}
                                    alt={resource.title}
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-grey-light" />
                                )}
                                {resource.resourceIcon &&
                                  resource.resourceIcon.length > 0 && (
                                    <img
                                      alt=""
                                      className="absolute top-2 right-14 z-40 h-4 md:h-10"
                                      src={`/img/${resource.resourceIcon.toLowerCase()}.svg`}
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
                    <i className="far fa-info-circle"></i> Info & Insights
                  </h5>
                  <div
                    className="text-base lg:text-lg mt-2 lg:mt-0 flex-1 inline-link article-body"
                    dangerouslySetInnerHTML={{ __html: data.otherInfo }}></div>
                </section>
                <div className="divider-b mt-8"></div>
              </>
            )}
            {data.itemCategory && data.itemCategory.items.length > 1 && (
              <>
                <section className="flex flex-col lg:grid lg:grid-cols-4 lg:gap-x-4 mt-6">
                  <div className="lg:col-span-1">
                    <h5 className="text-left">
                      <i className="far fa-clone"></i> Similar Items
                    </h5>
                  </div>
                  <div className="lg:col-span-3">
                    <Carousel
                      buttonOffset={-28}
                      slideWidth={144}
                      showNav={false}
                      className="gap-x-2 flex-1 mt-3 lg:mt-0">
                      {data.itemCategory.items.map((item, key) => {
                        if (item.id !== data.id) {
                          return (
                            <CarouselCard
                              key={key}
                              className="w-36 overflow-hidden relative">
                              <Card
                                className="w-full"
                                uniqueKey={`card-${key}`}
                                prefixIcon={item.resourceIcon || ''}
                                content={{
                                  image: item.images ? item.images[0] : {},
                                  headerText: item.title,
                                  contentType: 'items',
                                  slug: item.slug,
                                }}
                              />
                            </CarouselCard>
                          );
                        }
                      })}
                    </Carousel>
                  </div>
                </section>
                <div className="divider-b mt-4 mb-2"></div>
              </>
            )}
            <span className="text-grey-dark text-sm mt-2 block">
              Last Updated:{' '}
              {DateTime.fromISO(data.updatedAt).toLocaleString(
                DateTime.DATE_MED,
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
      )}
    </>
  );
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
  const ip = process.env.API_URL;
  const queryParams = qs.stringify({
    populate: [
      'recommendations',
      'images',
      'articles',
      'recommendations.resources',
      'recommendations.resources.images',
      'recommendations.resourcesComp',
      'recommendations.resourcesComp.resource',
      'recommendations.resourcesComp.resource.images',
      'itemCategory',
      'itemCategory.items',
      'itemCategory.items.images',
    ],
    filters: {
      slug: {
        $eq: id,
      },
    },
  });

  const res = await fetch(`${ip}/items?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
  let results = await res.json();

  if (results.data.length === 0) {
    return { notFound: true };
  }

  let relatedItems = [];
  let relatedItemsIndex = [];
  if (!!results.data[0].itemCategory) {
    const unparsedRelatedItems = results.data[0].itemCategory.items;

    while (
      relatedItems.length < ITEMS_PER_PAGE &&
      relatedItems.length < unparsedRelatedItems.length
    ) {
      const x = Math.floor(Math.random() * unparsedRelatedItems.length);
      if (relatedItemsIndex.indexOf(x) === -1) {
        relatedItems.push(unparsedRelatedItems[x]);
        relatedItemsIndex.push(x);
      }
    }
    results.data[0].itemCategory.items = relatedItems;
  }

  return { props: { data: results.data[0] } };
}

export default Page;
