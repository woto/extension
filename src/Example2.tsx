import React from 'react';
/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon, ChevronRightIcon, MailIcon } from '@heroicons/react/solid'

const entities = [
  {
    id: 1,
    title: 'Ricardo Cooper',
    description: 'ricardo.cooper@example.com',
    images: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    ],
    created_at: '2020-01-07',
    href: '#'
  }
]

export default function Example2() {
  return (
    <div className="bg-white shadow overflow-hidden rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {entities.map((entity) => (
          <li key={entity.id}>
            <a href={entity.href} className="block hover:bg-gray-50">
              <div className="flex items-center px-4 py-4">
                <div className="min-w-0 flex-1 flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12 rounded-full" src={entity.images[0]} alt="" />
                  </div>
                  <div className="min-w-0 flex-1 px-4">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">{entity.title}</p>
                      <p className="mt-2 flex items-center text-sm text-gray-500">
                        <MailIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="truncate">{entity.description}</span>
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
        ))}
      </ul>
    </div>
  )
}
