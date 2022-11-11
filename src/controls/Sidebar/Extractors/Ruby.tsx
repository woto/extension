import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { DownloadIcon } from '@heroicons/react/solid';
import { Tab } from '../../../../main';
import { appUrl, formatter, GlobalContext } from '../../../Utils';
import DotFlasing from '../../DotFlashing';
import StarIcon from '../../../icons/github/Star.svg';

export default function Ruby(props: {
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
    `Ruby:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        q: props.q,
      });

      return fetch(`${appUrl}/api/tools/rubygems?${query}`, {
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
      {data?.map((element: any, idx: number) => (
        <div key={idx}>
          <p className="text-sm font-medium mb-1">{element.name}</p>

          <div className="text-sm mb-1 space-x-2">
            <div className="inline-flex items-center">
              <DownloadIcon className="w-4 h-4 mr-1" />
              {formatter.format(element.downloads)}
            </div>
          </div>

          <p className="text-sm mb-1">
            <a href={element.homepage_uri}>{element.homepage_uri}</a>
          </p>

          <p className="text-sm mb-1">{element.info}</p>

          {/* { JSON.stringify(element) } */}
        </div>
      ))}
    </div>
  );
}
