import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import Select from './controls/Select';
import SelectOption from './controls/Select/Option.tsx';

export default function RelevanceInput(props: {
    priority: number,
    relevance: string,
    setRelevance: React.Dispatch<React.SetStateAction<string | null>>,
    show: boolean,
    options: any
}) {
  const changeRelevance = (value: string | null) => {
    const { setRelevance } = props;
    setRelevance(value);
  };

  const labelForRelevance = () => {
    const { options } = props;
    const found = options.find((row: any) => row.value === props.relevance);
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
          { props.options.map((row: any) => <SelectOption key={row.value} changeSelection={changeRelevance} isSelected={row.value == props.relevance} value={row.value} label={row.label} />)}
        </Select>
      </Transition>
    </div>
  );
}
