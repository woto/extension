// const someCommonValues = ['common', 'values'];

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Entity, GlobalContextInterface } from '../main';

// export const doSomethingWithInput = (theInput) => {
//    //Do something with the input
//    return theInput;
// };

// export const justAnAlert = () => {
//    alert('hello');
// };

export const appUrl = 'https://roastme.ru';
export const loginUrl = 'https://roastme.ru/auth/login';

// export const appUrl = 'http://localhost:3000';
// export const loginUrl = 'http://localhost:3000/auth/login';

// export const imgproxyUrl = 'http://localhost:8080';

export const GlobalContext = React.createContext<GlobalContextInterface>({
  apiKey: '',
  setApiKey: () => {},
  showWindow: true,
  setShowWindow: () => {},
  collapseWindow: false,
  setCollapseWindow: () => {},
  pageLanguage: undefined,
});

export const FirstLookupIndex = 'FirstLookupIndex';

export const newLookup = (index?: string) => ({
  index: index || uuidv4(),
  id: null,
  title: '',
  destroy: false,
});
export const newImage = (params: {
  file?: File;
  image_src?: string;
  video_src?: string;
}) => ({
  index: uuidv4(),
  id: null,
  ...params,
  image_url: params.image_src!,
  video_url: params.video_src!,
  width: 0,
  height: 0,
  dark: false,
  destroy: false,
});
export const newKind = (searchString: string) => ({
  index: uuidv4(),
  id: null,
  title: searchString,
  destroy: false,
  count: null,
});
export const newEntity = (searchString: string, entityId?: number): Entity => ({
  entity_id: entityId?.toString() ?? '',
  entity_url: '',
  title: searchString,
  intro: '',
  images: [],
  lookups: [],
  kinds: [],
  links: [],
  entities_mentions_count: 0,
});
export const formatter = Intl.NumberFormat('ru', { notation: 'compact' });

export enum EntityActionType {
  INIT = 'INIT',
  SET_TITLE = 'SET_TITLE',
  SET_INTRO = 'SET_INTRO',
  SET_KINDS = 'SET_KINDS',
  APPEND_LOOKUP = 'APPEND_LOOKUP',
  REMOVE_LOOKUP = 'REMOVE_LOOKUP',
  SET_LOOKUP_TITLE = 'SET_LOOKUP_TITLE',
  SET_IMAGES = 'SET_IMAGES',
  APPEND_IMAGE = 'APPEND_IMAGE',
  REMOVE_IMAGE = 'REMOVE_IMAGE',
  REPLACE_IMAGE = 'REPLACE_IMAGE',
  TOGGLE_IMAGE_BACKGROUND = 'TOGGLE_IMAGE_BACKGROUND',
}

export const stopPropagation = (e: any) => {
  e.stopPropagation();
};

export const preventDefault = (e: any) => {
  e.preventDefault();
};

// function objectSize(
//   {
//     width, height, minWidth, maxWidth,
//   }:
//   {width: number, height: number, minWidth: number, maxWidth: number},
// ) {
//   try {
//     const ratio = width / height || 1;
//     // const height = type === 'single' ? 250 : 120;
//     let newWidth = 0;

//     if (height * ratio >= maxWidth) {
//       newWidth = maxWidth;
//     } else if (height * ratio <= minWidth) {
//       newWidth = minWidth;
//     } else {
//       newWidth = height * ratio;
//     }

//     return { width: newWidth, height };
//   } catch {
//     return {};
//   }
// }

export function objectSize(
  {
    width, height, minWidth, maxWidth, minHeight, maxHeight,
  }:
  {
    width: number, height: number, minWidth: number,
    maxWidth: number, minHeight: number, maxHeight: number
  },
) {
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  const returnWidth = Math.round(width * ratio * 100) / 100;
  const returnHeight = Math.round(height * ratio * 100) / 100;

  return {
    width: Number.isFinite(returnWidth) ? returnWidth : 'auto',
    height: Number.isFinite(returnHeight) ? returnHeight : 'auto',
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
  };
}
