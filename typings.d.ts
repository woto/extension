declare module '*.css';

type Image = {
    index: string,
    id: number | null,
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

type Kind = {
  index: string,
  id: string | null, 
  label: string,
  destroy: boolean | null
}

type Relevance = {
  id: string, 
  label: string
}