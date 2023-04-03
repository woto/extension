import React from 'react';

import { Kind } from '../../../main';

export default function Item(props: { item: Kind; handleClick: any }) {
  return (
    <li onClick={props.handleClick} key={props.item.id} className="inline">
      <a
        // href="#"
        className="bg-white cursor-pointer hover:bg-gray-50 relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
      >
        <div className="text-xs font-medium text-gray-900">
          {props.item.title}
        </div>
      </a>
      {' '}
    </li>
  );
}
