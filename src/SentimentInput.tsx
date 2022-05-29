import React, { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
// import type { SentimentItem } from './SentimentItem';

export default function SentimentInput(props: {
    priority: number,
    show: boolean,
    options: SentimentItem[],
    setSentiment: React.Dispatch<React.SetStateAction<string | null>>,
    sentiment: string | null}) {
  const changeSentiment = (value: string | null) => {
    // debugger
    props.setSentiment(value);
  };

  return (
    <div className={`relative priority-${props.priority * 10}`}>
      <Transition
        show={props.show}
        enter="transition-all duration-1000"
        enterFrom="max-h-0 opacity-0 mt-0"
        enterTo="max-h-60 opacity-100 mt-3"
        leave="transition-all duration-1000"
        leaveFrom="max-h-60 opacity-100 mt-3"
        leaveTo="max-h-0 opacity-0 mt-0"
      >
        <div className="gap-2 flex">
          { props.options.map((row) => (
            <button
              key={row.value}
              onClick={() => changeSentiment(props.sentiment != row.value ? row.value : '')}
              type="button"
              className={`${props.sentiment === row.value ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'} inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {row.label}
            </button>
          ))}
        </div>
      </Transition>
    </div>
  );
}
