import { Transition } from '@headlessui/react';
import React, { Dispatch, useCallback } from 'react';
import { CheckCircleIcon, XIcon } from '@heroicons/react/solid';
import Select from './controls/Select';
import Option from './controls/Select/Option';

import { EntityAction, Relevance } from '../main';
import Alert from './Alert';
import { EntityActionType } from './Utils';

export default function RelevanceInput(props: {
  relevance: Relevance | null | undefined;
  setRelevance: React.Dispatch<
    React.SetStateAction<Relevance | null | undefined>
  >;
  options: Relevance[];
  toggleVisibility: any;
  priority: number;
  show: boolean;
}) {
  const handleChangeRelevance = (relevance: Relevance) => {
    let newRelevance: Relevance | null = null;

    if (props.relevance?.id === relevance.id) {
      newRelevance = null;
    } else {
      newRelevance = relevance;
    }

    props.setRelevance(newRelevance);
  };

  const titleForRelevance = () => {
    const { options } = props;
    const found = options.find((row) => props?.relevance?.id === row.id);
    if (found) return found.title;
    return null;
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
          toggleVisibility={(e: any) => props.toggleVisibility(e, 'relevance')}
          title="Важность"
          text="Отметтье важность, с которой упоминается объект. Как правило в статье не более 2-3 основных объектов."
        />

        <Select title={titleForRelevance()}>
          {props.options.map((option) => (
            <Option
              key={option.id}
              changeSelection={() => handleChangeRelevance(option)}
              isSelected={props.relevance?.id === option.id}
              option={option}
            />
          ))}
        </Select>
      </Transition>
    </div>
  );
}
