import Head from 'next/head';
import qs from 'qs';
import { SWRConfig } from 'swr';

import Link from '../components/Link';
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
          <>
            {article && (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <a>
                  <div className="flex flex-row mb-8 gap-x-4 flex-wrap divider-b divider-b-taller">
                    <div className="w-1/4 md:aspect-[4/3]">
                      <NewImage
                        className="aspect-[4/3] md:rounded-md"
                        sizes="270px"
                        source={article.coverImage || {}}
                        layout="responsive"
                      />
                    </div>
                    <div className="flex-1 mb-4">
                      <h5 className="text-left pt-2">
                        {article.category?.title}
                      </h5>
                      <h3 className="text-black">{article.title}</h3>
                      <p className="hidden md:block text-black my-2 text-lg leading-tight">
                        {article.excerpt && article.excerpt}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            )}
          </>
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
  const { title } = pageOptions;
  const x = useSearchBarTopValue();

  const articleTabs = {};

  articleTabs['All'] = (
    <Card
      params={{
        populate: ['coverImage', 'category'],
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
        <div className="container ">
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
        wrapperClassName="max-w-[1040px]"
        searchSuggestionsClassName=""
        inactiveBackgroundColor={pageOptions.colour}
        activeBackgroundColor={pageOptions.colour}
      />
      <SWRConfig value={{ fallback }}>
        <AccordionProvider headers={['All', ...categoryTitles]}>
          <div className="container ">
            <AccordionHeader
              className=""
              carouselClassName="scroll-px-4"
              sliderClassName="mx-auto "
            />
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
    `${process.env.API_URL}/news-and-tips-page`,
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
      sort: ['title:desc'],
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
      publicationState: 'live',
      sort: ['order:desc', 'updatedAt:desc'],
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
    })}`
  ] = [allArticles];

  return { props: { pageOptions, categoryTitles, fallback } };
}
