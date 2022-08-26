import { Field, Form, Formik } from 'formik';
import { useSession, signOut, signIn } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { object, ref, string } from 'yup';
import AccountHeader from '../../components/AccountHeader';

import Link from '../../components/Link';
import Layout from '../../components/Layout';
import { TextInput } from '../../components/Report';

export default function Page() {
  const { data: session, status: authStatus } = useSession();
  const [passChangeError, setPassChangeError] = useState('');

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      signIn();
    }
  }, []);

  const NameSchema = object({
    name: string()
      .required('Name required')
      .notOneOf([session?.user.name], 'You did not change your name'),
    field: string().required().oneOf(['name']),
  });

  const PasswordSchema = object({
    field: string().required().oneOf(['password']),
    oldPassword: string()
      .required('Password required')
      .min(8, 'Password needs to be at least 8 characters long')
      .matches(/\d/, 'Requires at least 1 digit'),
    newPassword1: string().when('newPassword2', {
      is: (value) => value && value.length > 0,
      then: (schema) =>
        schema
          .required('Password required')
          .min(8, 'Password needs to be at least 8 characters long')
          .matches(/\d/, 'Requires at least 1 digit'),
    }),
    newPassword2: string()
      .required('Please retype your new password')
      .oneOf([ref('newPassword1')], `Your passwords don't match`)
      .notOneOf([ref('oldPassword')], `Same password as your current password`),
  });

  const _handleNameChange = async (values, { setSubmitting }) => {
    const response = await fetch('/api/user', {
      body: JSON.stringify(values),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    setSubmitting(false);
    if (result.success) {
      setPassChangeError('');
      signOut({ callbackUrl: '/login' });
    } else {
      setPassChangeError(result.data.error);
    }
  };

  return (
    <Layout
      mainStyle={{
        display: authStatus === 'authenticated' ? 'block' : 'flex',
      }}>
      <Head>
        <title>Recyclopedia - Your account</title>
      </Head>
      <AccountHeader
        session={session}
        authStatus={authStatus}
        extraLink={
          <Link href="/account/bookmarks">
            <a className="text-white hover:text-white !no-underline hover:opacity-70">
              <i className="far fa-bookmark mr-1" />
              Bookmarks
            </a>
          </Link>
        }
      />
      {authStatus === 'loading' && (
        <section className="w-full flex justify-center items-center">
          <i className="fas fa-spinner text-5xl text-grey animate-spin"></i>
        </section>
      )}
      {authStatus === 'authenticated' && (
        <div className="container container--narrow mt-4 lg:mt-12">
          <h1 className="text-black">Account Settings</h1>
          {session.user.provider === 'local' && (
            <>
              <Formik
                initialValues={{
                  name: session.user.name,
                  field: 'name',
                }}
                onSubmit={_handleNameChange}
                validationSchema={NameSchema}>
                {({ isSubmitting }) => (
                  <Form className="flex flex-col lg:flex-row flex-wrap items-start mt-6 lg:mt-14">
                    <h3 className="lg:w-1/3 mb-8 lg:mb-0">
                      Personal Information
                    </h3>
                    <div className="w-full lg:w-2/3">
                      <Field
                        type="text"
                        name="name"
                        tooltip="You will need to relogin after changing your name"
                        label="name"
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
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="divider-b divider-b-8"></div>

              <Formik
                initialValues={{
                  oldPassword: '',
                  newPassword1: '',
                  newPassword2: '',
                  field: 'password',
                }}
                onSubmit={_handleNameChange}
                validationSchema={PasswordSchema}>
                {({ isSubmitting }) => (
                  <Form className="flex flex-col lg:flex-row flex-wrap items-start mt-6 lg:mt-10">
                    <h3 className="lg:w-1/3 mb-8 lg:mb-0">Update Password</h3>
                    <div className="w-full lg:w-2/3">
                      {passChangeError.length > 0 && (
                        <p className="bg-coral text-white rounded-md py-3 px-4 mb-4 text-sm">
                          {passChangeError}
                        </p>
                      )}
                      <Field
                        type="password"
                        name="oldPassword"
                        label="Current Password"
                        component={TextInput}
                      />
                      <Field
                        type="password"
                        name="newPassword1"
                        tooltip="Minimum of 8 alphanumeric characters with at least 1 digit"
                        label="New Password"
                        component={TextInput}
                      />
                      <Field
                        type="password"
                        name="newPassword2"
                        tooltip="You will need to relogin after changing your password"
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
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </div>
      )}
    </Layout>
  );
}
