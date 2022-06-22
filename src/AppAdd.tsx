import React, {
  Fragment, useCallback, useEffect, useRef, useState,
} from 'react';
import { Transition } from '@headlessui/react';
import Draggable from 'react-draggable';

import { XIcon } from '@heroicons/react/solid';
import Form from './Form';
import List from './List';
import SearchInput from './controls/SearchInput';
import Toast from './Toast';
import logo from './logo.svg';

import { FragmentHash, Entity, Kind } from '../main';

const createTextFragment = () => {
  const selection = window.getSelection();
  const fragmentHash: FragmentHash = {
    prefix: '',
    suffix: '',
    textStart: selection?.toString() || '',
    textEnd: '',
  };

  let url = `${location.origin}${location.pathname}${location.search}`;

  const prefix = fragmentHash.prefix
    ? `${encodeURIComponent(fragmentHash.prefix)}-,`
    : '';

  const suffix = fragmentHash.suffix
    ? `,-${encodeURIComponent(fragmentHash.suffix)}`
    : '';

  const textStart = encodeURIComponent(fragmentHash.textStart)
    .replace('-', '%2D');

  const textEnd = fragmentHash.textEnd
    ? `,${encodeURIComponent(fragmentHash.textEnd)}`
    : '';

  url = `${url}#:~:text=${prefix}${textStart}${textEnd}${suffix}`;

  return { selection: selection!, url: url!, fragmentHash: fragmentHash! };
};

