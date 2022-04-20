import Head from 'next/head';
import Link from 'next/link';
import qs from 'qs';
import { DateTime } from 'luxon';

import Layout from '../../components/Layout';
import { Carousel, CarouselCard } from '../../components/Carousel';
import Card from '../../components/Card';
import { staticFetcher, useWindowDimensions } from '../../lib/hooks';
import { useRouter } from 'next/router';

export default function Page({ data: article, categoryTitles }) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  return (
    <>
      {article && (
        <Layout showHeaderInitially={true} showHeaderOn="" hideHeaderOn="">
          <Head>
            <title>Recyclopedia - {article && article.title}</title>
            <meta
              property="og:url"
              content={`${process.env.NEXT_PUBLIC_LOCATION}${router.asPath}`}
            />
            <meta
              property="og:title"
              content={`Recyclopedia - ${article.title}`}
            />
            <meta property="og:description" content={article.excerpt} />
            <meta
              property="og:image"
              content={
                article.coverImage.formats.large
                  ? article.coverImage.formats.large.url
                  : article.coverImage.url
              }
            />
          </Head>
          <div className={`border-grey border-b-1`}>
            <Carousel
              autoScroll={false}
              autoSlideSize={true}
              className="scroll-px-4 mt-4"
              sliderClassName={`gap-x-8 relative px-4 lg:container lg:container--mid`}>
              <CarouselCard>
                <Link href={`/news-tips`}>
                  <a className="text-xs uppercase font-bold tracking-2 font-archivo pb-2 !text-grey-dark whitespace-nowrap">
                    All Articles
                  </a>
                </Link>
              </CarouselCard>
              {categoryTitles.map((title) => (
                <CarouselCard key={title}>
                  <Link href={`/news-tips?section=${title}`}>
                    <a className="text-xs uppercase font-bold tracking-2 font-archivo pb-2 !text-grey-dark">
                      {title}
                    </a>
                  </Link>
                </CarouselCard>
              ))}
            </Carousel>
          </div>
          <div className="container container--mid mt-10">
            <h5 className="text-left">{article.category.title}</h5>
            <h1 className="text-black pt-2">{article.title}</h1>
            <h4>
              {DateTime.fromISO(article.updatedAt).toLocaleString(
                DateTime.DATE_MED,
              )}
            </h4>
            <article
              className="article-body divider-b divider-b-taller"
              dangerouslySetInnerHTML={{ __html: article.content }}></article>
          </div>
          <div className="container container--mid">
            {article.items && article.items.length > 0 && (
              <div className="lg:divider-b">
                <section className="flex flex-col lg:flex-row lg:gap-x-4 mt-6">
                  <div className="lg:w-1/4">
                    <h5 className="text-left">
                      <i className="far fa-question-circle pr-2" />
                      Related Items
                    </h5>
                  </div>
                  <div className="flex-1">
                    <Carousel
                      autoSlideSize={true}
                      showNav={false}
                      className="mt-0 mb-6 h-auto"
                      sliderStyle={{
                        width:
                          width > 1080
                            ? 250 * article.items.length
                            : width * 0.5 * article.items.length,
                      }}>
                      {article.items.map((item, key) => (
                        <CarouselCard
                          key={key}
                          className="w-screen-1/2 lg:w-[250px] mt-0">
                          <Card
                            className="w-full"
                            imgClassName="h-[200px]"
                            uniqueKey={`related-${key}`}
                            key={`related-${key}`}
                            content={{
                              contentType: 'items',
                              slug: item.slug,
                              headerText: item.title,
                              backgroundImage:
                                item.images.length > 0
                                  ? item.images[0].formats.small.url
                                  : '',
                            }}
                          />
                        </CarouselCard>
                      ))}
                    </Carousel>
                  </div>
                </section>
              </div>
            )}
            {article.resources && article.resources.length > 0 && (
              <div className="lg:divider-b">
                <section className="flex flex-col lg:flex-row lg:gap-x-4 mt-6">
                  <div className="lg:w-1/4">
                    <h5 className="text-left">
                      <i className="far fa-info-circle pr-2" />
                      Useful links
                    </h5>
                  </div>
                  <div className="flex-1">
                    <Carousel
                      autoSlideSize={true}
                      showNav={false}
                      className="mt-0 mb-6 h-auto"
                      sliderStyle={{
                        width:
                          width > 1080
                            ? 250 * article.items.length
                            : width * 0.5 * article.items.length,
                      }}>
                      {article.resources.map((item, key) => (
                        <CarouselCard
                          key={key}
                          className="w-screen-1/2 lg:w-[250px] mt-0">
                          <Card
                            className="w-full"
                            imgClassName="h-[200px]"
                            uniqueKey={`related-${key}`}
                            key={`related-${key}`}
                            content={{
                              contentType: 'resources',
                              slug: item.slug,
                              headerText: item.title,
                              backgroundImage:
                                item.images.length > 0
                                  ? item.images[0].formats.small.url
                                  : '',
                            }}
                          />
                        </CarouselCard>
                      ))}
                    </Carousel>
                  </div>
                </section>
              </div>
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
    `${ip}/api/articles?${qs.stringify({
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

  const { data } = await staticFetcher(
    `${ip}/api/articles?${query}`,
    process.env.API_KEY,
  );

  const { data: categoryData } = await staticFetcher(
    `${process.env.API_URL}/api/article-categories?${qs.stringify({
      sort: ['title'],
    })}`,
    process.env.API_KEY,
  );

  const categoryTitles = categoryData.map(({ title }) => title);

  return { props: { data: data[0], categoryTitles }, revalidate: 3600 };
}
