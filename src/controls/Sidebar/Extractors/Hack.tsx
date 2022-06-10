import React from 'react';
import { Tab } from '../../../../main';

export default function Hack(props: {
    apiKey: string,
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    currentTab: Tab | null,
    cache: Partial<Record<Tab, any>> | undefined | null,
    storeCache: (key: Tab, value: object) => void,
    searchString: string,
    linkUrl: string
}) {
  return <></>;
}
