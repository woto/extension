import React, {
  Fragment, useContext, useEffect, useState,
} from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl, GlobalContext } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

function ResultItem(props: { item: any }) {
  return (
    <div>
      <div className="text-sm font-medium mb-1">{props.item.Text}</div>

      {props.item.Icon.URL && (
        <div className="text-sm mb-1">
          <img src={`https://duckduckgo.com${props.item.Icon.URL}`} />
        </div>
      )}

      <div className="text-sm mb-1">
        <a href={props.item.FirstURL}>{decodeURI(props.item.FirstURL)}</a>
      </div>
    </div>
  );
}

export default function DuckDuckGo(props: {
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
    `DuckDuckGo:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        q: props.q,
      });

      return fetch(`${appUrl}/api/tools/duckduckgo_instant?${query}`, {
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
        <div className="text-sm font-medium mb-1">{data?.Heading}</div>

        {data?.AbstractURL && (
          <div className="text-sm mb-1">
            <a href={data.AbstractURL}>{decodeURI(data.AbstractURL)}</a>
          </div>
        )}

        <div className="text-sm mb-1">{data?.AbstractText}</div>

        {data?.Image && (
          <div className="text-sm mb-1">
            <img src={`https://duckduckgo.com/${data?.Image}`} />
          </div>
        )}

        {data?.DefinitionURL && (
          <div className="text-sm mb-1">
            <a href={data.DefinitionURL}>{decodeURI(data.DefinitionURL)}</a>
          </div>
        )}

        <div className="text-sm mb-1">{data?.Definition}</div>
      </div>

      {data?.Results.map((item: any, index: number) => (
        <ResultItem key={index} item={item} />
      ))}

      {data?.RelatedTopics.map((item: any, index: number) => (
        <Fragment key={index}>
          {item.Name ? (
            item.Topics.map((subitem: any, index: number) => (
              <ResultItem key={index} item={subitem} />
            ))
          ) : (
            <ResultItem key={index} item={item} />
          )}
        </Fragment>
      ))}
    </div>
  );
}
