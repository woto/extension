import React from 'react';
import FullListItem from './FullListItem';

import { Entity } from '../main';

export default function FullList(props: {
  entities: any[];
  onSelectItem: any;
}) {
  return (
    <ul className="divide-y divide-gray-200">
      {props.entities.map((entity: Entity) => (
        <FullListItem
          key={entity.entity_id}
          onSelectItem={props.onSelectItem}
          entity={entity}
        />
      ))}
    </ul>
  );
}
