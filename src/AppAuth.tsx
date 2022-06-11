import React, { ChangeEventHandler, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { LockClosedIcon } from '@heroicons/react/solid';
import tailwind from './tailwind.css';

import { appUrl } from './Utils';

function AppAuth() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const submitData = () => {
    const data = {
      user: {
        email,
        password,
      },
    };

    fetch(`${appUrl}/auth/login`, {
      credentials: 'omit',
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) { throw new Error((await res.json()).error); }
      return res.json();
    }).then((data) => chrome.storage.sync.set({ api_key: data.api_key })).then(() => {
      chrome.runtime.sendMessage({ message: 'api-token-obtained' }, () => {
        close();
      });
    })
      .catch((reason) => {
        setError(reason.message);
      });
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Вход в roast.me</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Или
            {' '}
            <a href="https://roatme.ru/auth/register" target="_blank" className="font-medium text-indigo-600 hover:text-indigo-500" rel="noreferrer">
              зарегистрируйтесь
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="E-mail адрес"
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          <p>
            {' '}
            { error }
            {' '}
          </p>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={submitData}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <AppAuth />
  </React.StrictMode>,

  document.getElementById('root'),
);

tailwind.use({ target: document.getElementById('root') });
