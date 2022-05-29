import { CheckIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

export default function Option(
  props: {
    value: string | null,
    label: string,
    changeSelection: (fn: Kind) => void,
    isSelected: boolean},
) {
  const [isHighlight, setIsHighlight] = useState(false);

  return (
    <li
      onMouseEnter={() => setIsHighlight(true)}
      onMouseLeave={() => setIsHighlight(false)}
      className={`${isHighlight ? 'text-white bg-indigo-600' : 'text-gray-900'} relative cursor-default select-none py-2 pl-3 pr-9`}
      tabIndex={-1}
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
  );
}
