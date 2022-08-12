import { XIcon } from '@heroicons/react/solid';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Entity, EntityAction } from './../../main';
import Textarea from '../controls/Textarea';
import { EntityActionType, stopPropagation } from '../Utils';

export default function IntroInput(props: {
  submit: boolean,
  entity: Entity,
  dispatch: Dispatch<EntityAction>
}) {

  const { intro } = props.entity

  const [introTouched, setIntroTouched] = useState(false)

  const lengthError = intro && intro.length > 500
  const presenceError = introTouched && intro.length === 0

  const setIntro = (intro: string) => {
    props.dispatch({ type: EntityActionType.SET_INTRO, payload: { intro: intro } });
  }

  useEffect(() => {
    if (props.submit) {
      setIntroTouched(true);
    }
  })

  return (
    <>
      <div className="relative mt-3">
        <Textarea
          minRows={5}
          maxRows={9}
          value={intro}
          onBlur={() => { setIntroTouched(true) }}
          onKeyDown={stopPropagation}
          setValue={setIntro}
          className={`
            ${lengthError || presenceError ? 'focus:ring-red-500 focus:border-red-500 bg-yellow-50' : 'focus:ring-indigo-500 focus:border-indigo-500'}
            shadow-sm block w-full text-sm border-gray-300 rounded-md`}
          placeholder="Описание"
        />

        <div className="absolute bottom-1 right-3 p-1 text-sm text-slate-400 bg-white/30 rounded">
          {intro && intro.length || 0}
          / 500
        </div>
      </div>

      {lengthError && <div className="text-red-400 mt-2 text-sm">Должно быть короче 500 символов</div>}
      {presenceError && <div className="text-red-400 mt-2 text-sm">Должно быть заполнено</div>}
    </>
  )
}
