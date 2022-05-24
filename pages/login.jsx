import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';

export default function Page() {
  const router = useRouter();

  const callbackUrl = router.query.callbackUrl || '/account';

  return (
    <Layout>
      <Head>
        <title>Recyclopedia - Login</title>
      </Head>
      <div className="container container--narrow">
        <h1 className="text-black mt-6 lg:mt-16">Register or Log In</h1>
        <h4 className="lg:text-xl font-normal">
          Access your bookmarks with a free account
        </h4>
      </div>
      <div className="container container--narrow flex flex-col lg:flex-row mt-6 lg:mt-12">
        <div className="w-full flex flex-col lg:flex-1 gap-y-2">
          <button
            onClick={() => signIn('facebook', { callbackUrl })}
            className="bg-[#5A70A8] w-full p-2 rounded-md text-white font-semibold lg:text-left lg:pl-16">
            <i className="fab fa-facebook-f text-xl pr-2"></i> Continue with
            Facebook
          </button>
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="bg-[#CE6143] w-full p-2 rounded-md text-white font-semibold lg:text-left lg:pl-16">
            <i className="fab fa-google text-xl pr-1"></i> Continue with Google
          </button>
        </div>
        <div className="w-full h-16 lg:w-32 lg:h-auto flex flex-row lg:flex-col justify-center items-center">
          <div className="h-[1px] w-full lg:w-[1px] lg:h-full bg-grey-light"></div>
          <p className="p-4 text-sm text-grey-dark">OR</p>
          <div className="h-[1px] w-full lg:w-[1px] lg:h-full bg-grey-light"></div>
        </div>
        <div className="w-full lg:flex-1"></div>
      </div>
      <div className="container container--narrow my-8">
        <div className="divider-b"></div>
      </div>
    </Layout>
  );
}
