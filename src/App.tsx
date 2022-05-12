import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import Draggable from 'react-draggable';

import { XIcon as XIconSolid } from '@heroicons/react/solid';
import Form from './Form';
import List from './List';

const fgu = require('./fragment-generation-utils');

const createTextFragment = () => {
  const selection = window.getSelection();
  // eslint-disable-next-line no-undef
  const result = fgu.generateFragment(selection);
  let url = `${location.origin}${location.pathname}${location.search}`;
  if (result.status === 0) {
    const { fragment } = result;
    const prefix = fragment.prefix
      ? `${encodeURIComponent(fragment.prefix)}-,`
      : '';
    const suffix = fragment.suffix
      ? `,-${encodeURIComponent(fragment.suffix)}`
      : '';
    const textStart = encodeURIComponent(fragment.textStart);
    const textEnd = fragment.textEnd
      ? `,${encodeURIComponent(fragment.textEnd)}`
      : '';
    url = `${url}#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
  } else {
    alert(`Could not create URL ${result.status}`);
  }

  return { selection: selection!, url: url! };
};

function App() {
  const nodeRef = React.useRef(null);
  const [fragmentUrl, setFragmentUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showWindow, setShowWindow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [entity, setEntity] = useState({ title: '', description: '' });
  const [entities, setEntities] = useState<any[] | null>(null);
  const [page, setPage] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { message } = request;
      if (message === 'create-text-fragment') {
        console.log('got create-text-fragment message');
        const { url, selection } = createTextFragment();
        setSelectedText(selection!.toString());
        setFragmentUrl(url!);
        setShowWindow(true);
        setShowForm(false);
        setEntities(null);
        setScrollPosition(0);
        setPage(0);
        setEntity({ title: '', description: '' });
        return sendResponse();
      } if (message === 'ping') {
        return sendResponse('pong');
      }
      // foo
    });
    return () => {
      chrome.runtime.onMessage.removeListener(() => {
      });
    };
  }, []);

  const handleClick = (event: any) => {
    event.preventDefault();
    setShowForm(!showForm);
    setEntity({ title: '', description: '' });
  };

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleStop = () => {
    setIsDragging(false);
  };

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const selectItemHandler = (entity: any) => {
    setShowForm(true);
    setEntity(entity);
  };

  return (
    <Transition
      show={showWindow}
      appear
      enter="transition ease-in-out duration-500"
      enterFrom="opacity-0 translate-y-3"
      enterTo="opacity-100 translate-y-0"
      leave="transition"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={() => {
        setEntities(null);
        setScrollPosition(0);
        setPage(0);
      }}
    >
      <Draggable
        onStart={handleStart}
        onStop={handleStop}
        handle=".dragHandler"
        nodeRef={nodeRef}
      >
        <div
          ref={nodeRef}
          className={`select-none w-[320px] drop-shadow rounded-lg border bg-gradient-to-r bg-slate-100 border-slate-300 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >

          <div className="flex flex-col h-full">

            <div
              className="p-3 flex rounded-t-lg border-b border-slate-300 cursor-move dragHandler bg-white"
            >
              <span className="grow flex items-center">
                {selectedText}
              </span>

              <div className="flex-none">
                <button
                  onClick={() => setShowWindow(false)}
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}
                  type="button"
                  className="inline-flex items-center p-1 border border-transparent rounded-full
                                               shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none
                                               focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <XIconSolid className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-[408px] content-center flex flex-col">
              <div className="grow">
                <Transition
                  show={!showForm}
                  enter="transition duration-300"
                  enterFrom="opacity-0 -translate-x-1"
                  enterTo="opacity-100  translate-x-0"
                  leave="transition duration-300"
                  leaveFrom="opacity-100 translate-x-0"
                  leaveTo="opacity-0 -translate-x-1"
                >
                  {!showForm && (
                  <List
                    entities={entities}
                    page={page}
                    setPage={setPage}
                    setEntities={setEntities}
                    onClick={handleClick}
                    onSelectItem={selectItemHandler}
                    fragmentUrl={fragmentUrl}
                    scrollPosition={scrollPosition}
                    setScrollPosition={setScrollPosition}
                  />
                  )}
                </Transition>

                <Transition
                  show={showForm}
                  enter="transition duration-300"
                  enterFrom="opacity-0 translate-x-1"
                  enterTo="opacity-100 translate-x-0"
                  leave="transition duration-300"
                  leaveFrom="opacity-100 translate-x-0"
                  leaveTo="opacity-0 translate-x-1"
                >
                  {showForm && (
                  <Form
                    onClick={handleClick}
                    entity={entity}
                    fragmentUrl={fragmentUrl}
                  />
                  )}
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </Transition>
  );
}

export default App;
