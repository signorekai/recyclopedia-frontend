import Head from 'next/head';
import qs from 'qs';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';

import { getLargestPossibleImage } from '../../lib/functions';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import { Carousel, CarouselCard } from '../../components/Carousel';
import Card from '../../components/Card';
import { staticFetcher, useWindowDimensions } from '../../lib/hooks';
import NewImage from '../../components/Image';
import BookmarkButton from '../../components/BookmarkButton';
import Masonry from '../../components/Masonry';
import Mailchimp from '../../components/Mailchimp';

export default function Page({ article, categoryTitles, nextPost }) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  return (
    <>
      {article && (
        <Layout
          showHeaderInitially={true}
          showHeaderOn=""
          hideHeaderOn=""
          title={article && article.title}>
          <Head>
            <meta
              property="og:url"
              key="og:url"
              content={`${process.env.NEXT_PUBLIC_LOCATION}${router.asPath}`}
            />
            <meta
              property="og:description"
              key="og:description"
              content={article.excerpt}
            />
            {article.coverImage && (
              <meta
                property="og:image"
                key="og:image"
                content={getLargestPossibleImage(
                  article.coverImage,
                  'large',
                  'medium',
                )}
              />
            )}
          </Head>
          <div className={`border-grey border-b-1`}>
            <Carousel
              autoScroll={false}
              autoSlideSize={true}
              className="scroll-px-4 mt-4"
              sliderClassName={`gap-x-8 relative px-4 container !max-w-screen-lg`}>
              <CarouselCard>
                <Link href={`/articles`}>
                  <a className="no-underline text-xs uppercase font-bold tracking-2 font-archivo pb-2 !text-grey-dark whitespace-nowrap">
                    All Articles
                  </a>
                </Link>
              </CarouselCard>
              {categoryTitles.map((title) => (
                <CarouselCard key={title}>
                  <Link href={`/articles?section=${title}`}>
                    <a className="no-underline text-xs uppercase font-bold tracking-2 font-archivo pb-2 !text-grey-dark">
                      {title}
                    </a>
                  </Link>
                </CarouselCard>
              ))}
            </Carousel>
          </div>
          <div className="container mt-10">
            {article.category && (
              <h5 className="text-left">{article.category.title}</h5>
            )}
            <h1 className="text-black pt-2 mb-0">
              {article.title}{' '}
              <BookmarkButton
                className="ml-2 mt-1 page-icon-wrapper shadow-none bg-grey-light"
                contentType="articles"
                slug={article.slug}
                contentId={article.id}
              />
            </h1>
            {(function () {
              const publicationDate = article.publicationDate
                ? DateTime.fromISO(article.publicationDate).toLocaleString(
                    DateTime.DATE_MED,
                  )
                : DateTime.fromISO(article.createdAt).toLocaleString(
                    DateTime.DATE_MED,
                  );
              const updatedDate = DateTime.fromISO(
                article.updatedAt,
              ).toLocaleString(DateTime.DATE_MED);
              return (
                <span className="block mb-4">
                  <h4 className="mt-2">{publicationDate}</h4>
                  {updatedDate !== publicationDate && (
                    <h6 className="text-sm text-grey-mid">
                      Last Updated: {updatedDate}
                    </h6>
                  )}
                </span>
              );
            })()}
            <div className="lg:w-3/4">
              {article.coverImage && (
                <NewImage
                  width={article.coverImage.width}
                  height={article.coverImage.height}
                  sizes="100vw"
                  source={article.coverImage || {}}
                  layout="responsive"
                />
              )}
            </div>
            <article
              className="article-body mt-4 text-lg divider-b divider-b-8"
              dangerouslySetInnerHTML={{ __html: article.content }}></article>
          </div>
          <div className="container">
            <div className="lg:w-3/4 mt-10 divider-b divider-b-8">
              <h3 className="text-2xl leading-tight font-medium ">
                Want to keep up with Singapore&apos;s Zero-Waste happenings?
              </h3>
              <p className="mt-3 text-lg">
                Sign up for Recyclopedia News here. Get the latest info on new
                donation drives, recycling initiatives, zero-waste news, and the
                occasional life-hack for living lighter. No spam. You can
                unsubscribe any time.{' '}
                <a href="https://mailchi.mp/d067d8c7e8ed/waste-not-news-5791">
                  See a past issue here
                </a>
                .
              </p>
              <Mailchimp />
            </div>
          </div>
          <div className="container">
            {article.items && article.items.length > 0 && (
              <div className="lg:divider-b lg:max-w-[75%]">
                <div className="mt-10">
                  <h5 className="text-left">Related Items</h5>
                </div>
                <div className="flex-1 mt-5">
                  <Masonry
                    items={article.items}
                    columns={3}
                    card={(item, key) => (
                      <CarouselCard key={key} className="w-full">
                        <Card
                          className="w-full"
                          imagesWrapperClassName="aspect-square"
                          uniqueKey={`related-${key}`}
                          key={`related-${key}`}
                          content={{
                            contentType: 'items',
                            slug: item.slug,
                            headerText: item.title,
                            image: item.images ? item.images[0] : {},
                          }}
                        />
                      </CarouselCard>
                    )}
                  />
                </div>
              </div>
            )}
            {article.resources && article.resources.length > 0 && (
              <div className="lg:divider-b lg:max-w-[75%]">
                <div className="mt-10">
                  <h5 className="text-left">Related Resources</h5>
                </div>
                <div className="flex-1 mt-5">
                  <Masonry
                    items={article.resources}
                    columns={3}
                    card={(item, key) => (
                      <CarouselCard key={key} className="w-full">
                        <Card
                          className="w-full"
                          imagesWrapperClassName="aspect-[4_/_3]"
                          uniqueKey={`related-${key}`}
                          key={`related-${key}`}
                          content={{
                            contentType: 'resources',
                            slug: item.slug,
                            headerText: item.title,
                            image: item.images ? item.images[0] : {},
                          }}
                        />
                      </CarouselCard>
                    )}
                  />
                </div>
              </div>
            )}
            {nextPost && nextPost.length > 0 && (
              <section className="lg:max-w-[75%]">
                <div className="mt-10">
                  <h5 className="text-left">Read next</h5>
                </div>
                <div className={`flex flex-row mt-5 mb-8 lg:mb-12`}>
                  <div className="w-full">
                    <Link
                      key={nextPost[0].slug}
                      href={`/articles/${nextPost[0].slug}`}>
                      <a className="group no-underline">
                        <div className="flex flex-row mb-8 gap-x-4 flex-wrap justify-center items-center">
                          <div className="w-1/4 min-w-[96px] aspect-[4/3]">
                            <NewImage
                              wrapperClassName="md:rounded-md"
                              className="aspect-[4/3] group-hover:scale-110 transition-transform"
                              sizes="270px"
                              source={nextPost[0].coverImage || {}}
                              layout="responsive"
                            />
                          </div>
                          <div className="flex-1 mb-4">
                            <h5 className="text-left pt-2">
                              {nextPost[0].category?.title}
                            </h5>
                            <h3 className="text-blue-dark group-hover:text-blue block">
                              {nextPost[0].title}
                              <i className="fa fa-arrow-right ml-2 text-xs font-normal translate-y-[-2px] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"></i>
                            </h3>
                            <p className="hidden md:block text-black my-2 text-base leading-tight group-hover:opacity-60">
                              {nextPost[0].excerpt && nextPost[0].excerpt}
                            </p>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </div>
        </Layout>
      )}
    </>
  );
}

export async function getStaticPaths() {
  const ip = process.env.API_URL;
  const { data: res } = await staticFetcher(
    `${ip}/articles?${qs.stringify({
      sort: ['updatedAt:desc'],
      pagination: {
        page: 1,
        pagesize: 40,
      },
    })}`,
    process.env.API_KEY,
  );

  const paths = res.map(({ slug }) => ({
    params: { articleSlug: slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const { articleSlug } = params;
  const ip = process.env.API_URL;
  const query = qs.stringify({
    populate: [
      'coverImage',
      'items',
      'resources',
      'items.images',
      'resources.images',
      'category',
    ],
    filters: { slug: { $eq: articleSlug } },
  });

  const { data: articles } = await staticFetcher(
    `${ip}/articles?${query}`,
    process.env.API_KEY,
  );

  if (articles.length === 0) {
    return { notFound: true };
  }

  const { data: categoryData } = await staticFetcher(
    `${process.env.API_URL}/article-categories?${qs.stringify({
      sort: ['title'],
    })}`,
    process.env.API_KEY,
  );

  const { data: nextPost } = await staticFetcher(
    `${process.env.API_URL}/articles`,
    process.env.API_KEY,
    {
      filters: {
        id: {
          $ne: articles[0].id,
        },
        updatedAt: {
          $lt: articles[0].updatedAt,
        },
      },
      sort: ['updatedAt:desc'],
      fields: ['title', 'slug', 'excerpt'],
      populate: ['category', 'coverImage'],
      pagination: {
        start: 0,
        limit: 1,
      },
    },
  );

  const categoryTitles = categoryData.map(({ title }) => title);

  return {
    props: {
      article: articles[0],
      nextPost,
      categoryTitles,
    },
  };
}
