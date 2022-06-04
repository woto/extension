import { SelectorIcon } from '@heroicons/react/solid';
import React, { ChangeEvent, useRef, useState } from 'react';
import useOutsideClick from '../../useOutsideClick';
import Options from './Options';

export default function Combobox(props: {
  children: React.ReactNode,
  label: string,
  searchString: string,
  setSearchString: React.Dispatch<React.SetStateAction<string>>,
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>
}) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuRef, setIsOpen);

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //     // console.log(e);
  // }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.setSearchString(e.target.value);
    setIsOpen(true);
  };

  let counter = 0;
  const filteredOptions = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      if (child.props.option.label.toLowerCase().includes(props.searchString.toLowerCase())) {
        const element = React.cloneElement(child, { index: counter, isHighlighted: counter === child.props.highlightedIndex });
        counter++;
        return element;
      }
    }
  })?.filter((val: any) => val);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    // console.log(e.key);

    if (['Enter'].includes(e.key)) {
      e.preventDefault();
      setIsOpen(true);
    } else if (['ArrowUp'].includes(e.key)) {
      props.setHighlightedIndex((prevVal) => (Number(prevVal) > 0 ? Number(prevVal) - 1 : Number(filteredOptions?.length) - 1));
      e.preventDefault();
      setIsOpen(true);
    } else if (['ArrowDown'].includes(e.key)) {
      props.setHighlightedIndex((prevVal) => (Number(prevVal) < Number(filteredOptions?.length) - 1 ? Number(prevVal) + 1 : 0));
      e.preventDefault();
      setIsOpen(true);
    } else if (['Tab', 'Escape'].includes(e.key)) {
      setIsOpen(false);
    } else {
      // setIsOpen(true);
    }
  };

  const handleFocus = () => {
    // setIsOpen(true)
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={menuRef} className="relative">

      <input
        placeholder={props.label !== '' ? props.label : 'Выберите тип...'}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={handleFocus}
        onChange={handleChange}
        type="text"
        value={props.searchString}
        className={`${props.label !== '' ? 'placeholder:text-black' : ''} w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-12 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm`}
        role="combobox"
        aria-controls="options"
        aria-expanded="false"
      />

      <button type="button" tabIndex={-1} className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <SelectorIcon className="h-5 w-5 text-gray-400" />
      </button>

      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <SelectorIcon className="h-5 w-5 text-gray-400" />
      </span>

      {filteredOptions && filteredOptions.length > 0
        && (
          <Options isOpen={isOpen} setIsOpen={setIsOpen}>
            {filteredOptions}
          </Options>
        )}

    </div>
  );
}
