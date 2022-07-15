import Head from 'next/head';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';

import Link from './Link';
import Layout from './Layout';
import { useWindowDimensions } from '../lib/hooks';
import { Carousel, CarouselCard } from './Carousel';
import Card from './Card';
import Image from './Image';
import { ReportBtn } from './Report';
import { BookmarkButton } from './BookmarkButton';

const ResourceTagLiterals = {
  Recycling: {
    icon: 'fa-recycle',
    bgColor: 'bg-blue',
  },
  Repair: {
    icon: 'fa-wrench',
    bgColor: 'bg-blue',
  },
  Trash: {
    icon: 'fa-trash-alt',
    bgColor: 'bg-blue',
  },
  Charity: {
    icon: 'fa-box-heart',
    bgColor: 'bg-purple',
  },
  'NGO / Volunteers': {
    icon: 'fa-people-carry',
    bgColor: 'bg-purple',
  },
  'Social Enterprise / SME': {
    icon: 'fa-shopping-bag',
    bgColor: 'bg-teal',
  },
  Shops: {
    icon: 'fa-shopping-bag',
    bgColor: 'bg-teal',
  },
  'Online Community': {
    icon: 'fa-globe-asia',
    bgColor: 'bg-blue-light',
  },
  'App / Platform': {
    icon: 'fa-mobile-alt',
    bgColor: 'bg-mustard',
  },
  'Animal Welfare': {
    icon: 'fa-cat',
    bgColor: 'bg-coral',
  },
  'Public Waste Collectors': {
    icon: 'fa-dumpster',
    bgColor: 'bg-blue-light',
  },
};

const ResourceBullet = ({ tag, className, baseUrl = 'resources' }) => {
  if (ResourceTagLiterals[tag]) {
    return (
      <Link href={`/${baseUrl}?section=${tag}`}>
        <a
          className={`inline-flex mr-3 flex-row py-2 px-3 uppercase font-archivo !text-white rounded-md text-sm lg:text-xs ${ResourceTagLiterals[tag].bgColor} ${className}`}>
          <i
            className={`far text-base lg:text-sm pr-2 ${ResourceTagLiterals[tag].icon}`}
          />
          <span className="pt-[2px] tracking-2">{tag}</span>
        </a>
      </Link>
    );
  } else {
    return <></>;
  }
};

