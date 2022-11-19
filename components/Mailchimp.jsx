import Mailchimp from 'react-mailchimp-form';

export default function Email({ messages }) {
  const msg = {
    sending: 'Sending...',
    success: 'Thank you for subscribing!',
    error: 'An unexpected internal error has occurred.',
    empty: 'You need to include an email.',
    duplicate: 'Too many subscribe attempts for this email address',
    button: 'Sign up!',
    ...messages,
  };

  return (
    <Mailchimp
      className="subscribe-form"
      action="https://recyclopedia.us21.list-manage.com/subscribe/post?u=4608db3496efcb6a32540ecc5&amp;id=d6722cdcc6&amp;f_id=0016c4e1f0"
      messages={msg}
      fields={[
        {
          name: 'EMAIL',
          placeholder: 'Email',
          type: 'email',
          required: true,
        },
      ]}
    />
  );
}
