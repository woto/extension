import React from 'react';

/* This example requires Tailwind CSS v2.0+ */
import { InformationCircleIcon, XIcon } from '@heroicons/react/solid';

export default function Alert(props: {
  title: string;
  text: string;
  toggleVisibility: any;
}) {
  return (
    <div className="rounded-lg bg-blue-100 p-3 mb-3 border-blue-200 border">
      <div className="flex mb-3">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-4 w-4 text-blue-600"
            aria-hidden="true"
          />
        </div>
        <div className="ml-2 flex-1 flex justify-between">
          <p className="text-xs font-medium text-blue-600">{props.title}</p>

          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={(e) => props.toggleVisibility(e)}
                type="button"
                className="inline-flex rounded-md p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-400 focus:ring-transparent"
              >
                <span className="sr-only">Закрыть</span>
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-blue-700 break-all">{props.text}</div>
    </div>
  );
}
