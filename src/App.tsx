import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const fgu = require('./fragment-generation-utils');
  
function App() {
  const [fragmentUrl, setFragmentUrl] = useState('');

  const createTextFragment = () => {
    // debugger
    const selection = window.getSelection();
    // eslint-disable-next-line no-undef
    const result = fgu.generateFragment(selection);
    let url = `${location.origin}${location.pathname}${location.search}`;
    if (result.status === 0) {
      const fragment = result.fragment;
      const prefix = fragment.prefix ?
        `${encodeURIComponent(fragment.prefix)}-,` :
        '';
      const suffix = fragment.suffix ?
        `,-${encodeURIComponent(fragment.suffix)}` :
        '';
      const textStart = encodeURIComponent(fragment.textStart);
      const textEnd = fragment.textEnd ?
        `,${encodeURIComponent(fragment.textEnd)}` :
        '';
      url = `${url}#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
      if (selection) {
        setFragmentUrl(url);
        // alert(url);
        // alert(selection);
      }
      return url;
    } else {
      return `Could not create URL ${result.status}`;
    }
  };
  
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      const message = request.message;
      if (message === 'create-text-fragment') {
        return sendResponse(createTextFragment());
      } else if (message === 'ping') {
        return sendResponse('pong');
      } else {
        // foo
      }
    });
    return () => {
      chrome.runtime.onMessage.removeListener(() => {});
    };
  }, []);

  return (
    <>
      { fragmentUrl &&
      <div className="p-8 break-all rounded bg-gradient-to-b from-violet-500 to-fuchsia-500 drop-shadow">
        <p className="text-white">{fragmentUrl}</p>
      </div>
      }
    </>
  );
}

export default App;
  