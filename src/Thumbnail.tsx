import React, {
  Dispatch,
  Fragment,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { TrashIcon, MoonIcon, SunIcon } from '@heroicons/react/outline';
import { Transition } from '@headlessui/react';
import { EntityAction, Image } from '../main';
import { appUrl, EntityActionType } from './Utils';

function Thumbnail(props: { image: Image; dispatch: Dispatch<EntityAction> }) {
  const [showImage, setShowImage] = useState(true);
  const { image } = props;

  // URL.revokeObjectURL(objectUrl);

  const objectUrl = useMemo(() => {
    if (image.destroy) return;

    if (image.video_url) {
      return { video_url: image.video_url };
    }

    if (image.image_url) {
      return { image_url: image.image_url };
    }

    if (image.file instanceof File) {
      try {
        const image_types = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/vnd.microsoft.icon',
          'image/svg+xml',
        ];
        const video_types = [
          'video/mp4',
          'video/webm',
          'application/mp4',
          'video/mp4',
          'video/quicktime',
          'video/avi',
          'video/mpeg',
          'video/x-mpeg',
          'video/x-msvideo',
          'video/m4v',
          'video/x-m4v',
          'video/vnd.objectvideo',
        ];

        const object_url = URL.createObjectURL(image.file);
        if (image_types.includes(image.file.type)) {
          return { image_url: object_url };
        }
        return { video_url: object_url };
      } catch (error) {
        console.warn(error);
      }
    }
  }, [image]);

  const removeImage = () => {
    props.dispatch({ type: EntityActionType.REMOVE_IMAGE, payload: { image } });
  };

  const toggleBackground = () => {
    props.dispatch({
      type: EntityActionType.TOGGLE_IMAGE_BACKGROUND,
      payload: { image },
    });
  };

  const hideImage = () => {
    setShowImage(false);
  };

  const displaySpinner = !image.id && !image.json;

  return (
    <Transition
      show={showImage}
      appear
      as={Fragment}
      enter="duration-300 transition-all"
      enterFrom="opacity-0 scale-75"
      enterTo="opacity-100 sclale-100"
      leave="duration-300 transition-all"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-75"
      afterLeave={removeImage}
    >
      <div
        className={`
        rounded border p-0.5 h-full w-full group transition relative flex justify-center items-center
        ${
          image.dark
            ? 'bg-slate-800 border-black'
            : 'bg-slate-50 border-slate-200'
        }
      `}
      >
        <div className="rounded absolute inset-0 group-hover:backdrop-brightness-[0.7] duration-150" />
        {objectUrl?.image_url && (
          <img
            alt=""
            className="object-scale-down h-full p-0.5"
            src={`${appUrl}/${objectUrl.image_url}`}
          />
        )}

        {objectUrl?.video_url && (
          <video
            autoPlay
            muted
            loop
            className=""
            src={`${appUrl}/${objectUrl.video_url}`}
          />
        )}

        <Transition
          show={displaySpinner}
          leave="transition duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="rounded absolute inset-0">
            <div className="absolute inset-0 bg-slate-500/90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="dot-flashing" />
            </div>
          </div>
        </Transition>

        <div className="rounded flex flex-col top-0 right-0 absolute opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={hideImage}
            className="shadow-sm absolute top-1 right-1 items-center p-1 border border-transparent rounded-full
            text-white hover:bg-red-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300/30"
          >
            <TrashIcon className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="rounded flex flex-col top-0 left-0 absolute opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={toggleBackground}
            className="shadow-sm absolute top-1 left-1 items-center p-1 border border-transparent rounded-full
            text-white hover:bg-blue-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300/30"
          >
            {image.dark ? (
              <SunIcon className="h-4 w-4 text-white" />
            ) : (
              <MoonIcon className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </Transition>
  );
}

export default React.memo(Thumbnail);
