import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, useFormikContext } from 'formik';
import { object, string, number } from 'yup';
import FocusTrap from 'focus-trap-react';
import Select from 'react-select';
import { useSession } from 'next-auth/react';
import ReCAPTCHA from 'react-google-recaptcha';

import Link from './Link';

export const FeedbackFormSchema = object({
  name: string().required('Name required'),
  email: string().email('Email is invalid').required('Email required'),
  topic: string()
    .matches(
      /^(Make A Suggestion|General Feedback \/ Enquiry|Report An Error)$/,
      { message: 'Invalid topic' },
    )
    .required('Please choose a topic'),
  record: string(),
  message: string().required('Please type your message'),
  item: number(),
  resource: number(),
  recaptcha: string().required(),
  user: number(),
});

export const TextInput = ({
  field,
  form: { touched, errors },
  label,
  tooltip = '',
  className,
  ...props
}) => {
  return (
    <div className={`field-wrapper ${className}`}>
      <div className="flex flex-col lg:flex-row pb-1">
        {label && <h5 className="text-left flex-1">{label}:</h5>}
        {touched[field.name] && errors[field.name] && (
          <div className="text-sm text-red pb-1">{errors[field.name]}</div>
        )}
      </div>
      <div className="text-input-wrapper text-lg">
        <input tabIndex={0} className="flex-1" {...field} {...props} />
        {touched[field.name] && errors[field.name] && (
          <span className="fas fa-exclamation-triangle text-red" />
          // <div className="error">{errors[field.name]}</div>
        )}
      </div>
      {tooltip.length > 0 && (
        <p className="text-sm text-grey-dark">{tooltip}</p>
      )}
    </div>
  );
};

export const TextArea = ({
  field,
  options,
  form: { touched, errors },
  ...props
}) => (
  <div className="field-wrapper">
    <div className="flex flex-row pb-1">
      <h5 className="text-left flex-1">{props.label}:</h5>
      {touched[field.name] && errors[field.name] && (
        <div className="text-sm text-red pb-1">{errors[field.name]}</div>
      )}
    </div>
    <div className="text-lg relative">
      <textarea
        tabIndex={0}
        {...field}
        {...props}
        className="text-input-wrapper min-h-[3rem]"
        rows={3}>
        {field.value}
      </textarea>
      {touched[field.name] && errors[field.name] && (
        <span className="fas fa-exclamation-triangle text-red absolute top-2 right-4" />
        // <div className="error">{errors[field.name]}</div>
      )}
    </div>
  </div>
);

const CheckAuth = () => {
  const { data: session, status: authStatus } = useSession();
  const { setValues, values } = useFormikContext();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      const newValues = { ...values };
      // console.log(values);
      if (values.hasOwnProperty('name') && values.name.length === 0) {
        newValues.name = session.user.name;
      }
      if (values.hasOwnProperty('email') && values.email.length === 0) {
        newValues.email = session.user.email;
      }

      setValues(newValues);
    }
  }, [session, authStatus]);

  return <></>;
};

/**
 *
 * @param {Object} props
 * @param {"Make A Suggestion"|"General Feedback / Enquiry"|"Report An Error"} props.defaultTopic
 * @returns
 */
