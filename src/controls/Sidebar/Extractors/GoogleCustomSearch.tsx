import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

export default function GoogleCustomSearch(props: {
  apiKey: string,
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
  currentTab: Tab | null,
  q: string
}) {
  const {
    isLoading, error, data, isFetching,
  } = useQuery(`GoogleCustomSearch ${props.q}`, () => {
    props.setIsBusy(true);

    const query = new URLSearchParams({
      q: props.q,
    });

    return fetch(`${appUrl}/api/tools/google_custom_search?${query}`, {
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
      {data && data.items && data.items.length > 0 && data.items.map((element: any, idx: number) => (
        <div key={idx}>

          <p className="font-medium text-sm mb-1">
            {element.title}
          </p>

          <a href={element.link}>
            <p className="text-sm mb-1">
              {decodeURI(element.link)}
            </p>
          </a>

          <p className="text-sm mb-1">
            {element.snippet}
          </p>

          <img src={element.pagemap.cse_thumbnail?.[0]?.src} />

        </div>
      ))}
    </div>
  );
}
