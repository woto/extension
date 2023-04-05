import dayjs from 'dayjs';
import {
  Entity,
  EntityAction,
  Kind,
  Relevance,
  Sentiment,
  Image,
} from '../main';
import { EntityActionType, FirstLookupIndex, newImage } from './Utils';

export function initEntity(entity: Entity) {
  return entity;
}

export function entityReducer(entity: Entity, action: EntityAction): Entity {
  switch (action.type) {
    case EntityActionType.INIT: {
      return initEntity(action.payload);
    }

    case EntityActionType.APPEND_LOOKUP: {
      const index = entity.lookups.findIndex((lookup) => lookup.index === FirstLookupIndex);
      if (index !== -1 && action.payload.lookup.index === FirstLookupIndex) { return entity; }

      const newLookups = [...entity.lookups, action.payload.lookup];
      return { ...entity, lookups: newLookups };
    }

    case EntityActionType.REMOVE_LOOKUP: {
      let newLookups = [];

      if (action.payload.lookup.id) {
        newLookups = entity.lookups.map((item) => {
          if (item === action.payload.lookup) {
            return { ...action.payload.lookup, ...{ destroy: true } };
          }
          return item;
        });
      } else {
        newLookups = entity.lookups.filter(
          (item) => item !== action.payload.lookup,
        );
      }

      return { ...entity, lookups: newLookups };
    }

    case EntityActionType.SET_LOOKUP_TITLE: {
      const foundIndex = entity.lookups.findIndex(
        (l) => l == action.payload.lookup,
      );
      const newLookups = [
        ...entity.lookups.slice(0, foundIndex),
        { ...action.payload.lookup, ...{ title: action.payload.newTitle } },
        ...entity.lookups.slice(foundIndex + 1),
      ];

      return { ...entity, lookups: newLookups };
    }

    case EntityActionType.SET_TITLE: {
      return { ...entity, title: action.payload.title };
    }

    case EntityActionType.SET_INTRO: {
      return { ...entity, intro: action.payload.intro };
    }

    case EntityActionType.SET_KINDS: {
      let newKinds = [];
      const found = entity.kinds.find(
        (item: Kind) => item.title === action.payload.kind.title,
      );

      // props.setKinds((kinds: Kind[]) => {
      //   const found = kinds.find((item: Kind) => item.title === kind.title);
      //   if (found) {
      //     if (kind.id) {
      //       return kinds.map((item: Kind) => {
      //         if (item.title == kind.title) {
      //           return { ...item, ...{ destroy: !item.destroy} }
      //         } else {
      //           return item;
      //         }
      //       });
      //     } else {
      //       return kinds.filter((item) => item !== kind);
      //     }
      //   }
      //   return [kind, ...kinds];
      // });

      if (found) {
        if (action.payload.kind.id) {
          newKinds = entity.kinds.map((item: Kind) => {
            if (item.title == action.payload.kind.title) {
              return { ...item, ...{ destroy: !item.destroy } };
            }
            return item;
          });
        } else {
          newKinds = entity.kinds.filter(
            (item) => item !== action.payload.kind,
          );
        }

        return { ...entity, kinds: newKinds };
      }
      newKinds = [action.payload.kind, ...entity.kinds];

      return { ...entity, kinds: newKinds };
    }

    case EntityActionType.SET_IMAGES: {
      const newImages = [];

      // newImages = [...entity.images, ...action.payload.images]
      // return { ...entity, images: newImages };

      return { ...entity, images: action.payload.images };
    }

    case EntityActionType.APPEND_IMAGE: {
      let newImages = [];
      newImages = [...entity.images, action.payload.image];

      return { ...entity, images: newImages };
    }

    case EntityActionType.REMOVE_IMAGE: {
      let newImages: Image[] = [];

      // if (action.payload.image.url) {
      newImages = entity.images.map((val) => {
        if (val == action.payload.image) {
          return { ...val, ...{ destroy: true } };
        }
        return val;
      });
      // } else {
      // newImages = entity.images.filter((val) => val !== action.payload.image);
      // }

      return { ...entity, images: newImages };
    }

    case EntityActionType.REPLACE_IMAGE: {
      let newImages: Image[] = [];

      newImages = entity.images.map((val) => {
        if (val.index === action.payload.oldImage.index) {
          return action.payload.newImage;
        }
        return val;
      });

      return { ...entity, images: newImages };
    }

    case EntityActionType.TOGGLE_IMAGE_BACKGROUND: {
      const newImages = entity.images.map((item) => {
        if (item === action.payload.image) {
          return {
            ...action.payload.image,
            ...{ dark: !action.payload.image.dark },
          };
        }
        return item;
      });

      return { ...entity, images: newImages };
    }

    default:
      throw new Error(
        `There is no such action type. Check reducer. ${JSON.stringify(action)}`,
      );
  }
}
