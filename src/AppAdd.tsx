// react-chrome-extension
// react-chrome-extension-boilerplate
// text-fragment-polyfill
// generator-chrome-extension

// https://github.com/crimx/ext-saladict
// https://github.com/chibat/chrome-extension-typescript-starter/blob/master/src/__tests__/sum.ts
// https://github.com/satendra02/react-chrome-extension/blob/master/src/App.test.js

import React, {
  useCallback, useEffect, useReducer, useState,
} from 'react';
import { Transition } from '@headlessui/react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

import { ChevronUpIcon, XIcon } from '@heroicons/react/solid';
import { CogIcon } from '@heroicons/react/outline';
import { useDebounce } from 'react-use';
import Form from './Form';
import List from './List';
import SearchInput from './controls/SearchInput';
import logo from './logo.svg';
import { appUrl } from './Utils';

import type {
  FragmentHash, Entity, Relevance, Sentiment,
} from '../main';
import {
  EntityActionType,
  GlobalContext,
  newEntity,
  stopPropagation,
} from './Utils';
import { useToasts } from './ToastManager';
import { entityReducer, initEntity } from './entityReducer';

const createTextFragment = () => {
  const selection = window.getSelection();
  const fragmentHash: FragmentHash = {
    prefix: '',
    suffix: '',
    textStart: selection?.toString() || '',
    textEnd: '',
  };

  const prefix = fragmentHash.prefix
    ? `${encodeURIComponent(fragmentHash.prefix)}-,`
    : '';

  const suffix = fragmentHash.suffix
    ? `,-${encodeURIComponent(fragmentHash.suffix)}`
    : '';

  const textStart = encodeURIComponent(fragmentHash.textStart).replace(
    '-',
    '%2D',
  );

  const textEnd = fragmentHash.textEnd
    ? `,${encodeURIComponent(fragmentHash.textEnd)}`
    : '';

  const hash = location.hash ? `${location.hash}:~:text=` : '#:~:text=';

  const hashValue = `${prefix}${textStart}${textEnd}${suffix}`;

  const url = new URL(window.location.href);

  if (hashValue) url.hash = `${hash}${hashValue}`;

  return {
    selection: selection!,
    url: url.toString(),
    fragmentHash: fragmentHash!,
  };
};

