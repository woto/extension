import { SelectorIcon } from '@heroicons/react/solid';
import React, { ChangeEvent, useRef, useState } from 'react';
import useOutsideClick from '../../useOutsideClick';
import Options from './Options';

export default function Combobox(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuRef, setIsOpen);

  const [searchString, setSearchString] = useState('');

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //     console.log(e);
  // }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const filteredOptions = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      if (child.props.label.toLowerCase().includes(searchString.toLowerCase())) {
        return React.cloneElement(child);
      }
    }
  })?.filter((val: any) => val);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);

    if (['Enter'].includes(e.key)) {
      console.log('Enter prevented');
      e.preventDefault();
    } else if (['ArrowDown', 'ArrowUp'].includes((e.key))) {
      e.preventDefault();
      setIsOpen(true);
    } else if (['Tab'].includes(e.key)) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
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

      <input placeholder="Выберите тип..." onKeyDown={handleKeyDown} onClick={handleClick} onFocus={handleFocus} onChange={handleChange} id="combobox" type="text" className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-12 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" role="combobox" aria-controls="options" aria-expanded="false" />

      {/* <button type="button" tabIndex={-1} className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <SelectorIcon className="h-5 w-5 text-gray-400" />
      </button> */}

      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <SelectorIcon className="h-5 w-5 text-gray-400" />
      </span>

      { filteredOptions && filteredOptions.length > 0
            && (
              <Options isOpen={isOpen} setIsOpen={setIsOpen}>
                { filteredOptions }
              </Options>
            )}

    </div>
  );
}
