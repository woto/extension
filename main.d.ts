import { tabs } from './src/controls/Sidebar';
type Tab = typeof tabs[number];

export type Image = {
    index: string,
    id: number | null,
    file: File | null
    url: string | null,
    destroy: boolean
}

export type SentimentItem = {value: string, label: JSX.Element}

export type Entity = {
  entity_id: string,
  title: string,
  intro: string,
  images: Image[]
}

export type OptionalComponent = {
  key: string,
  show: boolean,
  component: (props: any) => JSX.Element
}

export type Kind = {
  index: string,
  id: string | null, 
  label: string,
  destroy: boolean | null
}

export type Relevance = {
  id: string, 
  label: string
}

export type FragmentHash = {
  prefix: string,
  suffix: string
  textStart: string,
  textEnd: string
}