import { CheckIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

import { Kind } from '../../../main';
import { preventDefault } from '../../Utils';

export default function Option(props: {
  // IT IS REQUIRED! TODO. Adds with React.cloneElement
  index?: number;
  // IT IS REQUIRED! TODO. Adds with React.cloneElement
  isHighlighted?: boolean;
  highlightedIndex: number | null;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  option: Kind;
  changeSelection: () => void;
  isSelected: boolean;
}) {
  // const isHighlighted = props.index === props.highlightedIndex;

  return (
    <li
      onClick={props.changeSelection}
      onMouseMove={() => props.setHighlightedIndex(props.index as number)}
      onMouseLeave={() => props.setHighlightedIndex(null)}
      className={`${
        props.isHighlighted ? 'text-white bg-indigo-600' : 'text-gray-900'
      } relative flex items-center content-center cursor-default py-2 pl-3 pr-9`}
      tabIndex={-1}
    >
      <span
        onMouseDown={preventDefault}
        className={`${
          props.isSelected ? 'font-semibold' : 'font-normal'
        } block truncate`}
      >
        {props.option.title}
      </span>

      <span
        className="ml-2 text-slate-400 text-xs"
        onMouseDown={preventDefault}
      >
        {props.option.count}
      </span>

      <span
        onMouseDown={preventDefault}
        className={`${
          props.isHighlighted ? 'text-white' : 'text-indigo-600'
        } absolute inset-y-0 right-0 flex items-center pr-4`}
      >
        {props.isSelected && <CheckIcon className="h-5 w-5" />}
      </span>
    </li>
  );
}
