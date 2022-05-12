import React from 'react';

export default function NothingFound() {
  return (
    <div className="h-full flex justify-center items-center">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12 text-gray-400"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#2c3e50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="12" cy="12" r="9" />
          <line x1="9" y1="10" x2="9.01" y2="10" />
          <line x1="15" y1="10" x2="15.01" y2="10" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
        <span className="mt-2 block text-sm font-medium text-gray-900">Ничего не найдено</span>
      </div>
    </div>
  );
}
