import React, {
  SetStateAction, Dispatch, useState, useEffect,
} from 'react';
import { XIcon } from '@heroicons/react/solid';

import { Entity } from '../../main';
import { stopPropagation } from '../Utils';

export default function SearchInput(
  {
    searchString, setSearchString, setPage, setEntities, setScrollPosition,
  }: {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
  setEntities: Dispatch<SetStateAction<Entity[] | null>>;
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
},
) {
  const handleChange = (q: string) => {
    setEntities(null);
    setScrollPosition(0);
    setPage(1);
    setSearchString(q);
  };

  return (
    <div className="p-3">
      <div className="relative">
        <input
          value={searchString}
          type="text"
          name="name"
          id="name"
          className="pr-9 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 px-4 rounded-full"
          placeholder="Поиск..."
          onKeyDown={stopPropagation}
          onKeyPress={stopPropagation}
          onKeyUp={stopPropagation}
          onChange={(event) => handleChange(event.target.value)}
        />

        <div className="absolute inset-y-0 right-2 flex py-1.5 pr-0.5">
          <button
            type="button"
            onClick={() => handleChange('')}
            className="inline-flex items-center rounded px-1.5 text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
