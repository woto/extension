import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import EmptyList from './EmptyList';
import FullList from './FullList';
import NothingFound from './NothingFound';

import AwesomeDebouncePromise from 'awesome-debounce-promise';

function DetermineList(props: { entities: any, onSelectItem: any }) {
  if (props.entities === null) {
    return <Wrapper><EmptyList /></Wrapper>;
  } if (props.entities && props.entities.length > 0) {
    return <Wrapper><FullList onSelectItem={props.onSelectItem} entities={props.entities} /></Wrapper>;
  } if (props.entities && props.entities.length === 0) {
    return <NothingFound />;
  }

  return <></>;
}

function Wrapper(props: any) {
  return (
    <div className="bg-white shadow overflow-hidden rounded-md min-h-full">
      {props.children}
    </div>
  );
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
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollPosition } = props;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollPosition;
  }, [scrollPosition]);

  const {
    fragmentUrl, page, setPage, setEntities,
  } = props;

  const fetchData = useCallback(
    () => {
      setIsFetching(true);
      setIsError(false);

      console.log('%cFETCHING!', 'color: Orange');

      const data = {
        url: fragmentUrl,
        page,
      };

      fetch('https://localhost/entities/search', {
        method: 'POST',
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setIsFetching(false);
            setPage((page) => page + 1);
            setEntities((prevEntities) => [...(prevEntities || []), ...result]);
          },
        ).catch((reason) => {
          setIsFetching(false);
          setIsError(true);
          console.error(reason);
        });
    },
    [fragmentUrl, page, setEntities, setPage],
  );

  useEffect(() => {
    // console.log('requested props.fragmentUrl')
    // console.log(props.fragmentUrl);

    if (page == 0 && !!fragmentUrl) {
      console.log('fetching from useEffect');
      fetchData();
    }

    return () => {};
    // , props.fragmentUrl, props.page
  }, [fragmentUrl, fetchData, page]);


  const someFunc = (val: any) => {props.setScrollPosition(val)}

  const asyncFunctionDebounced = AwesomeDebouncePromise(someFunc, 50)

  const handleScroll = (e: any) => {
    if (isFetching) return;
    if (page === 0) return;

    asyncFunctionDebounced(e.target.scrollTop);

    if (Math.floor(e.target.scrollHeight - e.target.scrollTop) <= Math.floor(e.target.clientHeight)) {
      console.log('fetching from handleScroll');
      fetchData();
    }
  };

  return (
    <>
      { console.log('rendered') }
      <div className="relative">

        {/* <p className="text-white">{decodeURI(fragmentUrl)}</p> */}

        <div
          onScroll={handleScroll}
          ref={scrollRef}
          className="h-[408px] overscroll-contain p-1 overflow-auto"
        >
          <DetermineList onSelectItem={props.onSelectItem} entities={props.entities} />
        </div>

        <div
          className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-b from-transparent to-slate-100 pt-6 pb-10 pointer-events-none absolute"
        />

        <div className="flex justify-center items-center overflow-hidden absolute inset-x-0 h-10 bottom-0">
          { isFetching && <div className="dot-falling" /> }
        </div>

        <div className="flex justify-center items-center overflow-hidden absolute inset-x-0 h-10 bottom-0">
          { isError && <div className="text-red-400 text-sm">что-то пошло не так</div> }
        </div>

      </div>

      <div className="p-3 rounded-b-lg bg-slate-100 mt-auto">
        <div className="text-center">
          <a
            href="#"
            onClick={props.onClick}
            className="undraggable text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Добавить новый объект
          </a>
        </div>
      </div>
    </>
  );
}
