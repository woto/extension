import React, { useEffect, useRef, useState } from 'react';
import { CheckIcon } from '@heroicons/react/solid';

type Item = {id: string, label: string}

export default function Option(props: {
    option: Item,
    changeSelection: () => void,
    isSelected: boolean }) {
  const [isHighlight, setIsHighlight] = useState(false);
  const inputEl = useRef<HTMLLIElement>(null);

  // useEffect(() => {
  //   if (props.isSelected) {
  //     setIsHighlight(false);
  //   }
  // }, [props.isSelected]);

  return (
    <li
      ref={inputEl}
      onClick={props.changeSelection}
      onMouseEnter={() => setIsHighlight(true)}
      onMouseLeave={() => setIsHighlight(false)}
      className={`${isHighlight ? 'text-white bg-indigo-600' : 'text-gray-900'} text-sm cursor-default relative py-2 pl-3 pr-9`}
    >

      <span className={`${props.isSelected ? 'font-semibold' : 'font-normal'} block truncate`}>
        {' '}
        {props.option.label}
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
