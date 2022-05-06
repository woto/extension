import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Transition } from '@headlessui/react'

import Form from './Form';
import List from './List';

import { XIcon as XIconSolid, PlusSmIcon as PlusSmIconSolid } from '@heroicons/react/solid'
import { PlusSmIcon as PlusSmIconOutline } from '@heroicons/react/outline'

const fgu = require('./fragment-generation-utils');

  
function App() {
  const [fragmentUrl, setFragmentUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showWindow, setShowWindow] = useState(false);

  // const [selectedText, setSelectedText] = useState('');

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
      // if (selection) {
      //   setSelectedText(selection.toString());
      // }
      // debugger
      setSelectedText(selection!.toString());
      setFragmentUrl(url);
      return url;
    } else {
      return `Could not create URL ${result.status}`;
    }
  };
  
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      const message = request.message;
      if (message === 'create-text-fragment') {
        setShowWindow(true);
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

  const handleClick = (event: any) => {
    event.preventDefault();
    setShowForm(!showForm);
  }

  return (
    <Transition
      show={showWindow}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="drop-shadow rounded-lg border bg-gradient-to-r bg-slate-100 border-slate-300">

        <div className="p-3 flex rounded-t-lg border-b border-slate-300 bg-white ">
          <span className="grow flex items-center">
            {selectedText}
          </span>
          <div className="flex-none">
            <button
              onClick={() => setShowWindow(false)}
              type="button"
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <XIconSolid className="h-4 w-4" />
            </button>
          </div>
        </div>

        { showForm && <Form fragmentUrl={fragmentUrl}></Form> }

        { !showForm && <List fragmentUrl={fragmentUrl}></List> }

        <div className="p-3 rounded-b-lg bg-slate-100">
          <div className="text-center">
            { showForm 
              ?
                <a href="#" onClick={handleClick} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Выбрать имеющийся
                </a>
              :
              <a href="#" onClick={handleClick} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Добавить новый объект
              </a>
            }
          </div>
        </div>
      </div>
    </Transition>
  );
}

export default App;
  