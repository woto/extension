import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import { appUrl, formatter, GlobalContext } from '../../../Utils';
import DotFlasing from '../../DotFlashing';

import StarIcon from '../../../icons/github/Star.svg';
import IssueIcon from '../../../icons/github/Issue.svg';
import WatchIcon from '../../../icons/github/Watch.svg';
import ForkIcon from '../../../icons/github/Fork.svg';

export default function Github(props: {
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
    `Github:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        q: props.q,
      });

      return fetch(`${appUrl}/api/tools/github?${query}`, {
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
      {data?.readme && (
        <div dangerouslySetInnerHTML={{ __html: data.readme }} />
      )}

      {data?.repos
        && data.repos.items.map((item: any) => (
          <div key={item.id}>
            <div className="font-medium text-sm mb-1">{item.full_name}</div>

            <div className="text-sm mb-1 space-x-2">
              <div className="inline-flex items-center">
                <div
                  className="w-4 h-4 mr-1 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: StarIcon }}
                />
                {formatter.format(item.stargazers_count)}
              </div>

              <div className="inline-flex items-center">
                <div
                  className="w-4 h-4 mr-0.5 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: ForkIcon }}
                />
                {formatter.format(item.forks_count)}
              </div>

              <div className="inline-flex items-center">
                <div
                  className="w-4 h-4 mr-1 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: WatchIcon }}
                />
                {formatter.format(item.watchers_count)}
              </div>
            </div>

            <div className="text-sm mb-1">
              {item.description && item.description.slice(0, 300)}
            </div>
          </div>
        ))}
    </div>
  );
}
