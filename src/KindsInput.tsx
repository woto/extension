import React from 'react';
import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import Combobox from './controls/Combobox';
import ComboboxOption from './controls/Combobox/Option';

export default function KindsInput(props: {
  priority: number,
  show: boolean
  kinds: Kind[],
  options: Kind[],
  setKinds: React.Dispatch<React.SetStateAction<Kind[]>>
}) {
  const changeKinds = (fn: Kind) => {
    props.setKinds((prevValues) => [...prevValues]);
    // console.log(fn);
  };

  const mergeByProperty = (target: Kind[], source: Kind[], prop: keyof Kind) => {
    const result: Kind[] = [];

    for (const kind of target) {
      if (!result.some((el: Kind) => el[prop] === kind[prop])) {
        result.push(kind);
      }
    }

    for (const kind of source) {
      if (!result.some((el: Kind) => el[prop] === kind[prop])) {
        result.push(kind);
      }
    }

    return result;
  };

  const mergedOptions: any = mergeByProperty(props.kinds, props.options, 'value');

  const isSelected = (option: Kind) => props.kinds.includes(option);

  return (
    <div className={`relative priority-${props.priority * 10}`}>
      <Transition
        show={props.show}
        enter="transition-all"
        enterFrom="max-h-0 opacity-0 mt-0"
        enterTo="max-h-60 opacity-100 mt-3"
        leave="transition-all"
        leaveFrom="max-h-60 opacity-100 mt-3"
        leaveTo="max-h-0 opacity-0 mt-0"
      >
        <Combobox>
          { mergedOptions.map((option: Kind) => (
            <ComboboxOption
              key={option.value}
              changeSelection={changeKinds}
              isSelected={isSelected(option)}
              value={option.value}
              label={option.label}
            />
          ))}
        </Combobox>

        <ul className="mt-2 leading-8">
          { props.kinds.map((kind) => (
            <li key={kind.value} className="inline">
              <a
                href="#"
                // className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                className="bg-white hover:bg-gray-50 relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
              >

                {/* <div className="absolute flex-shrink-0 flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
                </div> */}

                {/* <div className="ml-3.5 text-sm font-medium text-gray-900"> */}
                <div className="text-sm font-medium text-gray-900">
                  {' '}
                  {kind.label}
                  {' '}
                </div>
              </a>
              {' '}
            </li>
            // <li className="inline">
            //   <span className="relative z-0 inline-flex rounded-full">
            //     <div
            //       className="relative inline-flex items-center px-3 py-0.5 rounded-l-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            //     >
            //       {kind.label}
            //     </div>
            //     <button
            //       type="button"
            //       className="-ml-px relative inline-flex items-center px-2 py-0.5 rounded-r-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            //     >
            //       <XIcon className="-ml-1 h-4 w-4 text-gray-400" aria-hidden="true" />
            //     </button>
            //   </span>
            //   {' '}
            // </li>
          ))}
        </ul>
      </Transition>
    </div>
  );
}
