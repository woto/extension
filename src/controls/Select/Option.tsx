import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/solid';

export default function Option(props: { value: string, label: string, changeSelection: (value: string | null) => void, isSelected: boolean }) {
  const [isHighlight, setIsHighlight] = useState(false);

  return (
    <>
      {/* {console.log('SelectOption rendered')} */}

      <li
        onClick={() => { props.changeSelection(props.isSelected ? null : props.value); }}
        onMouseEnter={() => setIsHighlight(true)}
        onMouseLeave={() => setIsHighlight(false)}
        className={`${isHighlight ? 'text-white bg-indigo-600' : 'text-gray-900'} text-sm cursor-default select-none relative py-2 pl-3 pr-9`}
        id="listbox-option-0"
        role="option"
      >
        <span className={`${props.isSelected ? 'font-semibold' : 'font-normal'} block truncate`}>
          {' '}
          {props.label}
          {' '}
        </span>
        <span className={`${isHighlight ? 'text-white' : 'text-indigo-600'} absolute inset-y-0 right-0 flex items-center pr-4`}>

          {
                  props.isSelected
                  && <CheckIcon className="h-5 w-5" />
                }
        </span>
      </li>
    </>
  );
}
