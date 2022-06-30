import Head from 'next/head';
import qs from 'qs';
import Link from 'next/link';
import { SWRConfig } from 'swr';

import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import NewImage from '../components/Image';
import InfiniteLoader from '../components/InfiniteLoader';
import {
  ITEMS_PER_PAGE,
  staticFetcher,
  useSearchBarTopValue,
  useWindowDimensions,
  useFetchContent,
} from '../lib/hooks';
import {
  AccordionBody,
  AccordionHeader,
  AccordionProvider,
} from '../components/Accordion';

const Card = ({ params = {} }) => {
  const {
    data: articles,
    loadNext,
    isFinished,
  } = useFetchContent('articles', params);

  return (
    <div className="w-full mt-4 lg:mt-8">
      {articles.map((articleFetch) => {
        return articleFetch.map((article, key) => (
          <Link key={key} href={`/articles/${article.slug}`}>
            <a>
              <div className="flex flex-row mb-8 gap-x-4 flex-wrap divider-b divider-b-taller">
                <div className="w-1/3 md:min-h-[150px]">
                  <NewImage
                    className="aspect-[248/184] md:rounded-md"
                    sizes="270px"
                    source={article.coverImage || {}}
                    layout="responsive"
                  />
                </div>
                <div className="flex-1 mb-4">
                  <h5 className="text-left pt-2">{article.category?.title}</h5>
                  <h3 className="text-black">{article.title}</h3>
                  <p className="hidden md:block text-black my-2 text-lg leading-tight">
                    {article.excerpt && article.excerpt}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        ));
      })}
      {!isFinished && <InfiniteLoader handleEnter={loadNext} />}
    </div>
  );
};

export default function Page({
  pageOptions = {
    title: 'testing',
  },
  fallback,
  categoryTitles,
}) {
  const { title, featuredArticles } = pageOptions;
  const x = useSearchBarTopValue();
  const { width } = useWindowDimensions();

  const articleTabs = {};

  articleTabs['All'] = (
    <Card
      params={{
        populate: ['coverImage', 'category'],
        category: categoryTitles.join(','),
      }}
    />
  );

  categoryTitles.map((categoryTitle, key) => {
    articleTabs[categoryTitle] = (
      <Card
        key={key}
        params={{
          populate: ['coverImage', 'category'],
          category: categoryTitle,
        }}
      />
    );
  });

  return (
    <Layout headerContainerStyle={{ backgroundColor: pageOptions.colour }}>
      <Head>
        <title>Recyclopedia - {title}</title>
      </Head>
      <section
        className="relative py-4 lg:pt-10"
        style={{
          backgroundColor: pageOptions.colour,
        }}>
        <div className="container container--narrow">
          <h1 className="text-black">
            <i
              className={`${
                { Regular: 'far', Light: 'fal', Solid: 'fas' }[
                  pageOptions.iconStyle
                ]
              } fa-${pageOptions.icon} text-3xl mr-3 mt-1`}
            />
            {title}
          </h1>
          <p className="text-lg leading-tight">{pageOptions.subtitle}</p>
        </div>
      </section>
      <SearchBar
        top={x}
        searchType={['articles']}
        placeholderText={`Search ${title}`}
        className="py-2 sticky lg:relative transition-all duration-200 z-20"
        wrapperClassName="max-w-[800px]"
        inactiveBackgroundColor={pageOptions.colour}
        activeBackgroundColor={pageOptions.colour}
      />
      <div className="container pt-4 md:pt-10">
        {featuredArticles && (
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.map(({ article }) => (
              <div key={article.slug}>
                <Link href={`/articles/${article.slug}`}>
                  <a>
                    <NewImage
                      className="aspect-[503/374] lg:rounded-md"
                      sizes="600px"
                      width={'100%'}
                      height={width >= 1080 ? 374 : 278}
                      source={article.coverImage}
                      layout="fixed"
                    />
                    <div className="px-2 lg:px-0">
                      <h5 className="text-left pt-2">
                        {article.category.title}
                      </h5>
                      <h3 className="text-black">{article.title}</h3>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <SWRConfig value={{ fallback }}>
        <AccordionProvider headers={['All', ...categoryTitles]}>
          <AccordionHeader
            className="mt-6 lg:mt-16"
            carouselClassName="scroll-px-4"
            sliderClassName="lg:max-w-[840px] mx-auto px-4"
          />
          <div className="container container--narrow">
            <AccordionBody {...articleTabs} />
          </div>
        </AccordionProvider>
      </SWRConfig>
    </Layout>
  );
}

export async function getStaticProps() {
  const fallback = {};

  const { data: pageOptions } = await staticFetcher(
    `${process.env.API_URL}/news-and-tips-page?${qs.stringify({
      populate: [
        'featuredArticles',
        'featuredArticles.article',
        'featuredArticles.article.coverImage',
        'featuredArticles.article.category',
      ],
    })}`,
    process.env.API_KEY,
  );

  const { data: categoryData } = await staticFetcher(
    `${process.env.API_URL}/article-categories?${qs.stringify({
      sort: ['title'],
    })}`,
    process.env.API_KEY,
  );

  const categoryTitles = categoryData.map(({ title }) => title);

  const fetchEachCategory = categoryTitles.map(async (title) => {
    const query = qs.stringify({
      populate: ['coverImage', 'category'],
      sort: ['updatedAt:desc'],
      pagination: {
        page: 1,
        pageSize: ITEMS_PER_PAGE,
      },
      filters: { category: { title: { $eq: title } } },
    });

    const { data: results } = await staticFetcher(
      `${process.env.API_URL}/articles?${query}`,
      process.env.API_KEY,
    );

    fallback[
      `/api/articles?${qs.stringify({
        populate: ['coverImage', 'category'],
        page: 0,
        pageSize: ITEMS_PER_PAGE,
        category: title,
      })}`
    ] = [results];

    return true;
  });

  await Promise.all(fetchEachCategory);

  const { data: allArticles } = await staticFetcher(
    `${process.env.API_URL}/articles?${qs.stringify({
      populate: ['coverImage', 'category'],
      sort: ['updatedAt:desc'],
      pagination: {
        page: 1,
        pageSize: ITEMS_PER_PAGE,
      },
    })}`,
    process.env.API_KEY,
  );

  fallback[
    `/api/articles?${qs.stringify({
      populate: ['coverImage', 'category'],
      page: 0,
      pageSize: ITEMS_PER_PAGE,
      category: categoryTitles.join(','),
    })}`
  ] = [allArticles];

  return { props: { pageOptions, categoryTitles, fallback } };
}
