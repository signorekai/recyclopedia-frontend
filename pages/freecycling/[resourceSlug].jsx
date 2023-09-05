import qs from 'qs';
import ResourcePage from '../../components/ResourcePage';
import { staticFetcher } from '../../lib/hooks';

function Page({ data, categoryTags }) {
  return <ResourcePage tags={categoryTags} data={data} baseUrl="freecycling" />;
}

export async function getStaticPaths() {
  const ip = process.env.API_URL;

  const { data: pageOptions } = await staticFetcher(
    `${ip}/donate-page`,
    process.env.API_KEY,
    {
      populate: ['resourceTags'],
    },
  );

  const tags = pageOptions.resourceTags.map((tag) => ({
    resourceTags: {
      id: {
        $eq: tag.id,
      },
    },
  }));

  const queryParams = qs.stringify({
    pagination: {
      page: 1,
      pagesize: 10,
    },
    filters: {
      $or: tags,
    },
  });

  const result = await staticFetcher(
    `${ip}/resources`,
    process.env.API_KEY,
    queryParams,
  );

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
    populate: [
      'images',
      'resourceTags',
      'relatedItems',
      'relatedItems.images',
      'externalLinks',
      'SEO',
      'SEO.image',
    ],
    filters: {
      slug: {
        $eq: resourceSlug,
      },
    },
  });

  const res = await fetch(`${ip}/resources?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
  const result = await res.json();

  if (result.data.length === 0) {
    return { notFound: true };
  }

  const categoryTags = {};
  const data = result.data[0];
  const tags = data.resourceTags.map((tag) => tag.id);

  const categories = ['donate-page', 'shops-page', 'resource-page'];
  const categorySlugs = {
    'donate-page': 'freecycling',
    'shops-page': 'shops',
    'resource-page': 'resources',
  };

  for (const category of categories) {
    const { data } = await staticFetcher(
      `${process.env.API_URL}/${category}?${qs.stringify({
        populate: ['resourceTags'],
        filters: {
          resourceTags: {
            id: {
              $in: tags,
            },
          },
        },
      })}`,
      process.env.API_KEY,
    );

    if (data !== null) {
      for (const tagId of tags) {
        for (const resourceTag of data.resourceTags) {
          if (resourceTag.id === tagId) {
            categoryTags[tagId] = categorySlugs[category];
            break;
          }
        }
      }
    }
  }

  return { props: { data, categoryTags } };
}

export default Page;
