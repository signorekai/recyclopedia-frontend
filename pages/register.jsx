import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { signIn } from 'next-auth/react';
import Head from 'next/head';

import Link from '../components/Link';
import Layout from '../components/Layout';
import { TextInput } from '../components/Report';
import { RegisterSchema } from './api/register';

export default function Page() {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || '/account';

  const _handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (result.success) {
      setSuccessMsg(
        `You've successfully registered your account. Please check your email for instructions on how to verify your email.`,
      );
      setSubmitting(false);
      resetForm();
    } else {
      setSubmitting(false);
      setErrorMsg(result.data.error);
    }
  };

  return (
    <Layout title="Register an account">
      <div className="container container--narrow">
        <h1 className="text-black mt-6 lg:mt-16">Register an account</h1>
        <h4 className="lg:text-xl font-normal">
          Access your bookmarks with a free account
        </h4>
      </div>
      <div className="container container--sm">
        <div className="w-full lg:flex-1 mt-4 lg:mt-12 h-auto">
          {errorMsg.length > 0 && (
            <p className="bg-coral text-white rounded-md py-3 px-4 mb-4 text-sm">
              {errorMsg}
            </p>
          )}
          {successMsg.length > 0 && (
            <p className="bg-green/10 text-green font-bold rounded-md py-3 px-4 mb-4 text-sm">
              {successMsg}
            </p>
          )}
          <Formik
            onSubmit={_handleSubmit}
            initialValues={{
              email: '',
              password: '',
              name: '',
            }}
            validationSchema={RegisterSchema}>
            {({ isSubmitting }) => (
              <Form>
                <Field
                  type="text"
                  name="name"
                  label="Nickname"
                  component={TextInput}
                />
                <Field
                  type="email"
                  name="email"
                  label="Email Address"
                  component={TextInput}
                />
                <Field
                  type="password"
                  name="password"
                  label="Password"
                  tooltip="Minimum of 8 alphanumeric characters with at least 1 digit"
                  component={TextInput}
                />
                <div className="">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-submission-btn">
                    {isSubmitting ? (
                      <span className="far fa-spinner-third animate-spin" />
                    ) : (
                      'Register'
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
          Already have an account?
          <br />
          <Link passHref href="/login">
            <a className="text-coral">
              Login now
              <i className="p-2 -rotate-45 far fa-arrow-right"></i>
            </a>
          </Link>
        </h3>
      </div>
    </Layout>
  );
}
