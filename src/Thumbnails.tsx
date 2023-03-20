import React, { Dispatch } from 'react';
// import {
//   GridContextProvider,
//   GridDropZone,
//   GridItem,
//   swap,
// } from "react-grid-dnd";
import { Reorder } from 'framer-motion';

import { Entity, EntityAction, Image } from '../main';
import Thumbnail from './Thumbnail';

import { EntityActionType } from './Utils';
import FileInput from './FileInput';

export default function Thumbnails(props: {
  images: Image[],
  entity: Entity,
  dispatch: Dispatch<EntityAction>,
}) {
  const images = props.images.filter((image) => !image.destroy);

  // target id will only be set if dragging from one dropzone to another.
  const reorderImages = (newImages: Image[]) => {
    props.dispatch({
      type: EntityActionType.SET_IMAGES,
      payload: { images: newImages },
    });
  };

  return (
    <Reorder.Group axis="x" values={images} onReorder={reorderImages} className="flex overflow-x-auto">
      {images.map((item) => (
        <Reorder.Item
          key={item.index}
          value={item}
          className="flex justify-center items-center p-0.5"
        >
          <Thumbnail image={item} dispatch={props.dispatch} />
          {/* </div> */}
        </Reorder.Item>
      ))}
      <FileInput entity={props.entity} dispatch={props.dispatch} />
    </Reorder.Group>
  );
}
