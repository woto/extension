type Image = {
    id: string | number,
    file: File | null
    url: string | null,
    destroy: boolean
}

declare module '*.css';

type SentimentItem = {value: string, label: JSX.Element}

type Entity = {
  entity_id: string,
  title: string,
  intro: string,
  images: Image[]
}
