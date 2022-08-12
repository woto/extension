import React, { Dispatch, useContext, useEffect, useState, MouseEvent } from 'react';
import { Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';

import Combobox from './controls/Combobox';
import Option from './controls/Combobox/Option';

import Tags from './controls/Tags';
import Item from './controls/Tags/Item';

import { EntityAction, Kind } from '../main';
import { appUrl, EntityActionType, GlobalContext, newKind } from './Utils';
import { CheckCircleIcon, XIcon } from '@heroicons/react/solid';
import Alert from './Alert';

export default function KindsInput(props: {
  toggleVisibility: any,
  priority: number,
  show: boolean,
  kinds: Kind[],
  dispatch: Dispatch<EntityAction>,
}) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(-1);
  const [searchString, setSearchString] = useState('');
  const [options, setOptions] = useState<Kind[]>([]);
  const globalContext = useContext(GlobalContext);

  useEffect(() => {
    // props.setIsBusy(true);

    const query = new URLSearchParams({
      q: searchString,
    });

    fetch(`${appUrl}/api/topics?${query}`, {
      credentials: 'omit',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': globalContext.apiKey,
      },
    })
      .then((res) => {

        if (res.status === 401) {
          chrome.runtime.sendMessage({ message: 'request-auth' });
        }

        if (!res.ok) throw new Error(res.statusText);

        return res.json();
      })
      .then((res) => {
        res.forEach((row: Kind) => {
          row.destroy = false;
        });

        return res;
      })
      .then((res: Kind[]) => {
        res.forEach((res: Kind) => {
          res.index = res.id!.toString();
        });
        return res;
      })
      .then(
        (result) => {
          // props.setIsBusy(false);
          setOptions(result);
        },
      )
      .catch((reason) => {
        // props.setIsBusy(false);
        console.error(reason);
      });
  }, [searchString]);

  // const removeKind = (kind: Kind) => {

  //   // TODO: restore

  //   // props.setKinds((kinds) => {
  //   //   if (kind.id) {
  //   //     return kinds.map((item) => {
  //   //       if (item === kind) {
  //   //         return { ...kind, ...{ destroy: true } };
  //   //       }
  //   //       return item;
  //   //     });
  //   //   }
  //   //   return kinds.filter((item) => item !== kind);
  //   // });
  //   };

  const setKinds = (kind: Kind) => {
    setSearchString('');
    props.dispatch({type: EntityActionType.SET_KINDS, payload: {kind: kind}})
    // e.preventDefault(); removeKind(kind);
  }

  const mergeByProperty = (target: Kind[], source: Kind[], prop: keyof Kind) => {
    const result: Kind[] = [];

    for (const kind of source) {
      if (target.some((el: Kind) => el[prop] === kind[prop])) {
        continue;
      }

      if (!result.some((el: Kind) => el[prop] === kind[prop])) {
        result.push(kind);
      }
    }

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

  const mergedOptions: any = mergeByProperty(options || [], props.kinds || [], 'index');

  const isSelected = (option: Kind) => props.kinds.some(
    (row) => row.id === option.id && row.title === option.title && !row.destroy
  );

  const titleForKinds = () => {
    if (props.kinds.length > 0) {
      return `Выбрано тегов: ${props.kinds.filter((el) => !el.destroy).length}`;
    }
    return '';
  };

  const createOption: Kind = newKind(searchString);

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

        <Alert toggleVisibility={(e: any) => props.toggleVisibility(e, 'kinds')}
          title={"Теги"}
          text={'Старайтесь указывать теги в соответствии с правилами языка, например, "SaaS" или "Ruby on Rails".'} />

        <Combobox
          searchString={searchString}
          setSearchString={setSearchString}
          title={titleForKinds()}
          setHighlightedIndex={setHighlightedIndex}
        >

          {searchString && searchString !== '' && !(mergedOptions.some((option: Kind) => option.title === searchString))
            && (
              <Option
                highlightedIndex={highlightedIndex}
                setHighlightedIndex={setHighlightedIndex}
                key={createOption.index}
                changeSelection={() => setKinds(createOption)}
                isSelected={isSelected(createOption)}
                option={{ ...createOption, ...{ title: `Добавить: ${searchString}` } }}
              />
            )}

          {mergedOptions.map((option: Kind) => (
            <Option
              highlightedIndex={highlightedIndex}
              setHighlightedIndex={setHighlightedIndex}
              key={option.index}
              changeSelection={() => setKinds(option)}
              isSelected={isSelected(option)}
              option={option}
            />
          ))}
        </Combobox>

        <Tags>
          {props.kinds.map((kind: Kind) => (
            !kind.destroy
            && (
              <Item
                handleClick={() => { setKinds(kind) }}
                key={kind.index}
                item={kind}
              />
            )
          ))}
        </Tags>

      </Transition>
    </div>
  );
}
