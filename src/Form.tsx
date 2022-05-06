import React, { useState }  from "react";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {XIcon as XIconSolid, TrashIcon as TrashIconSolid} from "@heroicons/react/solid";
import {TrashIcon as TrashIconOutline} from "@heroicons/react/outline";


const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    // files: yup.mixed().test('required', 'Please select a file', value => {
    //     return value && value.length;
    // })
})

export default function Form(props: {fragmentUrl: string}) {
    const [isDragging, setIsDragging] = useState(false);

    const {
        register,
        watch,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: any) => {
        console.log(data);
    }

    const preventDefault = (e: any) => { console.log(e); e.preventDefault(); }
    const onDragEnter = (e: any) => { setIsDragging(true); e.preventDefault(); }
    const onDragLeave = (e: any) => { setIsDragging(false); e.preventDefault(); }


    const handlePaste = (e: any) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const index in items) {
            let item = items[index];
            if (item.kind === 'file') {
                uploadFile(item.getAsFile());
            }
        }
    }

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        let data = e.dataTransfer,
            files = data.files;

        if (files.length > 0) {
            Array.from(files).forEach(file => alert(file))
        } else {
            let originalUrl = e.dataTransfer.getData('url');
            let finalUrl = `https://1cf0-78-106-236-170.ngrok.io/AfrOrF3gWeDA6VOlDG4TzxMv39O7MXnF4CXpKUwGqRM/background:FFF/rs:fit:400:400:1/ex:1/el:1/g:sm/plain/${originalUrl}`;

            fetch(finalUrl)
                .then(async (res) => {
                    const blob = await res.blob()
                    const file = new File([blob], "")
                    uploadFile(file);
                }).catch(reason => {
                    alert(reason);
            })
        }
    }

    const uploadFile = (file: any) => {
        // this.imagePreviewTarget.src = URL.createObjectURL(file);

        let container = new DataTransfer();
        container.items.add(file);
        // this.inputFileTarget.files = ;
        setValue('files', container.files)
    }

    const files = watch('files');

    const removeImage = (image: any) => { console.log(image) }
    const draggingClass = isDragging ? 'bg-yellow-50' : 'bg-white'

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-3">

                <div className="mt-0">
                    <input
                        {...register('title')}
                        type="text"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Название"
                    />
                </div>

                { errors.title && <div className="text-red-400 mt-2">{errors.title.message}</div> }


                <div className="mt-3">
                    <textarea
                        rows={4}
                        {...register('description')}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder='Описание'
                    />
                </div>

                { errors.description && <div className="text-red-400 mt-2">{errors.description.message}</div> }


                <div className={"mt-3 rounded-md relative " + draggingClass}>
                    <textarea onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={preventDefault} onDrop={handleDrop} onPaste={handlePaste} className="absolute inset-0 opacity-0" />

                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                                <input id="file-upload" {...register('files')} type="file" className="sr-only" multiple />
                            </label>
                            <span className="pl-1">перетащите или вставьте</span>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF размером до 10Мб</p>
                        </div>
                    </div>
                </div>

                {
                    files?.length > 0 && Array.from(files)?.map((file: any) => {
                        const objectUrl = URL.createObjectURL(file);

                        const imageTag = (
                            <div className="relative">
                                <div className="mt-3 h-20 bg-gray-200 rounded-md overflow-hidden">
                                    <button
                                        onClick={() => removeImage(file)}
                                        type="button"
                                        className="backdrop-saturate-50 drop-shadow absolute top-1 right-1 items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-400/30 hover:bg-red-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300/30"
                                    >
                                        <TrashIconSolid className="h-3 w-3" />
                                    </button>
                                    <img key={file.name} alt="" src={objectUrl} className="w-full h-full object-center object-cover" />
                                </div>
                            </div>
                        );

                        // const imageTag = <img />;
                        // URL.revokeObjectURL(objectUrl);
                        return imageTag;
                    })
                }

                { errors.files && <div className="text-red-400 mt-2">{errors.files.message}</div> }
            </div>

            <div className="mt-3 mx-3">
                <button
                    type="submit"
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                >
                Ок
                </button>
            </div>
        </form>
    )
}