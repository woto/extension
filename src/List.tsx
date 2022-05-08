import React, { useEffect, useState } from "react";
import Example2 from './Example2'

export default function List(props: {fragmentUrl: string}) {
    const [entities, setEntities] = useState<any[]>([]);

    useEffect(() => {
        const data = { url: props.fragmentUrl };
    
        fetch("https://4fac-78-106-236-170.ngrok.io/entities/search", {
          method: "POST",
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(
          (result) => {
            setEntities(result)
          }
        )
      }, [props.fragmentUrl])

    return (
        <div className="relative">

        {/* <p className="text-white">{decodeURI(fragmentUrl)}</p> */}

        <div className="overscroll-contain p-1 overflow-auto max-h-96 scrollbar-w-1 scrollbar-thumb-neutral-400 scrollbar-track-neutral-100">

            <Example2></Example2>

            <ul>
            {entities.map(entity => (
            <li key={entity.id}>
                {entity.title}
            </li>
            ))}
            </ul>

        </div>

        <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-b from-transparent to-slate-100 pt-6 pb-10 pointer-events-none absolute"></div>

        </div>
    )
}