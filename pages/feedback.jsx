import Head from 'next/head';
import Layout from '../components/Layout';
import { FeedbackForm } from '../components/Report';

export default function Page() {
  return (
    <Layout title="Feedback">
      <div className="container container--narrow h-full pt-4 lg:pt-10">
        <h1 className="text-black">Contact us</h1>
        <h3 className="mb-10">
          Spotted outdated information, or have suggestions for improvements?
          Know a certain item that isn’t yet listed? Or got a tip you’d like to
          share with everyone? Please reach out!
        </h3>
        <FeedbackForm />
      </div>
    </Layout>
  );
}
