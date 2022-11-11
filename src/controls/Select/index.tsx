import React, { useEffect, useRef, useState } from 'react';
import { SelectorIcon } from '@heroicons/react/solid';
import Options from './Options';
import useOutsideClick from '../../useOutsideClick';
import { stopPropagation } from '../../Utils';

export default function Select(props: {
  children: React.ReactNode;
  title: string | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuRef, setIsOpen);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // console.log(e.key);

    if (['Enter'].includes(e.key)) {
      e.preventDefault();
      setIsOpen(true);
    } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      setIsOpen(true);
    } else if (['Tab', 'Escape'].includes(e.key)) {
      setIsOpen(false);
    } else {
      // setIsOpen(true);
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onKeyDown={handleKeyDown}
        onKeyPress={stopPropagation}
        onKeyUp={stopPropagation}
        onClick={handleClick}
        type="button"
        className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      >
        <span
          className={`block truncate ${props.title ? '' : 'text-slate-500'}`}
        >
          {props.title ? props.title : 'Выберите важность...'}
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
