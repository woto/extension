import { Transition } from '@headlessui/react';
import React from 'react';
import Select from './controls/Select';
import Option from './controls/Select/Option';

import { Relevance } from '../main';

export default function RelevanceInput(props: {
    priority: number,
    relevance: Relevance | null,
    setRelevance: React.Dispatch<React.SetStateAction<Relevance | null>>,
    show: boolean,
    options: Relevance[]
}) {
  const handleChangeSelection = (fn: {id: string, label: string}) => {
    // console.log('change selection');
    const { relevance, setRelevance } = props;
    if (relevance?.id === fn.id) {
      setRelevance(null);
    } else {
      setRelevance(fn);
    }
  };

  const labelForRelevance = () => {
    const { options } = props;
    const found = options.find((row) => props?.relevance?.id === row.id);
    if (found) return found.label;
    return null;
  };

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
        <Select label={labelForRelevance()}>
          { props.options.map((option) => (
            <Option
              key={option.id}
              changeSelection={() => handleChangeSelection(option)}
              isSelected={props?.relevance?.id === option.id}
              option={option}
            />
          ))}
        </Select>
      </Transition>
    </div>
  );
}
