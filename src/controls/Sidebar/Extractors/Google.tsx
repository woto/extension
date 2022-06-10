import React, { useEffect, useState } from 'react';
import { Tab } from '../../../../main';

export default function Google(props: {
  apiKey: string,
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
  currentTab: Tab | null,
  cache: Partial<Record<Tab, any>> | undefined | null,
  storeCache: (key: Tab, value: object) => void,
  q: string
}) {
  // const [data, setData] = useState();

  let data;

  if (props.currentTab && props.cache) {
    data = props.cache[props.currentTab];
  }

  // useEffect(
  //   () => {
  //     setTimeout(() => {
  //       props.setIsBusy(true);
  //     }, 1000)

  //     return () => {}
  //   }, [])

  useEffect(() => {
    if (props.currentTab && props.cache && props.cache[props.currentTab]) return;

    props.setIsBusy(true);

    const query = new URLSearchParams({
      q: props.q,
    })

    fetch(`http://localhost:3000/api/tools/google_graph?${query}`, {
      credentials: 'omit',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Api-Key': props.apiKey
      }
    }).then((result) => {
      if (!result.ok) throw new Error(result.statusText);
      return result.json();
    }).then((result) => {
      if (result && props.currentTab) props.storeCache(props.currentTab, result);
      props.setIsBusy(false);
    }).catch((reason) => {
      // console.log(reason);
      props.setIsBusy(false);
    });
  }, []);

  debugger

  return (
    <div className="overflow-auto p-3 space-y-3 break-all">
      {data && data.itemListElement && data.itemListElement.length > 0 && data.itemListElement.map((element: any) =>
        <div className="mb-3">
          <p className="text-xs mb-1">
            {' '}
            {element.result && element.result.name}
            {' '}
          </p>
          <p className="text-xs mb-1">
            {' '}
            {element.result && element.result.description}
            {' '}
          </p>
          <p className="text-xs mb-1">
            {' '}
            {element.result && element.result.detailedDescription && element.result.detailedDescription.articleBody}
            {' '}
          </p>
          <p className="text-xs mb-1">
            {' '}
            {element.result && element.result.image && element.result.image.contentUrl && 
              <img src={element.result.image.contentUrl} /> }
            {' '}
          </p>
        </div>
      )}
    </div>
  );
}
