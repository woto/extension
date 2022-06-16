import React, {
  Fragment, Suspense, useCallback, useEffect, useState,
} from 'react';

import { Transition } from '@headlessui/react';
import Button from './Button';

import { Tab, SidebarButtonState } from '../../../main';

export const tabs = ['YandexXML', 'GoogleCustomSearch', 'Iframely', 'Scrapper', 'Github', 'Ruby', 'Javascript', 'Youtube', 'Telegram', 'YandexMicrodata', 'GoogleGraph'] as const;

function _Sidebar(
  props: {
    apiKey: string,
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    searchString: string,
    linkUrl: string,
  },
) {
  const [currentTab, _setCurrentTab] = useState<Tab | null>(null);
  const setCurrentTab = useCallback(_setCurrentTab, []);

  const handleClick = (tab: any) => {
    setCurrentTab(tab === currentTab ? null : tab);
  };

  const [internalSearchString, setInternalSearchString] = useState<string>('');

  const { searchString, linkUrl } = props;

  const SidebarButtonsStates: { [key in Tab]: SidebarButtonState } = {
    YandexMicrodata: {
      q: searchString,
      bell() { return false; },
      disabled: true,
    },
    YandexXML: {
      q: searchString,
      bell() { return true; },
      disabled: false,
    },
    GoogleGraph: {
      q: searchString,
      bell() { return true; },
      disabled: false,
    },
    GoogleCustomSearch: {
      q: searchString,
      bell() { return true; },
      disabled: false,
    },
    Iframely: {
      q: linkUrl,
      bell() {
        try {
          const url = new URL(linkUrl);
          return true;
        } catch {}
      },
      disabled: false,
    },
    Scrapper: {
      q: linkUrl,
      bell() {
        try {
          const url = new URL(linkUrl);
          return true;
        } catch {}
      },
      disabled: false,
    },
    Github: {
      q: linkUrl || searchString,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['github.com'].includes(url.host)) return true;
        } catch { }
      },
      disabled: false,
    },
    Telegram: {
      q: linkUrl || searchString,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['www.t.me', 't.me', 'telegram.me'].includes(url.host)) return true;
        } catch { }
      },
      disabled: false,
    },
    Ruby: {
      q: linkUrl || searchString,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['rubygems.org'].includes(url.host)) return true;
        } catch { }
      },
      disabled: false,
    },
    Javascript: {
      q: linkUrl || searchString,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['npmjs.com'].includes(url.host)) return true;
        } catch { }
      },
      disabled: false,
    },
    Youtube: {
      q: linkUrl || searchString,
      bell() {
        try {
          const url = new URL(linkUrl);
          if (['youtube.com', 'www.youtube.com'].includes(url.host)) return true;
        } catch { }
      },
      disabled: false,
    },
  };

  useEffect(() => {
    const str = currentTab && SidebarButtonsStates[currentTab].q || '';
    setInternalSearchString(str);
  }, [currentTab]);

  const [Component, setComponent] = useState<any>(
    React.lazy(() => import('./Extractors/Hack')),
  );

  useEffect(() => {
    if (currentTab) {
      setComponent(
        React.lazy(() => import(`./Extractors/${currentTab}`)),
      );
    }
  }, [currentTab]);

  const stopPropagation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <Transition
      as={Fragment}
      appear
      enter="transition duration-300 ease-out"
      enterFrom="translate-x-0"
      enterTo="translate-x-[43px]"
    >
      <div className={`absolute inset-0 transition-transform ${currentTab ? 'translate-x-full' : 'translate-x-[43px]'} rounded`}>
        <div className="flex h-full bg-orange-50/80 backdrop-blur-sm rounded-r border-gray-300 border">

          <div className="flex w-full overflow-auto">

            <div className="select-text flex-col overflow-auto justify-self-stretch self-stretch items-stretch w-full bg-white/50 mt-1 mb-1 ml-1 border-gray-300 border rounded">

              <div className="mt-1 border-b border-gray-300 focus-within:border-indigo-600">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full border-0 border-b border-transparent bg-gray-50 focus:border-indigo-600 focus:ring-0 sm:text-sm"
                  placeholder="Поиск..."
                  value={internalSearchString}
                  onKeyDown={stopPropagation}
                  onChange={(e) => setInternalSearchString(e.target.value)}
                />
              </div>

              <Suspense fallback={<div>Загрузка...</div>}>
                <Component
                  apiKey={props.apiKey}
                  setIsBusy={props.setIsBusy}
                  currentTab={currentTab}
                  q={internalSearchString}
                />
              </Suspense>
            </div>
          </div>

          <div className="flex flex-col">
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

    </Transition>
  );
}

const Mycomponents = React.memo((props: any) => _Sidebar(props));

export default Mycomponents;
