import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl, GlobalContext } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

export default function Iframely(props: {
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>;
  currentTab: Tab | null;
  q: string;
  refetchClicked: boolean;
  setRefetchClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const globalContext = useContext(GlobalContext);

  const {
    isLoading, error, data, refetch, isFetching,
  } = useQuery(
    `Iframely:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        url: props.q,
      });

      return fetch(`${appUrl}/api/tools/iframely?${query}`, {
        credentials: 'omit',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Api-Key': globalContext.apiKey,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            chrome.runtime.sendMessage({ message: 'request-auth' });
          }

          if (!res.ok) throw new Error(res.statusText);

          return res.json();
        })
        .catch((reason) => {
          console.error(reason);
        });
    },
    { enabled: false },
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    props.setIsBusy(isFetching);
  }, [isFetching]);

  useEffect(() => {
    props.setRefetchClicked(false);
    refetch().then();
  }, [props.refetchClicked]);

  if (isLoading) return <DotFlasing />;

  if (error) {
    return `An error has occurred: ${
      (error as Record<string, string>).message
    }`;
  }

  return (
    <div className="py-3 space-y-7 break-all">
      <div>
        <p className="font-medium text-sm mb-1">
          {data && data.meta && data.meta.site}
        </p>

        <p className="font-medium text-sm mb-1">
          {data && data.meta && data.meta.title}
        </p>

        <p className="text-sm mb-1">
          {data && data.meta && data.meta.canonical && (
            <a href={data.meta.canonical}>{data.meta.canonical}</a>
          )}
        </p>

        <p className="text-sm mb-1">
          {data && data.meta && data.meta.description}
        </p>

        {data
          && data.links
          && data.links.thumbnail
          && data.links.thumbnail.map((row: any, idx: number) => (
            <img key={row.href} className="mb-1" src={row.href} />
          ))}
        {data
          && data.links
          && data.links.icon
          && data.links.icon.map((row: any, idx: number) => (
            <img key={row.href} className="mb-1" src={row.href} />
          ))}
      </div>
    </div>
  );
}
