import { Field, Form, Formik } from 'formik';
import { useSession, signOut, signIn } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { object, ref, string } from 'yup';
import AccountHeader from '../../components/AccountHeader';
import { PasswordSchema } from '../api/user/password';

import Link from '../../components/Link';
import Layout from '../../components/Layout';
import { TextInput } from '../../components/Report';

export default function Page() {
  const { data: session, status: authStatus } = useSession();
  const [passChangeError, setPassChangeError] = useState('');
  const [nameChangeError, setNameChangeError] = useState('');
  const [emailChangeError, setEmailChangeError] = useState('');

  const NameSchema = object({
    name: string()
      .required('Name required')
      .notOneOf([session?.user.name], 'You did not change your name'),
    field: string().required().oneOf(['name']),
  });

  const EmailSchema = object({
    email: string().email().required(),
    field: string().required().oneOf(['email']),
  });

  const DeleteAccountSchema = object({
    name: string()
      .required('Name required')
      .oneOf([session?.user.name], 'Please key in your name'),
    field: string().required().oneOf(['name']),
  });

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      signIn();
    }
  }, []);

  const _handlePasswordChange = async (values, { setSubmitting }) => {
    const response = await fetch('/api/user/password', {
      body: JSON.stringify({
        currentPassword: values.currentPassword,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.jwt}`,
      },
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

  const _handleNameChange = async (values, { setSubmitting }) => {
    const response = await fetch('/api/user', {
      body: JSON.stringify(values),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    setSubmitting(false);
    if (result.success) {
      setNameChangeError('');
      signOut({ callbackUrl: '/login' });
    } else {
      setNameChangeError(result.data.error);
    }
  };

  const _handleDeleteAccount = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const response = await fetch('/api/user', {
      body: JSON.stringify(values),
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (result.success) {
      signOut({ callbackUrl: '/' });
    }
    setSubmitting(false);
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
                  <h3 className="lg:w-1/3 mb-8 lg:mb-0">Nickname</h3>
                  <div className="w-full lg:w-2/3">
                    {nameChangeError.length > 0 && (
                      <p className="bg-coral text-white rounded-md py-3 px-4 mb-4 text-sm">
                        {nameChangeError}
                      </p>
                    )}
                    <Field
                      type="text"
                      name="name"
                      tooltip="You will need to relogin after changing your nickname"
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
          </>
          {session.user.provider === 'local' && (
            <>
              <Formik
                initialValues={{
                  email: session.user.email,
                  field: 'email',
                }}
                onSubmit={_handleNameChange}
                validationSchema={EmailSchema}>
                {({ isSubmitting }) => (
                  <Form className="flex flex-col lg:flex-row flex-wrap items-start mt-6 lg:mt-14">
                    <h3 className="lg:w-1/3 mb-8 lg:mb-0">Email</h3>
                    <div className="w-full lg:w-2/3">
                      {emailChangeError.length > 0 && (
                        <p className="bg-coral text-white rounded-md py-3 px-4 mb-4 text-sm">
                          {emailChangeError}
                        </p>
                      )}
                      <Field
                        type="email"
                        name="email"
                        tooltip="You will need to re-verify your email after changing it."
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
            </>
          )}

          {session.user.provider === 'local' && (
            <>
              <Formik
                initialValues={{
                  currentPassword: '',
                  password: '',
                  passwordConfirmation: '',
                  field: 'password',
                }}
                onSubmit={_handlePasswordChange}
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
                        name="currentPassword"
                        label="Current Password"
                        component={TextInput}
                      />
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

              <div className="divider-b divider-b-8"></div>
            </>
          )}

          <div className="flex flex-col lg:flex-row flex-wrap items-start mt-6 lg:mt-10">
            <h3 className="lg:w-1/3 mb-8 lg:mb-0">Delete Account</h3>
            <div className="w-full lg:w-2/3">
              All your bookmarks will be lost. <br />
              Are you sure you want to delete your account?
              <Formik
                initialValues={{
                  name: '',
                  field: 'name',
                }}
                onSubmit={_handleDeleteAccount}
                validationSchema={DeleteAccountSchema}>
                {({ isSubmitting }) => (
                  <Form className="">
                    <Field
                      type="text"
                      name="name"
                      tooltip={`To confirm, please type your nickname - ${session.user.name}`}
                      label=""
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
                          'Yes, delete my account'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
