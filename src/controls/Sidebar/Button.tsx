import { Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react';

import { Tab, SidebarButtonState } from '../../../main';

export default function SlideButton(props: {
  iconName: Tab;
  currentTab: Tab | null;
  setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>;
  state: SidebarButtonState;
}) {
  const [icon, setIcon] = useState<string>('');

  useEffect(() => {
    async function loadIcon() {
      const mod = await import(`../../icons/${props.iconName}.svg`);
      setIcon(mod.default);
    }

    loadIcon();
  }, []);

  return (
    <button
      disabled={props.state.disabled}
      onClick={(e) => {
        e.preventDefault();
        props.setCurrentTab(props.iconName);
      }}
      className={`
        ${props.state.disabled ? 'fill-slate-500/50' : 'fill-slate-500'}
        ${
          props.state.disabled
            ? ''
            : 'hover:border-r-indigo-400 hover:fill-slate-700'
        }
        ${props.currentTab === props.iconName ? 'opacity-95' : ''}
        ${
          props.currentTab === props.iconName
            ? 'bg-gradient-to-br from-white/0 to-slate-600/20'
            : ''
        }
        ${
          props.currentTab === props.iconName
            ? 'border-r-slate-800/50'
            : 'border-transparent'
        }
        group relative border-r-[3px] inline-flex items-center pl-3 py-3
      `}
    >
      <div
        className="h-5 w-5 relative"
        dangerouslySetInnerHTML={{ __html: icon }}
      />

      <Transition
        show={props.state.analyze().bell === true}
        appear
        enter="transition-all"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <span className="absolute top-3.5 right-3 inline-block w-2.5 h-2.5 transform translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full" />
      </Transition>
    </button>
  );
}
