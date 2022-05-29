import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import React, { ChangeEvent, useState } from 'react';
import Options from './Options';

export default function Combobox(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

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

  return (
    <div className="relative mt-1">
      <input onChange={handleChange} id="combobox" type="text" className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-12 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" role="combobox" aria-controls="options" aria-expanded="false" />
      <button type="button" className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <SelectorIcon className="h-5 w-5 text-gray-400" />
      </button>

      { filteredOptions && filteredOptions.length > 0
            && (
            <Options isOpen={isOpen} setIsOpen={setIsOpen}>
              { filteredOptions }
            </Options>
            )}
    </div>
  );
}
