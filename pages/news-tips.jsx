import Head from 'next/head';
import qs from 'querystring';
import Link from 'next/link';

import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import NewImage from '../components/Image';
import {
  staticFetcher,
  useSearchBarTopValue,
  useWindowDimensions,
} from '../lib/hooks';
import {
  AccordionBody,
  AccordionHeader,
  AccordionProvider,
} from '../components/Accordion';

export default function Page({
  pageOptions = {
    title: 'testing',
  },
  categories,
}) {
  const { title, featuredArticles } = pageOptions;
  const x = useSearchBarTopValue();
  const { width } = useWindowDimensions();

  console.log(categories);

  return (
    <Layout showHeaderInitially={true} showHeaderOn="UP" hideHeaderOn="DOWN">
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
        placeholderText={`Search ${title}`}
        className="py-2 sticky lg:relative transition-all duration-200 z-80"
        wrapperClassName="max-w-[800px]"
        inactiveBackgroundColor={pageOptions.colour}
        activeBackgroundColor={pageOptions.colour}
      />
      <div className="md:container md:pt-10">
        {featuredArticles && (
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.map(({ article }) => (
              <div key={article.slug}>
                <Link href={`/articles/${article.slug}`}>
                  <a>
                    <NewImage
                      className="aspect-[503/374] lg:rounded-md"
                      sizes="750px"
                      width={'100%'}
                      height={width >= 1080 ? 374 : 278}
                      src={article.coverImage.url}
                      formats={article.coverImage.formats}
                      layout="fixed"
                    />
                    <div className="px-4 lg:px-0">
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
      <AccordionProvider
        headers={['All', ...categories.map(({ title }) => title)]}>
        <AccordionHeader
          className="mt-6 lg:mt-16"
          carouselClassName="scroll-px-4"
          sliderClassName="lg:max-w-[840px] mx-auto px-4"
        />
      </AccordionProvider>
    </Layout>
  );
}

export async function getStaticProps() {
  const pageOptions = await staticFetcher(
    `${process.env.API_URL}/api/news-and-tips-page?${qs.stringify({
      populate: [
        'featuredArticles',
        'featuredArticles.article',
        'featuredArticles.article.coverImage',
        'featuredArticles.article.category',
      ],
    })}`,
    process.env.API_KEY,
  );

  const categories = await staticFetcher(
    `${process.env.API_URL}/api/article-categories?${qs.stringify({
      sort: ['title'],
    })}`,
    process.env.API_KEY,
  );

  return { props: { pageOptions, categories } };
}
