import { signOut } from 'next-auth/react';
import { capitalise } from '../lib/functions';

export const AccountHeader = ({ session, authStatus }) => {
  return (
    <>
      {authStatus === 'authenticated' && (
        <section className="bg-teal">
          <div className="container container--lg py-4 lg:py-12 flex flex-col md:flex-row justify-between">
            <h3 className="text-white">
              Hi {session && capitalise(session.user.name)}
            </h3>
            <div className="text-right text-white">
              <button onClick={() => signOut({ callbackUrl: '/' })}>
                <i className="far fa-sign-out" /> Logout
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AccountHeader;
