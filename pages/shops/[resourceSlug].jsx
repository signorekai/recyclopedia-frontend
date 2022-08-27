import qs from 'qs';
import ResourcePage from '../../components/ResourcePage';
import { staticFetcher } from '../../lib/hooks';

function Page({ data }) {
  return <ResourcePage data={data} baseUrl="shops" />;
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

  const queryParams = qs.stringify({
    pagination: {
      page: 1,
      pagesize: 50,
    },
    filters: {
      $or: tags,
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

  return { props: { data: result.data[0] }, revalidate: 3600 };
}

export default Page;
