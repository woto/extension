import React from 'react';
/* This example requires Tailwind CSS v2.0+ */
import { ChevronRightIcon } from '@heroicons/react/solid';

import { Entity } from '../main';
import { appUrl } from './Utils';

export default function FullListItem(props: {
  entity: Entity;
  onSelectItem: any;
}) {
  const image = props.entity.images[0];

  return (
    <li className="">
      <a
        onClick={(e) => {
          e.preventDefault();
          props.onSelectItem(props.entity);
        }}
        className="block hover:bg-gray-50 cursor-pointer"
      >
        <div className="flex items-center px-4 py-4">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="flex-shrink-0">
              {props.entity.images?.length > 0
                && ((props.entity.images[0].video_url && (
                  <video
                    autoPlay
                    muted
                    loop
                    className={`
                      h-12 w-12 object-contain
                      ${image.dark ? 'bg-slate-800' : 'bg-white'}
                    `}
                    src={props.entity.images[0].video_url}
                  />
                ))
                  || (props.entity.images[0].image_url && (
                    <img
                      alt=""
                      className={`
                      h-12 w-12 object-contain
                      ${image.dark ? 'bg-slate-800' : 'bg-white'}
                    `}
                      src={`${appUrl}/${props.entity.images[0].image_url}`}
                    />
                  )))}
            </div>
            <div className="min-w-0 flex-1 px-4">
              <div>
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {props.entity.title}
                  <span className="ml-2 text-xs text-gray-400">
                    {props.entity.entities_mentions_count}
                  </span>
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  {/* <MailIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                  <span className="truncate">{props.entity.intro}</span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <ChevronRightIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </a>
    </li>
  );
}
