import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Upload from './Upload';

const schema = yup.object().shape({
    files: yup.mixed().test('required', 'Please select a file', value => {
        return value && value.length;
    })
})

export default function Form(props: {fragmentUrl: string}) {
    const { 
        register, 
        watch,
        handleSubmit, 
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [image, setImage] = useState('');

    const convert2base64 = (file: any) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result!.toString())
        };

        reader.readAsDataURL(file);
    }

    const onSubmit = (data: any) => {
        if (data.files.length > 0) {
            convert2base64(data.files[0])
        }
    }

    const [entityImage, setEntityImage] = useState('');

    return (
        <>
        { image ? <img src={image} /> : null }
        <form onSubmit={handleSubmit(onSubmit)}>
            { !watch('files') || watch('files').length === 0 ? (
                <div className="p-3">
                    <div className="mt-1">
                        <input
                        type="email"
                        name="email"
                        id="email"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="you@example.com"
                        />
                    </div>

                    {/* <Upload entityImage={entityImage} setEntityImage={setEntityImage}></Upload> */}

                    <div className="mt-3 bg-white rounded-md">
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
                                <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                    <span>Upload a file</span>
                                    <input id="file-upload" {...register('files')} type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                </div> 
            ) : (
                <strong>{watch('files')[0].name}</strong>
            ) }

            <div className="mt-6">
                <button
                    type="submit"
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                >
                Ок
                </button>
                { errors.files && <div>{errors.files.message}</div> }
            </div>

        </form>
        </>
    )
}