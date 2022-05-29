import Head from 'next/head';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import qs from 'qs';
import { useState, useEffect, useRef } from 'react';

import Layout from '../../components/Layout';
import { useWindowDimensions } from '../../lib/hooks';
import { Carousel, CarouselCard } from '../../components/Carousel';
import Card from '../../components/Card';
import NewImage from '../../components/Image';
import { ReportBtn } from '../../components/Report';
import { useRouter } from 'next/router';
import { BookmarkButton } from '../../components/BookmarkButton';

const RecommendationCard = ({ children, recommendation }) => (
  <div
    className={`p-4 pt-3 mt-3 lg:mt-0 rounded-md ${
      {
        Recycle: 'bg-blue-light',
        eWasteRecycle: 'bg-blue-light',
        RecycleElsewhere: 'bg-blue-light',
        GiveAway: 'bg-coral',
        Repair: 'bg-blue-dark',
        Trash: 'bg-grey-mid',
        Others: 'bg-blue-dark',
      }[recommendation]
    }`}>
    {children}
  </div>
);

const RecommendationIcon = ({ recommendation }) => (
  <i
    className={`far text-3xl pr-3 pt-1 ${
      {
        Recycle: 'fa-recycle',
        eWasteRecycle: 'fa-bolt',
        RecycleElsewhere: 'fa-map-marker-exclamation',
        GiveAway: 'fa-box-heart',
        Repair: 'fa-wrench',
        Trash: 'fa-trash-alt',
        Others: 'fa-leaf',
      }[recommendation]
    }`}
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

  const modifier = 0.5;
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

  return (
    <>
      {data && (
        <Layout>
          <Head>
            <title>Recyclopedia - {data && data.title}</title>
            <meta name="description" content="Recyclopedia" />
            <link rel="icon" href="/favicon.ico" />
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
              content={`Learn how to recycle ${data.title.toLowerCase()} here.`}
            />
            <meta
              property="og:image"
              content={data.images[0].formats.large.url}
            />
          </Head>
          {width > 1080 ? (
            <div className="container">
              <div
                className="grid grid-cols-3 grid-rows-12 gap-2 mt-12"
                style={{ height: height * modifier }}>
                {data.images.map((image, key) => (
                  <div
                    key={key}
                    className={`overflow-hidden rounded-md ${
                      key === 0
                        ? 'row-span-full'
                        : {
                            2: 'row-span-6',
                            3: 'row-span-6',
                            4: 'row-span-4',
                            5: 'row-span-3',
                          }[data.images.length]
                    } ${
                      key === 0
                        ? {
                            1: 'col-span-full',
                            2: 'col-span-2',
                            3: 'col-span-2',
                            4: 'col-span-2',
                            5: 'col-span-2',
                          }[data.images.length]
                        : {
                            2: 'col-span-1',
                            3: 'col-span-1',
                            4: 'col-span-1',
                            5: 'col-span-1',
                          }[data.images.length]
                    }`}>
                    <NewImage
                      src={image.url}
                      width={
                        data.images.length === 1
                          ? 1040
                          : key > 0
                          ? 1040 * 0.33
                          : 1040 * 0.67
                      }
                      height={
                        key === 0
                          ? height * modifier + 2 * 4
                          : {
                              2: height * modifier * 0.5,
                              3: height * modifier * 0.5,
                              4: height * modifier * 0.33,
                              5: height * modifier * 0.25,
                            }[data.images.length]
                      }
                      formats={image.formats}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="page-icons">
                <Link href="/items">
                  <a className="page-icon-wrapper leading-none">
                    <i className="far fa-angle-left text-blue"></i>
                  </a>
                </Link>
                <div className="flex flex-row gap-x-2">
                  <button
                    onClick={handleShare}
                    className="page-icon-wrapper text-base leading-none">
                    <i className="far fa-external-link text-blue"></i>
                  </button>
                  <BookmarkButton contentType="items" slug={data.slug} />
                </div>
              </div>
              {data.images && (
                <CarouselProvider
                  naturalSlideWidth={width}
                  naturalSlideHeight={width * 0.8}
                  totalSlides={data.images.length}>
                  <Slider>
                    {data.images.map((image, key) => (
                      <Slide key={key} index={key}>
                        <NewImage
                          alt={image.alternativeText}
                          src={image.url}
                          formats={image.formatS}
                          width={width}
                          height={width}
                        />
                      </Slide>
                    ))}
                  </Slider>
                  <DotGroup className="z-30" />
                </CarouselProvider>
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
                    className="flex flex-col lg:flex-row lg:gap-x-4 mt-6">
                    <div className="lg:w-1/4">
                      <h5 className="text-left">
                        <i className="fas fa-check" />
                        {key === 0 && ' Recommendations'}
                        {key !== 0 && ' Alternatives'}
                      </h5>
                    </div>
                    <div className="flex-1">
                      <RecommendationCard recommendation={item.recommendation}>
                        <h2 className="text-white align-middle mb-1 lg:justify-start">
                          <RecommendationIcon
                            recommendation={item.recommendation}
                          />
                          {
                            {
                              Recycle: 'Recycle',
                              eWasteRecycle: 'eWaste Recycle',
                              RecycleElsewhere: 'Recycle Elsewhere',
                              GiveAway: 'Give Away / Sell',
                              Repair: 'Repair',
                              Trash: 'Trash',
                              Others: 'Others',
                            }[item.recommendation]
                          }
                        </h2>
                        <div
                          className="text-white text-lg"
                          dangerouslySetInnerHTML={{
                            __html: item.recommendationText,
                          }}
                        />
                      </RecommendationCard>
                      {item.otherText && (
                        <div
                          className="text-base lg:text-lg mt-2 lg:mt-4 px-2"
                          dangerouslySetInnerHTML={{
                            __html: item.otherText,
                          }}
                        />
                      )}
                    </div>
                  </section>
                  {width > 1080 ? (
                    <div
                      className={`ml-[calc(25%+1rem)] ${
                        item.resources.length === 0 && 'hidden'
                      }`}>
                      <Carousel
                        showNav={false}
                        slideWidth={256}
                        className="gap-x-2 mt-6">
                        {item.resources.map((resource, key) => (
                          <CarouselCard
                            key={key}
                            className="w-64 group border-1 rounded-md border-grey-light overflow-hidden relative">
                            <Link
                              key={key}
                              href={`/resources/${resource.slug}`}>
                              <a className="group-hover:opacity-100">
                                <NewImage
                                  className="group-hover:scale-110 transition-transform"
                                  layout="fixed"
                                  src={resource.images[0].url}
                                  format={resource.images[0].format}
                                  width={256}
                                  height={158}
                                  alt={resource.title}
                                />
                                <h4 className="py-2 px-3 text-blue group-hover:text-blue-dark text-lg">
                                  {resource.title}
                                </h4>
                              </a>
                            </Link>
                          </CarouselCard>
                        ))}
                      </Carousel>
                    </div>
                  ) : (
                    <section className="grid gap-y-2 my-4 divider-b after:mt-6">
                      {item.resources.map((resource, key) => (
                        <Link key={key} href={`/resources/${resource.slug}`}>
                          <a>
                            <motion.div
                              initial={{
                                y: 30,
                                opacity: 0,
                              }}
                              whileInView={{ x: 0, y: 0, opacity: 1 }}
                              viewport={{ once: true, margin: '50px' }}
                              className="h-20 pl-4 bg-white-pure border-1 rounded-md border-grey-light flex flex-row justify-between items-center overflow-hidden">
                              <h4 className="pr-4 text-blue-light">
                                {resource.title}
                              </h4>
                              {resource.images && resource.images.length > 0 ? (
                                <NewImage
                                  src={resource.images[0].url}
                                  format={resource.images[0].format}
                                  width={80}
                                  height={80}
                                  alt={resource.title}
                                />
                              ) : (
                                <div className="w-20 h-20 bg-grey-light" />
                              )}
                            </motion.div>
                          </a>
                        </Link>
                      ))}
                    </section>
                  )}
                </motion.div>
              );
            })}
            {data.otherInfo && (
              <>
                <section className="flex flex-col lg:flex-row lg:gap-x-4 mt-6">
                  <h5 className="text-left lg:w-1/4">
                    <i className="far fa-info-circle"></i> Info & Insights
                  </h5>
                  <div
                    className="text-base lg:text-lg mt-2 lg:mt-0  flex-1"
                    dangerouslySetInnerHTML={{ __html: data.otherInfo }}></div>
                </section>
                <div className="divider-b mt-8"></div>
              </>
            )}
            {data.itemCategory && data.itemCategory.items.length > 1 && (
              <>
                <section className="flex flex-col lg:flex-row lg:gap-x-4 mt-6">
                  <h5 className="text-left lg:w-1/4">
                    <i className="far fa-question-circle"></i> Similar Items
                  </h5>
                  <div className="flex-1">
                    <Carousel
                      slideWidth={256}
                      showNav={false}
                      className="gap-x-2 flex-1 mt-3 lg:mt-0">
                      {data.itemCategory.items.map((item, key) => {
                        if (item.id !== data.id) {
                          return (
                            <CarouselCard
                              key={key}
                              className="w-36 lg:w-64 overflow-hidden relative">
                              <Card
                                className="w-full"
                                uniqueKey={`card-${key}`}
                                content={{
                                  backgroundImage:
                                    item.images.length > 0
                                      ? item.images[0].url
                                      : '',
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
            <ReportBtn record={`${data.title} (Items)`} />
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
  const result = await res.json();

  if (result.data.length === 0) {
    return { notFound: true };
  }

  return { props: { data: result.data[0] }, revalidate: 3600 };
}

export default Page;
