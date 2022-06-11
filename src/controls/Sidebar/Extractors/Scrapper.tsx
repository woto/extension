import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import DotFlasing from '../../DotFlashing';

export default function Scrapper(props: {
    apiKey: string,
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    currentTab: Tab | null,
    q: string,
}) {
  const {
    isLoading, error, data, isFetching,
  } = useQuery(`Scrapper ${props.q}`, () => {
    props.setIsBusy(true);

    const query = new URLSearchParams({
      url: props.q,
    });

    return fetch(`http://localhost:3000/api/tools/scrape_webpage?${query}`, {
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
    <div className="overflow-auto p-3 space-y-3 break-all">
      <p className="text-xs">
        {' '}
        {data && data.title }
        {' '}
      </p>
      <p className="text-xs">
        {' '}
        {data && data.excerpt }
        {' '}
      </p>
      <p className="text-xs">
        {' '}
        {data && data.siteName }
        {' '}
      </p>
      { data && <img className="border border-slate-300" src={data.image} /> }
    </div>
  );
}
