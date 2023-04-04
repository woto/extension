import React, {
  Fragment, useContext, useEffect, useState,
} from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl, GlobalContext } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

export default function YandexXML(props: {
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
    `YandexXML:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        q: props.q,
      });

      return fetch(`${appUrl}/api/tools/yandex_xml?${query}`, {
        credentials: 'omit',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/xml',
          'Api-Key': globalContext.apiKey,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            chrome.runtime.sendMessage({ message: 'request-auth' });
          }

          if (!res.ok) throw new Error(res.statusText);

          return res.text();
        })
        .then((result) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(result, 'application/xml');
          return xml.querySelectorAll('doc');
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

  const decodedURI = (text?: string | null) => {
    try {
      if (text == null) throw new Error();
      return decodeURI(text);
    } catch (err) {
      return text;
    }
  };

  return (
    <div className="py-3 space-y-7 break-all">
      <>
      {data
        && Array.from(data).map((item, idx) => (
          <div key={idx}>
            <p className="font-medium text-sm mb-1">
              {item.querySelector('title')?.textContent!}
            </p>
            <a href={item.querySelector('url')?.textContent!}>
              <p className="text-sm mb-1">
                {decodedURI(item.querySelector('url')?.textContent)}
              </p>
            </a>
            <p className="text-sm mb-1">
              {item.querySelector('headline')?.textContent!}
            </p>
            <p className="text-sm mb-1">
              {item.querySelector('passages')?.textContent!}
            </p>
          </div>
        ))}{" "}
        </>
    </div>
  );
}
