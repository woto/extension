import { XIcon } from '@heroicons/react/solid';
import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import { Entity, FragmentHash } from '../../main';

export default function IntroInput(props: {
  entity: Entity;
  fragmentHash: FragmentHash;
  linkUrl: string;
  imageSrc: string;
  fragmentUrl: string;
  renderCount: number;
}) {
  return (
    <>
      <div className="shadow-inner my-3 text-xs text-orange-200 bg-stone-800 p-2 rounded-lg">
        {props.fragmentHash.textStart && (
          <>
            {' '}
            text start:
            {' '}
            <span className="text-orange-50 select-all">
              {props.fragmentHash.textStart}
            </span>
          </>
        )}
        {props.linkUrl && (
          <>
            {' '}
            link url:
            {' '}
            <span className="text-orange-50 break-all select-all">
              {props.linkUrl}
            </span>
          </>
        )}
        {props.imageSrc && (
          <>
            {' '}
            image src:
            {' '}
            <span className="text-orange-50 break-all select-all">
              {props.imageSrc}
            </span>
          </>
        )}
        {props.entity.entity_id && (
          <>
            {' '}
            entity id:
            {' '}
            <span className="text-orange-50 break-all select-all">
              {props.entity.entity_id}
            </span>
          </>
        )}
        {' '}
        fragment url:
        {' '}
        <span className="text-orange-50 break-all select-all">
          {props.fragmentUrl}
        </span>
        {' '}
        render count:
        {' '}
        {props.renderCount}
      </div>

      <div className="select-text mx-auto text-center text-gray-400 mb-3">
        ¯\_(ツ)_/¯
      </div>
    </>
  );
}
