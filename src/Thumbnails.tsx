import React, { Dispatch, useEffect } from 'react';
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

function Thumbnails(props: {
  images: Image[],
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
    <div className="relative mt-3">
      <Reorder.Group
        axis="x"
        values={images}
        onReorder={reorderImages}
        className="flex overflow-x-scroll pb-3"
      >
        {images.map((item) => (
          <Reorder.Item
            key={item.index}
            value={item}
            className="flex justify-center items-center px-0.5"
          >
            <Thumbnail image={item} dispatch={props.dispatch} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

export default React.memo(Thumbnails);
