import Plain from '../components/PlainTemplate';
import { staticFetcher } from '../lib/hooks';

export default function Page({ data }) {
  console.log(data);
  return <Plain {...data}></Plain>;
}

export async function getStaticProps() {
  const { data } = await staticFetcher(
    `${process.env.API_URL}/terms-of-use`,
    process.env.API_KEY,
  );

  return { props: { data } };
}
