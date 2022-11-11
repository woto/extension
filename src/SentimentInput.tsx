import React, {
  Dispatch, Fragment, useCallback, useState,
} from 'react';
import { Transition } from '@headlessui/react';
// import type { SentimentItem } from './SentimentItem';

import {
  CheckCircleIcon,
  ThumbDownIcon,
  ThumbUpIcon,
  XIcon,
} from '@heroicons/react/solid';
import { EntityAction, Sentiment } from '../main';
import Alert from './Alert';
import { EntityActionType } from './Utils';

function Icon(props: { title: string }) {
  switch (props.title) {
    case 'ThumbUpIcon':
      return <ThumbUpIcon className="w-5 h-5" />;
    case 'ThumbDownIcon':
      return <ThumbDownIcon className="w-5 h-5" />;
  }

  return <></>;
}

export default function SentimentInput(props: {
  sentiment: Sentiment | null | undefined;
  setSentiment: React.Dispatch<
    React.SetStateAction<Sentiment | null | undefined>
  >;
  options: Sentiment[];
  toggleVisibility: any;
  priority: number;
  show: boolean;
}) {
  const handleChangeSentiment = (sentiment: Sentiment) => {
    let newSentiment: Sentiment | null = null;

    if (props.sentiment?.id === sentiment.id) {
      newSentiment = null;
    } else {
      newSentiment = sentiment;
    }

    props.setSentiment(newSentiment);
  };

  return (
    <div className={`relative priority-${props.priority * 10}`}>
      <Transition
        show={props.show}
        enter="transition-all duration-300"
        enterFrom="max-h-0 opacity-0 mt-0"
        enterTo="max-h-[500px] opacity-100 mt-3"
        leave="transition-all duration-300"
        leaveFrom="max-h-[500px] opacity-100 mt-3"
        leaveTo="max-h-0 opacity-0 mt-0"
      >
        <Alert
          toggleVisibility={(e: any) => props.toggleVisibility(e, 'sentiment')}
          title="Настроение"
          text="Отметтье настроение, с которым автор упоминает объект. Настроение автора может не совпадать с вашим."
        />

        <div className="gap-2 flex">
          {props.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleChangeSentiment(option)}
              type="button"
              className={`
                ${
                  props.sentiment?.id === option.id
                    ? 'bg-gray-600 border-transparent text-white hover:bg-gray-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }
                inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <Icon title={option.title} />
            </button>
          ))}
        </div>
      </Transition>
    </div>
  );
}
