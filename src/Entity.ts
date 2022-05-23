import {Image} from './Image';

export type Entity = {
  entity_id: string,
  title: string,
  intro: string,
  images: Image[]
}