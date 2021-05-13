import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  ExternalMedia,
  GiphyMedia,
  TwitterMedia,
  YouTubeMedia,
} from "coral-stream/common/Media";
import { Button, ButtonIcon, HorizontalGutter } from "coral-ui/components/v2";

import { LiveMediaSectionContainer_comment } from "coral-stream/__generated__/LiveMediaSectionContainer_comment.graphql";
import { LiveMediaSectionContainer_settings } from "coral-stream/__generated__/LiveMediaSectionContainer_settings.graphql";

import styles from "./LiveMediaSectionContainer.css";

interface Props {
  comment: LiveMediaSectionContainer_comment;
  settings: LiveMediaSectionContainer_settings;
  defaultExpanded?: boolean;
  mode?: "default" | "mini";
}

const LiveMediaSectionContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  defaultExpanded = false,
  mode = "default",
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const onToggleExpand = useCallback(() => {
    setExpanded((v) => !v);
  }, []);

  const media = comment.revision?.media;
  if (!media) {
    return null;
  }

  if (
    (media.__typename === "TwitterMedia" && !settings.media.twitter.enabled) ||
    (media.__typename === "YouTubeMedia" && !settings.media.youtube.enabled) ||
    (media.__typename === "GiphyMedia" && !settings.media.giphy.enabled) ||
    (media.__typename === "ExternalMedia" && !settings.media.external.enabled)
  ) {
    return null;
  }

  if (!expanded || mode === "mini") {
    return (
      <Button
        iconLeft
        variant="outlined"
        color="stream"
        onClick={onToggleExpand}
        size="small"
        className={styles.button}
      >
        {media.__typename === "ExternalMedia" && (
          <ExternalMedia
            id={comment.id}
            url={media.url}
            siteID={comment.site.id}
            className={styles.miniFrame}
          />
        )}

        {mode !== "mini" && (
          <>
            <ButtonIcon>add</ButtonIcon>
            {media.__typename === "TwitterMedia" && (
              <Localized id="comments-embedLinks-show-twitter">
                Show Tweet
              </Localized>
            )}
            {media.__typename === "YouTubeMedia" && (
              <Localized id="comments-embedLinks-show-youtube">
                Show video
              </Localized>
            )}
            {media.__typename === "ExternalMedia" && (
              <Localized id="comments-embedLinks-show-external">
                Show image
              </Localized>
            )}
            {media.__typename === "GiphyMedia" && (
              <Localized id="comments-embedLinks-show-giphy">
                Show GIF
              </Localized>
            )}
          </>
        )}
      </Button>
    );
  }

  return (
    <HorizontalGutter>
      <div>
        <Button
          variant="outlined"
          color="stream"
          onClick={onToggleExpand}
          size="small"
          iconLeft
          className={styles.button}
        >
          <ButtonIcon>remove</ButtonIcon>
          {media.__typename === "TwitterMedia" && (
            <Localized id="comments-embedLinks-hide-twitter">
              Hide Tweet
            </Localized>
          )}
          {media.__typename === "GiphyMedia" && (
            <Localized id="comments-embedLinks-hide-giphy">Hide GIF</Localized>
          )}
          {media.__typename === "YouTubeMedia" && (
            <Localized id="comments-embedLinks-hide-youtube">
              Hide video
            </Localized>
          )}
          {media.__typename === "ExternalMedia" && (
            <Localized id="comments-embedLinks-hide-external">
              Hide image
            </Localized>
          )}
        </Button>
      </div>
      {media.__typename === "ExternalMedia" && (
        <ExternalMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
          className={styles.frameLimits}
        />
      )}
      {media.__typename === "TwitterMedia" && (
        <TwitterMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
        />
      )}
      {media.__typename === "YouTubeMedia" && (
        <YouTubeMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
        />
      )}
      {media.__typename === "GiphyMedia" && (
        <GiphyMedia
          url={media.url}
          width={media.width}
          height={media.height}
          title={media.title}
          video={media.video}
        />
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment LiveMediaSectionContainer_comment on Comment {
      id
      site {
        id
      }
      revision {
        media {
          __typename
          ... on GiphyMedia {
            url
            title
            width
            height
            still
            video
          }
          ... on TwitterMedia {
            url
            width
          }
          ... on YouTubeMedia {
            url
            width
            height
          }
          ... on ExternalMedia {
            url
          }
        }
      }
    }
  `,
  settings: graphql`
    fragment LiveMediaSectionContainer_settings on Settings {
      media {
        twitter {
          enabled
        }
        youtube {
          enabled
        }
        giphy {
          enabled
        }
        external {
          enabled
        }
      }
    }
  `,
})(LiveMediaSectionContainer);

export default enhanced;
