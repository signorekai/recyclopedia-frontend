import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Field, Formik, Form } from 'formik';
import { object, string } from 'yup';

import Link from '../components/Link';
import Layout from '../components/Layout';
import { TextInput } from '../components/Report';

export const LoginSchema = object({
  identifier: string().email('Email is invalid').required('Email required'),
  password: string()
    .min(8, 'Password needs to be at least 8 characters long')
    .matches(/\d/, 'Requires at least 1 number')
    .required('Password required'),
});

export default function Page() {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || '/account/bookmarks';
  const error = router.query.error || '';

  const errorMsgs = {
    CredentialsSignin: `The information you provided is incorrect. Please try again.`,
    AlreadyRegisteredViaEmail: `According to our records, you registered directly with this email address. Please login with your email and password below.`,
  };

  const _handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    signIn('credentials', { ...values, callbackUrl });
  };

  return (
    <Layout title="Login">
      <div className="container container--narrow">
        <h1 className="text-black mt-6 lg:mt-16">Register or Log In</h1>
        <h4 className="lg:text-xl font-normal">
          Access your bookmarks with a free account
        </h4>
      </div>
      <div className="container container--narrow flex flex-col lg:flex-row mt-6 lg:mt-12 lg:items-stretch">
        <div className="w-full flex flex-col lg:flex-1 gap-y-2 justify-center ">
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
        <div className="w-full lg:flex-1">
          {error.length > 0 && (
            <p
              className="bg-coral text-white rounded-md py-3 px-4 mb-4 text-sm"
              dangerouslySetInnerHTML={{ __html: errorMsgs[error] }}></p>
          )}
          <Formik
            onSubmit={_handleSubmit}
            initialValues={{ identifier: '', password: '' }}
            validationSchema={LoginSchema}>
            {({ isSubmitting }) => (
              <Form>
                <Field
                  type="email"
                  name="identifier"
                  label="Email"
                  component={TextInput}
                />
                <Field
                  type="password"
                  name="password"
                  label="Password"
                  component={TextInput}
                />
                <Link href="/forget-password" passHref>
                  <a className="text-sm text-grey-mid mt-2 no-underline">
                    Forget your password?
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
                      'Login'
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
