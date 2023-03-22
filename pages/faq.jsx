import Head from 'next/head';
import qs from 'querystring';
import { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';
import { replaceCDNUri } from '../lib/functions';
import OpenGraph, { getOpengraphTags } from '../components/OpenGraph';

const FAQCard = ({ slug, header, content, openByDefault = false, onClick }) => {
  const max = '10000000px';
  const [expanded, setExpanded] = useState(openByDefault);
  const maxHeight = useMotionValue(0);

  useEffect(() => {
    if (!expanded && openByDefault) {
      setExpanded(!expanded);
    }
  }, [openByDefault]);

  useEffect(() => {
    maxHeight.set(expanded ? max : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const handleClick = (e) => {
    e.preventDefault();
    if (expanded) {
      onClick('');
    } else {
      onClick(slug);
    }
    setExpanded(!expanded);
  };

  return (
    <dl className={`px-4 divider-b after:mt-2 `} id={slug}>
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
          dangerouslySetInnerHTML={{ __html: replaceCDNUri(content) }}
        />
      </motion.dd>
    </dl>
  );
};

export default function Page({ pageOptions }) {
  const { section: sections, SEO, title, subtitle } = pageOptions;
  const [currentHash, setCurrentHash] = useState();
  const router = useRouter();

  useEffect(() => {
    setCurrentHash(location.hash.slice(1));
  }, []);

  useEffect(() => {
    window.history.replaceState({}, '', `${router.pathname}#${currentHash}`);
  }, [currentHash]);

  const meta = getOpengraphTags({ title, description: subtitle }, SEO);

  return (
    <Layout title={title}>
      <Head>
        <meta
          name="og:title"
          key="og:title"
          content={`${meta.title} | Recyclopedia.sg`}
        />
        {meta.description && meta.description.length > 0 && (
          <>
            <meta
              key="description"
              name="description"
              content={meta.description}
            />
            <meta
              property="og:description"
              key="og:description"
              content={meta.description}
            />
          </>
        )}
        <meta property="og:image" key="og:image" content={meta.image} />
      </Head>
      <div className="container relative z-10 pt-4 lg:pt-10">
        <h1 className="text-black">{title}</h1>
        <p
          className="text-lg leading-tight"
          dangerouslySetInnerHTML={{ __html: subtitle }}
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
                onClick={setCurrentHash}
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
