import React, {
  useState, useEffect, Fragment, useContext, useRef, MouseEventHandler, SetStateAction, Dispatch, useCallback, useMemo,
} from 'react';
import {
  ArrowCircleLeftIcon, CogIcon, XIcon
} from '@heroicons/react/solid';
import { v4 as uuidv4 } from 'uuid';

import {
  appUrl, GlobalContext, newImage, newLookup, EntityActionType, newEntity,
} from './Utils';

import SentimentInput from './SentimentInput';
import KindsInput from './KindsInput';
import LookupsInput from './LookupsInput';
import RelevanceInput from './RelevanceInput';
import DateInput from './MentionDateInput'
import Sidebar from './controls/Sidebar';
import Textarea from './controls/Textarea';

import {
  Kind, Lookup, FragmentHash, Entity, Image, Relevance, Sentiment, OptionalComponent, EntityAction,
} from '../main';
import { ExclamationCircleIcon, ThumbUpIcon, ThumbDownIcon, DocumentDuplicateIcon, HashtagIcon, ClockIcon } from '@heroicons/react/outline';
import { useQuery } from "react-query";
import { useToasts } from './ToastManager';
import TitleInput from './form/TitleInput';
import IntroInput from './form/IntroInput';
import Debug from './form/Debug';
import FileInput from './FileInput';
import useMentionDate from './useMentionDate';
import Thumbnails from './Thumbnails';

let renderCount = 0;

