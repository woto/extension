import React, { ReactNode, useRef, useState } from 'react';

/* This example requires Tailwind CSS v2.0+ */
import { ChevronRightIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/solid';
import { Disclosure, Popover, Transition } from '@headlessui/react';
import {
  useFloating,
  useHover,
  useInteractions,
  offset,
  autoUpdate,
  FloatingArrow,
  arrow,
} from '@floating-ui/react';

import { ExclamationCircleIcon, MailIcon } from '@heroicons/react/outline';
import ReactDOM from 'react-dom';
import { Entity } from '../main';
import { appUrl } from './Utils';
import WidgetPortal from './WidgetPortal'

export default function FullListItem(props: {
  entity: Entity;
  onSelectItem: any;
}) {
  const image = props.entity.images[0];
  const [entityCollapsed, setEntityCollapsed] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const {
    x, y, strategy, refs, context,
  } = useFloating({
    placement: 'right',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(10),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const hover = useHover(context, {
    delay: {
      open: 200,
      close: 0,
    },
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <li className="">
      <a
        onClick={(e) => {
          e.preventDefault();
          props.onSelectItem(props.entity);
        }}
        className="block hover:bg-gray-50 cursor-pointer"
      >
        <div className="flex items-center px-4 py-4 group relative">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="flex-shrink-0 border-r pr-4">
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
                      h-12 w-12 object-contain rounded-sm p-px
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
                  <span className="truncate">{props.entity.intro}</span>
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="group-hover:relative absolute"
            onClick={
              (e) => {
                e.stopPropagation();
                setEntityCollapsed(false);
              }
            }
          >

            <div className="opacity-0 group-hover:opacity-100 delay-150" ref={refs.setReference} {...getReferenceProps()}>
              <div className="hidden group-hover:block">
                <div className="bg-slate-100 hover:bg-slate-200 hover:scale-105 transition-all origin-center p-2 rounded-full">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {isOpen && (
            <WidgetPortal>
              <div
                className="bg-gray-800 text-gray-50 rounded p-2 border-blue-500 w-96 max-w-xs"
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                }}
                {...getFloatingProps()}
              >
                <FloatingArrow ref={arrowRef} context={context} />
                <p className="mb-1">
                  <span className="text-yellow-50 text-base">
                    {props.entity.title}
                  </span>
                  {' '}
                  <span className="text-sm">
                    {props.entity.intro}
                  </span>
                </p>
                <p className="text-xs">
                  {props.entity.lookups.map((obj, i) => [
                    obj.title,
                    i === 0 && props.entity.lookups.length > 1 && ', ',
                  ])}
                </p>
                <p className="text-xs">
                  {props.entity.kinds.map((obj, i) => [
                    obj.title,
                    i === 0 && props.entity.kinds.length > 1 && ', ',
                  ])}
                </p>
                {/* { JSON.stringify(props.entity) } */}
              </div>
            </WidgetPortal>
            )}

          </button>
        </div>
      </a>
    </li>
  );
}
