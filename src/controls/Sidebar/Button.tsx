import React, { useEffect, useState } from 'react';

import { Tab, SidebarButtonState } from '../../../main';

export default function SlideButton(props: {
    iconName: Tab,
    currentTab: Tab | null,
    setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>,
    state: SidebarButtonState
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
      onClick={(e) => { e.preventDefault(); props.setCurrentTab(props.iconName); }}
      className={`
        relative
        border-t border-r-2
        ${props.state.disabled ? 'fill-slate-900/20' : 'fill-slate-600'}
        ${props.state.disabled ? '' : 'hover:border-r-indigo-400'}
        ${props.currentTab === props.iconName ? 'opacity-95' : ''}
        ${props.currentTab === props.iconName ? 'bg-gradient-to-br from-white/0 to-slate-900/20' : ''}
        ${props.currentTab === props.iconName ? 'border-r-slate-900/50 border-y-white/5' : 'border-transparent'}
        first:rounded-tr border-r-2 inline-flex items-center px-2.5 py-3
      `}
    >
      <div className="h-5 w-5" dangerouslySetInnerHTML={{ __html: icon }} />
      { props.state.bell()
        && <span className="absolute top-3 right-3 inline-block w-2.5 h-2.5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full" />}
    </button>
  );
}
