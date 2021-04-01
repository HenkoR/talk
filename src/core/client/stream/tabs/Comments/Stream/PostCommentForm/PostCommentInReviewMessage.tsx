import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

export interface PostCommentInReviewProps {
  onDismiss: () => void;
}

const classes: PropTypesOf<typeof CallOut>["classes"] = {
  closeButton: CLASSES.createComment.dismissButton,
};

const PostCommentInReview: FunctionComponent<PostCommentInReviewProps> = (
  props
) => {
  return (
    <CallOut
      classes={classes}
      color="primary"
      className={CLASSES.createComment.inReview}
      onClose={props.onDismiss}
      icon={<Icon size="sm">check</Icon>}
      titleWeight="semiBold"
      title={
        <Localized id="comments-submitStatus-submittedAndWillBeReviewed">
          <span>
            Your comment has been submitted and will be reviewed by a moderator
          </span>
        </Localized>
      }
    />
  );
};

export default PostCommentInReview;
