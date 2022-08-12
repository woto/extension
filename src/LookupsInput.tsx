import { Transition } from '@headlessui/react';
import React, { ChangeEvent, Dispatch, Fragment, useCallback, useEffect, useState } from 'react';
import { PlusIcon, MinusIcon, XIcon, CheckCircleIcon } from '@heroicons/react/solid';
import { EntityAction, Lookup } from '../main';
import { EntityActionType, newLookup } from './Utils';
import Alert from './Alert';

function AddButton(props: {
  onClick: any
}) {
  return (
    <button
      onClick={props.onClick}
      type="button"
      className="-ml-px relative inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <PlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
    </button>
  );
}

function RemoveButton(props: {
  onClick: any
}) {
  return (
    <button
      onClick={props.onClick}
      type="button"
      className="-ml-px relative inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <MinusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
    </button>
  );
}

function Input(props: {
  lookup: Lookup,
  isFirst: boolean,
  isLast: boolean,
  appendLookup: () => void
  removeLookup: (lookup: Lookup) => void
  handleChange: (lookup: Lookup, newTitle: string) => void
}) {
  const [showItem, setShowItem] = useState(false);

  useEffect(() => {
    setShowItem(true);
  }, []);

  const stopPropagation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleChange = ((event: ChangeEvent<HTMLInputElement>) => {
    props.handleChange(props.lookup, event.target.value);
  });

  const hideItem = (event: any) => {
    event.preventDefault();
    setShowItem(false);
  };

  const removeItem = () => {
    props.removeLookup(props.lookup);
  };

  return (
    <Transition
      show={showItem}
      appear
      enter="transition-all duration-300"
      enterFrom="max-h-0 opacity-0"
      enterTo="max-h-[500px] opacity-100"
      leave="transition-all duration-300"
      leaveFrom="max-h-[500px] opacity-100"
      leaveTo="max-h-0 opacity-0"
      afterLeave={removeItem}
    >
      <div className="flex rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <input
            onKeyDown={stopPropagation}
            onKeyPress={stopPropagation}
            onKeyUp={stopPropagation}
            defaultValue={props.lookup.title}
            onChange={handleChange}
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
            placeholder="Синоним"
          />
        </div>

        {props.isLast
          ? <AddButton onClick={props.appendLookup} />
          : <RemoveButton onClick={hideItem} />}

      </div>

      {!props.isLast &&
        <div className="mb-3"></div>}

    </Transition>
  );
}

export default function LookupsInput(props: {
  toggleVisibility: any,
  priority: number,
  show: boolean,
  lookups: Lookup[],
  dispatch: Dispatch<EntityAction>,
}) {

  const handleAppend = useCallback(() => {
    props.dispatch({ type: EntityActionType.APPEND_LOOKUP, payload: {lookup: newLookup()} })
  }, []);

  const handleRemove = useCallback((lookup: Lookup) => {
    props.dispatch({ type: EntityActionType.REMOVE_LOOKUP, payload: {lookup: lookup} })
  }, []);

  const handleChange = useCallback((lookup: Lookup, newTitle: string) => {
    props.dispatch({ type: EntityActionType.SET_LOOKUP_TITLE, payload: { lookup: lookup, newTitle: newTitle } })
  }, []);

  const visibleLookups = props.lookups.filter((item) => !item.destroy)

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
          toggleVisibility={(e: any) => props.toggleVisibility(e, 'lookups')}
          title={"Синонимы"}
          text={"Например добавляя упоминание Evernote, можно добавить синонимы Эверноут и Эвернот."} />

        <div className="flex flex-col">
          {visibleLookups && visibleLookups.length > 0 && visibleLookups.map((lookup, index) => (
            <Input
              key={lookup.index}
              appendLookup={handleAppend}
              removeLookup={handleRemove}
              handleChange={handleChange}
              lookup={lookup}
              isFirst={index === 0}
              isLast={index === visibleLookups.length - 1}
            />
          )
          )}
        </div>
      </Transition>
    </div>
  );
}
