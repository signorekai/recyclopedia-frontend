import React from 'react';
import jsonp from 'jsonp';
import PropTypes from 'prop-types';

class Mailchimp extends React.Component {
  state = {};

  handleSubmit(evt) {
    evt.preventDefault();
    const { fields, action } = this.props;
    const values = fields
      .map((field) => {
        return `${field.name}=${encodeURIComponent(this.state[field.name])}`;
      })
      .join('&');
    const path = `${action}&${values}`;
    const url = path.replace('/post?', '/post-json?');
    const regex = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
    const email = this.state['EMAIL'];
    !regex.test(email)
      ? this.setState({ status: 'empty' })
      : this.sendData(url);
  }

  sendData(url) {
    this.setState({ status: 'sending' });
    jsonp(url, { param: 'c' }, (err, data) => {
      if (data.msg.includes('already subscribed')) {
        this.setState({ status: 'duplicate' });
      } else if (err) {
        this.setState({ status: 'error' });
      } else if (data.result !== 'success') {
        this.setState({ status: 'error' });
      } else {
        this.setState({ status: 'success' });
      }
    });
  }

  render() {
    const { fields, styles, className, buttonClassName } = this.props;
    const messages = {
      ...Mailchimp.defaultProps.messages,
      ...this.props.messages,
    };
    const { status } = this.state;
    return (
      <form onSubmit={this.handleSubmit.bind(this)} className={className}>
        {fields.map((input) => (
          <input
            {...input}
            key={input.name}
            onChange={({ target }) =>
              this.setState({ [input.name]: target.value })
            }
            defaultValue={this.state[input.name]}
          />
        ))}
        <button
          disabled={status === 'sending' || status === 'success'}
          type="submit"
          className={buttonClassName}>
          {messages.button}
        </button>
        <div className="msg-alert">
          {status === 'sending' && (
            <p style={styles.sendingMsg}>{messages.sending}</p>
          )}
          {status === 'success' && (
            <p style={styles.successMsg}>{messages.success}</p>
          )}
          {status === 'duplicate' && (
            <p style={styles.duplicateMsg}>{messages.duplicate}</p>
          )}
          {status === 'empty' && (
            <p style={styles.errorMsg}>{messages.empty}</p>
          )}
          {status === 'error' && (
            <p style={styles.errorMsg}>{messages.error}</p>
          )}
        </div>
      </form>
    );
  }
}

export default function Form() {
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
      key="mailchimp-form"
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
