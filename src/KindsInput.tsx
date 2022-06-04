import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';

import Combobox from './controls/Combobox';
import Option from './controls/Combobox/Option';

import Tags from './controls/Tags';
import Item from './controls/Tags/Item';

export default function KindsInput(props: {
  priority: number,
  show: boolean
  kinds: Kind[],
  options: Kind[],
  setKinds: React.Dispatch<React.SetStateAction<Kind[]>>
}) {
  // console.log('options')
  // console.log(props.options);

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(-1);
  const [searchString, setSearchString] = useState('');

  const changeKinds = (kind: Kind) => {
    setSearchString('');

    props.setKinds((prevValues: any) => {
      const found = prevValues.find((obj: Kind) => obj.label === kind.label);
      if (found) {
        return prevValues.filter((obj: Kind) => obj.label !== kind.label);
      }
      return [kind, ...prevValues];
    });
  };

  const removeKind = (kind: Kind) => {
    props.setKinds(
      props.kinds.filter((item) => item.index !== kind.index && item.label !== kind.label),
    );
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

  const mergedOptions: any = mergeByProperty(props.options || [], props.kinds || [], 'index');

  const isSelected = (option: Kind) => props.kinds.some((row) => row.id === option.id && row.label === option.label);

  const labelForKinds = () => {
    if (props.kinds.length > 0) {
      return `Выбрано типов: ${props.kinds.length}`;
    }
    return '';
  };

  const createOption: Kind = {
    index: uuidv4(),
    id: null,
    label: searchString,
    destroy: false,
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

        <Combobox
          searchString={searchString}
          setSearchString={setSearchString}
          label={labelForKinds()}
          setHighlightedIndex={setHighlightedIndex}
        >

          { searchString && searchString !== '' && !(mergedOptions.some((option: Kind) => option.label === searchString))
          && (
          <Option
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            key={createOption.index}
            changeSelection={() => changeKinds(createOption)}
            isSelected={isSelected(createOption)}
            option={{ ...createOption, ...{ label: `Добавить: ${searchString}` } }}
          />
          )}

          { mergedOptions.map((option: Kind) => (
            <Option
              highlightedIndex={highlightedIndex}
              setHighlightedIndex={setHighlightedIndex}
              key={option.index}
              changeSelection={() => changeKinds(option)}
              isSelected={isSelected(option)}
              option={option}
            />
          ))}
        </Combobox>

        <Tags>
          { props.kinds.map((option: Kind) => (
            <Item
              handleClick={() => removeKind(option)}
              key={option.index}
              item={option}
            />
          ))}
        </Tags>

        {/* <ul className="mt-2 leading-8">
          { props.kinds.map((kind) => (
            <li key={kind.value} className="inline">
              <a
                href="#"
                className="bg-white hover:bg-gray-50 relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
              >

                <div className="text-sm font-medium text-gray-900">
                  {' '}
                  {kind.label}
                  {' '}
                </div>

              </a>
              {' '}
            </li>
          ))}
        </ul> */}

      </Transition>
    </div>
  );
}
