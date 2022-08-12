import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl, GlobalContext } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

export default function GoogleGraph(props: {
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
  currentTab: Tab | null,
  q: string,
  refetchClicked: boolean,
  setRefetchClicked: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  const globalContext = useContext(GlobalContext);

  const {
    isLoading, error, data, refetch, isFetching
  } = useQuery(`GoogleGraph:${props.q}:${globalContext.apiKey}`, () => {

    const query = new URLSearchParams({
      q: props.q,
    });

    return fetch(`${appUrl}/api/tools/google_graph?${query}`, {
      credentials: 'omit',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': globalContext.apiKey,
      },
    }).then((res) => {

      if (res.status === 401) {
        chrome.runtime.sendMessage({ message: 'request-auth' });
      }

      if (!res.ok) throw new Error(res.statusText);

      return res.json();
    }).catch((reason) => {
      console.error(reason);
    });
  }, {enabled: false});

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    props.setIsBusy(isFetching);
  }, [isFetching])

  useEffect(() => {
    props.setRefetchClicked(false);
    refetch().then()
  }, [props.refetchClicked])

  if (isLoading) return <DotFlasing />;

  if (error) return `An error has occurred: ${(error as Record<string, string>).message}`;

  return (
    <div className="py-3 space-y-7 break-all">
      {data && data.itemListElement && data.itemListElement.length > 0 && data.itemListElement.map((element: any, idx: number) => (
        <div key={idx}>

          <p className="font-medium text-sm mb-1">
            {element.result && element.result.name}
          </p>

          <p className="text-sm mb-1">
            {element.result && element.result.description}
          </p>

          <p className="text-sm mb-1">
            {element.result && element.result.detailedDescription && element.result.detailedDescription.articleBody}
          </p>

          <p className="text-sm mb-1">
            {element.result && element.result.image && element.result.image.contentUrl
              && <img src={element.result.image.contentUrl} />}
          </p>
        </div>
      ))}
    </div>
  );
}
