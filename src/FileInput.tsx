import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Image, Entity, EntityAction } from '../main'
import { appUrl, EntityActionType, GlobalContext, newImage, preventDefault } from './Utils';

export default function FileInput(props: {
  entity: Entity,
  dispatch: Dispatch<EntityAction>
}) {

  const globalContext = useContext(GlobalContext);

  const [filesError, setFilesError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const onDragEnter = (e: any) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const onDragLeave = (e: any) => {
    setIsDragging(false);
    e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // let errorMessage = 'изображение не найдено';

    const clipboardData = e.clipboardData;
    const text = clipboardData.getData('text')
    const files = clipboardData.files;

    console.log(files);
    console.log(text);

    Array.from(files).forEach((file) => uploadFile({ file: file }));
    if (text) { uploadFile({ image_src: text }) }
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const data = e.dataTransfer;
    const { files } = data;

    if (files.length > 0) {
      Array.from(files).forEach((file) => uploadFile({ file: file }));
    } else {
      const domParser = new DOMParser();
      const fragment = domParser.parseFromString(data.getData('text/html'), 'text/html');

      let image_src = fragment.querySelector('img')?.src;
      let video_src = fragment.querySelector('video')?.src || fragment.querySelector('source')?.src;

      if (image_src || video_src) {
        uploadFile({ image_src: image_src, video_src: video_src })
        // // const finalUrl = `${imgproxyUrl}/AfrOrF3gWeDA6VOlDG4TzxMv39O7MXnF4CXpKUwGqRM/background:FFF/rs:fit:400:400:1/ex:0/el:0/g:sm/plain/${encodeURIComponent(img.src)}@png`;
        // // const finalUrl = `${imgproxyUrl}/AfrOrF3gWeDA6VOlDG4TzxMv39O7MXnF4CXpKUwGqRM/plain/${encodeURIComponent(img.src)}`;
        // const finalUrl = `${imgproxyUrl}/AfrOrF3gWeDA6VOlDG4TzxMv39O7MXnF4CXpKUwGqRM/background:FFF/rs:fit:400:400:1/ex:0/el:0/g:sm/plain/${encodeURIComponent(img.src)}`;

        // fetch(finalUrl, {
        //   credentials: 'omit',
        // })
        //   .then(async (res) => {
        //     if (!res.ok) throw new Error(res.statusText);

        //     const blob = await res.blob();
        //     const file = new File([blob], new Date().toISOString());
        //     uploadFile({ file: file });
        //   }).catch((reason) => {
        //     alert(reason);
        //   });
      } else {
        setFilesError('изображение не найдено');
      }
    }
  };

  const uploadFile = async (params: { file?: File, image_src?: string, video_src?: string }) => {

    const upload = (image: Image) => {
      if (image.json) {
        return image
      }

      const formData = new FormData();

      if (image.file) {
        formData.append('file', image.file);
      }

      if (image.image_src) {
        formData.append('src', image.image_src);
      }

      if (image.video_src) {
        formData.append('src', image.video_src);
      }

      return fetch(`${appUrl}/api/uploads`, {
        credentials: 'omit',
        method: 'POST',
        body: formData,
        headers: {
          // 'Content-Type': 'multipart/form-data',
          // 'Accept': 'application/json',
          'Api-Key': globalContext.apiKey,
        },
      }).then((res) => {

        if (res.status === 401) {
          chrome.runtime.sendMessage({ message: 'request-auth' });
        }

        if (!res.ok) throw new Error(res.statusText);

        return res.json();
      });
    };

    const image = newImage({ file: params.file, image_src: params.image_src, video_src: params.video_src });
    props.dispatch({ type: EntityActionType.APPEND_IMAGE, payload: { image: image } })


    const file = await upload(image!);

    const result: Image = {
      index: image.index,
      id: image.id,
      json: file.data,
      image_url: file.image_url,
      video_url: file.video_url,
      image_src: image.image_src,
      video_src: image.video_src,
      file: image.file,
      dark: false,
      destroy: image.destroy,
    }

    props.dispatch({ type: EntityActionType.REPLACE_IMAGE, payload: { oldImage: image, newImage: result } })
  };


  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => uploadFile({ file: file }));
      cleanInputFile(e);
    }
  };

  const cleanInputFile = (e: any) => {
    const container = new DataTransfer();
    e.target.files = container.files;
  };

  const draggingClass = isDragging ? 'bg-yellow-50' : 'bg-white';

  return (

    <div className={`relative mt-3 rounded-md transition-colors ${draggingClass}`}>
      <textarea
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={preventDefault}
        onDrop={handleDrop}
        onPaste={handlePaste}
        className="cursor-default peer absolute inset-3 opacity-0"
        tabIndex={-1}
      />

      <div
        className="shadow-sm peer-focus:ring-indigo-500 peer-focus:border-indigo-500 text-sm max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md block w-full"
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="inline-block text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Загрузите</span>
              <input
                id="file-upload"
                onChange={handleInputFile}
                type="file"
                className="sr-only"
                multiple
              />
            </label>
            <span className="pl-1">перетащите или вставьте</span>
          </div>
          <p className="text-xs text-gray-500">картинку или видео размером до 10Мб</p>
        </div>
      </div>
    </div>
  )
}
