import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import tailwind from './tailwind.css';

function AuthApp() {
  useEffect(() => {
    chrome.runtime.sendMessage({mesasge: 'obtain-tab-id'}, (response) => {
      debugger
    })
    console.log('aaa');
    console.log(chrome.extension.getBackgroundPage());
    setTimeout(() => {
      const res = chrome.runtime.sendMessage({ a: 'b' });
    }, 1000);
  }, []);

  return (
    <p className="text-red-400 text-lg">
      Hello AuthApp!
    </p>
  );
}

ReactDOM.render(

  <React.StrictMode>
    <AuthApp />
  </React.StrictMode>,

  document.getElementById('root'),
);

tailwind.use({ target: document.getElementById('root') });
