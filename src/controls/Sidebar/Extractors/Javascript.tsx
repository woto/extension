import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import DotFlasing from '../../DotFlashing';

export default function Javascript(props: {
    apiKey: string,
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    currentTab: Tab | null,
    q: string
}) {
  const {
    isLoading, error, data, isFetching,
  } = useQuery(`Javascript ${props.q}`, () => {
    props.setIsBusy(true);

    const query = new URLSearchParams({
      q: props.q,
    });

    return fetch(`http://localhost:3000/api/tools/npmjs?${query}`, {
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
      { data?.map((element: any, idx: number) => (
        <div key={idx}>
          <p className="text-base font-medium mb-1">
            {' '}
            {element.name}
            {' '}
          </p>

          <p className="text-sm mb-1">
            {' '}
            {element.description}
            {' '}
          </p>

          <p className="text-sm mb-1">
            {' '}
            {element?.links?.repository}
            {' '}
          </p>

          <p className="text-sm mb-1">
            {' '}
            {element?.links?.homepage}
            {' '}
          </p>

          <p className="text-sm mb-1">
            {' '}
            {element?.maintainers?.map((maintainer: any) => {
              { maintainer.username; }
            })}
            {' '}
          </p>

          <p className="text-sm mb-1">
            {' '}
            {element.downloads}
            {' '}
          </p>
        </div>
      )) }
    </div>
  );
}
