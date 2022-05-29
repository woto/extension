import React from 'react';
/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon, ChevronRightIcon, MailIcon } from '@heroicons/react/solid';
import { Entity } from './Entity';

export default function FullListItem(props: {entity: Entity, onSelectItem: any}) {
  return (
    <li className="undraggable">
      <a
        onClick={(e) => { e.preventDefault(); props.onSelectItem(props.entity); }}
        className="undraggable block hover:bg-gray-50 cursor-pointer"
      >
        <div className="flex items-center px-4 py-4">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="flex-shrink-0">
              {
                props.entity.images?.length > 0
                && props.entity.images[0].url
                && <img className="undraggable h-12 w-12 rounded-full" src={props.entity.images[0].url} alt={props.entity.title} />
              }
            </div>
            <div className="min-w-0 flex-1 px-4">
              <div>
                <p className="text-sm font-medium text-indigo-600 truncate">{props.entity.title}</p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  {/* <MailIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                  <span className="truncate">{props.entity.intro}</span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </a>
    </li>
  );
}
