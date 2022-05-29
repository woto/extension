import { CheckIcon } from '@heroicons/react/solid';
import React from 'react';

export default function Option(props: {changeSelection: (fn: Kind) => void, isSelected: boolean, value: string | null, label: string}) {
  // console.log('render combobox option');

  return (
  //     <!--
  //     Combobox option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

  //     Active: "text-white bg-indigo-600", Not Active: "text-gray-900"
  //   -->
    <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900" id="option-0" role="option" tabIndex={-1}>
      {/* <!-- Selected: "font-semibold" --> */}
      <span className="block truncate">{props.label}</span>

      {/* <!--
          Checkmark, only display for selected option.

          Active: "text-white", Not Active: "text-indigo-600"
        --> */}
      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
        {/* <!-- Heroicon name: solid/check --> */}
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </span>
    </li>
  );
}
