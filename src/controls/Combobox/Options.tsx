import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { preventDefault } from '../../Utils';

export default function Options(props: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Transition
      as={Fragment}
      show={props.isOpen}
      enter="transition ease-in"
      enterFrom="opacity-0 -translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 -translate-y-1"
    >
      <ul
        onMouseDown={preventDefault}
        className="absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
      >
        {props.children}
      </ul>
    </Transition>
  );
}
