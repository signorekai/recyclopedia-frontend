import Head from 'next/head';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import qs from 'qs';

import Layout from '../../components/Layout';
import { useWindowDimensions } from '../../lib/hooks';
import { Carousel, CarouselCard } from '../../components/Carousel';
import Card from '../../components/Card';
import Image from '../../components/Image';

const ResourceIcon = ({ tag }) => (
  <i
    className={`far text-xl pr-2 ${
      {
        Recycling: 'fa-recycle',
        Repair: 'fa-wrench',
        Trash: 'fa-trash-alt',
        Charity: 'fa-box-heart',
        'Animal Welfare': 'fa-cat',
      }[tag]
    }`}
  />
);

const ResourceBullet = ({ tag, className }) => (
  <div
    className={`inline-flex mr-3 flex-row py-2 px-3 uppercase font-archivo text-white rounded-md ${
      {
        Recycling: 'bg-blue',
        Repair: 'bg-blue',
        Trash: 'bg-blue',
        Charity: 'bg-purple',
        'Animal Welfare': 'bg-coral',
      }[tag]
    } ${className}`}>
    <ResourceIcon tag={tag} />
    <span className="pt-[2px]">{tag}</span>
  </div>
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
          <div className="bg-bg lg:pt-12 lg:pb-8">
            {width < 1080 && (
              <>
                {data.images && data.images.length > 0 ? (
                  <div className="aspect-[1_/_1] w-full lg:w-1/2 lg:pr-12">
                    <Image
                      layout={width > 1080 ? 'fixed' : 'responsive'}
                      width={768}
                      height={768}
                      formats={data.images[0].formats}
                      src={data.images[0].url}
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
                          formats={data.images[0].formats}
                          src={data.images[0].url}
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
                        <ResourceBullet key={key} tag={title} />
                      ))}
                  </div>
                  <h2 className="text-black inline-block pt-2 order-1 lg:order-2">
                    {data.title}
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
                      className="btn order-5"
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      Website
                    </motion.a>
                  )}
                  {data.locations && (
                    <motion.div
                      className="order-6"
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
            {data.items && (
              <div className="lg:divider-b">
                <section className="flex flex-col lg:flex-row lg:gap-x-4 mt-6">
                  <div className="lg:w-1/4">
                    <h5 className="text-left">
                      <i className="fas fa-check" />
                      Accepted Items
                    </h5>
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-base lg:text-lg mt-2 lg:mt-0 px-2 !leading-snug"
                      dangerouslySetInnerHTML={{
                        __html: data.items,
                      }}
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

  const res = await fetch(`${ip}/api/resources?${queryParams}`, {
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
    params: { resourceSlug: item.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const { resourceSlug } = params;
  const ip = process.env.API_URL;
  const queryParams = qs.stringify({
    populate: ['images', 'resourceTags'],
    filters: {
      slug: {
        $eq: resourceSlug,
      },
    },
  });

  const res = await fetch(`${ip}/api/resources?${queryParams}`, {
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
