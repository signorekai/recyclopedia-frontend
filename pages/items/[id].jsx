import Head from 'next/head';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';

import Layout from '../../components/Layout';
import { useWindowDimensions } from '../../lib/hooks';
import { Carousel, CarouselCard } from '../../components/Carousel';

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
  const router = useRouter();

  const modifier = 0.5;

  data.alternateSearchTerms = data.alternateSearchTerms
    .split(', ')
    .map((term) => term.charAt(0).toUpperCase() + term.slice(1))
    .join(', ');

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
    <Layout showHeaderInitially={true} showHeaderOn="" hideHeaderOn="">
      <Head>
        <title>Recyclopedia - {data.title}</title>
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
                <Image
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
                  objectFit="cover"
                  objectPosition="center"
                  layout="responsive"
                  priority={key === 0}
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
          <CarouselProvider
            naturalSlideWidth={width}
            naturalSlideHeight={width * 0.8}
            totalSlides={data.images.length}>
            <Slider>
              {data.images.map((image, key) => (
                <Slide key={key} index={key}>
                  <Image
                    src={image.url}
                    width={image.width}
                    height={image.height}
                    objectFit="cover"
                    objectPosition="center"
                    layout="fill"
                    priority={key === 0}
                    alt=""
                  />
                </Slide>
              ))}
            </Slider>
            <DotGroup className="z-30" />
          </CarouselProvider>
        </>
      )}
      <div className="container">
        <section className="mt-3 lg:mt-5 divider-b">
          <h2 className="text-black mb-0 lg:text-3xl leading-tight justify-start">
            {data.title}
          </h2>
          <p className="text-sm lg:text-lg text-grey-dark">
            {data.alternateSearchTerms}
          </p>
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
                    <Link key={key} href={`/resource/${resource.slug}`}>
                      <a>
                        <CarouselCard
                          key={key}
                          className="w-64 border-1 rounded-md border-grey-light overflow-hidden relative">
                          <Image
                            src={resource.coverImage.url}
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
                    <Link key={key} href={`/resource/${resource.slug}`}>
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
                          <Image
                            src={resource.coverImage.url}
                            width={80}
                            height={80}
                            alt={resource.title}
                          />
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
              <Carousel showNav={false} className="gap-x-2 flex-1 mt-3 lg:mt-0">
                {data.itemCategory.items.map((item, key) => (
                  <>
                    {item.id !== data.id && (
                      <Link key={key} href={`/items/${item.slug}`}>
                        <a>
                          <CarouselCard
                            key={key}
                            className="w-36 lg:w-64 overflow-hidden relative">
                            <div className="w-full h-36 lg:h-64 rounded-md bg-grey-light overflow-hidden">
                              {item.images && (
                                <Image
                                  src={item.images[0].url}
                                  width={width > 1080 ? 256 : 144}
                                  height={width > 1080 ? 256 : 144}
                                  objectFit="cover"
                                  objectPosition="center"
                                  alt={item.title}
                                />
                              )}
                            </div>
                            <h4 className="py-2 text-blue lg:text-lg leading-none">
                              {item.title}
                            </h4>
                          </CarouselCard>
                        </a>
                      </Link>
                    )}
                  </>
                ))}
              </Carousel>
            </section>
            <div className="divider-b mt-4 mb-2"></div>
            <span className="text-grey-dark text-sm">
              Last Updated:{' '}
              {DateTime.fromISO(data.updatedAt).toLocaleString(
                DateTime.DATE_MED,
              )}
            </span>
            <div className="divider-b mt-2"></div>
          </>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const { id } = query;

  // mock data
  return {
    props: {
      data: {
        id: 1,
        title: 'Aerosol Cans',
        createdAt: '2022-02-28T08:22:27.530Z',
        updatedAt: '2022-03-30T15:27:14.481Z',
        publishedAt: '2022-03-01T05:41:07.178Z',
        otherInfo:
          'In September 2020, a worker in a scrap metal yard died from burn injuries after an aerosol can caused a fire.',
        alternateSearchTerms:
          'spray can, hairspray, spray paint, fire extinguisher',
        slug: 'aerosol-cans',
        recommendations: [
          {
            id: 7,
            recommendationText:
              '<p style="column-count: 1">As this is metal, it is widely accepted in recycling bins, by karung guni and cash for trash. Ensure the can is empty first!</p><p style="column-count: 1"><strong>DO NOT</strong> put full cans into any bin; they post a danger to the workers who handle the waste.</p>',
            otherText:
              '<p style="column-count: 1"><span>Books that are in good condition (no pages missing, not stained or mouldy) can be left at the book exchange corner at the National Library.</span></p><p style="column-count: 1"><span>Some thrift shops will take book donations, particularly children\'s books. But most thrift shops do not.</span></p>',
            title: 'Recycle',
            recommendation: 'Recycle',
            resources: [
              {
                id: 1,
                title: 'Blue Bins',
                description:
                  '<p style="column-count: 1">The good old blue bins.</p>',
                createdAt: '2022-02-28T08:56:25.738Z',
                updatedAt: '2022-03-30T15:44:07.745Z',
                url: null,
                items: null,
                locations: null,
                address: null,
                slug: 'blue-bins',
                coverImage: {
                  id: 14,
                  name: 'blue_bins.png',
                  alternativeText: 'blue_bins.png',
                  caption: 'blue_bins.png',
                  width: 1024,
                  height: 1024,
                  formats: {
                    thumbnail: {
                      name: 'thumbnail_blue_bins.png',
                      hash: 'thumbnail_blue_bins_f59a56f472',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 156,
                      height: 156,
                      size: 35.36,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_blue_bins_f59a56f472.png',
                    },
                    large: {
                      name: 'large_blue_bins.png',
                      hash: 'large_blue_bins_f59a56f472',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 1000,
                      height: 1000,
                      size: 829.44,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/large_blue_bins_f59a56f472.png',
                    },
                    medium: {
                      name: 'medium_blue_bins.png',
                      hash: 'medium_blue_bins_f59a56f472',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 750,
                      height: 750,
                      size: 514.99,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_blue_bins_f59a56f472.png',
                    },
                    small: {
                      name: 'small_blue_bins.png',
                      hash: 'small_blue_bins_f59a56f472',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 500,
                      height: 500,
                      size: 254.06,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_blue_bins_f59a56f472.png',
                    },
                  },
                  hash: 'blue_bins_f59a56f472',
                  ext: '.png',
                  mime: 'image/png',
                  size: 167.99,
                  url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/blue_bins_f59a56f472.png',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-aws-s3-advanced',
                  provider_metadata: null,
                  createdAt: '2022-03-30T15:38:57.939Z',
                  updatedAt: '2022-03-30T15:38:57.939Z',
                },
              },
              {
                id: 3,
                title: '3-in-1 e-Waste Bins',
                description:
                  '<p style="column-count: 1">ALBA E-Waste has stationed more than 300 E-Bins across Singapore. The 3-in-1 e-Waste Bins are one of the 3 bin types deployed around Singapore . They can be found in public areas such as town centres, shopping malls, government buildings, Residents’ Committee Centres, community centres, supermarkets and retail outlets. </p>',
                createdAt: '2022-02-28T09:26:21.683Z',
                updatedAt: '2022-03-30T15:44:01.386Z',
                url: 'https://alba-ewaste.sg/drop-off-locations/',
                items:
                  '<p style="column-count: 1">Accepted E-Waste: </p><ul><li><p style="column-count: 1">Batteries (AA, AAA, AAAA, D, C, 9-volt, Button Cell only) – circumference ≤ 50mm </p></li><li><p style="column-count: 1">Light Bulbs – circumference ≤ 100mm </p></li><li><p style="column-count: 1">ICT equipment: Printers, power banks, computers &amp; laptops, mobile phones &amp; tablets, network &amp; set-top boxes, TVs &amp; desktop monitors – devices must be able to fit through a 500mm x 250mm slot </p></li><li><p style="column-count: 1">ICT Peripherals: Mouse, Keyboards, Computer cables, Mobile phone wires, Headset, Headphones, Earpiece, Hard disk/external hard drive/ Thumb drive</p></li></ul>',
                locations: null,
                address: null,
                slug: '3-in-1-e-waste-bins',
                coverImage: {
                  id: 13,
                  name: 'eee.png',
                  alternativeText: 'eee.png',
                  caption: 'eee.png',
                  width: 1262,
                  height: 977,
                  formats: {
                    thumbnail: {
                      name: 'thumbnail_eee.png',
                      hash: 'thumbnail_eee_e17e8496bf',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 202,
                      height: 156,
                      size: 73.27,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_eee_e17e8496bf.png',
                    },
                    large: {
                      name: 'large_eee.png',
                      hash: 'large_eee_e17e8496bf',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 1000,
                      height: 774,
                      size: 1312.25,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/large_eee_e17e8496bf.png',
                    },
                    medium: {
                      name: 'medium_eee.png',
                      hash: 'medium_eee_e17e8496bf',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 750,
                      height: 581,
                      size: 767.73,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_eee_e17e8496bf.png',
                    },
                    small: {
                      name: 'small_eee.png',
                      hash: 'small_eee_e17e8496bf',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 500,
                      height: 387,
                      size: 361.13,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_eee_e17e8496bf.png',
                    },
                  },
                  hash: 'eee_e17e8496bf',
                  ext: '.png',
                  mime: 'image/png',
                  size: 516.53,
                  url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/eee_e17e8496bf.png',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-aws-s3-advanced',
                  provider_metadata: null,
                  createdAt: '2022-03-30T15:12:52.378Z',
                  updatedAt: '2022-03-30T15:12:52.378Z',
                },
              },
            ],
          },
          {
            id: 8,
            recommendationText:
              '<p style="column-count: 1">Consequatur illum debitis non nostrum consequuntur. Qui et perferendis quae quidem ipsa sed quia. Velit qui ipsa maiores eos a et reprehenderit commodi. Quaerat magnam nihil consequatur recusandae nisi odio. Qui aut illum ut eius.</p>',
            otherText: null,
            title: null,
            recommendation: 'GiveAway',
            resources: [
              {
                id: 2,
                title: 'Cash for Trash',
                description:
                  '<p style="column-count: 1">Cash-for-Trash is an incentive programme by Public Waste Collectors, where residents may bring their recyclables to the Cash-for-Trash stations and cash is given in exchange for recyclables. </p><p style="column-count: 1">Suspended during COVID.</p>',
                createdAt: '2022-02-28T08:56:58.300Z',
                updatedAt: '2022-03-30T15:44:13.285Z',
                url: 'https://www.nea.gov.sg/our-services/waste-management/3r-programmes-and-resources/recycling-collection-points',
                items:
                  '<p style="column-count: 1">Items taken include Metal cans, Newspapers, Books, Magazines), Corrugated cardboard, Old clothing&amp; bed sheets (in good condition), Small electrical appliances. Not taken: plastic &amp; glass.</p>',
                locations: null,
                address: null,
                slug: 'cash-for-trash',
                coverImage: {
                  id: 15,
                  name: '160178472_4178354962209633_5999074153740908589_n.jpg',
                  alternativeText:
                    '160178472_4178354962209633_5999074153740908589_n.jpg',
                  caption:
                    '160178472_4178354962209633_5999074153740908589_n.jpg',
                  width: 1120,
                  height: 2015,
                  formats: {
                    thumbnail: {
                      name: 'thumbnail_160178472_4178354962209633_5999074153740908589_n.jpg',
                      hash: 'thumbnail_160178472_4178354962209633_5999074153740908589_n_afc14a085e',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 87,
                      height: 156,
                      size: 4.79,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_160178472_4178354962209633_5999074153740908589_n_afc14a085e.jpg',
                    },
                    large: {
                      name: 'large_160178472_4178354962209633_5999074153740908589_n.jpg',
                      hash: 'large_160178472_4178354962209633_5999074153740908589_n_afc14a085e',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 556,
                      height: 1000,
                      size: 107.65,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/large_160178472_4178354962209633_5999074153740908589_n_afc14a085e.jpg',
                    },
                    medium: {
                      name: 'medium_160178472_4178354962209633_5999074153740908589_n.jpg',
                      hash: 'medium_160178472_4178354962209633_5999074153740908589_n_afc14a085e',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 417,
                      height: 750,
                      size: 66.19,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_160178472_4178354962209633_5999074153740908589_n_afc14a085e.jpg',
                    },
                    small: {
                      name: 'small_160178472_4178354962209633_5999074153740908589_n.jpg',
                      hash: 'small_160178472_4178354962209633_5999074153740908589_n_afc14a085e',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 278,
                      height: 500,
                      size: 33.97,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_160178472_4178354962209633_5999074153740908589_n_afc14a085e.jpg',
                    },
                  },
                  hash: '160178472_4178354962209633_5999074153740908589_n_afc14a085e',
                  ext: '.jpg',
                  mime: 'image/jpeg',
                  size: 264.24,
                  url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/160178472_4178354962209633_5999074153740908589_n_afc14a085e.jpg',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-aws-s3-advanced',
                  provider_metadata: null,
                  createdAt: '2022-03-30T15:39:20.327Z',
                  updatedAt: '2022-03-30T15:39:20.327Z',
                },
              },
              {
                id: 4,
                title: 'Repair Kopitiam ',
                description:
                  '<p style="column-count: 1">Community initiative to coach and help people repair electronic devices. </p>',
                createdAt: '2022-02-28T15:19:06.879Z',
                updatedAt: '2022-03-30T15:44:17.333Z',
                url: 'https://repairkopitiam.sg/',
                items: null,
                locations: 'Multiple locations around Singapore. See website. ',
                address: null,
                slug: 'repair-kopitiam',
                coverImage: {
                  id: 16,
                  name: 'download (2)(1).png',
                  alternativeText: 'download (2)(1).png',
                  caption: 'download (2)(1).png',
                  width: 225,
                  height: 225,
                  formats: {
                    thumbnail: {
                      name: 'thumbnail_download (2)(1).png',
                      hash: 'thumbnail_download_2_1_e3714556d0',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 156,
                      height: 156,
                      size: 19.17,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_download_2_1_e3714556d0.png',
                    },
                  },
                  hash: 'download_2_1_e3714556d0',
                  ext: '.png',
                  mime: 'image/png',
                  size: 6.87,
                  url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/download_2_1_e3714556d0.png',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-aws-s3-advanced',
                  provider_metadata: null,
                  createdAt: '2022-03-30T15:39:40.266Z',
                  updatedAt: '2022-03-30T15:39:40.266Z',
                },
              },
            ],
          },
        ],
        images: [
          {
            id: 10,
            name: 'aerosol_cans.jpg',
            alternativeText: 'aerosol_cans.jpg',
            caption: 'aerosol_cans.jpg',
            width: 1000,
            height: 1250,
            formats: {
              thumbnail: {
                name: 'thumbnail_aerosol_cans.jpg',
                hash: 'thumbnail_aerosol_cans_57959df5c7',
                ext: '.jpg',
                mime: 'image/jpeg',
                path: null,
                width: 125,
                height: 156,
                size: 5.4,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_aerosol_cans_57959df5c7.jpg',
              },
              large: {
                name: 'large_aerosol_cans.jpg',
                hash: 'large_aerosol_cans_57959df5c7',
                ext: '.jpg',
                mime: 'image/jpeg',
                path: null,
                width: 800,
                height: 1000,
                size: 83.7,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/large_aerosol_cans_57959df5c7.jpg',
              },
              medium: {
                name: 'medium_aerosol_cans.jpg',
                hash: 'medium_aerosol_cans_57959df5c7',
                ext: '.jpg',
                mime: 'image/jpeg',
                path: null,
                width: 600,
                height: 750,
                size: 54.18,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_aerosol_cans_57959df5c7.jpg',
              },
              small: {
                name: 'small_aerosol_cans.jpg',
                hash: 'small_aerosol_cans_57959df5c7',
                ext: '.jpg',
                mime: 'image/jpeg',
                path: null,
                width: 400,
                height: 500,
                size: 30.04,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_aerosol_cans_57959df5c7.jpg',
              },
            },
            hash: 'aerosol_cans_57959df5c7',
            ext: '.jpg',
            mime: 'image/jpeg',
            size: 115.4,
            url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/aerosol_cans_57959df5c7.jpg',
            previewUrl: null,
            provider: 'strapi-provider-upload-aws-s3-advanced',
            provider_metadata: null,
            createdAt: '2022-03-30T05:35:42.388Z',
            updatedAt: '2022-03-30T05:35:42.388Z',
          },
          {
            id: 12,
            name: 'acrylic_box.png',
            alternativeText: 'acrylic_box.png',
            caption: 'acrylic_box.png',
            width: 1024,
            height: 975,
            formats: {
              thumbnail: {
                name: 'thumbnail_acrylic_box.png',
                hash: 'thumbnail_acrylic_box_e2ebbd2594',
                ext: '.png',
                mime: 'image/png',
                path: null,
                width: 164,
                height: 156,
                size: 48.03,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_acrylic_box_e2ebbd2594.png',
              },
              large: {
                name: 'large_acrylic_box.png',
                hash: 'large_acrylic_box_e2ebbd2594',
                ext: '.png',
                mime: 'image/png',
                path: null,
                width: 1000,
                height: 952,
                size: 1375.37,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/large_acrylic_box_e2ebbd2594.png',
              },
              medium: {
                name: 'medium_acrylic_box.png',
                hash: 'medium_acrylic_box_e2ebbd2594',
                ext: '.png',
                mime: 'image/png',
                path: null,
                width: 750,
                height: 714,
                size: 816.81,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_acrylic_box_e2ebbd2594.png',
              },
              small: {
                name: 'small_acrylic_box.png',
                hash: 'small_acrylic_box_e2ebbd2594',
                ext: '.png',
                mime: 'image/png',
                path: null,
                width: 500,
                height: 476,
                size: 370.46,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_acrylic_box_e2ebbd2594.png',
              },
            },
            hash: 'acrylic_box_e2ebbd2594',
            ext: '.png',
            mime: 'image/png',
            size: 331.6,
            url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/acrylic_box_e2ebbd2594.png',
            previewUrl: null,
            provider: 'strapi-provider-upload-aws-s3-advanced',
            provider_metadata: null,
            createdAt: '2022-03-30T08:00:58.271Z',
            updatedAt: '2022-03-30T08:00:58.271Z',
          },
          {
            id: 11,
            name: 'acrylic.jpg',
            alternativeText: 'acrylic.jpg',
            caption: 'acrylic.jpg',
            width: 800,
            height: 800,
            formats: {
              thumbnail: {
                name: 'thumbnail_acrylic.jpg',
                hash: 'thumbnail_acrylic_3c80a6725c',
                ext: '.jpg',
                mime: 'image/jpeg',
                path: null,
                width: 156,
                height: 156,
                size: 6.15,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_acrylic_3c80a6725c.jpg',
              },
              medium: {
                name: 'medium_acrylic.jpg',
                hash: 'medium_acrylic_3c80a6725c',
                ext: '.jpg',
                mime: 'image/jpeg',
                path: null,
                width: 750,
                height: 750,
                size: 69.6,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_acrylic_3c80a6725c.jpg',
              },
              small: {
                name: 'small_acrylic.jpg',
                hash: 'small_acrylic_3c80a6725c',
                ext: '.jpg',
                mime: 'image/jpeg',
                path: null,
                width: 500,
                height: 500,
                size: 38.73,
                url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_acrylic_3c80a6725c.jpg',
              },
            },
            hash: 'acrylic_3c80a6725c',
            ext: '.jpg',
            mime: 'image/jpeg',
            size: 76.08,
            url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/acrylic_3c80a6725c.jpg',
            previewUrl: null,
            provider: 'strapi-provider-upload-aws-s3-advanced',
            provider_metadata: null,
            createdAt: '2022-03-30T08:00:57.697Z',
            updatedAt: '2022-03-30T08:00:57.697Z',
          },
        ],
        articles: [],
        itemCategory: {
          id: 1,
          title: 'Metal',
          createdAt: '2022-02-28T10:27:07.321Z',
          updatedAt: '2022-03-01T05:32:11.362Z',
          items: [
            {
              id: 1,
              title: 'Aerosol Cans',
              createdAt: '2022-02-28T08:22:27.530Z',
              updatedAt: '2022-03-30T15:27:14.481Z',
              publishedAt: '2022-03-01T05:41:07.178Z',
              otherInfo:
                'In September 2020, a worker in a scrap metal yard died from burn injuries after an aerosol can caused a fire.',
              alternateSearchTerms:
                'spray can, hairspray, spray paint, fire extinguisher',
              slug: 'aerosol-cans',
              images: [
                {
                  id: 10,
                  name: 'aerosol_cans.jpg',
                  alternativeText: 'aerosol_cans.jpg',
                  caption: 'aerosol_cans.jpg',
                  width: 1000,
                  height: 1250,
                  formats: {
                    thumbnail: {
                      name: 'thumbnail_aerosol_cans.jpg',
                      hash: 'thumbnail_aerosol_cans_57959df5c7',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 125,
                      height: 156,
                      size: 5.4,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_aerosol_cans_57959df5c7.jpg',
                    },
                    large: {
                      name: 'large_aerosol_cans.jpg',
                      hash: 'large_aerosol_cans_57959df5c7',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 800,
                      height: 1000,
                      size: 83.7,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/large_aerosol_cans_57959df5c7.jpg',
                    },
                    medium: {
                      name: 'medium_aerosol_cans.jpg',
                      hash: 'medium_aerosol_cans_57959df5c7',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 600,
                      height: 750,
                      size: 54.18,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_aerosol_cans_57959df5c7.jpg',
                    },
                    small: {
                      name: 'small_aerosol_cans.jpg',
                      hash: 'small_aerosol_cans_57959df5c7',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 400,
                      height: 500,
                      size: 30.04,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_aerosol_cans_57959df5c7.jpg',
                    },
                  },
                  hash: 'aerosol_cans_57959df5c7',
                  ext: '.jpg',
                  mime: 'image/jpeg',
                  size: 115.4,
                  url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/aerosol_cans_57959df5c7.jpg',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-aws-s3-advanced',
                  provider_metadata: null,
                  createdAt: '2022-03-30T05:35:42.388Z',
                  updatedAt: '2022-03-30T05:35:42.388Z',
                },
                {
                  id: 12,
                  name: 'acrylic_box.png',
                  alternativeText: 'acrylic_box.png',
                  caption: 'acrylic_box.png',
                  width: 1024,
                  height: 975,
                  formats: {
                    thumbnail: {
                      name: 'thumbnail_acrylic_box.png',
                      hash: 'thumbnail_acrylic_box_e2ebbd2594',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 164,
                      height: 156,
                      size: 48.03,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_acrylic_box_e2ebbd2594.png',
                    },
                    large: {
                      name: 'large_acrylic_box.png',
                      hash: 'large_acrylic_box_e2ebbd2594',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 1000,
                      height: 952,
                      size: 1375.37,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/large_acrylic_box_e2ebbd2594.png',
                    },
                    medium: {
                      name: 'medium_acrylic_box.png',
                      hash: 'medium_acrylic_box_e2ebbd2594',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 750,
                      height: 714,
                      size: 816.81,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_acrylic_box_e2ebbd2594.png',
                    },
                    small: {
                      name: 'small_acrylic_box.png',
                      hash: 'small_acrylic_box_e2ebbd2594',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 500,
                      height: 476,
                      size: 370.46,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_acrylic_box_e2ebbd2594.png',
                    },
                  },
                  hash: 'acrylic_box_e2ebbd2594',
                  ext: '.png',
                  mime: 'image/png',
                  size: 331.6,
                  url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/acrylic_box_e2ebbd2594.png',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-aws-s3-advanced',
                  provider_metadata: null,
                  createdAt: '2022-03-30T08:00:58.271Z',
                  updatedAt: '2022-03-30T08:00:58.271Z',
                },
                {
                  id: 11,
                  name: 'acrylic.jpg',
                  alternativeText: 'acrylic.jpg',
                  caption: 'acrylic.jpg',
                  width: 800,
                  height: 800,
                  formats: {
                    thumbnail: {
                      name: 'thumbnail_acrylic.jpg',
                      hash: 'thumbnail_acrylic_3c80a6725c',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 156,
                      height: 156,
                      size: 6.15,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_acrylic_3c80a6725c.jpg',
                    },
                    medium: {
                      name: 'medium_acrylic.jpg',
                      hash: 'medium_acrylic_3c80a6725c',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 750,
                      height: 750,
                      size: 69.6,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_acrylic_3c80a6725c.jpg',
                    },
                    small: {
                      name: 'small_acrylic.jpg',
                      hash: 'small_acrylic_3c80a6725c',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      path: null,
                      width: 500,
                      height: 500,
                      size: 38.73,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_acrylic_3c80a6725c.jpg',
                    },
                  },
                  hash: 'acrylic_3c80a6725c',
                  ext: '.jpg',
                  mime: 'image/jpeg',
                  size: 76.08,
                  url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/acrylic_3c80a6725c.jpg',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-aws-s3-advanced',
                  provider_metadata: null,
                  createdAt: '2022-03-30T08:00:57.697Z',
                  updatedAt: '2022-03-30T08:00:57.697Z',
                },
              ],
            },
            {
              id: 3,
              title: 'Small appliances',
              createdAt: '2022-02-28T15:15:14.737Z',
              updatedAt: '2022-03-31T04:47:45.600Z',
              publishedAt: '2022-02-28T15:15:54.140Z',
              otherInfo:
                'While technically e-waste, small and medium sized appliances are "unregulated e-waste" meaning that they are not accepted in e-waste bins. Unfortunately there is no convenient way to recycled these unlike other forms of e-waste.',
              alternateSearchTerms:
                'CD player, DVD player, blender, clothes iron, curling iron, electric hot pot, food processor, hair dryer, hair straightener, hot plate, induction cooker, juicer, microwave, mixer, radio, rice cooker, sandwich maker, sewing machine, slow cooker, speaker, standing fan, steamer, telephone, toaster, toaster oven, vacuum, kettle, food blender, electric kettle, gaming console',
              slug: 'small-appliances',
              images: [
                {
                  id: 18,
                  name: 'small_appliances.png',
                  alternativeText: 'small_appliances.png',
                  caption: 'small_appliances.png',
                  width: 1080,
                  height: 1080,
                  formats: {
                    thumbnail: {
                      name: 'thumbnail_small_appliances.png',
                      hash: 'thumbnail_small_appliances_0962d171f4',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 156,
                      height: 156,
                      size: 33.94,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/thumbnail_small_appliances_0962d171f4.png',
                    },
                    large: {
                      name: 'large_small_appliances.png',
                      hash: 'large_small_appliances_0962d171f4',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 1000,
                      height: 1000,
                      size: 882.11,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/large_small_appliances_0962d171f4.png',
                    },
                    medium: {
                      name: 'medium_small_appliances.png',
                      hash: 'medium_small_appliances_0962d171f4',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 750,
                      height: 750,
                      size: 535.52,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/medium_small_appliances_0962d171f4.png',
                    },
                    small: {
                      name: 'small_small_appliances.png',
                      hash: 'small_small_appliances_0962d171f4',
                      ext: '.png',
                      mime: 'image/png',
                      path: null,
                      width: 500,
                      height: 500,
                      size: 260.56,
                      url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_small_appliances_0962d171f4.png',
                    },
                  },
                  hash: 'small_appliances_0962d171f4',
                  ext: '.png',
                  mime: 'image/png',
                  size: 283.72,
                  url: 'https://recyclopedia.ap-south-1.linodeobjects.com/strapi-assets/small_appliances_0962d171f4.png',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-aws-s3-advanced',
                  provider_metadata: null,
                  createdAt: '2022-03-31T04:47:42.829Z',
                  updatedAt: '2022-03-31T04:47:42.829Z',
                },
              ],
            },
          ],
        },
      },
      meta: {},
    },
  };
}

export default Page;