export default function Form(props: {
  isBusy: boolean,
  setIsBusy: Dispatch<SetStateAction<boolean>>,
  fragmentUrl: string,
  fragmentHash: FragmentHash,
  linkUrl: string,
  imageSrc: string,
  entity: Entity,
  relevance: Relevance | null | undefined,
  setRelevance: Dispatch<SetStateAction<Relevance | null | undefined>>
  sentiment: Sentiment | null | undefined,
  setSentiment: Dispatch<SetStateAction<Sentiment | null | undefined>>
  mentionDate: Date | null | undefined,
  setMentionDate: Dispatch<SetStateAction<Date | null | undefined>>
  dispatch: Dispatch<EntityAction>,
  handleBackButtonClick: MouseEventHandler<HTMLButtonElement> | undefined,
  operation: 'add' | 'edit',
  showDebug: boolean
}) {
  const {
    dispatch: _dispatch,
    operation,
    entity: {
      entity_id: _entity_id,
      lookups: _lookups,
      kinds: _kinds,
    } } = props

  const {
    mentionDate: _mentionDate,
    setMentionDate: _setMentionDate,
    relevance: _relevance,
    setRelevance: _setRelevance,
    sentiment: _sentiment,
    setSentiment: _setSentiment
  } = props

  const _images = useMemo(() => {
    return props.entity.images
  },
    [props.entity.images]
  );

  renderCount++;

  const globalContext = useContext(GlobalContext);
  const [submit, setSubmit] = useState(false);
  const [optionalComponents, setOptionalComponents] = useState<OptionalComponentsItem[]>([]);
  const { add } = useToasts();

  const relevanceOptions: Relevance[] = [
    { id: '0', title: 'Закрепленный'},
    { id: '1', title: 'Основной объект' },
    { id: '2', title: 'Второстепенный объект' },
    { id: '3', title: 'Один из равнозначных' },
    { id: '4', title: 'Ссылающееся издание или автор' },
  ];

  const sentimentOptions: Sentiment[] = [
    { id: '0', title: 'ThumbUpIcon' },
    { id: '1', title: 'ThumbDownIcon' },
  ];

  useEffect(() => {
    if (_lookups.length === 0) {
      props.dispatch({ type: EntityActionType.APPEND_LOOKUP, payload: { lookup: newLookup() } })
    }
  }, []);

  const { status: MentionDateStatus, data: mentionDateData, error: MentionDateError, isFetching: MentionDateIsFetching } =
    useMentionDate({ url: window.location.href, entityId: _entity_id })

  useEffect(() => {
    if (mentionDateData && props.mentionDate == null) {
      props.setMentionDate(mentionDateData)
      // props.dispatch({ type: EntityActionType.SET_MENTION_DATE, payload: { mentionDate: mentionDateData } });
    }
  }, [mentionDateData, props.mentionDate])

  useEffect(() => {
    if (!_entity_id) return;
    if (!globalContext.apiKey) return;

    fetch(`${appUrl}/api/entities/${_entity_id}`, {
      credentials: 'omit',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': globalContext.apiKey,
      },
    })
      .then((res) => {

        if (res.status === 401) {
          chrome.runtime.sendMessage({ message: 'request-auth' });
        }

        if (!res.ok) throw new Error(res.statusText);

        return res.json();
      })
      .then((res: Entity) => {
        res.images.forEach((image) => {
          image.index = image.id!.toString();
          image.destroy = false;
        });

        res.kinds.forEach((kind) => {
          kind.index = kind.id!.toString();
          kind.destroy = false;
        });

        res.lookups.forEach((lookup) => {
          lookup.index = lookup.id!.toString();
          lookup.destroy = false;
        });

        return res;
      })
      .then((res: Entity) => {
        _dispatch({ type: EntityActionType.INIT, payload: res });
      })
      .catch((reason) => {
        console.log(reason)
        // if (reason.name === 'AbortError') return;

        // console.error(reason);
        // setError(reason.message);
      });

    return () => { };
  }, [globalContext.apiKey, _entity_id])

  // const meth = (str: any) => fetch(str).then(response => { return response.text() })
  // let [res1, res2] = await Promise.all(['http://example.com', 'http://example.com'].map((str: string) => meth(str)))

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setSubmit(true)

    const data = {
      fragment_url: props.fragmentUrl,
      link_url: props.linkUrl,
      image_src: props.imageSrc,
      relevance: props.relevance?.id,
      sentiment: props.sentiment?.id,
      kinds: props.entity.kinds.map((kind: Kind) => ({
        id: kind.id,
        destroy: kind.destroy,
        title: kind.title,
      })),
      lookups: props.entity.lookups.map((lookup: Lookup) => ({
        id: lookup.id,
        destroy: lookup.destroy,
        title: lookup.title,
      })),
      entity_id: props.entity.entity_id,
      title: props.entity.title,
      intro: props.entity.intro,
      images: props.entity.images,
      mention_date: props.mentionDate
    };

    fetch(`${appUrl}/api/cites`, {
      credentials: 'omit',
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': globalContext.apiKey,
      },
    }).then((res) => {

      if (res.status === 401) {
        chrome.runtime.sendMessage({ message: 'request-auth' });
      }

      if (!res.ok) throw new Error(res.statusText);

      return res.json();
    }).then((res) => {

      globalContext.setShowWindow(false);
      add(<span>Упоминание <a href={res.url}>{res.title}</a> успешно добавлено.</span>);

    }).catch((reason) => {
      console.error(reason);
    });
  };

  type OptionalComponentsItem = { show: boolean, key: string, component: any };

  useEffect(() => {
    const defaultOrder = ['sentiment', 'kinds', 'lookups', 'relevance', 'mentionDate'];
    const isShow = (prevState: any, key: string) => prevState.find((obj: any) => obj.key === key)?.show || false;

    setOptionalComponents((prevState) => {
      const types: OptionalComponent[] = [
        {
          key: 'sentiment',
          show: isShow(prevState, 'sentiment'),
          component: (props: any) => (
            <SentimentInput
              toggleVisibility={toggleVisibility}
              sentiment={_sentiment}
              setSentiment={_setSentiment}
              options={sentimentOptions}
              {...props}
            />
          ),
        },
        {
          key: 'kinds',
          show: isShow(prevState, 'kinds'),
          component: (props: any) => (
            <KindsInput
              toggleVisibility={toggleVisibility}
              dispatch={_dispatch}
              kinds={_kinds}
              {...props}
            />
          ),
        },
        {
          key: 'lookups',
          show: isShow(prevState, 'lookups'),
          component: (props: any) => (
            <LookupsInput
              toggleVisibility={toggleVisibility}
              dispatch={_dispatch}
              lookups={_lookups}
              {...props}
            />
          ),
        },
        {
          key: 'relevance',
          show: isShow(prevState, 'relevance'),
          component: (props: any) => (
            <RelevanceInput
              toggleVisibility={toggleVisibility}
              relevance={_relevance}
              setRelevance={_setRelevance}
              options={relevanceOptions}
              {...props}
            />
          ),
        },
        {
          key: 'mentionDate',
          show: isShow(prevState, 'mentionDate'),
          component: (props: any) => (
            <DateInput
              toggleVisibility={toggleVisibility}
              mentionDate={_mentionDate}
              setMentionDate={_setMentionDate}
              {...props}
            />
          ),
        },
      ];

      if (prevState && prevState.length > 0) {
        const order = prevState.map((obj) => obj.key);
        return order.map(
          (key: string) => types.find((obj) => obj.key === key),
        ) as OptionalComponentsItem[];
      }
      return defaultOrder.map(
        (key: string) => types.find((obj) => obj.key === key),
      ) as OptionalComponentsItem[];
    });
  }, [_kinds, _lookups, _mentionDate, _sentiment, _relevance]);

  const toggleVisibility = useCallback((e: any, key: string) => {
    e.preventDefault();

    setOptionalComponents((prevValues) => {
      const row = prevValues.find((row) => row.key === key);
      if (!row) throw new Error('Optional component is not found.');

      const idx = prevValues.indexOf(row);
      if (row.show) {
        return [
          ...prevValues.slice(0, idx),
          { ...row, ...{ show: false } },
          ...prevValues.slice(idx + 1),
        ];
      }
      return [
        { ...row, ...{ show: true } },
        ...prevValues.slice(0, idx),
        ...prevValues.slice(idx + 1),
      ];
    });
  }, []);

  function isOptionalComponentVisible(key: string) {
    return !!optionalComponents.find((object) => object.key === key && object.show === true);
  }

  const toolbarButtonClass = (name: string, disableable: boolean) => {
    let classes = [''];

    if (isOptionalComponentVisible(name)) {
      classes.push('text-white bg-gray-600 hover:bg-gray-700');
    } else {
      classes.push('text-gray-500 bg-white');
      if (disableable && operation === 'edit') {
        classes.push('opacity-50');
      } else {
        classes.push('hover:bg-gray-50 hover:text-gray-900');
      }
    }
      classes.push(`mb-0 inline-flex ml-1 items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs
                    font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`);

    return classes.join(' ');
  }

  return (
    <>

      <form onSubmit={onSubmit} style={{ marginBlockEnd: 0 }}>
        <Sidebar
          searchString={props.entity.title}
          linkUrl={props.linkUrl}
          imageSrc={props.imageSrc}
          fragmentUrl={props.fragmentUrl}
        />

        <div className="p-3 relative svg-pattern border border-t-0 border-slate-300 rounded-t-none rounded-lg">

          <div className="flex">
            <button
              disabled={operation === 'edit'}
              onClick={props.handleBackButtonClick}
              type="button"
              className={`mb-0 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium
              rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${operation === 'edit' ? 'opacity-50' : ''}`}
            >
              <ArrowCircleLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              {/*<ArrowCircleLeftIcon className="mr-2 -ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />*/}
              {/*Назад*/}
            </button>

            <div className="flex ml-auto flex-grow justify-end">

              <button
                disabled={operation === 'edit'}
                onClick={(e) => { toggleVisibility(e, 'sentiment'); }}
                className={toolbarButtonClass('sentiment', true)}
              >
                <ThumbUpIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                disabled={operation === 'edit'}
                onClick={(e) => { toggleVisibility(e, 'relevance'); }}
                className={toolbarButtonClass('relevance', true)}
              >
                <ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                disabled={false}
                onClick={(e) => { toggleVisibility(e, 'kinds'); }}
                className={toolbarButtonClass('kinds', false)}
              >
                <HashtagIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                disabled={false}
                onClick={(e) => { toggleVisibility(e, 'lookups'); }}
                className={toolbarButtonClass('lookups', false)}
              >
                <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                disabled={operation === 'edit'}
                onClick={(e) => { toggleVisibility(e, 'mentionDate'); }}
                className={toolbarButtonClass('mentionDate', true)}
              >
                <ClockIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {props.showDebug &&
            <Debug
              imageSrc={props.imageSrc}
              linkUrl={props.linkUrl}
              entity={props.entity}
              fragmentUrl={props.fragmentUrl}
              fragmentHash={props.fragmentHash}
              renderCount={renderCount}
            />
          }

          {optionalComponents.map(({ key, show, component }, index) => {
            const priority = optionalComponents.length - index;
            return (
              // component({key: key, show: show, priority: priority})
              component({ key, show, priority })
            );
          })}

          <TitleInput submit={submit} entity={props.entity} dispatch={props.dispatch}></TitleInput>
          <IntroInput submit={submit} entity={props.entity} dispatch={props.dispatch}></IntroInput>
          <FileInput entity={props.entity} dispatch={props.dispatch}></FileInput>
          <Thumbnails images={_images} dispatch={props.dispatch}></Thumbnails>

          <button
            type="submit"
            className="mt-3 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          >
            Сохранить
          </button>
        </div>

      </form>
    </>
  );
}
