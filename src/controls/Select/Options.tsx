import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";

export default function Options(props: {
  children: any;
  isOpen: any;
  setIsOpen: any;
}) {
  const hideList = () => {
    props.setIsOpen(false);
  };

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
        onClick={hideList}
        className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        tabIndex={-1}
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
      >
        {props.children}
      </ul>
    </Transition>
  );
}
