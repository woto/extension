import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/outline';
import { Transition } from '@headlessui/react';
import { Image } from '../main';

export default function Thumbnail(props: {image: Image, removeImage: any}) {
  const objectUrl = props.image.url || URL.createObjectURL(props.image.file);

  const [showItem, setShowItem] = useState(true);

  const hideImage = (event: any) => {
    event.preventDefault();
    setShowItem(false);
  };

  const removeImage = () => {
    props.removeImage(props.image);
  };

  return (
    <Transition
      show={showItem}
      appear
      enter="transition-opacity"
      enterFrom="opacity-0"
      enterTo="opacity-80"
      leave="transition-opacity"
      leaveFrom="opacity-80"
      leaveTo="opacity-0"
      afterLeave={removeImage}
    >
      <div className="border border-slate-200 group transition relative bg-gray-50 flex justify-center items-center">
        <div className="absolute inset-0 group-hover:backdrop-brightness-[0.8] group-hover:bg-white/10" />
        <img className="object-contain h-20" src={objectUrl} alt="" />

        <div className="flex flex-col top-0 right-0 absolute opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={hideImage}
            className="backdrop-saturate-50 drop-shadow absolute top-1 right-1 items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-400/30 hover:bg-red-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300/30"
          >
            <TrashIcon className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </Transition>
  );
}

//         <div className="mt-3 h-20 bg-gray-200  overflow-hidden">
//             <img alt="" src={objectUrl} className="w-full h-full" />
// URL.revokeObjectURL(objectUrl);
