import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Page() {
  return (
    <Layout title="404">
      <div className="container">
        <section className="mt-20 mx-auto flex flex-col items-center justify-center">
          <img src="/img/404.svg" alt="" />
          <h2 className="text-black mt-6 mb-0 text-center block">
            Oops! Page not found
          </h2>
          <p className="mt-2 lg:mt-6 mb-10">How&apos;d you get here?</p>
          <Link passHref href="/">
            <a className="text-coral">
              Back to Homepage
              <i className="p-2 far fa-arrow-right"></i>
            </a>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
