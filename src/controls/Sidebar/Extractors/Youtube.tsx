import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Tab } from "../../../../main";
import { appUrl, GlobalContext } from "../../../Utils";
import DotFlasing from "../../DotFlashing";

export default function Youtube(props: {
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>;
  currentTab: Tab | null;
  q: string;
  refetchClicked: boolean;
  setRefetchClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const globalContext = useContext(GlobalContext);

  const { isLoading, error, data, refetch, isFetching } = useQuery(
    `Youtube:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        q: props.q,
      });

      return fetch(`${appUrl}/api/tools/youtube?${query}`, {
        credentials: "omit",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Api-Key": globalContext.apiKey,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            chrome.runtime.sendMessage({ message: "request-auth" });
          }

          if (!res.ok) throw new Error(res.statusText);

          return res.json();
        })
        .catch((reason) => {
          console.error(reason);
        });
    },
    { enabled: false }
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

  if (error)
    return `An error has occurred: ${
      (error as Record<string, string>).message
    }`;

  return (
    <div className="py-3 space-y-7 break-all text-sm">
      {data?.video?.items?.length > 0 && (
        <div>
          <p className="font-medium text-sm mb-1">
            {data.video.items[0].snippet.title}
          </p>
          <p className="text-sm mb-1">
            {data.video.items[0].snippet.description
              .split("\n")
              .map((item: string, idx: number) => (
                <span key={idx}>
                  {item}
                  <br />
                </span>
              ))}
          </p>
          <img src={data.video.items[0].snippet.thumbnails.medium.url} />
        </div>
      )}

      {data?.channel?.items?.length > 0 && (
        <div>
          <p className="font-medium text-sm mb-1">
            {data.channel.items[0].snippet.title}
          </p>

          <p className="text-sm mb-1">
            {data.channel.items[0].snippet.description
              ?.split("\n")
              .map((item: string, idx: number) => (
                <span key={idx}>
                  {item}
                  <br />
                </span>
              ))}
          </p>

          <p className="text-sm mb-1">
            {data.channel.items[0].branding_settings.channel.keywords}
          </p>

          {data.channel.items[0].branding_settings.image && (
            <img
              className="mb-1"
              src={
                data.channel.items[0].branding_settings.image
                  .banner_external_url
              }
            />
          )}

          <img
            className="mb-1"
            src={data.channel.items[0].snippet.thumbnails.medium.url}
          />
        </div>
      )}

      {/* 'video_count' => metadata.data.dig('items', 0, 'statistics', 'video_count'),
          'view_count' => metadata.data.dig('items', 0, 'statistics', 'view_count'),
          'subscriber_count' => metadata.data.dig('items', 0, 'statistics', 'subscriber_count')

          'item_count' => metadata.data.dig('items', 0, 'contentDetails', 'itemCount')

          'tags' => metadata.data.dig('items', 0, 'snippet', 'tags'),

          'like_count' => metadata.data.dig('items', 0, 'statistics', 'like_count'),
          'view_count' => metadata.data.dig('items', 0, 'statistics', 'view_count'),
          'comment_count' => metadata.data.dig('items', 0, 'statistics', 'comment_count'),
          'favorite_count' => metadata.data.dig('items', 0, 'statistics', 'favorite_count'),
          'duration' => metadata.data.dig('items', 0, 'content_details', 'duration') */}
    </div>
  );
}
