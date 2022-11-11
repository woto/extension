import { XIcon } from '@heroicons/react/solid';
import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import type { Entity, EntityAction } from '../../main';
import Textarea from '../controls/Textarea';
import { EntityActionType, stopPropagation } from '../Utils';

export default function TitleInput(props: {
  submit: boolean;
  entity: Entity;
  dispatch: Dispatch<EntityAction>;
}) {
  const { title } = props.entity;

  const [titleTouched, setTitleTouched] = useState(false);

  const lengthError = title && title.length > 150;
  const presenceError = titleTouched && title.length === 0;

  const setTitle = (title: string) => {
    props.dispatch({ type: EntityActionType.SET_TITLE, payload: { title } });
  };

  const clearTitle = () => {
    setTitle('');
    setTitleTouched(true);
  };

  useEffect(() => {
    if (props.submit) {
      setTitleTouched(true);
    }
  });

  return (
    <>
      <div className="relative mt-3">
        <Textarea
          minRows={1}
          maxRows={3}
          value={title}
          onBlur={() => setTitleTouched(true)}
          onKeyDown={stopPropagation}
          setValue={setTitle}
          className={`
            ${
              lengthError || presenceError
                ? 'focus:ring-red-500 focus:border-red-500 bg-yellow-50'
                : 'focus:ring-indigo-500 focus:border-indigo-500'
            }
            pr-6 hide-resize shadow-sm block w-full text-sm border-gray-300 rounded-md`}
          placeholder="Название"
        />

        <div className="absolute inset-y-0 right-2 flex py-1.5 pr-0.5">
          <button
            type="button"
            onClick={clearTitle}
            className="inline-flex items-center rounded px-1.5 text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {lengthError && (
        <div className="text-red-400 mt-2 text-sm">
          Должно быть короче 150 символов
        </div>
      )}
      {presenceError && (
        <div className="text-red-400 mt-2 text-sm">Должно быть заполнено</div>
      )}
    </>
  );
}