export const FeedbackForm = ({
  defaultTopic = '',
  defaultRecord,
  item,
  resource,
  handleModalClick = () => {},
  delay,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const { data, status: authStatus } = useSession();
  const recaptchaRef = useRef();
  let handler;

  const _handleSubmit = async (values, { setSubmitting }) => {
    const formData = values;
    if (data !== null) formData.user = data.user.id;
    if (typeof item === 'number') formData.item = item;
    if (typeof resource === 'number') formData.resource = resource;

    let res = await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({
        token: '',
        formData,
      }),
    });

    if (res.ok && res.status === 200) {
      handler = setTimeout(() => {
        handleModalClick();
      }, delay);
      setSubmitting(false);
      setShowSuccess(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSuccess ? (
          <div className="h-full text-center">
            <i className="far fa-check text-teal text-4xl"></i>
            <h2>Your message has been received!</h2>
            <p>
              Thank you for your time. We’ll contact you regarding further
              details if you requested for a response.
            </p>
            <div className="divider-b-wider my-8"></div>
            <p className="text-center">
              <Link href="/items">
                <a className="!text-coral font-bold">
                  Recycling Guide <i className="far fa-arrow-right"></i>
                </a>
              </Link>
            </p>
          </div>
        ) : (
          <Formik
            initialValues={{
              name: '',
              email: '',
              topic: defaultTopic,
              message: '',
              recaptcha: '',
              record: defaultRecord,
            }}
            onSubmit={_handleSubmit}
            validationSchema={FeedbackFormSchema}>
            {({ isSubmitting, values, setFieldValue }) => (
              <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
                <Form className="test">
                  <CheckAuth />
                  <Field
                    name="topic"
                    options={[
                      {
                        value: 'Make A Suggestion',
                        label: 'Make A Suggestion',
                      },
                      {
                        value: 'General Feedback / Enquiry',
                        label: 'General Feedback / Enquiry',
                      },
                      { value: 'Report An Error', label: 'Report An Error' },
                    ]}
                    component={({
                      field,
                      options,
                      form: { errors, setFieldValue },
                    }) => (
                      <div className="field-wrapper">
                        <div className="flex flex-row pb-1">
                          <h5 className="text-left flex-1">Topic*:</h5>
                          {errors[field.name] && (
                            <div className="text-sm text-red pb-1">
                              {errors[field.name]}
                            </div>
                          )}
                        </div>
                        <div className="text-lg">
                          <Select
                            tabSelectsValue={true}
                            options={options}
                            value={
                              options
                                ? options.find(
                                    (option) => option.value === field.value,
                                  )
                                : ''
                            }
                            onChange={(option) =>
                              setFieldValue(field.name, option.value)
                            }
                            onBlur={field.onBlur}
                          />
                        </div>
                      </div>
                    )}
                  />
                  <Field
                    type="text"
                    name="record"
                    label="Record"
                    tooltip="What item / resource is it regarding?"
                    component={TextInput}
                  />
                  <Field
                    type="text"
                    name="name"
                    label="Name*"
                    component={TextInput}
                  />
                  <Field
                    type="email"
                    name="email"
                    label="Email*"
                    component={TextInput}
                  />
                  <Field
                    name="message"
                    label="Your Message*"
                    component={TextArea}
                  />
                  <span className="text-sm text-grey-mid">
                    * denotes compulsory.
                  </span>
                  <div className="mt-4">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={(code) => {
                        console.log(268, code, setFieldValue);
                        setFieldValue('recaptcha', code);
                      }}
                    />
                  </div>
                  <div className="">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-submission-btn">
                      {isSubmitting ? (
                        <span className="far fa-spinner-third animate-spin" />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </Form>
              </FocusTrap>
            )}
          </Formik>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 *
 * @param {Object} props
 * @param {"Make A Suggestion"|"General Feedback / Enquiry"|"Report An Error"} [props.topic]
 * @param {boolean} [props.openModal=false]
 * @returns
 */
export const FeedbackModal = ({
  openModal = false,
  record = '',
  topic = '',
  item = '',
  resource = '',
  handleClick = () => {},
  delay,
}) => (
  <AnimatePresence>
    {openModal && (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        className="modal-wrapper overflow-hidden items-center !justify-center top-0 left-0 !z-50">
        <div
          className="w-full h-full absolute top-0 left-0"
          onClick={handleClick}
        />
        <div className="mx-4 w-full max-w-xl my-14  bg-white py-7 px-3 rounded-lg relative overflow-hidden">
          <button
            onClick={handleClick}
            className="hover:opacity-80 transition-all duration-200">
            <span className="far fa-times absolute top-4 right-6 text-2xl text-grey" />
          </button>
          <h2 className="text-black inline-block px-4">Feedback</h2>
          <div className="flex-1 lg:max-h-[60vh] overflow-x-hidden overflow-y-auto px-4 pb-4">
            <FeedbackForm
              item={item}
              resource={resource}
              defaultTopic={topic}
              defaultRecord={record}
              delay={delay}
              handleModalClick={handleClick}
            />
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const ReportBtn = ({
  record = '',
  topic = '',
  item = '',
  resource = '',
  delay = 0,
}) => {
  const [openModal, setOpenModal] = useState(false);
  let handler;

  const _handleClick = () => {
    // if (!openModal) {
    setOpenModal(!openModal);
    // } else {
    //   handler = setTimeout(() => {
    //     setOpenModal(!openModal);
    //   }, delay);
    // }
  };

  useEffect(() => {
    return () => {
      clearTimeout(handler);
    };
  }, []);

  return (
    <>
      <div className="w-full text-center mt-10 mb-8">
        <button onClick={_handleClick} className="hover:opacity-80">
          <span className="far fa-exclamation-triangle text-coral-dark text-lg"></span>
          <h6 className="mt-2 text-sm">Report Error / Provide Feedback</h6>
        </button>
      </div>
      <FeedbackModal
        item={item}
        resource={resource}
        openModal={openModal}
        record={record}
        topic={topic}
        delay={delay}
        handleClick={_handleClick}
      />
    </>
  );
};
