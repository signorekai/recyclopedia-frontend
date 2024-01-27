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
  topic: string().required('Please choose a topic'),
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
  className = '',
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
  className = '',
  form: { touched, errors },
  ...props
}) => (
  <div className={`field-wrapper ${className}`}>
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
 * @param {Object[]} [props.topics]
 * @param {string} props.topics[].value
 * @param {string} props.topics[].label
 * @param {string} [props.defaultTopic='']
 * @param {string} [props.defaultRecord='']
 * @returns
 */
export const FeedbackForm = ({
  defaultTopic = '',
  topics = [],
  defaultRecord = '',
  item,
  resource,
  handleModalClick = () => {},
  delay,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [disabledForm, setDisabledForm] = useState(false);
  const [showDisabledFormMsg, setShowDisabledFormMsg] = useState(false);
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
            {({ isSubmitting, values, setFieldValue }) => {
              for (let topic of topics) {
                if (
                  !!topic.label === true &&
                  values.topic.length > 0 &&
                  topic.label === values.topic &&
                  topic.showForm === false
                ) {
                  setShowDisabledFormMsg(topic.errorMsg);
                  setDisabledForm(true);
                  break;
                } else {
                  setShowDisabledFormMsg(false);
                  setDisabledForm(false);
                }
              }

              return (
                <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
                  <Form className="">
                    <CheckAuth />
                    <Field
                      name="topic"
                      options={topics}
                      component={({
                        field,
                        options,
                        form: { errors, setFieldValue },
                      }) => (
                        <div className="field-wrapper">
                          <div className="flex flex-row pb-1">
                            <h5 className="text-left flex-1">Subject*:</h5>
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
                    <div className="relative mt-6">
                      <AnimatePresence>
                        {showDisabledFormMsg && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              marginTop: 30,
                            }}
                            animate={{
                              opacity: 1,
                              marginTop: 0,
                            }}
                            exit={{
                              opacity: 0,
                              marginTop: -30,
                            }}
                            className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 w-3/4 -translate-y-1/2 user-editable"
                            dangerouslySetInnerHTML={{
                              __html: showDisabledFormMsg,
                            }}></motion.div>
                        )}
                      </AnimatePresence>
                      <Field
                        type="text"
                        name="record"
                        label="Record"
                        tooltip="What item / resource is it regarding?"
                        component={TextInput}
                        disabled={disabledForm}
                        className={`${
                          disabledForm ? 'field-wrapper--disabled' : ''
                        }`}
                      />
                      <Field
                        type="text"
                        name="name"
                        label="Name*"
                        component={TextInput}
                        disabled={disabledForm}
                        className={`${
                          disabledForm ? 'field-wrapper--disabled' : ''
                        }`}
                      />
                      <Field
                        type="email"
                        name="email"
                        label="Email*"
                        component={TextInput}
                        disabled={disabledForm}
                        className={`${
                          disabledForm ? 'field-wrapper--disabled' : ''
                        }`}
                      />
                      <Field
                        name="message"
                        label="Your Message*"
                        disabled={disabledForm}
                        component={TextArea}
                        className={`${
                          disabledForm ? 'field-wrapper--disabled' : ''
                        }`}
                      />
                      <span
                        className={`text-sm text-grey-mid ${
                          disabledForm ? 'field-wrapper--disabled' : ''
                        }`}>
                        * denotes compulsory.
                      </span>
                      <div
                        className={`mt-4 ${
                          disabledForm ? 'field-wrapper--disabled' : ''
                        }`}>
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                          onChange={(code) => {
                            setFieldValue('recaptcha', code);
                          }}
                        />
                      </div>
                      <p
                        className={`mt-4 text-blue-dark ${
                          disabledForm ? 'field-wrapper--disabled' : ''
                        }`}>
                        <strong>
                          Please note that we do not provide recycling or
                          collection services. Recyclopedia.sg is a reference
                          website.
                        </strong>
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting || disabledForm}
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
              );
            }}
          </Formik>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 *
 * @param {Object} props
 * @param {string} [props.defaultTopic]
 * @param {boolean} [props.openModal=false]
 * @param {string} [props.record='']
 * @param {string} [props.item='']
 * @param {string} [props.resource='']
 * @param {number} props.delay
 * @param {function} props.handleClick
 * @param {Object[]} [props.topics]
 * @param {string} props.topics[].value
 * @param {string} props.topics[].label
 */
export const FeedbackModal = ({
  openModal = false,
  record = '',
  defaultTopic = '',
  item = '',
  resource = '',
  handleClick = () => {},
  topics = [],
  delay,
}) => (
  <AnimatePresence>
    {openModal && (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        className="modal-wrapper items-center !justify-center top-0 left-0 !z-50">
        <div
          className="w-full h-full absolute top-0 left-0"
          onClick={handleClick}
        />
        <div className="mx-4 w-full max-w-xl max-h-[calc(100vh_-_3.5rem)] bg-white py-7 px-3 rounded-lg relative overflow-y-scroll">
          <button
            onClick={handleClick}
            className="hover:opacity-80 transition-all duration-200">
            <span className="far fa-times fixed top-10 right-10 text-2xl text-grey" />
          </button>
          <h2 className="text-black inline-block px-4">Feedback</h2>
          <div className="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-4">
            <FeedbackForm
              topics={topics}
              item={item}
              resource={resource}
              defaultTopic={defaultTopic}
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

/**
 *@param {Object} props
 * @param {Object[]} [props.topics]
 * @param {string} props.topics[].value
 * @param {string} props.topics[].label
 * @param {string} [props.defaultTopic='']
 * @param {string} [props.record='']
 * @param {string} [props.item='']
 * @param {string} [props.resource='']
 * @param {number} [props.delay=0]
 */
export const ReportBtn = ({
  record = '',
  defaultTopic = 'Report an Error on Recyclopedia.sg',
  item = '',
  resource = '',
  delay = 0,
  topics = [],
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
        topics={topics}
        item={item}
        resource={resource}
        openModal={openModal}
        record={record}
        defaultTopic={defaultTopic}
        delay={delay}
        handleClick={_handleClick}
      />
    </>
  );
};
