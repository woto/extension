import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { abort } from 'process';
import EmptyList from './EmptyList';
import FullList from './FullList';
import NothingFound from './NothingFound';

import { appUrl } from './Utils';

import { Entity, Image } from '../main';

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
    apiKey: string,
    isBusy: boolean,
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    fragmentUrl: string,
    searchString: string,
    linkUrl: string,
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
      const diff = Math.abs(scrollRef.current.scrollTop - scrollPosition);
      if (diff > 1) {
        scrollRef.current.scrollTop = scrollPosition;
      }
    }
  }, [scrollPosition]);

  const {
    fragmentUrl, searchString, page, linkUrl, setPage, setEntities,
  } = props;

  const abortController = useRef<AbortController>();

  const fetchData = useCallback(() => {
      props.setIsBusy(true);
      setIsError(false);

      console.log('%cFETCHING!', 'color: Orange');

      const data = {
        fragment_url: fragmentUrl,
        search_string: searchString,
        link_url: linkUrl,
        page,
      };

      const params: RequestInit = {
        credentials: 'omit',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Api-Key': props.apiKey
        },
      };

      if (abortController.current) {
        params.signal = abortController.current.signal;
      } else {
        console.error('some error')
      }

      fetch(`${appUrl}/api/mentions/seek`, params)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);

          return res.json();
        })
        .then((res: Entity[]) => {
          res.forEach((entity: Entity) => {
            entity.images.forEach((image: Image) => {
              image.index = image.id!.toString();
              image.id = image.id;
              image.destroy = false;
              image.url = `${appUrl}${image.url}`;
            });
          });

          return res;
        })
        .then((res: Entity[]) => {
          props.setIsBusy(false);
          setEntities((prevEntities) => [...(prevEntities || []), ...res]);
          if (res.length > 0) {
            setPage((page) => page + 1);
          }
        })
        .catch((reason) => {
          // console.log(reason);

          if (reason.name === 'AbortError') return;

          props.setIsBusy(false);
          setIsError(true);
        });
    },
    [fragmentUrl, searchString, page, linkUrl, setEntities, setPage],
  );

  useEffect(() => {
    abortController.current = new AbortController();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
        // console.log('aborted');
      } else {
        alert('b');
      }
    };
  }, [fragmentUrl, searchString, page, linkUrl, fetchData]);

  useEffect(() => {
    if (page == 1 && !!fragmentUrl) {
      fetchData();
    }

    return () => {};
    // , props.fragmentUrl, props.page
  }, [fragmentUrl, searchString, page, linkUrl, fetchData]);

  const someFunc = (val: any) => { props.setScrollPosition(val); };
  const asyncFunctionDebounced = AwesomeDebouncePromise(someFunc, 50);

  const handleScroll = (e: any) => {
    // if (props.isBusy) return;
    if (page === 1) return;

    asyncFunctionDebounced(e.target.scrollTop);

    if (Math.floor(e.target.scrollHeight - e.target.scrollTop) <= Math.floor(e.target.clientHeight)) {
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
          className="h-[440px] overscroll-contain p-1 overflow-auto"
        >
          <DetermineList onSelectItem={props.onSelectItem} entities={props.entities} />
        </div>

        <div
          className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-b from-transparent to-slate-100 pt-6 pb-10 pointer-events-none absolute"
        />

        <div className="flex justify-center items-center overflow-hidden absolute inset-x-0 h-10 bottom-0">
          {/* { props.isBusy && <div className="dot-falling" /> } */}
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
            className="drag-none text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Добавить новый объект
          </a>
        </div>
      </div>
    </>
  );
}
