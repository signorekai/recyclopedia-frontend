import Plain from '../components/PlainTemplate';
import { staticFetcher } from '../lib/hooks';

export default function Page({ data }) {
  return <Plain {...data}></Plain>;
}

export async function getStaticProps() {
  const { data } = await staticFetcher(
    `${process.env.API_URL}/privacy-policy`,
    process.env.API_KEY,
    {
      populate: ['SEO', 'SEO.image'],
    },
  );

  return { props: { data } };
}
