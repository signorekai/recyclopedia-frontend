import { useEffect, useState } from 'react';
import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Field, Formik, Form } from 'formik';
import { object, string } from 'yup';

import Link from '../components/Link';
import Layout from '../components/Layout';
import { TextInput } from '../components/Report';
import { ResetPasswordSchema } from './api/user/password/reset';

export const ForgetSchema = object({
  identifier: string().email('Email is invalid').required('Email required'),
});

export default function Page() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [passChangeError, setPassChangeError] = useState('');

  const callbackUrl = router.query.callbackUrl || '/';
  const error = router.query.error || '';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const code = urlParams.get('code');
    if (code) {
      setCode(urlParams.get('code'));
    }
  }, []);

  const errorMsgs = {
    CredentialsSignin: `The information you provided is incorrect. Please try again.`,
  };

  const _handlePasswordChange = async (values, { setSubmitting }) => {
    console.log(38, values);
    setSubmitting(true);
    const response = await fetch('/api/user/password/reset', {
      body: JSON.stringify({
        code: values.code,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    console.log(51, result);
    setSubmitting(false);
    if (result.success) {
      router.push('/login');
    } else {
    }
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
    setSubmitting(false);
  };

  return (
    <Layout title="Forget Password">
      <div className="container container--narrow">
        <h1 className="text-black mt-6 lg:mt-16">Forget Password</h1>
        <h4 className="lg:text-xl font-normal">
          Don&apos;t worry, we&apos;ll get you back and running
        </h4>
      </div>
      <div className="container container--narrow flex flex-col lg:flex-row mt-6 lg:mt-12 lg:items-stretch">
        {code.length > 0 && (
          <Formik
            initialValues={{
              code,
              password: '',
              passwordConfirmation: '',
            }}
            onSubmit={_handlePasswordChange}
            validationSchema={ResetPasswordSchema}>
            {({ isSubmitting }) => (
              <Form className="">
                {passChangeError.length > 0 && (
                  <p className="bg-coral text-white rounded-md py-3 px-4 mb-4 text-sm">
                    {passChangeError}
                  </p>
                )}
                <Field
                  type="password"
                  name="password"
                  tooltip="Minimum of 8 alphanumeric characters with at least 1 digit"
                  label="New Password"
                  component={TextInput}
                />
                <Field
                  type="password"
                  name="passwordConfirmation"
                  label="Retype New Password"
                  component={TextInput}
                />
                <div className="w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-submission-btn">
                    {isSubmitting ? (
                      <span className="far fa-spinner-third animate-spin" />
                    ) : (
                      'Update'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
        {code.length === 0 && (
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
        )}
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
