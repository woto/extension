import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl, GlobalContext } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

export default function YandexMicrodata(props: {
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
    `YandexMicrodata:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        url: props.q,
      });

      const data = {
        url: props.q,
      };

      return fetch(`${appUrl}/api/tools/yandex_microdata`, {
        credentials: 'omit',
        method: 'POST',
        body: JSON.stringify(data),
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
      <pre className="text-xs mb-1">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
