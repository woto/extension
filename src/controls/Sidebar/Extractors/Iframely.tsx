import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

export default function Iframely(props: {
    apiKey: string,
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    currentTab: Tab | null,
    q: string
}) {
  const {
    isLoading, error, data, isFetching,
  } = useQuery(`Iframely ${props.q}`, () => {
    props.setIsBusy(true);

    const query = new URLSearchParams({
      url: props.q,
    });

    return fetch(`${appUrl}/api/tools/iframely?${query}`, {
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

      <p className="text-sm">
        {' '}
        { data && data.meta && data.meta.title }
        {' '}
      </p>
      <p className="text-sm">
        {' '}
        { data && data.meta && data.meta.site }
        {' '}
      </p>
      <p className="text-sm">
        {' '}
        { data && data.meta && data.meta.description }
        {' '}
      </p>
      <p className="text-sm">
        {' '}
        { data && data.meta && data.meta.canonical }
        {' '}
      </p>

      { data && data.links && data.links.thumbnail && data.links.thumbnail.map((row: any, idx: number) => <img key={row.href} src={row.href} />) }

      { data && data.links && data.links.icon && data.links.icon.map((row: any, idx: number) => <img key={row.href} src={row.href} />) }

    </div>
  );
}
