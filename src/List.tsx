import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { abort } from 'process';
import EmptyList from './EmptyList';
import FullList from './FullList';
import NothingFound from './NothingFound';

import { appUrl, GlobalContext } from './Utils';

import {
  Entity, Image, Kind, Lookup,
} from '../main';
import DotFlasing from './controls/DotFlashing';

function DetermineList(props: {
  entities: Entity[] | null;
  onSelectItem: any;
}) {
  if (props.entities === null) {
    return (
      <Wrapper>
        <EmptyList />
      </Wrapper>
    );
  }
  if (props.entities && props.entities.length > 0) {
    return (
      <Wrapper>
        <FullList onSelectItem={props.onSelectItem} entities={props.entities} />
      </Wrapper>
    );
  }
  if (props.entities && props.entities.length === 0) {
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
  isBusy: boolean;
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>;
  fragmentUrl: string;
  searchString: string;
  linkUrl: string;
  imageSrc: string;
  onSelectItem: any;
  handleNewEntityClick: any;
  entities: any[] | null;
  setEntities: React.Dispatch<React.SetStateAction<any[] | null>>;
  scrollPosition: number;
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const globalContext = useContext(GlobalContext);

  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [restoreScroll, setRestoreScroll] = useState(true);

  const { scrollPosition } = props;

  useEffect(() => {
    if (restoreScroll && scrollRef.current) {
      const diff = Math.abs(scrollRef.current.scrollTop - scrollPosition);
      if (diff > 1) {
        scrollRef.current.scrollTop = scrollPosition;
      }
    }
  }, [scrollPosition]);

  const {
    fragmentUrl,
    searchString,
    page,
    linkUrl,
    imageSrc,
    setPage,
    setEntities,
    setIsBusy,
  } = props;

  const { apiKey } = globalContext;

  const abortController = useRef<AbortController>();

  const fetchData = useCallback(() => {
    // if (!apiKey) return null;
    setIsBusy(true);
    setError(null);

    // console.log('%cFETCHING!', 'color: Orange');

    const data = {
      fragment_url: fragmentUrl,
      search_string: searchString,
      link_url: linkUrl,
      image_src: imageSrc,
      page,
    };

    const params: RequestInit = {
      credentials: 'omit',
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': apiKey,
      },
    };

    if (abortController.current) {
      params.signal = abortController.current.signal;
    } else {
      console.error('some error');
    }

    fetch(`${appUrl}/api/entities/seek`, params)
      .then((res) => {
        if (res.status === 401) {
          chrome.runtime.sendMessage({ message: 'request-auth' });
        }

        if (!res.ok) throw new Error(res.statusText);

        return res.json();
      })
      .then((res: Entity[]) => {
        res.forEach((entity) => {
          entity.images.forEach((image) => {
            image.index = image.id!.toString();
            image.destroy = false;
          });
        });

        // res.forEach((entity) => {
        //   entity.relevance = null
        // })

        res.forEach((entity) => {
          entity.kinds.forEach((kind) => {
            kind.index = kind.id!.toString();
            kind.destroy = false;
          });
        });

        res.forEach((entity) => {
          entity.lookups.forEach((lookup) => {
            lookup.index = lookup.id!.toString();
            lookup.destroy = false;
          });
        });

        return res;
      })
      .then((res: Entity[]) => {
        setIsBusy(false);
        setEntities((prevEntities) => [...(prevEntities || []), ...res]);
        if (res.length > 0) {
          setPage((page) => page + 1);
        }
      })
      .catch((reason) => {
        setIsBusy(false);
        if (reason.name === 'AbortError') return;

        console.error(reason);
        setError(reason.message);
      });
  }, [
    setIsBusy,
    fragmentUrl,
    searchString,
    page,
    linkUrl,
    imageSrc,
    setEntities,
    setPage,
    apiKey,
  ]);

  useEffect(() => {
    abortController.current = new AbortController();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      } else {
        alert('b');
      }
    };
  }, [fragmentUrl, searchString, page, linkUrl, imageSrc, fetchData, apiKey]);

  useEffect(() => {
    if (page == 1 && !!fragmentUrl) {
      fetchData();
    }

    return () => {};
    // , props.fragmentUrl, props.page
  }, [fragmentUrl, searchString, page, linkUrl, imageSrc, fetchData, apiKey]);

  const someFunc = (val: any) => {
    props.setScrollPosition(val);
  };

  const asyncFunctionDebounced = AwesomeDebouncePromise(someFunc, 50);

  const handleScroll = (e: any) => {
    if (props.isBusy) return;
    if (page === 1) return;

    setRestoreScroll(false);
    asyncFunctionDebounced(e.target.scrollTop);

    if (
      Math.floor(e.target.scrollHeight - e.target.scrollTop)
      <= Math.floor(e.target.clientHeight)
    ) {
      fetchData();
    }
  };

  // // TODO: make it better
  // if (!globalContext.apiKey) return (<></>);

  return (
    <>
      {/* { console.log('render <List/>') } */}

      <div className="relative">
        {/* <p className="text-white">{decodeURI(fragmentUrl)}</p> */}

        <div
          onScroll={handleScroll}
          ref={scrollRef}
          className="h-[450px] overscroll-contain p-1 overflow-auto"
        >
          <DetermineList
            onSelectItem={props.onSelectItem}
            entities={props.entities}
          />
        </div>

        <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-b from-transparent to-slate-100 pt-6 pb-10 pointer-events-none absolute" />

        {props.isBusy && <DotFlasing />}

        <div className="flex justify-center items-center overflow-hidden absolute inset-x-0 h-10 bottom-0">
          {error && (
            <div className="text-red-400 text-sm font-medium">{error}</div>
          )}
        </div>
      </div>

      <div className="p-3 rounded-b-lg bg-slate-100 mt-auto">
        <div className="text-center">
          <a
            href="#"
            onClick={props.handleNewEntityClick}
            className="drag-none text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Добавить новый объект
          </a>
          {/* <a href="#:~:text=is">111</a> */}
          {/* <a href="#:~:text=in">222</a> */}
        </div>
      </div>
    </>
  );
}
