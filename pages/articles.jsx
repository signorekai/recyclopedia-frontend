import qs from 'qs';
import { SWRConfig } from 'swr';

import Link from '../components/Link';
import Layout from '../components/Layout';
import NewImage from '../components/Image';
import InfiniteLoader from '../components/InfiniteLoader';
import {
  ITEMS_PER_PAGE,
  staticFetcher,
  useSearchBarTopValue,
  useFetchContent,
} from '../lib/hooks';
import {
  AccordionBody,
  AccordionHeader,
  AccordionProvider,
} from '../components/Accordion';
import { useMemo } from 'react';
import OpenGraph, { getOpengraphTags } from '../components/OpenGraph';
import Head from 'next/head';

const articlesParams = {
  populate: ['coverImage', 'category'],
  publicationState: 'live',
  sort: ['order:desc', 'updatedAt:desc'],
  pagination: {
    page: 1,
    pageSize: ITEMS_PER_PAGE,
  },
};

const Card = ({ params = {} }) => {
  const { data, loadNext, isFinished } = useFetchContent('articles', params);

  return (
    <div className="w-full mt-4 lg:mt-8">
      {data.map((articles) => {
        return articles.map((article, key) => (
          <>
            {article && (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <a className="group no-underline">
                  <div className="flex flex-row mb-8 gap-x-4 flex-wrap divider-b divider-b-taller">
                    <div className="w-1/4 md:aspect-[4/3]">
                      <NewImage
                        wrapperClassName="md:rounded-md"
                        className="aspect-[4/3] group-hover:scale-110 transition-transform"
                        sizes="270px"
                        source={article.coverImage || {}}
                        layout="responsive"
                      />
                    </div>
                    <div className="flex-1 mb-4">
                      <h5 className="text-left pt-2">
                        {article.category?.title}
                      </h5>
                      <h3 className="text-blue-dark group-hover:text-blue block">
                        {article.title}
                        <i className="fa fa-arrow-right ml-2 text-xs font-normal translate-y-[-2px] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"></i>
                      </h3>
                      <p className="hidden md:block text-black my-2 text-base leading-tight group-hover:opacity-60">
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
  const { title, SEO } = pageOptions;
  const x = useSearchBarTopValue();

  const [articleHeaders, articleTabs] = useMemo(() => {
    const accordionHeaders = [];
    const articleTabs = {
      All: (
        <Card
          params={{
            populate: ['coverImage', 'category'],
          }}
        />
      ),
    };

    categoryTitles.map((categoryTitle, key) => {
      const params = {
        populate: ['coverImage', 'category'],
        category: categoryTitle,
      };

      const data =
        fallback[
          `/api/articles?${qs.stringify({
            populate: [],
            page: 0,
            pageSize: ITEMS_PER_PAGE,
            ...params,
          })}`
        ];

      if (data[0].length > 0) {
        articleTabs[categoryTitle] = <Card key={key} params={params} />;
        accordionHeaders.push(categoryTitle);
      }
    });
    return [accordionHeaders, articleTabs];
  }, [categoryTitles, fallback]);

  const meta = getOpengraphTags({ title }, SEO);

  return (
    <Layout
      title={title}
      headerContainerStyle={{ backgroundColor: pageOptions.colour }}>
      <Head>
        <meta
          name="og:title"
          key="og:title"
          content={`${meta.title} | Recyclopedia.sg`}
        />
        {meta.description && meta.description.length > 0 && (
          <>
            <meta
              key="description"
              name="description"
              content={meta.description}
            />
            <meta
              property="og:description"
              key="og:description"
              content={meta.description}
            />
          </>
        )}
        <meta property="og:image" key="og:image" content={meta.image} />
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
      <SWRConfig value={{ fallback }}>
        <AccordionProvider headers={['All', ...articleHeaders]}>
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
    {
      populate: ['SEO', 'SEO.image'],
    },
  );

  const { data: categoryData } = await staticFetcher(
    `${process.env.API_URL}/article-categories`,
    process.env.API_KEY,
    {
      sort: ['title'],
    },
  );

  const categoryTitles = categoryData.map(({ title }) => title);

  const fetchEachCategory = categoryTitles.map(async (title) => {
    const { data: results } = await staticFetcher(
      `${process.env.API_URL}/articles`,
      process.env.API_KEY,
      {
        ...articlesParams,
        filters: { category: { title: { $eq: title } } },
      },
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
    `${process.env.API_URL}/articles`,
    process.env.API_KEY,
    articlesParams,
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
