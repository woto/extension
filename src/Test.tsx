import React, {useEffect, useState} from "react";
import {TrashIcon as TrashIconSolid} from "@heroicons/react/outline";
import { Transition } from '@headlessui/react'

export default function Test(props: {file: any, removeImage: any}) {
    const objectUrl = URL.createObjectURL(props.file);

    const [showItem, setShowItem] = useState(true)

    // useEffect(() => {
    //     if (!showItem) {
    //
    //     }
    // }, [showItem])

    const hideImage = (event: any) => {
        event.preventDefault();
        setShowItem(false)
    }

    const removeImage = () => {
        props.removeImage(props.file)
    }

    return (
        <Transition
            show={showItem}
            appear={true}
            enter="transition-opacity duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={removeImage}
        >
            <div className="border border-slate-200 relative group transition relative bg-gray-50 flex justify-center items-center">
                <div className="absolute inset-0 duration-300 group-hover:backdrop-brightness-[0.8] group-hover:bg-white/10"></div>
                <img className="object-contain h-20" src={objectUrl} />

                <div className="flex flex-col top-0 right-0 absolute opacity-0 group-hover:opacity-100 transition duration-500">
                    <button onClick={hideImage}
                            className="backdrop-saturate-50 drop-shadow absolute top-1 right-1 items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-400/30 hover:bg-red-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300/30">
                        <TrashIconSolid className="h-4 w-4 text-white" />
                    </button>
                </div>
            </div>
        </Transition>
    );
}

//         <div className="mt-3 h-20 bg-gray-200  overflow-hidden">
//             <img alt="" src={objectUrl} className="w-full h-full" />
// URL.revokeObjectURL(objectUrl);