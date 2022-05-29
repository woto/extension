import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import EmptyList from './EmptyList';
import FullList from './FullList';
import NothingFound from './NothingFound';

function DetermineList(props: { entities: Entity[] | null, onSelectItem: any }) {
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
    isBusy: boolean,
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    fragmentUrl: string,
    searchString: string,
    onSelectItem: any,
    onClick: any,
    entities: any[] | null,
    setEntities: React.Dispatch<React.SetStateAction<any[] | null>>,
    scrollPosition: number,
    setScrollPosition: React.Dispatch<React.SetStateAction<number>>,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>
}) {
  const [isError, setIsError] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollPosition } = props;

  useEffect(() => {
    if (scrollRef.current) {
      if (Math.floor(scrollRef.current.scrollTop) != Math.floor(scrollPosition)) {
        scrollRef.current.scrollTop = scrollPosition;
      }
    }
  }, [scrollPosition]);

  const {
    fragmentUrl, searchString, page, setPage, setEntities,
  } = props;

  const fetchData = useCallback(
    () => {
      props.setIsBusy(true);
      setIsError(false);

      console.log('%cFETCHING!', 'color: Orange');

      const data = {
        fragment_url: fragmentUrl,
        search_string: searchString,
        link_url: 'https://foo.bar',
        page,
      };

      fetch('https://localhost/entities/search', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);

          return res.json();
        })
        .then(
          (result) => {
            props.setIsBusy(false);
            setEntities((prevEntities) => [...(prevEntities || []), ...result]);
            if (result.length > 0) {
              setPage((page) => page + 1);
            }
          },
        ).catch((reason) => {
          props.setIsBusy(false);
          setIsError(true);
          console.error(reason);
        });
    },
    [fragmentUrl, searchString, page, setEntities, setPage],
  );

  useEffect(() => {
    // console.log('requested props.fragmentUrl')
    // console.log(props.fragmentUrl);

    if (page == 1 && !!fragmentUrl) {
      // console.log('fetching from useEffect');
      fetchData();
    }

    return () => {};
    // , props.fragmentUrl, props.page
  }, [fragmentUrl, searchString, fetchData, page]);

  const someFunc = (val: any) => { props.setScrollPosition(val); };

  const asyncFunctionDebounced = AwesomeDebouncePromise(someFunc, 50);

  const handleScroll = (e: any) => {
    if (props.isBusy) return;
    if (page === 1) return;

    asyncFunctionDebounced(e.target.scrollTop);

    if (Math.floor(e.target.scrollHeight - e.target.scrollTop) <= Math.floor(e.target.clientHeight)) {
      // console.log('fetching from handleScroll');
      fetchData();
    }
  };

  return (
    <>
      {/* { console.log('render <List/>') } */}

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
          { props.isBusy && <div className="dot-falling" /> }
        </div>

        <div className="flex justify-center items-center overflow-hidden absolute inset-x-0 h-10 bottom-0">
          { isError && <div className="text-red-400 text-sm font-medium">что-то пошло не так</div> }
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
