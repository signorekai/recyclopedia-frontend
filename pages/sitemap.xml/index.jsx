import { getServerSideSitemap } from 'next-sitemap';
import qs from 'qs';
import { staticFetcher } from '../../lib/hooks';

export const getServerSideProps = async (ctx) => {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const ip = process.env.API_URL;
  const apiKey = process.env.API_KEY;
  let fields = [
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/items/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/about-us/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/articles/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/freecycling/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/newsletter/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/register/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/privacy-policy/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/shops/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/resources/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/terms-of-service/`,
      lastmod: new Date().toISOString(),
    },
  ];

  const contentParams = {
    fields: ['slug'],
    pagination: {
      page: 0,
      pageSize: 100000000,
    },
  };

  const { data: items } = await staticFetcher(
    `${ip}/items`,
    apiKey,
    contentParams,
  );

  items.map((item) => {
    fields.push({
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/items/${item.slug}`,
      lastmod: new Date().toISOString(),
    });
  });

  const { data: shopOptions } = await staticFetcher(
    `${ip}/shops-page`,
    apiKey,
    {
      populate: ['resourceTags'],
    },
  );

  const shopTagNames = shopOptions.resourceTags.map((tag) => tag.title);

  const { data: shops } = await staticFetcher(`${ip}/resources`, apiKey, {
    ...contentParams,
    filters: {
      resourceTags: {
        title: {
          $in: shopTagNames,
        },
      },
    },
  });

  shops.map((shop) => {
    fields.push({
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/shops/${shop.slug}`,
      lastmod: new Date().toISOString(),
    });
  });

  const { data: resourceOptions } = await staticFetcher(
    `${ip}/resource-page`,
    apiKey,
    {
      populate: ['resourceTags'],
    },
  );

  const resourceTagNames = resourceOptions.resourceTags.map((tag) => tag.title);

  const { data: resources } = await staticFetcher(`${ip}/resources`, apiKey, {
    ...contentParams,
    filters: {
      resourceTags: {
        title: {
          $in: resourceTagNames,
        },
      },
    },
  });

  resources.map((resource) => {
    fields.push({
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/resources/${resource.slug}`,
      lastmod: new Date().toISOString(),
    });
  });

  const { data: freecyclingOptions } = await staticFetcher(
    `${ip}/donate-page`,
    apiKey,
    {
      populate: ['resourceTags'],
    },
  );

  const freecyclingTagNames = freecyclingOptions.resourceTags.map(
    (tag) => tag.title,
  );

  const { data: freecycling } = await staticFetcher(`${ip}/resources`, apiKey, {
    ...contentParams,
    filters: {
      resourceTags: {
        title: {
          $in: freecyclingTagNames,
        },
      },
    },
  });

  freecycling.map((resource) => {
    fields.push({
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/freecycling/${resource.slug}`,
      lastmod: new Date().toISOString(),
    });
  });

  const { data: articles } = await staticFetcher(
    `${ip}/articles`,
    apiKey,
    contentParams,
  );

  articles.map((item) => {
    fields.push({
      loc: `${process.env.NEXT_PUBLIC_LOCATION}/articles/${item.slug}`,
      lastmod: new Date().toISOString(),
    });
  });

  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
