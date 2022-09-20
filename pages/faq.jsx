import Head from 'next/head';
import qs from 'querystring';
import { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';

const FAQCard = ({ slug, header, content, openByDefault = false }) => {
  const max = '10000000px';
  const [expanded, setExpanded] = useState(openByDefault);
  const maxHeight = useMotionValue(0);
  const router = useRouter();

  useEffect(() => {
    if (!expanded && openByDefault) {
      setExpanded(!expanded);
    }
  }, [openByDefault]);

  useEffect(() => {
    maxHeight.set(expanded ? max : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const handleClick = () => {
    console.log(router);
    if (location) {
      if (expanded) {
        router.replace(router.pathname, false, { shallow: true });
      } else if (expanded === false && slug.length > 0) {
        router.replace(`${router.pathname}#${slug}`, false, { shallow: true });
      } else if (expanded === false && slug.length === 0) {
        router.replace(router.pathname, false, { shallow: true });
      }
    }
    setExpanded(!expanded);
  };

  return (
    <dl className={`px-4 divider-b after:mt-2 `}>
      <button className="w-full mt-4" onClick={handleClick}>
        <dt className="flex flex-row items-center">
          <h3 className="text-black my-0 flex-1 text-left font-semibold">
            {header}
          </h3>
          {expanded ? (
            <i className="far fa-chevron-up"></i>
          ) : (
            <i className="far fa-chevron-down"></i>
          )}
        </dt>
      </button>
      <motion.dd
        style={{
          maxHeight,
        }}
        className="overflow-hidden transition-all duration-200 opacity-80">
        <div
          className="mt-4 mb-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.dd>
    </dl>
  );
};

export default function Page({ pageOptions }) {
  const { section: sections } = pageOptions;
  const [currentHash, setCurrentHash] = useState();

  useEffect(() => {
    setCurrentHash(location.hash.slice(1));
  }, []);

  return (
    <Layout>
      <Head>
        <title>Recyclopedia - {pageOptions.title}</title>
        <meta name="description" content={pageOptions.subtitle} />
      </Head>
      <div className="container relative z-10 pt-4 lg:pt-10">
        <h1 className="text-black">{pageOptions.title}</h1>
        <p
          className="text-lg leading-tight"
          dangerouslySetInnerHTML={{ __html: pageOptions.subtitle }}
        />
      </div>
      <div className="lg:container">
        {sections.map((section) => (
          <section key={`faq-${section.title}`} className="faq-section">
            <header className="faq-header">
              <h2 className="text-black mb-0 lg:justify-start">
                {section.title}
              </h2>
            </header>
            {section.item.map((item) => (
              <FAQCard
                openByDefault={currentHash === item.slug}
                slug={item.slug === null ? '' : item.slug}
                key={`faq-${section.title}-${item.header}`}
                header={item.header}
                content={item.content}
              />
            ))}
          </section>
        ))}
      </div>
      <div className="container pt-8">
        <p>
          Didn&apos;t find what you were looking for?
          <br />
          Reach out to us at{' '}
          <a href="mailto:hello@recyclopedia.sg">hello@recyclopedia.sg</a>
        </p>
      </div>
    </Layout>
  );
}
export async function getStaticProps() {
  const ip = process.env.API_URL;

  const pageQuery = {
    populate: ['section', 'section.item'],
  };

  const pageResponse = await fetch(`${ip}/faq?${qs.stringify(pageQuery)}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });

  const { data: pageOptions } = await pageResponse.json();
  return { props: { pageOptions } };
}
