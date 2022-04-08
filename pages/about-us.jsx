import Head from 'next/head';
import qs from 'querystring';
import Layout from '../components/Layout';
import { staticFetcher } from '../lib/hooks';

export default function Page({ pageOptions }) {
  console.log(pageOptions);
  return (
    <Layout showHeaderInitially={true} showHeaderOn="UP" hideHeaderOn="DOWN">
      <Head>
        <title>Recyclopedia - {pageOptions.title}</title>
        <meta name="description" content={pageOptions.description} />
      </Head>
    </Layout>
  );
}

export async function getStaticProps() {
  const pageOptions = await staticFetcher(
    `${process.env.API_URL}/api/about-us-page?${qs.stringify({
      populate: ['supporters'],
    })}`,
    process.env.API_KEY,
  );

  return { props: { pageOptions } };
}
