import { Transition } from '@headlessui/react';
import React from 'react';
import Select from './controls/Select';
import Option from './controls/Select/Option';

export default function RelevanceInput(props: {
    priority: number,
    relevance: Relevance | null,
    setRelevance: React.Dispatch<React.SetStateAction<Relevance | null>>,
    show: boolean,
    options: Relevance[]
}) {
  const handleChangeSelection = (fn: {value: string, label: string}) => {
    console.log('change selection');
    const { relevance, setRelevance } = props;
    if (relevance?.value === fn.value) {
      setRelevance(null);
    } else {
      setRelevance(fn);
    }
  };

  const labelForRelevance = () => {
    const { options } = props;
    const found = options.find((row) => props?.relevance?.value === row.value);
    if (found) return found.label;
    return null;
  };

  return (
    <div className={`relative priority-${props.priority * 10}`}>
      <Transition
        show={props.show}
        enter="transition-all duration-300"
        enterFrom="max-h-0 opacity-0 mt-0"
        enterTo="max-h-60 opacity-100 mt-3"
        leave="transition-all duration-300"
        leaveFrom="max-h-60 opacity-100 mt-3"
        leaveTo="max-h-0 opacity-0 mt-0"
      >
        <Select label={labelForRelevance()}>
          { props.options.map((option) => (
            <Option
              key={option.value}
              changeSelection={() => handleChangeSelection(option)}
              isSelected={props?.relevance?.value === option.value}
              option={option}
            />
          ))}
        </Select>
      </Transition>
    </div>
  );
}
