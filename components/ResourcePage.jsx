import Head from 'next/head';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';

import { getLargestPossibleImage, replaceCDNUri } from '../lib/functions';
import Link from './Link';
import Layout from './Layout';
import { useWindowDimensions } from '../lib/hooks';
import Masonry from './Masonry';
import Image from './Image';
import { ReportBtn } from './Report';
import { BookmarkButton } from './BookmarkButton';
import Card from './Card';

const ResourceTagLiterals = {
  Recycling: {
    icon: 'fa-recycle',
    bgColor: 'bg-blue-light',
  },
  Repair: {
    icon: 'fa-wrench',
    bgColor: 'bg-blue-light',
  },
  Trash: {
    icon: 'fa-trash-alt',
    bgColor: 'bg-blue-light',
  },
  Charity: {
    icon: 'fa-box-heart',
    bgColor: 'bg-coral',
  },
  'Charity & Welfare': {
    icon: 'fa-box-heart',
    bgColor: 'bg-coral',
  },
  'NGO / Volunteers': {
    icon: 'fa-people-carry',
    bgColor: 'bg-coral',
  },
  'Social Enterprise / SME': {
    icon: 'fa-shopping-bag',
    bgColor: 'bg-coral',
  },
  Shops: {
    icon: 'fa-shopping-bag',
    bgColor: 'bg-blue',
  },
  'Online Community': {
    icon: 'fa-globe-asia',
    bgColor: 'bg-coral',
  },
  'App / Platform': {
    icon: 'fa-mobile-alt',
    bgColor: 'bg-coral',
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

const ResourceBullet = ({
  tag,
  id,
  className,
  icon = '',
  baseUrl = 'resources',
  tags,
}) => {
  return (
    <Link href={`/${tags[id]}?section=${encodeURIComponent(tag)}`}>
      <a
        className={`no-underline inline-flex mr-3 flex-row py-2 my-1 px-3 uppercase font-archivo !text-white rounded-md text-sm lg:text-xs ${className}`}>
        <i
          className={`far text-base lg:text-sm pr-2 ${icon && `fa-${icon}`}`}
        />
        <span className="pt-[2px] tracking-2">{tag}</span>
      </a>
    </Link>
  );
};

function ResourcePage({ data, baseUrl, tags }) {
  const { width } = useWindowDimensions();
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
        <Layout
          showHeaderInitially={true}
          showHeaderOn=""
          hideHeaderOn=""
          title={data && data.title}>
          <Head>
            <meta
              name="description"
              content={`Learn more about ${data.title} here.`}
            />
            <meta
              property="og:url"
              key="og:url"
              content={`${process.env.NEXT_PUBLIC_LOCATION}${router.asPath}`}
            />
            <meta
              property="og:description"
              key="og:description"
              content={`Learn more about ${data.title} here.`}
            />
            {data.images.length > 0 && (
              <meta
                property="og:image"
                key="og:image"
                content={getLargestPossibleImage(
                  data.images[0],
                  'large',
                  'medium',
                )}
              />
            )}
          </Head>
          <div className="page-icons lg:hidden">
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
                subCategory={baseUrl}
                contentType="resources"
                slug={data.slug}
                contentId={data.id}
              />
            </div>
          </div>
          <div className="bg-bg lg:pt-12 lg:pb-8 ">
            {width < 1080 && (
              <>
                {data.images && data.images.length > 0 ? (
                  <div className="aspect-[1_/_1] w-full lg:w-1/2 lg:pr-12 relative">
                    {data.resource && data.resourceIcon === 'Sponsored' && (
                      <div className="z-10 py-1 px-2 rounded-md tracking-2 absolute bottom-4 left-4 bg-grey-dark bg-opacity-70 text-white font-archivo font-bold text-xs uppercase">
                        SPONSORED
                      </div>
                    )}
                    {data.resourceIcon && data.resourceIcon !== 'Sponsored' && (
                      <img
                        alt=""
                        className="absolute bottom-4 left-4 z-40 h-8"
                        src={`/img/${data.resourceIcon.toLowerCase() + '.svg'}`}
                      />
                    )}
                    <Image
                      layout={width > 1080 ? 'fixed' : 'responsive'}
                      width={768}
                      height={768}
                      source={data.images[0] || {}}
                      alt={`${data.title}`}
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
                      <div className="aspect-[1_/_1] w-full lg:w-1/2 lg:pr-12 relative">
                        {data.resourceIcon &&
                          data.resourceIcon === 'Sponsored' && (
                            <div className="z-10 py-1 px-2 rounded-md tracking-2 absolute top-4 left-4 bg-grey-dark bg-opacity-70 text-white font-archivo font-bold text-xs uppercase">
                              SPONSORED
                            </div>
                          )}
                        {data.resourceIcon &&
                          data.resourceIcon !== 'Sponsored' && (
                            <img
                              alt=""
                              className="absolute top-4 left-4 z-40 h-8"
                              src={`/img/${
                                data.resourceIcon.toLowerCase() + '.svg'
                              }`}
                            />
                          )}
                        <Image
                          layout={width > 1080 ? 'fixed' : 'responsive'}
                          className="rounded-md"
                          width={480}
                          height={480}
                          source={data.images[0] || {}}
                          alt={`${data.title}`}
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
                      data.resourceTags.map(
                        ({ title, id, icon, bgColour }, key) => {
                          const props = {
                            baseUrl,
                            tags,
                            id,
                            tag: title,
                            className: bgColour,
                          };

                          if (icon) {
                            props.icon = icon;
                          }

                          return <ResourceBullet key={key} {...props} />;
                        },
                      )}
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
                      className="order-4 resource__box"
                      viewport={{ once: true }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}>
                      <h5 className="text-left lg:w-1/4 mt-2 lg:mt-5">
                        <i className="far fa-info-circle" /> Info
                      </h5>
                      <div
                        className="text-base lg:text-lg mt-2 lg:mt-1 !leading-snug article-body lg:w-full info-insights"
                        dangerouslySetInnerHTML={{
                          __html: replaceCDNUri(data.description),
                        }}
                      />
                    </motion.div>
                  )}
                  <div className="grid grid-cols-1 lg:flex lg:flex-row lg:gap-x-2 gap-y-2 mt-4 mb-2 order-5">
                    {data.url && (
                      <motion.a
                        viewport={{ once: true }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="btn m-0"
                        href={data.url}
                        target="_blank"
                        rel="noopener noreferrer">
                        Website{' '}
                        <i className="text-xs ml-2 far fa-external-link-alt"></i>
                      </motion.a>
                    )}
                    {data.externalLinks.map((externalLink, key) => (
                      <motion.a
                        key={key}
                        viewport={{ once: true }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className={`btn m-0`}
                        href={externalLink.url}
                        target="_blank"
                        rel="noopener noreferrer">
                        {externalLink.title}
                        <i className="text-xs ml-2 far fa-external-link-alt"></i>
                      </motion.a>
                    ))}
                  </div>
                  {data.locations && (
                    <motion.div
                      className="order-6 mt-2 resource__box"
                      viewport={{ once: true }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}>
                      <h5 className="text-left lg:w-1/4 mt-2">
                        <i className="far fa-map-marker-alt" /> Location
                      </h5>
                      <div
                        className="text-base lg:text-lg mt-2 lg:mt-1 px-2 !leading-snug"
                        dangerouslySetInnerHTML={{
                          __html: replaceCDNUri(data.locations),
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
                        className="text-base lg:text-lg mt-2 lg:mt-0 mb-6 !leading-snug"
                        dangerouslySetInnerHTML={{
                          __html: replaceCDNUri(data.items),
                        }}
                      />
                    )}
                    <Masonry
                      columns={3}
                      items={data.relatedItems}
                      card={(item, key) => (
                        <div key={key} className="">
                          <Card
                            uniqueKey={`card-${key}`}
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
              resource={data.id}
              topic="Report An Error"
              delay={3000}
              record={`${data.title} (Freecycling Resources)`}
            />
          </div>
        </Layout>
      )}
    </>
  );
}

export default ResourcePage;
