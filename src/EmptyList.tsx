import React from 'react';
import EmptyListItem from './EmptyListItem';

export default function EmptyList() {
  return (
    <ul role="list" className="divide-y divide-gray-200">
      {
                Array.from({ length: 5 }).map((x, id) => <EmptyListItem key={id} />)
            }
    </ul>
  );
}