function AppAdd() {
  const [entity, dispatch] = useReducer(
    entityReducer,
    newEntity(''),
    initEntity,
  );

  const nodeRef = React.useRef(null);
  const [fragmentUrl, setFragmentUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [fragmentHash, setFragmentHash] = useState<FragmentHash>();
  const [searchString, setSearchString] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isBusy, _setIsBusy] = useState(false);
  const setIsBusy = useCallback((num) => _setIsBusy(num), []);
  const [entities, setEntities] = useState<Entity[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showDebug, setShowDebug] = useState(false);
  const [positionX, setPositionX] = useState(5);
  const [positionY, setPositionY] = useState(5);

  const [relevance, setRelevance] = useState<Relevance | null | undefined>();
  const [sentiment, setSentiment] = useState<Sentiment | null | undefined>();
  const [mentionDate, setMentionDate] = useState<Date | null | undefined>();

  const [operation, setOperation] = useState<'add' | 'edit'>('add');
  const { add } = useToasts();

  const [showWindow, setShowWindow] = useState(false);
  const [collapseWindow, setCollapseWindow] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [pageLanguage, setPageLanguage] = useState<string | undefined>();

  useEffect(() => {
    const fn = async () => {
      const data = await chrome.storage.sync.get('apiKey');
      setApiKey(data.apiKey);
    };

    fn();
  }, []);

  useEffect(() => {
    const subscription = function (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: 'sync' | 'local' | 'managed' | 'session',
    ) {
      if (changes?.apiKey?.newValue) {
        setApiKey(changes.apiKey.newValue);
        setShowWindow(true);
      }

      // for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      //   // console.log(
      //     `Storage key "${key}" in namespace "${areaName}" changed.`,
      //     `Old value was "${JSON.stringify(oldValue)}", new value is "${JSON.stringify(newValue)}".`
      //   );
      // }
    };

    chrome.storage.onChanged.addListener(subscription);

    return () => {
      chrome.storage.onChanged.removeListener(subscription);
    };
  });

  const setPreserveWidget = async () => {
    // // console.log('sendMessage', 'preserve-widget');

    chrome.runtime.sendMessage({
      message: 'preserve-widget',
      fragmentUrl,
      linkUrl,
      imageSrc,
      fragmentHash,
      searchString,
      showForm,
      showWindow,
      collapseWindow,
      entity,
      mentionDate,
      relevance,
      sentiment,
      entities,
      page,
      scrollPosition,
      showDebug,
      positionX,
      positionY,
      operation,
      pageLanguage,
    });
  };

  useEffect(() => {
    setPreserveWidget();
  }, [
    fragmentUrl,
    linkUrl,
    imageSrc,
    fragmentHash,
    searchString,
    showForm,
    showWindow,
    collapseWindow,
    entity,
    entities,
    page,
    scrollPosition,
    showDebug,
    positionX,
    positionY,
    mentionDate,
    relevance,
    sentiment,
    operation,
    pageLanguage,
  ]);

  useEffect(() => {
    const subscription = (
      request: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void,
    ) => {
      // console.log('received message');
      const { message, feature } = request;

      if (message === 'edit-entity') {
        dispatch({
          type: EntityActionType.INIT,
          payload: newEntity('', request.entityId),
        });

        // setPositionX(request.positionX);
        // setPositionY(request.positionY);
        // setSearchString(request.searchString);
        setCollapseWindow(false);
        setDelayCollapseWindow(false);
        // setFragmentUrl(request.fragmentUrl);
        // setFragmentHash(request.fragmentHash);
        // setLinkUrl(request.linkUrl);
        // setImageSrc(request.imageSrc);
        setShowWindow(true);
        // setEntities(request.entities);
        // setScrollPosition(request.scrollPosition);
        // setPage(request.page);
        // setShowDebug(request.showDebug);
        setShowForm(true);

        // setFragmentUrl(url!);
        // setFragmentHash(fHash!);
        // setLinkUrl(request.linkUrl);
        // setImageSrc(request.imageSrc);
        // setShowForm(false);
        // setShowWindow(true);
        // setEntities(null);
        // setScrollPosition(0);
        // setPage(1);
        // setCollapseWindow(false);
        // dispatch({ type: EntityActionType.INIT, payload: newEntity('') });

        setOperation('edit');
        setPageLanguage(request.pageLanguage);

        return sendResponse();
      }
    };

    chrome.runtime.onMessage.addListener(subscription);

    return () => {
      chrome.runtime.onMessage.removeListener(subscription);
    };
  }, []);

  useEffect(() => {
    const subscription = (
      request: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void,
    ) => {
      const { message, feature } = request;

      if (message === 'restore-widget') {
        if (showWindow) return sendResponse();

        setPositionX(request.positionX);
        setPositionY(request.positionY);
        setOperation(request.operation);
        setSearchString(request.searchString);
        setCollapseWindow(request.collapseWindow);
        setFragmentUrl(request.fragmentUrl);
        setFragmentHash(request.fragmentHash);
        setLinkUrl(request.linkUrl);
        setImageSrc(request.imageSrc);
        setShowWindow(request.showWindow);
        setEntities(request.entities);
        setScrollPosition(request.scrollPosition);
        setPage(request.page);
        dispatch({ type: EntityActionType.INIT, payload: request.entity });
        setMentionDate(request.mentionDate);
        setRelevance(request.relevance);
        setSentiment(request.sentiment);
        setShowDebug(request.showDebug);
        setShowForm(request.showForm);
        setPageLanguage(request.pageLanguage);

        return sendResponse();
      }
    };

    chrome.runtime.onMessage.addListener(subscription);

    return () => {
      chrome.runtime.onMessage.removeListener(subscription);
    };
  }, []);

  useEffect(() => {
    const subscription = (
      request: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void,
    ) => {
      const { message, feature } = request;

      if (message === 'create-fragment') {
        const { url, selection, fragmentHash: fHash } = createTextFragment();
        setSearchString(selection!.toString() || document.title);
        selection.removeAllRanges();

        setFragmentUrl(url!);
        setFragmentHash(fHash!);
        setLinkUrl(request.linkUrl);
        setImageSrc(request.imageSrc);
        setShowForm(false);
        setShowWindow(true);
        setEntities(null);
        setScrollPosition(0);
        setPage(1);
        setCollapseWindow(false);
        setDelayCollapseWindow(false);
        dispatch({ type: EntityActionType.INIT, payload: newEntity('') });
        setMentionDate(null);
        setRelevance(null);
        setSentiment(null);
        setPageLanguage(request.pageLanguage);

        return sendResponse();
      }
    };

    chrome.runtime.onMessage.addListener(subscription);

    return () => {
      chrome.runtime.onMessage.removeListener(subscription);
    };
  }, []);

  const handleBackButtonClick = useCallback((event: any) => {
    event.preventDefault();
    setShowForm(false);
  }, []);

  const handleNewEntityClick = (event: any) => {
    event.preventDefault();
    setShowForm(true);
    dispatch({ type: EntityActionType.INIT, payload: newEntity(searchString) });
  };

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(false);
    setPositionX(data.x);
    setPositionY(data.y);
  };

  const selectItemHandler = (entity: Entity) => {
    setShowForm(true);
    dispatch({ type: EntityActionType.INIT, payload: entity });
  };

  const [delayCollapseWindow, setDelayCollapseWindow] = useState(false);

  const [, cancelDelayCollapseWindow] = useDebounce(
    () => {
      if (delayCollapseWindow && !collapseWindow) setCollapseWindow(true);
    },
    300,
    [delayCollapseWindow, collapseWindow],
  );

  return (
    <GlobalContext.Provider
      value={{
        apiKey,
        setApiKey,
        showWindow,
        setShowWindow,
        collapseWindow,
        setCollapseWindow,
        pageLanguage,
      }}
    >
      <Transition
        show={showWindow}
        appear
        enter="duration-300 transition ease-out"
        enterFrom="opacity-0 translate-y-3"
        enterTo="opacity-100 translate-y-0"
        leave="duration-300 transition"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => {
          console.debug('before afterLeave');
          setEntities(null);
          setScrollPosition(0);
          setPage(1);
          console.debug('after afterLeave');
        }}
      >
        <Draggable
          onStart={handleStart}
          onStop={handleStop}
          handle=".dragHandler"
          nodeRef={nodeRef}
          position={{ x: positionX, y: positionY }}
          bounds="html"
        >
          <div
            role="dialog"
            ref={nodeRef}
            onMouseUp={(e) => {
              // console.log('onMouseUp');
            }}
            onMouseMove={(e) => {
              // console.log('onMouseMove');
            }}
            onMouseDown={(e) => {
              // console.log('onMouseDown');
            }}
            onBlur={(e) => {
              // console.log('onBlur');
            }}
            onDragLeave={(e) => {
              // console.log('onDragLeave');
              setDelayCollapseWindow(true)
            }}
            onDragExit={() => {
              // console.log('onDragExit');
            }}
            onDragEnd={() => {
              // console.log('onDragEnd');
              setDelayCollapseWindow(false);
              cancelDelayCollapseWindow();
              setCollapseWindow(false);
            }}
            onMouseOut={() => {
              // console.log('onMouseOut');
            }}
            onDragOver={() => {
              // console.log('onDragOver');
              setDelayCollapseWindow(false);
              cancelDelayCollapseWindow();
              setCollapseWindow(false);
            }}
            onMouseLeave={() => {
              // console.log('onMouseLeave');
              setDelayCollapseWindow(true);
            }}
            onMouseEnter={() => {
              // console.log('onMouseEnter');
              setDelayCollapseWindow(false);
              cancelDelayCollapseWindow();
              setCollapseWindow(false);
            }}
            className={`
            selection:bg-purple-800 selection:text-white select-none rounded-lg w-[320px]
            ${isDragging ? 'blur-[1px] opacity-50' : 'opacity-100'}`}
          >
            <div
              className={`
              ${!collapseWindow && 'rounded-b-none'}
              py-3 px-3 border-zinc-700 border-t border-r border-l rounded-lg flex cursor-move
              dragHandler bg-gradient-to-b to-zinc-900 from-zinc-700`}
            >
              <span className="grow flex items-center">
                <div
                  className="w-5 h-5 mr-1 inline-block fill-lime-400"
                  dangerouslySetInnerHTML={{ __html: logo }}
                />
                <a
                  href={appUrl}
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}
                  target="_blank"
                  className="select-none drag-none font-extrabold tracking-wide text-xl text-slate-50"
                  rel="noreferrer"
                >
                  <img
                    className="drag-none h-6"
                    src={chrome.runtime.getURL('logo.png')}
                  />
                </a>
              </span>

              <div className="gap-x-2 flex">
                {false && (
                  <div className="self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDebug(!showDebug);
                      }}
                      onMouseDown={stopPropagation}
                      onTouchStart={stopPropagation}
                      className="inline-flex items-center p-1 border border-transparent rounded-full
                                              shadow-sm text-white bg-stone-900 hover:bg-stone-800 focus:outline-none
                                              focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 focus:ring-offset-stone-500"
                    >
                      <CogIcon
                        className={`h-4 w-4 transition duration-300 ${
                          showDebug ? '' : 'rotate-90'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}

                <div className="self-center">
                  <button
                    onClick={() => setCollapseWindow((prevState) => !prevState)}
                    onMouseDown={stopPropagation}
                    onTouchStart={stopPropagation}
                    type="button"
                    className="inline-flex items-center p-1 border border-transparent rounded-full
                                            shadow-sm text-white bg-stone-900 hover:bg-stone-800 focus:outline-none
                                            focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 focus:ring-offset-stone-500"
                  >
                    <ChevronUpIcon
                      className={`h-4 w-4 transition duration-300 ${
                        collapseWindow ? '' : 'rotate-180'
                      } `}
                    />
                  </button>
                </div>

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
                    <XIcon
                      className={`h-4 w-4 transition duration-75 ${
                        showWindow ? '' : 'rotate-45'
                      } `}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* <div className={`relative z-30 ${isBusy ? 'background-animate from-indigo-500 via-lime-400 to-indigo-500 bg-gradient-to-r bg-orange-400' : 'bg-slate-600'} transition-all h-1`} /> */}
            {/* <div className={`${isBusy ? 'background-animate from-indigo-500 via-lime-400 to-indigo-500 bg-gradient-to-r bg-orange-400' : 'from-lime-400 to-indigo-500 bg-gradient-to-r bg-orange-400'} transition-all h-2`} /> */}
            {/* <div className={`${isBusy ? 'background-animate from-indigo-500 via-lime-400 to-indigo-500 bg-gradient-to-r bg-orange-400' : 'bg-slate-400'} transition-all h-2`} /> */}

            {/* <div className="border border-t-0 border-slate-300 rounded-t-none rounded-lg overflow-hidden flex flex-col h-full"> */}
            <Transition
              show={!collapseWindow}
              unmount={false}
              enter="transition"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="flex flex-col h-full">
                <div className="content-center flex flex-col relative">
                  <Transition
                    show={!showForm}
                    appear
                    enter="z-20 duration-300 transition-all ease-out"
                    enterFrom="opacity-80"
                    enterTo="opacity-100"
                    leave="z-10 duration-300 transition-all ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute w-full">
                      <div className="svg-pattern border border-t-0 border-slate-300 rounded-t-none rounded-lg">
                        <SearchInput
                          searchString={searchString}
                          setSearchString={setSearchString}
                          setPage={setPage}
                          setEntities={setEntities}
                          setScrollPosition={setScrollPosition}
                        />

                        <List
                          isBusy={isBusy}
                          setIsBusy={setIsBusy}
                          entities={entities}
                          page={page}
                          setPage={setPage}
                          setEntities={setEntities}
                          handleNewEntityClick={handleNewEntityClick}
                          onSelectItem={selectItemHandler}
                          fragmentUrl={fragmentUrl}
                          linkUrl={linkUrl}
                          imageSrc={imageSrc}
                          searchString={searchString}
                          scrollPosition={scrollPosition}
                          setScrollPosition={setScrollPosition}
                        />
                      </div>
                    </div>
                  </Transition>

                  <Transition
                    show={showForm}
                    appear
                    enter="z-20 duration-300 transition-all ease-out"
                    enterFrom="opacity-80"
                    enterTo="opacity-100"
                    leave="z-10 duration-300 transition-all ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => {
                      dispatch({
                        type: EntityActionType.INIT,
                        payload: newEntity(searchString),
                      });
                    }}
                  >
                    <div className="absolute w-full">
                      <Form
                        isBusy={isBusy}
                        setIsBusy={setIsBusy}
                        handleBackButtonClick={handleBackButtonClick}
                        entity={entity}
                        sentiment={sentiment}
                        setSentiment={setSentiment}
                        relevance={relevance}
                        setRelevance={setRelevance}
                        mentionDate={mentionDate}
                        setMentionDate={setMentionDate}
                        dispatch={dispatch}
                        fragmentUrl={fragmentUrl}
                        fragmentHash={fragmentHash!}
                        linkUrl={linkUrl}
                        imageSrc={imageSrc}
                        showDebug={showDebug}
                        operation={operation}
                      />
                    </div>
                  </Transition>
                </div>
              </div>
            </Transition>
          </div>
        </Draggable>
      </Transition>
    </GlobalContext.Provider>
  );
}

export default AppAdd;
