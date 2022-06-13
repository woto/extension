import React, { useEffect, useState } from 'react';

import { Tab } from '../../../main';

export default function SlideButton(props: {
    iconName: Tab,
    currentTab: Tab | null,
    setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>,
    isShowBell: boolean
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
      onClick={(e) => { e.preventDefault(); props.setCurrentTab(props.iconName); }}
      className={`
            relative
            ${props.currentTab === props.iconName ? 'bg-gradient-to-bl from-white/0 to-slate-900/20 opacity-80' : ''}
            fill-slate-600 border-r-transparent first:rounded-tr border-r-2 hover:border-r-indigo-400 inline-flex items-center px-2.5 py-3`}
    >
      <div className="h-5 w-5" dangerouslySetInnerHTML={{ __html: icon }} />
      { props.isShowBell
        && <span className="absolute top-3 right-3 inline-block w-2.5 h-2.5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full" />}
    </button>
  );
}
