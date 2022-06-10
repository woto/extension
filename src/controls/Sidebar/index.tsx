import React, {
  Fragment, Suspense, useCallback, useEffect, useState,
} from 'react';

import { Transition } from '@headlessui/react';
import Button from './Button';

import { Tab } from '../../../main';

export const tabs = ['Yandex', 'Google', 'Iframely', 'Scrapper', 'Github', 'Ruby', 'Javascript', 'Python', 'Youtube', 'Telegram', 'Yandex2'] as const;

export default function Sidebar(
  props: {
    apiKey: string,
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    searchString: string, linkUrl: string
  },
) {
  const [currentTab, _setCurrentTab] = useState<Tab | null>(null);
  const setCurrentTab = useCallback(_setCurrentTab, []);

  const handleClick = (tab: any) => {
    setCurrentTab(tab === currentTab ? null : tab);
  };

  const [cache, setCache] = useState<Partial<Record<Tab, any>> | null>();

  // setCache({(['yandex' as Tab]): '1'})
  const storeCache = (key: Tab, value: object) => {
    const tmp = { [key]: value };
    setCache({ ...cache, ...tmp });
  };

  // const disabled = (tab: string) => {
  //   switch (tab) {
  //     case 'Yandex':
  //       return false;
  //     case 'Iframely':
  //       if (props.linkUrl) {
  //         return false;
  //       }
  //     case 'Scrapper':
  //       if (props.linkUrl) {
  //         return false;
  //       }
  //   }

  //   return true;
  // };

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

  return (
    <Transition
      as={Fragment}
      appear
      enter="transition duration-300 ease-out"
      enterFrom="translate-x-0"
      enterTo="translate-x-[43px]"
    >
      <div className={`absolute inset-0 transition-transform ${currentTab ? 'translate-x-full' : 'translate-x-[43px]'} rounded`}>
        <div className="flex h-full bg-slate-50/90 backdrop-blur-sm rounded-r border-gray-300 border">

          <div className="flex w-full">
            <div className="flex overflow-auto justify-self-stretch self-stretch items-stretch w-full bg-white/50 mt-1 mb-1 ml-1 border-gray-300 border rounded">
              <Suspense fallback={<div>Загрузка...</div>}>
                <Component
                  apiKey={props.apiKey}
                  setIsBusy={props.setIsBusy}
                  currentTab={currentTab}
                  cache={cache}
                  storeCache={storeCache}
                  linkUrl={props.linkUrl}
                  searchString={props.searchString}
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
