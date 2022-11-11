import React, {
  Fragment,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Transition } from '@headlessui/react';
import {
  RefreshIcon,
  SearchIcon,
  SortAscendingIcon,
} from '@heroicons/react/solid';
import Button from './Button';
import Textarea from '../Textarea';

import { Tab, SidebarButtonState } from '../../../main';
import search = chrome.bookmarks.search;
import { url } from 'inspector';

export const tabs = [
  'Wikipedia',
  'GoogleGraph',
  'DuckDuckGo',
  'YandexXML',
  'GoogleCustomSearch',
  'Iframely',
  'Scrapper',
  'Screenshot',
  'Github',
  'Ruby',
  'Javascript',
  'Youtube',
  'Telegram',
  'YandexMicrodata',
  'YandexImages',
] as const;

function Sidebar(props: {
  searchString: string;
  linkUrl: string;
  imageSrc: string;
  fragmentUrl: string;
}) {
  const [isBusy, setIsBusy] = useState(false);
  const [currentTab, _setCurrentTab] = useState<Tab | null>(null);
  const setCurrentTab = useCallback(_setCurrentTab, []);
  const [refetchClicked, setRefetchClicked] = useState<boolean>(false);

  const handleClick = (tab: any) => {
    setCurrentTab(tab === currentTab ? null : tab);
  };

  const [internalSearchString, setInternalSearchString] = useState<string>('');
  const { searchString, linkUrl, fragmentUrl } = props;

  const SidebarButtonsStates: { [key in Tab]: SidebarButtonState } = {
    Wikipedia: {
      q: searchString,
      bell() {
        return !!searchString;
      },
      disabled: false,
    },
    YandexMicrodata: {
      q: linkUrl || fragmentUrl,
      bell() {
        try {
          new URL(linkUrl);
          return true;
        } catch {}

        try {
          new URL(fragmentUrl);
          return true;
        } catch {}
      },
      disabled: false,
    },
    YandexXML: {
      q: searchString,
      bell() {
        return !!searchString;
      },
      disabled: false,
    },
    YandexImages: {
      q: searchString,
      bell() {
        return false;
      },
      disabled: true,
    },
    GoogleGraph: {
      q: searchString,
      bell() {
        return !!searchString;
      },
      disabled: false,
    },
    GoogleCustomSearch: {
      q: searchString,
      bell() {
        return !!searchString;
      },
      disabled: false,
    },
    DuckDuckGo: {
      q: searchString,
      bell() {
        return !!searchString;
      },
      disabled: false,
    },
    Iframely: {
      q: linkUrl || fragmentUrl,
      bell() {
        try {
          new URL(linkUrl);
          return true;
        } catch {}

        try {
          new URL(fragmentUrl);
          return true;
        } catch {}
      },
      disabled: false,
    },
    Scrapper: {
      q: linkUrl || fragmentUrl,
      bell() {
        try {
          new URL(linkUrl);
          return true;
        } catch {}

        try {
          new URL(fragmentUrl);
          return true;
        } catch {}
      },
      disabled: false,
    },
    Screenshot: {
      q: '',
      bell() {
        return true;
      },
      disabled: false,
    },
    Github: {
      q: linkUrl || fragmentUrl || searchString,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['github.com'].includes(url.host)) return true;
        } catch {}

        try {
          const url = new URL(fragmentUrl);
          if (['github.com'].includes(url.host)) return true;
        } catch {}
      },
      disabled: false,
    },
    Telegram: {
      q: linkUrl || fragmentUrl || searchString,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['www.t.me', 't.me', 'telegram.me'].includes(url.host)) { return true; }
        } catch {}

        try {
          const url = new URL(fragmentUrl);
          if (['www.t.me', 't.me', 'telegram.me'].includes(url.host)) { return true; }
        } catch {}
      },
      disabled: false,
    },
    Ruby: {
      q: linkUrl || searchString || fragmentUrl,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['rubygems.org'].includes(url.host)) return true;
        } catch {}

        try {
          const url = new URL(fragmentUrl);
          if (['rubygems.org'].includes(url.host)) return true;
        } catch {}
      },
      disabled: false,
    },
    Javascript: {
      q: linkUrl || searchString || fragmentUrl,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['npmjs.com'].includes(url.host)) return true;
        } catch {}

        try {
          const url = new URL(fragmentUrl);
          if (['npmjs.com'].includes(url.host)) return true;
        } catch {}
      },
      disabled: false,
    },
    Youtube: {
      q: linkUrl || fragmentUrl || searchString,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['youtube.com', 'www.youtube.com'].includes(url.host)) { return true; }
        } catch {}

        try {
          const url = new URL(fragmentUrl);
          if (['youtube.com', 'www.youtube.com'].includes(url.host)) { return true; }
        } catch {}
      },
      disabled: false,
    },
  };

  useEffect(() => {
    const str = (currentTab && SidebarButtonsStates[currentTab].q) || '';
    setInternalSearchString(str);
  }, [currentTab]);

  const [Component, setComponent] = useState<any>(
    React.lazy(() => import('./Extractors/Hack')),
  );

  useEffect(() => {
    if (currentTab) {
      setComponent(React.lazy(() => import(`./Extractors/${currentTab}`)));
    }
  }, [currentTab]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();

    if (['Enter'].includes(e.key)) {
      e.preventDefault();
      setRefetchClicked(true);
    }
  };

  const initiateRefetch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRefetchClicked(true);
  };

  return (
    <Transition.Child
      as={Fragment}
      enter="transition ease-out"
      enterFrom="c1"
      enterTo="c2"
      leaveTo="c1"
    >
      <div
        className={`absolute duration-300 inset-0 transition-transform ${
          currentTab ? 'c3' : 'c2'
        } rounded overflow-hidden`}
      >
        <div className="flex h-full bg-slate-100/95 backdrop-blur-sm border-gray-300 border rounded overflow-hidden">
          <div className="flex flex-col w-full overflow-auto">
            <div className="shrink-0 border-b border-gray-300 focus-within:border-b-indigo-600 border-r">
              <div className="relative">
                <Textarea
                  className="hide-resize block w-full border-0 border-b border-transparent bg-gray-50 focus:border-indigo-600 focus:ring-0 sm:text-sm pr-10"
                  placeholder="Поиск..."
                  onKeyDown={handleKeyDown}
                  value={internalSearchString}
                  setValue={setInternalSearchString}
                />
                <div className="absolute inset-y-0 right-2 flex py-1.5 pr-0.5">
                  <div className="inline-flex items-center px-1.5">
                    {isBusy ? (
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-gray-400"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    ) : (
                      <button
                        onClick={initiateRefetch}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <SearchIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex grow bg-white/70">
              <div
                className="w-3 absolute top-0 bottom-0 cursor-pointer hover:border-l-indigo-400 border-l-4 border-l-transparent"
                onClick={() => setCurrentTab(null)}
              />

              <div className="px-3 select-text flex-col overflow-auto justify-self-stretch self-stretch items-stretch w-full border-gray-300 border-r">
                <Suspense fallback={<div>Загрузка...</div>}>
                  <Component
                    setIsBusy={setIsBusy}
                    currentTab={currentTab}
                    q={internalSearchString}
                    refetchClicked={refetchClicked}
                    setRefetchClicked={setRefetchClicked}
                  />
                </Suspense>
                <div className="opacity-0">.</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-y-scroll overscroll-none hide-scrollbar w-[50px] ">
            {tabs.map((tab) => (
              <Button
                key={tab}
                iconName={tab}
                setCurrentTab={handleClick}
                currentTab={currentTab}
                state={SidebarButtonsStates[tab]}
              />
            ))}
          </div>
        </div>
      </div>
    </Transition.Child>
  );
}

export default React.memo(Sidebar);
