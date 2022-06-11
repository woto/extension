import React, {
  Fragment, Suspense, useCallback, useEffect, useMemo, useState,
} from 'react';

import { Transition } from '@headlessui/react';
import Button from './Button';

import { Tab } from '../../../main';

export const tabs = ['Yandex', 'Google', 'Iframely', 'Scrapper', 'Github', 'Ruby', 'Javascript', 'Python', 'Youtube', 'Telegram', 'YandexXml'] as const;

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

  useEffect(() => {
    const getDefaultValue = () => {
      switch (currentTab) {
        case 'Yandex':
          return searchString;
        case 'Iframely':
          return linkUrl || 'https://example.com';
        case 'Scrapper':
          return linkUrl || 'https://example.com';
      }

      return searchString;
    };

    const defaultValue = getDefaultValue();
    setInternalSearchString(defaultValue);
  }, [searchString, linkUrl, currentTab]);

  let Component = React.lazy(() => import('./Extractors/Hack'));

  if (currentTab) {
    Component = React.lazy(() => import(`./Extractors/${currentTab}`));
  }

  // const loadLibrary = () => import('../Combobox/index');
  // return loadLibrary().then((mod => {
  //   return mod;
  // })
  // );

  // const load = (
  //   async () => await import('./Extractors/Yandex')
  // )();
  // return load();

  // switch(mod) {
  //   case 'Yandex':
  //     return import('./Extractors/Yandex');
  // }

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
        <div className="flex h-full bg-slate-100/80 backdrop-blur-sm rounded-r border-gray-300 border">

          <div className="flex w-full">

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
            { tabs.map((tab) => (
              <Button
                key={tab}
                iconName={tab}
                setCurrentTab={handleClick}
                currentTab={currentTab}
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
