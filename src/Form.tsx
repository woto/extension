import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowCircleLeftIcon as ArrowCircleLeftIconSolid } from '@heroicons/react/solid';
import Thumbnail from './Thumbnail';
import { Image } from './Image';
import { Entity } from './Entity'

declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

const schema = yup.object().shape({
  title: yup.string().required('должно быть заполнено').max(150, 'должно быть короче 150 символов'),
  intro: yup.string().required('должно быть заполнено').max(250, 'должно быть короче 250 символов'),
  // files: yup.mixed().test('required', 'изображение не загружено', value => {
  //   return value && value.length;
  // })
});

export default function Form(props: { fragmentUrl: string, linkUrl: string, entity: Entity, onClick: any, setShowWindow: any }) {
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [filesError, setFilesError] = useState<string>('');

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: props.entity.title,
      intro: props.entity.intro,
      // files: props.entity.images
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setImages(props.entity.images)
  }, [])

  const intro = watch('intro');

  const onSubmit = (data: any) => {
    console.log(data);
    let formData = new FormData();
    formData.append('cite[fragment_url]', props.fragmentUrl)
    formData.append('cite[link_url]', props.linkUrl)
    formData.append('entity[entity_id]', props.entity.entity_id)
    formData.append('entity[title]', data.title)
    formData.append('entity[intro]', data.intro)
    for (const image of images) {
      if (image.file) {
        formData.append(`entity[images_attributes][${image.id}][image]`, image.file)
      } else {
        formData.append(`entity[images_attributes][${image.id}][id]`, image.id.toString())
        formData.append(`entity[images_attributes][${image.id}][_destroy]`, image.destroy ? "1" : "0")
      }
    }

    // Object.keys(data).forEach((key) => {
    //   formData.append(key, data[key])
    // })

    fetch(`https://localhost/entities/modify`, {
      method: 'POST',
      body: formData,
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // }
    }).then(res => {
      props.setShowWindow(false);
      console.log(res)
  })};

  const removeImage = (image: any) => {
    setImages((prevState: any) => {
      console.log('prevState');
      console.log(prevState);
      let newState;
      // debugger
      if (image.url) {
        newState = prevState.map((val: Image) => {
          if (val == image) {
            return {...val, ...{destroy: true}}
          } else {
            return val
          }})
      } else {
        newState = prevState.filter((val: Image) => val !== image);
      }
      // setValue('files', newState);
      console.log('newState');
      console.log(newState);
      return newState;
    });
  };

  const preventDefault = (e: any) => {
    e.preventDefault();
  };
  const onDragEnter = (e: any) => {
    setIsDragging(true);
    e.preventDefault();
  };
  const onDragLeave = (e: any) => {
    setIsDragging(false);
    e.preventDefault();
  };

  const handlePaste = (e: any) => {
    let errorMessage = 'изображение не найдено';

    const { items } = e.clipboardData || e.originalEvent.clipboardData;
    for (const index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        console.log(item);
        uploadFile(item.getAsFile());
        errorMessage = '';
      }
    }

    if (errorMessage !== '') setFilesError(errorMessage);
  };

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const handleDrop = (e: any) => {
    // debugger
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const data = e.dataTransfer;
    const { files } = data;

    if (files.length > 0) {
      Array.from(files).forEach((file) => uploadFile(file));
    } else {
      const domParser = new DOMParser();
      const fragment = domParser.parseFromString(e.dataTransfer.getData('text/html'), 'text/html');
      const img = fragment.querySelector('img');
      // console.log(img!.src);

      if (img) {
        const finalUrl = `https://0e7b-78-106-236-170.ngrok.io/AfrOrF3gWeDA6VOlDG4TzxMv39O7MXnF4CXpKUwGqRM/background:FFF/rs:fit:400:400:1/ex:1/el:1/g:sm/plain/${img.src}`;

        fetch(finalUrl)
          .then(async (res) => {
            if (!res.ok) throw new Error(res.statusText);

            const blob = await res.blob();
            const file = new File([blob], new Date().toISOString());
            uploadFile(file);
          }).catch((reason) => {
            alert(reason);
          });
      } else {
        setFilesError('изображение не найдено');
      }
    }
  };

  const appendToAllFiles = (e: any) => {
    Array.from(e.target.files).forEach((file) => uploadFile(file));
    cleanUploader(e);
  };

  const uploadFile = (file: any) => {
    setImages((prevState: Image[]) => {
      console.log('prevState');
      console.log(prevState);
      // const newState = [...new Map([...prevState, file].map((file) => [file.name, file])).values()];
      // Array.from(newState)
      const newState = [...prevState, {
        id: crypto.randomUUID(),
        file: file,
        url: null,
        destroy: false
      }]
      console.log('newState');
      console.log(newState);
      // setValue('files', newState);
      return newState;
    });
    // console.log(files);
    // console.log();
  };

  const cleanUploader = (e: any) => {
    // clean up
    const container = new DataTransfer();
    e.target.files = container.files;
  };

  // useEffect(() => {
  //     register('files', { required: true }) // still have validation for required
  // }, [register])

  const draggingClass = isDragging ? 'bg-yellow-50' : 'bg-white';

  return (
    <>
      { console.log('render <Form/>') }

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-3">

          <button
            onClick={props.onClick}
            type="button"
            className="mb-3 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowCircleLeftIconSolid className="mr-2 -ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Назад
          </button>

          <div className="mt-0">
            <input
              value={props.fragmentUrl}
              disabled
              type="text"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-3">
            <input
              value={props.linkUrl}
              disabled
              type="text"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-3">
            <input
              value={props.entity.entity_id}
              disabled
              type="text"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-3">
            <input
              onKeyDown={stopPropagation}
              {...register('title')}
              type="text"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md"
              placeholder="Название"
            />
          </div>

          {/*<input className="hidden" {...register('files')} />*/}

          {errors.title && <div className="text-red-400 mt-2 text-sm">{errors.title.message}</div>}

          <div className="mt-3 relative">
            <textarea
              onKeyDown={stopPropagation}
              rows={2}
              {...register('intro')}
              className="hide-resize pb-7 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md"
              placeholder="Описание"
            />

            <div className="absolute bottom-1 right-3 p-1 text-sm text-slate-400 bg-white/90 rounded">
              {intro?.length || 0}
              {' '}
              / 250
            </div>
          </div>

          {errors.intro && <div className="text-red-400 mt-2 text-sm">{errors.intro.message}</div>}

          <div className={`mt-3 rounded-md relative transition-colors ${draggingClass}`}>
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
              className="shadow-sm peer-focus:ring-indigo-500 peer-focus:border-indigo-500 sm:text-sm max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md block w-full"
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
                      onChange={appendToAllFiles}
                      type="file"
                      className="sr-only"
                      multiple
                    />
                  </label>
                  <span className="pl-1">перетащите или вставьте</span>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF размером до 10Мб</p>
              </div>
            </div>
          </div>

          {/*{errors.files && <div className="text-red-400 mt-2 text-sm">{errors.files.message}</div>}*/}

          {filesError && <div className="text-red-400 mt-2 text-sm">{filesError}</div>}

          <div className="mt-3 grid grid-cols-3 gap-3">
            { images.map((image) => <Thumbnail key={image.id} image={image} removeImage={removeImage} />) }
          </div>

          <button
            type="submit"
            className="mt-3 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          >
            Ок
          </button>
        </div>
      </form>
    </>
  );
}
