import React, { SetStateAction, Dispatch } from 'react';
import { SearchIcon } from '@heroicons/react/solid';

export default function SearchInput(props: { searchString: string, setSearchString: Dispatch<SetStateAction<string>> }) {
  function handleChange(event: any) {
    props.setSearchString(event.target.value);
  }

  return (
    <div className="m-3 relative">
      <input
        defaultValue={props.searchString}
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
  );
}
