import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import DotFlasing from '../../DotFlashing';

export default function Youtube(props: {
  apiKey: string,
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
  currentTab: Tab | null,
  q: string
}) {
  const {
    isLoading, error, data, isFetching,
  } = useQuery(`Youtube ${props.q}`, () => {
    props.setIsBusy(true);

    const query = new URLSearchParams({
      q: props.q,
    });

    return fetch(`http://localhost:3000/api/tools/youtube?${query}`, {
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
    <div className="p-3 space-y-3 break-all text-sm">

      { data?.video?.items?.length > 0 &&
        <div>
          <p className="font-medium text-sm mb-1">{data.video.items[0].snippet.title}</p>
          <p className="text-sm mb-1">
            { data.video.items[0].snippet.description.split("\n").map(function (item: string, idx: number) {
              return (
                <span key={idx}>
                  {item}
                  <br />
                </span>
              )
            })}
          </p>
          <img src={data.video.items[0].snippet.thumbnails.medium.url} />
        </div>
      }

      { data?.channel?.items?.length > 0 &&
        <div>
          <p className="font-medium text-sm mb-1">{data.channel.items[0].snippet.title}</p>
          <p className="text-sm mb-1">
            {data.channel.items[0].snippet.description?.split("\n").map(function (item: string, idx: number) {
              return (
                <span key={idx}>
                  {item}
                  <br />
                </span>
              )
            })}
          </p>
          <p className="text-sm mb-1">{data.channel.items[0].branding_settings.channel.keywords}</p>
          <img className="mb-1" src={data.channel.items[0].branding_settings.image.banner_external_url} />
          <img className="mb-1" src={data.channel.items[0].snippet.thumbnails.medium.url} />
        </div>
      }

    </div>
  );
}
