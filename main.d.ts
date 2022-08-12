import React from 'react';
import { tabs } from './src/controls/Sidebar';
import { EntityActionType } from './src/Utils';
type Tab = typeof tabs[number];


export type Image = {
  index: string,
  id: number | null,
  image_url: string | null,
  video_url: string | null,
  file?: File | null,
  image_src?: string,
  video_src?: string,
  // NOTE: It doesn't validates. May be later add something like yup.
  json?: {
    data: {
      id: string,
      storage: string,
      metadata: {
        filename: string,
        size: number,
        mime_type: string,
        width: number,
        height: number
      }
    },
    url: string
  },
  dark: boolean,
  destroy: boolean,
}

export type Entity = {
  entity_id: string,
  title: string,
  intro: string,
  lookups: Lookup[],
  kinds: Kind[],
  images: Image[],
  entities_mentions_count: number,
}

export type OptionalComponent = {
  key: string,
  show: boolean,
  component: (props: any) => JSX.Element
}

export type Kind = {
  index: string,
  id: number | null,
  title: string,
  count: number | null,
  destroy: boolean | null
}

export type Lookup = {
  index: string,
  id: number | null,
  title: string,
  destroy: boolean | null
}

export type Sentiment = {
  id: string,
  title: string
}

export type Relevance = {
  id: string,
  title: string
}

export type FragmentHash = {
  prefix: string,
  suffix: string
  textStart: string,
  textEnd: string
}

type Feature = 'list' | 'add';

type SidebarButtonState = {
  bell: () => boolean | undefined,
  q: string,
  disabled: boolean,
}
interface GlobalContextInterface {
  apiKey: string,
  setApiKey: React.Dispatch<React.SetStateAction<string>>
  showWindow: boolean,
  setShowWindow: React.Dispatch<React.SetStateAction<boolean>>,
  collapseWindow: boolean,
  setCollapseWindow: React.Dispatch<React.SetStateAction<boolean>>,
}

interface ToastContextInterface {
  add: any,
  remove: any
}

export type ToastType = {
  id: number,
  content: string
}

// export interface EntityAction {
//   type: EntityActionType,
//   payload: any
// }

export type EntityAction =
  {
    type: EntityActionType.INIT,
    payload: Entity
  } |
  {
    type: EntityActionType.SET_TITLE,
    payload: {
      title: string
    }
  } |
  {
    type: EntityActionType.SET_INTRO,
    payload: {
      intro: string
    }
  } |
  {
    type: EntityActionType.SET_KINDS,
    payload: {
      kind: Kind
    }
  } |
  {
    type: EntityActionType.APPEND_LOOKUP,
    payload: {
      lookup: Lookup
    }
  } |
  {
    type: EntityActionType.REMOVE_LOOKUP,
    payload: {
      lookup: Lookup
    }
  } |
  {
    type: EntityActionType.SET_LOOKUP_TITLE,
    payload: {
      lookup: Lookup,
      newTitle: string
    }
  } |
  {
    type: EntityActionType.APPEND_IMAGE,
    payload: {
      image: Image
    }
  } |
  {
    type: EntityActionType.REMOVE_IMAGE,
    payload: {
      image: Image
    }
  } |
  {
    type: EntityActionType.SET_IMAGES,
    payload: {
      images: Image[]
    }
  } |
  {
    type: EntityActionType.TOGGLE_IMAGE_BACKGROUND,
    payload: {
      image: Image
    }
  } |
  {
    type: EntityActionType.REPLACE_IMAGE,
    payload: {
      oldImage: Image,
      newImage: Image
    }
  }
