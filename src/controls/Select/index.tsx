import React, { useEffect, useRef, useState } from 'react';
import { SelectorIcon } from '@heroicons/react/solid';
import Options from './Options';
import useOutsideClick from '../../useOutsideClick';

export default function Select(props: {children: React.ReactNode, label: string | null}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuRef, setIsOpen);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    console.log(e.key);

    if (['ArrowDown', 'ArrowUp'].includes((e.key))) {
      e.preventDefault();
      setIsOpen(true);
    } else if (['Tab'].includes(e.key)) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={menuRef} className="relative">

      <button onKeyDown={handleKeyDown} onClick={handleClick} type="button" className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">

        <span className={`block truncate ${props.label ? '' : 'text-slate-500'}`}>
          {props.label ? props.label : 'Выберите важность...'}
        </span>

        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" />
        </span>

      </button>

      <Options isOpen={isOpen} setIsOpen={setIsOpen}>
        {props.children}
      </Options>

    </div>
  );
}