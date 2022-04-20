import qs from 'qs';
import { staticFetcher } from '../../lib/hooks';
export default function Page({ data }) {
  console.log(data);
  return <></>;
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
    populate: ['coverImage', 'items', 'category'],
    filters: { slug: { $eq: articleSlug } },
  });

  const { data } = await staticFetcher(
    `${ip}/api/articles?${query}`,
    process.env.API_KEY,
  );

  return { props: { data: data[0] }, revalidate: 3600 };
}
