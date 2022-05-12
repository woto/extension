import React, { useEffect, useRef } from 'react';
import FullListItem from './FullListItem';

export default function FullList(props: {entities: any[], onSelectItem: any}) {
  return (
    <ul className="divide-y divide-gray-200">
      { props.entities.map((entity: any) => <FullListItem onSelectItem={props.onSelectItem} key={entity.id} entity={entity} />) }
    </ul>
  );
}
