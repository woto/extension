declare module '*.css';

type Image = {
    id: string | number,
    file: File | null
    url: string | null,
    destroy: boolean
}

type SentimentItem = {value: string, label: JSX.Element}

type Entity = {
  entity_id: string,
  title: string,
  intro: string,
  images: Image[]
}

type OptionalComponent = {
  key: string,
  show: boolean,
  component: (props: any) => JSX.Element
}

type Kind = {value: string | null, label: string}
type Relevance = {value: string, label: string}
