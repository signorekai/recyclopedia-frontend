import Head from 'next/head';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import qs from 'qs';

import Layout from '../../components/Layout';
import { useWindowDimensions } from '../../lib/hooks';
import { Carousel, CarouselCard } from '../../components/Carousel';
import Card from '../../components/Card';
import NewImage from '../../components/Image';

const RecommendationCard = ({ children, recommendation }) => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    }}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
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
  </motion.div>
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

function Page({ data }) {
  const { width, height } = useWindowDimensions();

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
        <Layout showHeaderInitially={true} showHeaderOn="" hideHeaderOn="">
          <Head>
            <title>Recyclopedia - {data && data.title}</title>
            <meta name="description" content="Recyclopedia" />
            <link rel="icon" href="/favicon.ico" />
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
                <div>
                  <button
                    onClick={handleShare}
                    className="page-icon-wrapper text-base leading-none">
                    <i className="far fa-external-link text-blue"></i>
                  </button>
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
                {data.title}
              </h2>
              {data.alternateSearchTerms && (
                <p className="text-sm lg:text-lg text-grey-dark">
                  {data.alternateSearchTerms
                    .split(', ')
                    .map((term) => term.charAt(0).toUpperCase() + term.slice(1))
                    .join(', ')}
                </p>
              )}
            </section>
            {data.recommendations.map((item, key) => {
              return (
                <div key={key} className="lg:divider-b">
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
                        <motion.div
                          viewport={{ once: true }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          className="text-base lg:text-lg mt-2 lg:mt-4 px-2"
                          dangerouslySetInnerHTML={{
                            __html: item.otherText,
                          }}
                        />
                      )}
                    </div>
                  </section>
                  {width > 1080 ? (
                    <Carousel
                      showNav={false}
                      className="ml-[calc(25%+1rem)] gap-x-2 mt-6 mb-8">
                      {item.resources.map((resource, key) => (
                        <Link key={key} href={`/resources/${resource.slug}`}>
                          <a>
                            <CarouselCard
                              key={key}
                              className="w-64 border-1 rounded-md border-grey-light overflow-hidden relative">
                              <Image
                                src={resource.images[0].url}
                                width={256}
                                height={158}
                                objectFit="cover"
                                objectPosition="center"
                                alt={resource.title}
                              />
                              <h4 className="py-2 px-3 text-blue text-lg">
                                {resource.title}
                              </h4>
                            </CarouselCard>
                          </a>
                        </Link>
                      ))}
                    </Carousel>
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
                                <Image
                                  src={resource.images[0].url}
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
                </div>
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
                  <Carousel
                    showNav={false}
                    className="gap-x-2 flex-1 mt-3 lg:mt-0">
                    {data.itemCategory.items.map((item, key) => (
                      <>
                        {item.id !== data.id && (
                          <CarouselCard
                            key={key}
                            className="w-36 lg:w-64 overflow-hidden relative">
                            <Card
                              key={key}
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
                        )}
                      </>
                    ))}
                  </Carousel>
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

  const res = await fetch(`${ip}/api/items?${queryParams}`, {
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

  const res = await fetch(`${ip}/api/items?${queryParams}`, {
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
