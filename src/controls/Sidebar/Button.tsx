import React, { useEffect, useState } from 'react';

import { Tab } from '../../../main';

export default function SlideButton(props: {
    iconName: Tab,
    currentTab: Tab | null,
    setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>,
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
            ${props.currentTab === props.iconName ? 'bg-gradient-to-br from-white/0 to-slate-900/20 opacity-80' : ''}
            fill-slate-800/80 border-r-transparent first:rounded-tr border-r-2 hover:border-r-indigo-400 inline-flex items-center px-2.5 py-3`}
    >
      <div className="h-5 w-5" dangerouslySetInnerHTML={{ __html: icon }} />
    </button>
  );
}
