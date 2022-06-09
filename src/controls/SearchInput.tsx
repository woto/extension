import React, {
  SetStateAction, Dispatch, useState, useEffect,
} from 'react';
import { SearchIcon } from '@heroicons/react/solid';

import { Entity } from '../../main';

export default function SearchInput(props: {
  searchString: string,
  setSearchString: Dispatch<SetStateAction<string>>,
  setPage: Dispatch<SetStateAction<number>>,
  setEntities: Dispatch<SetStateAction<Entity[] | null>>,
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>,
 }) {
  const { searchString } = props;

  const handleChange = (event: any) => {
    props.setEntities(null);
    props.setScrollPosition(0);
    props.setPage(1);
    props.setSearchString(event.target.value);
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
          onChange={handleChange}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>

      </div>
    </div>
  );
}
