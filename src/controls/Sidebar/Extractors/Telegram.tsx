import { UserGroupIcon } from '@heroicons/react/solid';
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl, GlobalContext } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

export default function Telegram(props: {
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    currentTab: Tab | null,
    q: string,
    refetchClicked: boolean,
    setRefetchClicked: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  const globalContext = useContext(GlobalContext);

  const {
    isLoading, error, data, refetch, isFetching
  } = useQuery(`Telegram:${props.q}:${globalContext.apiKey}`, () => {

    const query = new URLSearchParams({
      q: props.q,
    });

    return fetch(`${appUrl}/api/tools/telegram?${query}`, {
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

      <div>
        <p className="text-sm mb-1">
          { data?.kind }
        </p>

        <p className="text-sm font-medium mb-1">
          {data?.title}
        </p>

        { data?.label
          && (
          <p className="text-sm mb-1">
            <a href={`https://t.me/${data.label}`}>
              { `https://t.me/${data.label}` }
            </a>
          </p>
          )}

        <div className="text-sm mb-1 space-x-2">

          { data?.members
            && (
            <div className="inline-flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              { data?.members }
            </div>
            )}

          { data?.online
            && (
            <div className="inline-flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              { data?.online }
            </div>
            )}

          { data?.subscribers
            && (
            <div className="inline-flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              { data?.subscribers }
            </div>
            )}
        </div>

        <p className="text-sm mb-1" dangerouslySetInnerHTML={{ __html: data?.description || '' }} />

        <p className="text-sm mb-1">
          <img src={data?.image} />
        </p>

      </div>
    </div>
  );
}