function ResourcePage({ data, baseUrl }) {
  const { width } = useWindowDimensions();

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
          <div className="page-icons lg:hidden">
            <Link href={`/${baseUrl}`}>
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
              <BookmarkButton
                subCategory={baseUrl}
                contentType="resources"
                slug={data.slug}
                contentId={data.id}
              />
            </div>
          </div>
          <div className="bg-bg lg:pt-12 lg:pb-8">
            {width < 1080 && (
              <>
                {data.images && data.images.length > 0 ? (
                  <div className="aspect-[1_/_1] w-full lg:w-1/2 lg:pr-12">
                    <Image
                      layout={width > 1080 ? 'fixed' : 'responsive'}
                      width={768}
                      height={768}
                      source={data.images[0] || {}}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="aspect-[1_/_1] w-full lg:w-1/2 lg:pr-12">
                    <div className="w-full h-full bg-grey rounded-md"></div>
                  </div>
                )}
              </>
            )}
            <div className="container">
              <section className="flex flex-col lg:flex-row">
                {width > 1080 && (
                  <>
                    {data.images && data.images.length > 0 ? (
                      <div className="aspect-[1_/_1] w-full lg:w-1/2 lg:pr-12">
                        <Image
                          layout={width > 1080 ? 'fixed' : 'responsive'}
                          className="rounded-md"
                          width={480}
                          height={480}
                          source={data.images[0] || {}}
                          alt=""
                        />
                      </div>
                    ) : (
                      <div className="aspect-[1_/_1] w-full lg:w-1/2 lg:pr-12">
                        <div className="w-full h-full bg-grey rounded-md"></div>
                      </div>
                    )}
                  </>
                )}
                <div className="flex-1 mb-6 lg:mb-0 flex flex-col">
                  <div
                    className={`order-3 lg:order-1 origin-top-left ${
                      width < 1080 && 'scale-75 mt-4'
                    }`}>
                    {data.resourceTags &&
                      data.resourceTags.map(({ title }, key) => (
                        <ResourceBullet
                          baseUrl={baseUrl}
                          key={key}
                          tag={title}
                        />
                      ))}
                  </div>
                  <h2 className="text-black inline-block pt-2 order-1 lg:order-2">
                    {data.title}
                    <BookmarkButton
                      contentType="resources"
                      slug={data.slug}
                      subCategory={baseUrl}
                      contentId={data.id}
                      className="page-icon-wrapper hidden lg:inline-block shadow-none bg-grey-light ml-2 mt-1"
                    />
                  </h2>
                  <div className="h-[1px] w-full bg-white mt-2 order-2 lg:order-3"></div>
                  {data.description && (
                    <motion.div
                      className="order-4"
                      viewport={{ once: true }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}>
                      <h5 className="text-left lg:w-1/4 mt-2 lg:mt-5">
                        <i className="far fa-info-circle" /> Info
                      </h5>
                      <div
                        className="text-base lg:text-lg mt-2 lg:mt-1 px-2 !leading-snug"
                        dangerouslySetInnerHTML={{
                          __html: data.description,
                        }}
                      />
                    </motion.div>
                  )}
                  {data.url && (
                    <motion.a
                      viewport={{ once: true }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="btn order-5 mb-2"
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      Website{' '}
                      <i className="text-xs ml-2 far fa-external-link-alt"></i>
                    </motion.a>
                  )}
                  {data.address && (
                    <motion.a
                      viewport={{ once: true }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="btn order-5 mt-2"
                      href={`https://www.google.com.sg/maps?hl=en&q=${data.address}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      View on Google Maps{' '}
                      <i className="text-xs ml-2 far fa-external-link-alt"></i>
                    </motion.a>
                  )}
                  {data.locations && (
                    <motion.div
                      className="order-6 mt-2"
                      viewport={{ once: true }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}>
                      <h5 className="text-left lg:w-1/4 mt-2">
                        <i className="far fa-map-marker-alt" /> Location
                      </h5>
                      <div
                        className="text-base lg:text-lg mt-2 lg:mt-1 px-2 !leading-snug"
                        dangerouslySetInnerHTML={{
                          __html: data.locations,
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              </section>
            </div>
          </div>
          <div className="container">
            {(data.items || data.relatedItems.length > 0) && (
              <div className="lg:divider-b">
                <section className="lg:grid lg:grid-cols-4 lg:gap-x-4 mt-6">
                  <div className="lg:col-span-1">
                    <h5 className="text-left">
                      <i className="fas fa-check" />
                      Accepted Items
                    </h5>
                  </div>
                  <div className="lg:col-span-3">
                    {data.items && (
                      <div
                        className="text-base lg:text-lg mt-2 lg:mt-0 mb-6 px-2 !leading-snug"
                        dangerouslySetInnerHTML={{
                          __html: data.items,
                        }}
                      />
                    )}
                    <Carousel
                      autoSlideSize={true}
                      showNav={false}
                      className="mb-6 h-auto"
                      sliderStyle={{
                        width:
                          width > 1080
                            ? 250 * data.relatedItems.length
                            : width * 0.5 * data.relatedItems.length,
                      }}>
                      {data.relatedItems &&
                        data.relatedItems.map((item, key) => (
                          <CarouselCard
                            key={key}
                            className="w-36 lg:w-64 overflow-hidden relative">
                            <Card
                              className="w-full"
                              imgClassName="h-[200px]"
                              uniqueKey={`related-${key}`}
                              key={`related-${key}`}
                              content={{
                                image: item.images ? item.images[0] : {},
                                headerText: item.title,
                                contentType: 'items',
                                slug: item.slug,
                              }}
                            />
                          </CarouselCard>
                        ))}
                    </Carousel>
                  </div>
                </section>
              </div>
            )}
            <span className="text-grey-dark text-sm mt-2 block">
              Last Updated:{' '}
              {DateTime.fromISO(data.updatedAt).toLocaleString(
                DateTime.DATE_MED,
              )}
            </span>
            <div className="divider-b mt-2"></div>
            <ReportBtn
              topic="Report An Error"
              record={`${data.title} (Donate Resources)`}
            />
          </div>
        </Layout>
      )}
    </>
  );
}

export default ResourcePage;
