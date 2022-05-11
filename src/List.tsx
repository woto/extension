import React, {useEffect, useRef} from "react";
import EmptyList from "./EmptyList";
import FullList from "./FullList";
import NothingFound from "./NothingFound";

const DetermineList = (props: { entities: any, onSelectItem: any }) => {
    if (props.entities === null) {
        return <Wrapper><EmptyList></EmptyList></Wrapper>
    } else if (props.entities && props.entities.length > 0) {
        return <Wrapper><FullList onSelectItem={props.onSelectItem} entities={props.entities}></FullList></Wrapper>
    } else if (props.entities && props.entities.length === 0) {
        return <NothingFound></NothingFound>
    }

    return <></>
}

const Wrapper = (props: any) => {
    return (
        <div className="bg-white shadow overflow-hidden rounded-md min-h-full">
            {props.children}
        </div>
    )
}
export default function List(props: {
    fragmentUrl: string,
    onSelectItem: any,
    onClick: any,
    entities: any[] | null,
    setEntities: React.Dispatch<React.SetStateAction<any[] | null>>,
    scrollPosition: number,
    setScrollPosition: React.Dispatch<React.SetStateAction<number>>,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = props.scrollPosition;
    })

    useEffect(() => {
        if (props.page == 0) fetchData();
    }, [])

    const fetchData = () => {
        const data = {
            url: props.fragmentUrl,
            page: props.page
        };

        fetch("https://localhost/entities/search", {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    props.setPage((page) => page + 1);
                    props.setEntities((prevEntities) => [...(prevEntities || []), ...result])
                }
            )
    }

    const handleScroll = (e: any) => {
        props.setScrollPosition(e.target.scrollTop);

        // console.log(e.target.scrollHeight - e.target.scrollTop)
        // console.log(e.target.clientHeight);

        if (e.target.scrollHeight - e.target.scrollTop == e.target.clientHeight) {
            fetchData()
        }
    }

    return (
        <>
            <div className="relative">

                {/* <p className="text-white">{decodeURI(fragmentUrl)}</p> */}

                <div onScroll={handleScroll}
                     ref={scrollRef}
                     className="h-[408px] overscroll-contain p-1 overflow-auto scrollbar-w-1 scrollbar-thumb-neutral-400 scrollbar-track-neutral-100">
                    <DetermineList onSelectItem={props.onSelectItem} entities={props.entities}></DetermineList>
                </div>

                <div
                    className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-b from-transparent to-slate-100 pt-6 pb-10 pointer-events-none absolute"></div>
            </div>

            <div className="p-3 rounded-b-lg bg-slate-100 mt-auto">
                <div className="text-center">
                    <a href="#" onClick={props.onClick}
                       className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Добавить новый объект
                    </a>
                </div>
            </div>
        </>
    )
}