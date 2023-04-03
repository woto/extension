import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl, GlobalContext } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

export default function Wikipedia(props: {
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
    `Wikipedia:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        q: props.q,
        ...(globalContext.pageLanguage && { lang: globalContext.pageLanguage }),
      });

      return fetch(`${appUrl}/api/tools/wikipedia?${query}`, {
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
      {data
        && data.pages
        && Array.from(data.pages).map((item: any, idx) => (
          <div key={idx}>
            {item?.title && (
              <p className="font-medium text-sm mb-1">{item.title}</p>
            )}

            {item?.description && (
              <p className="text-sm mb-1">{item.description}</p>
            )}

            {item?.excerpt && (
              <p
                className="text-sm mb-1"
                dangerouslySetInnerHTML={{ __html: item.excerpt || '' }}
              />
            )}

            {item?.thumbnail && (
              <div className="text-sm mb-1">
                <img
                  width={item.thumbnail.width}
                  height={item.thumbnail.height}
                  src={item.thumbnail.url}
                />
              </div>
            )}
          </div>
        ))}
      {' '}
    </div>
  );
}
