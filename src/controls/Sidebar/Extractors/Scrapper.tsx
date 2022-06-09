import React, { useEffect, useState } from 'react';
import { Tab } from '../../../../main';

export default function Scrapper(props: {
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    currentTab: Tab | null,
    cache: Partial<Record<Tab, any>> | undefined | null,
    storeCache: (key: Tab, value: object) => void,
    searchString: string,
    linkUrl: string
}) {
  // const [data, setData] = useState();

  let data;

  if (props.currentTab && props.cache) {
    data = props.cache[props.currentTab];
  }

  useEffect(() => {
    if (props.currentTab && props.cache && props.cache[props.currentTab]) return;

    props.setIsBusy(true);

    const query = new URLSearchParams({
      url: props.linkUrl,
      api_key: 'EsqkkEtzzbWgkVzeZ2jV'
    });

    fetch(`http://localhost:3000/api/tools/scrape_webpage?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((result) => {
      debugger
      if (!result.ok) throw new Error(result.statusText);
      return result.json();
    }).then((result) => {
      debugger      
      if (result && props.currentTab) props.storeCache(props.currentTab, result);
      props.setIsBusy(false);
    }).catch((reason) => {
      console.log(reason);
      props.setIsBusy(false);
    });

    return () => {}
  }, []);

  return (
    <div className="overflow-auto p-3 space-y-3 break-all">
      <p className="text-xs"> {data && data.title } </p>
      <p className="text-xs"> {data && data.excerpt } </p>
      <p className="text-xs"> {data && data.siteName } </p>
      { data && <img className="border border-slate-300" src={data.image}></img> }
    </div>
  );
}
