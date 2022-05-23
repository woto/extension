import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import Draggable from 'react-draggable';

import {Entity} from './Entity';
import { XIcon as XIconSolid } from '@heroicons/react/solid';
import Form from './Form';
import List from './List';
import SearchInput from './SearchInput'

const fgu = require('./fragment-generation-utils');

const createTextFragment = () => {
  debugger
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
  const [linkUrl, setLinkUrl] = useState('');
  const [searchString, setSearchString] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showWindow, setShowWindow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [entity, setEntity] = useState<Entity>({ entity_id: '', title: '', intro: '', images: [] });
  const [entities, setEntities] = useState<any[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { message } = request;
      if (message === 'create-text-fragment') {
        console.log('got create-text-fragment message');
        const { url, selection } = createTextFragment();
        console.log(url);
        setSearchString(selection!.toString());
        setFragmentUrl(url!);
        setLinkUrl('https://foo.bar');
        setShowWindow(true);
        setShowForm(false);
        setEntities(null);
        setScrollPosition(0);
        setPage(1);
        setEntity({ entity_id: '', title: '', intro: '', images: [] });
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
    setEntity({ entity_id: '', title: searchString, intro: '', images: []});
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
    <>

    { true &&        
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
        setPage(1);
      }}
    >
      <Draggable
        onStart={handleStart}
        onStop={handleStop}
        handle=".dragHandler"
        nodeRef={nodeRef}
        defaultPosition={{x: 10, y: 10}}
        bounds="html"
      >
        <div
          ref={nodeRef}
          className={`shadow rounded-lg select-none w-[320px] ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >

            <div
              className="p-3 border-slate-600 border-t border-r border-l rounded-b-none rounded-lg flex cursor-move dragHandler svg-pattern"
            >
              <span className="grow flex items-center">
                <a href="https://roastme.ru"
                   onMouseDown={stopPropagation}
                   onTouchStart={stopPropagation}
                   target="_blank" className="font-extrabold tracking-wide text-xl text-slate-50">Roastme.ru</a>
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

            <div className={`${isBusy ? 'background-animate' : ''} transition-all bg-gradient-to-r from-blue-500 via-indigo-500 to-yellow-500 h-3`}></div>

            <div className="border border-t-0 border-slate-300 rounded-t-none rounded-lg overflow-hidden flex flex-col h-full">

            <div className="bg-slate-100 min-h-[408px] content-center flex flex-col">
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
                    <>
                      <SearchInput searchString={searchString} setSearchString={setSearchString}></SearchInput>

                      <List
                        isBusy={isBusy}
                        setIsBusy={setIsBusy}
                        entities={entities}
                        page={page}
                        setPage={setPage}
                        setEntities={setEntities}
                        onClick={handleClick}
                        onSelectItem={selectItemHandler}
                        fragmentUrl={fragmentUrl}
                        searchString={searchString}
                        scrollPosition={scrollPosition}
                        setScrollPosition={setScrollPosition}
                      />
                    </>
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
                    isBusy={isBusy}
                    setIsBusy={setIsBusy}
                    setShowWindow={setShowWindow}
                    onClick={handleClick}
                    entity={entity}
                    fragmentUrl={fragmentUrl}
                    linkUrl={linkUrl}
                  />
                  )}
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </Transition>
    }
    </>
  );
}

export default App;
