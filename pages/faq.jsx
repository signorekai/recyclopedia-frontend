import Layout from '../components/Layout';
import Head from 'next/head';
import qs from 'querystring';

export default function Page({ pageOptions }) {
  console.log(JSON.stringify({ ...pageOptions }, null, ' '));

  return (
    <Layout showHeaderInitially={true} showHeaderOn="UP" hideHeaderOn="DOWN">
      <Head>
        <title>Recyclopedia - {pageOptions.title}</title>
        <meta name="description" content={pageOptions.subtitle} />
      </Head>
      <div className="container relative z-10 pt-4 lg:pt-10">
        <h1 className="text-black">{pageOptions.title}</h1>
        <p className="text-lg leading-tight">{pageOptions.subtitle}</p>
      </div>
    </Layout>
  );
}
export async function getStaticProps() {
  const ip = process.env.API_URL;

  const pageQuery = {
    populate: ['section', 'section.item'],
  };

  const pageResponse = await fetch(`${ip}/api/faq?${qs.stringify(pageQuery)}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });

  const { data: pageOptions } = await pageResponse.json();
  return { props: { pageOptions } };
}
