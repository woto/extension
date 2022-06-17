import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

export default function GoogleGraph(props: {
  apiKey: string,
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
  currentTab: Tab | null,
  q: string
}) {
  const {
    isLoading, error, data, isFetching,
  } = useQuery(`GoogleGraph ${props.q}`, () => {
    props.setIsBusy(true);

    const query = new URLSearchParams({
      q: props.q,
    });

    return fetch(`${appUrl}/api/tools/google_graph?${query}`, {
      credentials: 'omit',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': props.apiKey,
      },
    }).then((result) => {
      if (!result.ok) throw new Error(result.statusText);
      props.setIsBusy(false);
      return result.json();
    }).catch((reason) => {
      // console.log(reason);
      props.setIsBusy(false);
    });
  });

  if (isLoading) return <DotFlasing />;

  if (error) return `An error has occurred: ${(error as Record<string, string>).message}`;

  return (
    <div className="overflow-auto p-3 space-y-7 break-all">
      {data && data.itemListElement && data.itemListElement.length > 0 && data.itemListElement.map((element: any, idx: number) => (
        <div key={idx}>
          <p className="font-medium text-sm mb-1">
            {' '}
            {element.result && element.result.name}
            {' '}
          </p>
          <p className="text-sm mb-1">
            {' '}
            {element.result && element.result.description}
            {' '}
          </p>
          <p className="text-sm mb-1">
            {' '}
            {element.result && element.result.detailedDescription && element.result.detailedDescription.articleBody}
            {' '}
          </p>
          <p className="text-sm mb-1">
            {' '}
            {element.result && element.result.image && element.result.image.contentUrl
              && <img src={element.result.image.contentUrl} />}
            {' '}
          </p>
        </div>
      ))}
    </div>
  );
}
