import React from 'react';

export default function Options(props: {children: any, isOpen: any, setIsOpen: any}) {
  return (
    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" id="options" role="listbox">
      {props.children}
    </ul>
  );
}

// TODO: React.ReactNode
