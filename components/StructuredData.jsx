import Head from 'next/head';
import Script from 'next/script';

export default function StructuredData({ data }) {
  return (
    <Script
      strategy="afterInteractive"
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', ...data }),
      }}
    />
  );
}
