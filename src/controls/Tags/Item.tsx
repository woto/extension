import React from 'react';

export default function Item(props: {item: Kind, handleClick: any}) {
  return (
    <li onClick={props.handleClick} key={props.item.id} className="inline">
      <a
        href="#"
        className="bg-gray-600 hover:bg-gray-700 text-white focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 relative inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5"
      >

        <div className="text-xs text-white">
          {' '}
          {props.item.label}
          {' '}
        </div>
      </a>
      {' '}
    </li>
  );
}
