import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Field, Formik, Form } from 'formik';
import { object, string } from 'yup';

import Link from '../components/Link';
import Layout from '../components/Layout';
import { TextInput } from '../components/Report';

export const ForgetSchema = object({
  identifier: string().email('Email is invalid').required('Email required'),
});

export default function Page() {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || '/';
  const error = router.query.error || '';

  const errorMsgs = {
    CredentialsSignin: `The information you provided is incorrect. Please try again.`,
  };

  const _handleSubmit = async (values, { setSubmitting }) => {
    console.log(25, `${process.env.NEXT_PUBLIC_API_URL}/auth/forget-password`);
    setSubmitting(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      {
        body: JSON.stringify({ email: values.identifier }),
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response);
    setSubmitting(false);
  };

  return (
    <Layout>
      <Head>
        <title>Recyclopedia - Forget Password</title>
      </Head>
      <div className="container container--narrow">
        <h1 className="text-black mt-6 lg:mt-16">Forget Password</h1>
        <h4 className="lg:text-xl font-normal">
          Don't worry, we'll get you back and running
        </h4>
      </div>
      <div className="container container--narrow flex flex-col lg:flex-row mt-6 lg:mt-12 lg:items-stretch">
        <div className="w-full lg:flex-1">
          {error.length > 0 && (
            <p className="bg-coral text-white rounded-md py-3 px-4 mb-4 text-sm">
              {errorMsgs[error]}
            </p>
          )}
          <Formik
            onSubmit={_handleSubmit}
            initialValues={{ identifier: '', password: '' }}
            validationSchema={ForgetSchema}>
            {({ isSubmitting }) => (
              <Form>
                <Field
                  type="email"
                  name="identifier"
                  label="Email"
                  component={TextInput}
                />
                <Link href="/login" passHref>
                  <a className="text-sm text-grey-mid mt-2 no-underline">
                    Want to login instead?
                  </a>
                </Link>
                <div className="">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-submission-btn">
                    {isSubmitting ? (
                      <span className="far fa-spinner-third animate-spin" />
                    ) : (
                      'Reset password'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="container container--narrow my-8">
        <div className="divider-b"></div>
      </div>
      <div className="container container--narrow mt-12 mb-8">
        <h3 className="text-center">
          Don&apos;t have an account yet?
          <br />
          <Link passHref href="/register">
            <a className="text-coral">
              Register now
              <i className="p-2 -rotate-45 far fa-arrow-right"></i>
            </a>
          </Link>
        </h3>
      </div>
    </Layout>
  );
}
