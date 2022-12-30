import React, { Dispatch } from "react";
// import {
//   GridContextProvider,
//   GridDropZone,
//   GridItem,
//   swap,
// } from "react-grid-dnd";
import { EntityAction, Image } from "../main";
import Thumbnail from "./Thumbnail";

import { EntityActionType } from "./Utils";

export default function Thumbnails(props: {
  images: Image[];
  dispatch: Dispatch<EntityAction>;
}) {
  const images = props.images.filter((image) => !image.destroy);

  // target id will only be set if dragging from one dropzone to another.
  // function onChange(
  //   sourceId: string,
  //   sourceIndex: number,
  //   targetIndex: number,
  //   targetId?: string | undefined
  // ) {
  //   const realSourceIndex = props.images.findIndex(
  //     (el) => el.index === images[sourceIndex].index
  //   );
  //   const realTargetIndex = props.images.findIndex(
  //     (el) => el.index === images[targetIndex].index
  //   );
  //   const newImages = swap(props.images, realSourceIndex, realTargetIndex);
  //   props.dispatch({
  //     type: EntityActionType.SET_IMAGES,
  //     payload: { images: newImages },
  //   });
  // }

  return (
    // <GridContextProvider onChange={onChange}>
      // <GridDropZone
      //   className="-mx-0.5 -my-1 mt-2"
      //   id="items"
      //   boxesPerRow={3}
      //   rowHeight={100}
      //   style={{ height: `${Math.ceil(images.length / 3) * 100}px` }}
      // >
        <>
        {images.map((item) => (
          // <GridItem
          <div
            key={item.index}
            className="flex justify-center items-center p-0.5"
          >
            <Thumbnail image={item} dispatch={props.dispatch} />
          </div>
          // </GridItem>
        ))}
        </>
    //   </GridDropZone>
    // </GridContextProvider>
  );
}
