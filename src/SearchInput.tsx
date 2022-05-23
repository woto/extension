import React, {SetStateAction, Dispatch} from 'react';

export default function SearchInput(props: { searchString: string, setSearchString: Dispatch<SetStateAction<string>> }) {
  function handleChange(event: any) {
    props.setSearchString(event.target.value);
  }

  return (
    <div className="m-3">
      <input
        defaultValue={props.searchString}
        type="text"
        name="name"
        id="name"
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 px-4 rounded-full"
        placeholder="Поиск..."
        onChange={handleChange}
      />
    </div>
  )
}