function AppAdd() {
  const nodeRef = React.useRef(null);
  const [fragmentUrl, setFragmentUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [fragmentHash, setFragmentHash] = useState<FragmentHash>();
  const [searchString, setSearchString] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showWindow, setShowWindow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isBusy, _setIsBusy] = useState(false);
  const [entity, setEntity] = useState<Entity>({
    entity_id: '', title: '', intro: '', images: [],
  });
  const setIsBusy = useCallback((num) => _setIsBusy(num), []);
  const [entities, setEntities] = useState<Entity[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [kindsOptions, setKindsOptions] = useState<Kind[]>([]);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const fn = async () => {
      const data = await chrome.storage.sync.get('api_key');
      setApiKey(data.api_key);
    };

    fn();
  }, []);

  function usePrevious(value: string) {
    const ref = useRef<string>(window.location.toString());

    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  let previousLocation = usePrevious(window.location.toString());

  useEffect(() => {
    const interval = setInterval(() => {
      if (previousLocation != window.location.toString()) {
        // console.log('location changed');
        // console.log(previousLocation);
        // console.log(window.location.toString());
        previousLocation = window.location.toString();
        setShowWindow(false);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { message, feature } = request;
      if (message === 'create-fragment') {
        const { url, selection, fragmentHash } = createTextFragment();
        // console.log(url);
        // console.log(selection!.toString());
        setSearchString(selection!.toString());
        setFragmentUrl(url!);
        setFragmentHash(fragmentHash!);
        setLinkUrl(request.linkUrl);
        setShowWindow(true);
        setShowForm(false);
        setEntities(null);
        setScrollPosition(0);
        setPage(1);
        setEntity({
          entity_id: '', title: '', intro: '', images: [],
        });
        return sendResponse();
      } if (feature === 'add' && message === 'ping') {
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
    setEntity({
      entity_id: '', title: searchString, intro: '', images: [],
    });
  };

  // const handleClick = useCallback((event) => _handleClick(event), [])

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleStop = () => {
    setIsDragging(false);
  };

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const selectItemHandler = (entity: Entity) => {
    setShowForm(true);
    setEntity(entity);
  };

  return (
    <>
      { false
        && <Toast />}

      {true
        && (
          <Transition
            show={showWindow}
            appear
            enter="transition ease-in-out"
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
              defaultPosition={{ x: 5, y: 5 }}
              bounds="html"
            >
              <div
                ref={nodeRef}
                className={`shadow-sm selection:bg-purple-800 selection:text-white select-none min-h-[600px] bg-slate-100 rounded-lg w-[320px] ${isDragging ? 'blur-[1px] opacity-50' : 'opacity-100'}`}
              >

                <div
                  className="py-2 px-3 border-slate-600 border-t border-r border-l rounded-b-none rounded-lg flex cursor-move
                  dragHandler bg-gradient-to-b to-stone-800 from-zinc-700"
                >
                  <span className="grow flex items-center">
                    <div className="w-9 h-9 mr-2 inline-block" dangerouslySetInnerHTML={{ __html: logo }} />
                    <a
                      href="https://roastme.ru"
                      onMouseDown={stopPropagation}
                      onTouchStart={stopPropagation}
                      target="_blank"
                      className="select-none drag-none font-extrabold tracking-wide text-xl text-slate-50"
                      rel="noreferrer"
                    >
                      <img className="drag-none h-6" src={chrome.runtime.getURL('logo.png')} />
                    </a>
                  </span>

                  <div className="self-center">
                    <button
                      onClick={() => setShowWindow(false)}
                      onMouseDown={stopPropagation}
                      onTouchStart={stopPropagation}
                      type="button"
                      className="inline-flex items-center p-1 border border-transparent rounded-full
                                              shadow-sm text-white bg-stone-900 hover:bg-stone-800 focus:outline-none
                                              focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 focus:ring-offset-stone-500"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className={`${isBusy ? 'background-animate from-indigo-500 via-lime-400 to-indigo-500 bg-gradient-to-r bg-orange-400' : 'from-lime-400 to-indigo-500 bg-gradient-to-r bg-orange-400'} transition-all h-1`} />
                {/* <div className={`${isBusy ? 'background-animate from-indigo-500 via-lime-400 to-indigo-500 bg-gradient-to-r bg-orange-400' : 'bg-slate-400'} transition-all h-2`} /> */}

                {/* <div className="border border-t-0 border-slate-300 rounded-t-none rounded-lg overflow-hidden flex flex-col h-full"> */}
                <div className="flex flex-col h-full">

                  <div className="content-center flex flex-col">
                    <Transition
                      show={!showForm}
                      enter="transition"
                      enterFrom="opacity-0 -translate-x-1"
                      enterTo="opacity-100  translate-x-0"
                      leave="transition"
                      leaveFrom="opacity-100 translate-x-0"
                      leaveTo="opacity-0 -translate-x-1"
                    >
                      {!showForm && (
                        <div className="svg-pattern border border-t-0 border-slate-300 rounded-t-none rounded-lg">
                          <SearchInput
                            searchString={searchString}
                            setSearchString={setSearchString}
                            setPage={setPage}
                            setEntities={setEntities}
                            setScrollPosition={setScrollPosition}
                          />

                          <List
                            apiKey={apiKey}
                            isBusy={isBusy}
                            setIsBusy={setIsBusy}
                            entities={entities}
                            page={page}
                            setPage={setPage}
                            setEntities={setEntities}
                            onClick={handleClick}
                            onSelectItem={selectItemHandler}
                            fragmentUrl={fragmentUrl}
                            linkUrl={linkUrl}
                            searchString={searchString}
                            scrollPosition={scrollPosition}
                            setScrollPosition={setScrollPosition}
                          />
                        </div>
                      )}
                    </Transition>

                    <Transition
                      show={showForm}
                      enter="transition"
                      enterFrom="opacity-0 translate-x-1"
                      enterTo="opacity-100 translate-x-0"
                      leave="transition"
                      leaveFrom="opacity-100 translate-x-0"
                      leaveTo="opacity-0 translate-x-1"
                    >
                      {showForm && (
                        <Form
                          apiKey={apiKey}
                          kindsOptions={kindsOptions}
                          setKindsOptions={setKindsOptions}
                          isBusy={isBusy}
                          setIsBusy={setIsBusy}
                          setShowWindow={setShowWindow}
                          onClick={handleClick}
                          entity={entity}
                          fragmentUrl={fragmentUrl}
                          fragmentHash={fragmentHash!}
                          linkUrl={linkUrl}
                        />
                      )}
                    </Transition>
                  </div>
                </div>
              </div>
            </Draggable>
          </Transition>
        )}
    </>
  );
}

export default AppAdd;
