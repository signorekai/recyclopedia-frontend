import qs from 'qs';
import ResourcePage from '../../components/ResourcePage';
import { staticFetcher } from '../../lib/hooks';

function Page({ data, categoryTags }) {
  return <ResourcePage tags={categoryTags} data={data} baseUrl="resources" />;
}

export async function getStaticPaths() {
  const ip = process.env.API_URL;

  const { data: pageOptions } = await staticFetcher(
    `${ip}/shops-page`,
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

  const result = await staticFetcher(`${ip}/resources`, process.env.API_KEY, {
    pagination: {
      page: 1,
      pagesize: 10,
    },
    filters: {
      $or: tags,
    },
  });

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

  const result = await staticFetcher(`${ip}/resources`, process.env.API_KEY, {
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

  const promises = [];
  for (const category of categories) {
    promises.push(
      new Promise(async (resolve) => {
        const { data } = await staticFetcher(
          `${process.env.API_URL}/${category}`,
          process.env.API_KEY,
          {
            populate: ['resourceTags'],
            filters: {
              resourceTags: {
                id: {
                  $in: tags,
                },
              },
            },
          },
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
        resolve();
      }),
    );
  }
  await Promise.all(promises);

  return { props: { data, categoryTags } };
}

export default Page;
