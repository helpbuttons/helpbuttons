import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { GlobalState, store, useGlobalStore } from 'state';
import { DeleteComment } from 'state/Posts';
import { alertService } from 'services/Alert';
import { isAdmin } from 'state/Users';
import {
  IoArrowBack,
  IoArrowRedo,
  IoArrowUndoOutline,
  IoChatbubbleEllipsesSharp,
  IoMailOutline,
  IoReturnDownBackSharp,
  IoReturnUpBackOutline,
  IoTrashBinOutline,
} from 'react-icons/io5';
import { readableTimeLeftToDate } from 'shared/date.utils';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { PrivacyType } from 'shared/types/privacy.enum';
import { formatMessage } from 'elements/Message';
import { uniqueArray } from 'shared/sys.helper';
import { Compose } from 'layouts/Feed';
import { useState } from 'react';
import { useToggle } from 'shared/custom.hooks';
import t from 'i18n';
import { mentionsOfMessage } from 'shared/types/message.helper';
import { ImageGallery } from 'elements/ImageGallery';
import Link from 'next/link';
import { FindAndSetMainPopupCurrentProfile } from 'state/HomeInfo';

export default function PostComments({
  comments,
  reloadPosts,
  sessionUser,
  isButtonOwner,
  post,
}) {
  const focusMessageId = useGlobalStore(
    (state: GlobalState) => state.activities.focusMessageId,
  );
  const commentParentIds = comments.filter(
    (comment) => comment.commentParentId,
  );
  return (
    <>
      <>
        {comments.length > 0 && (
          <>
            {comments
              .filter((comment) => !comment.commentParentId)
              .map((comment, key) => {
                return (
                  <PostComment
                    key={key}
                    focus={comment.id == focusMessageId}
                    comment={comment}
                    sessionUser={sessionUser}
                    isButtonOwner={isButtonOwner}
                    reloadPosts={reloadPosts}
                    post={post}
                    replies={commentParentIds.filter(
                      (reply) => reply.commentParentId == comment.id,
                    )}
                  />
                );
              })}
          </>
        )}
      </>
    </>
  );
}
enum ComposeCommentState {
  HIDE,
  PRIVATE,
  PUBLIC,
}

export function PostComment({
  comment,
  sessionUser,
  isButtonOwner,
  reloadPosts,
  post,
  replies,
  isReply = false,
  focus = false
}) {
  const deleteComment = (commentId) => {
    store.emit(
      new DeleteComment(commentId, reloadPosts, (error) => {
        alertService.error(error.caption);
      }),
    );
  };
  const [showComposeComment, setShowComposeComment] =
    useState<ComposeCommentState>(ComposeCommentState.HIDE);

  const toggleShowComposeComment = (privacy: ComposeCommentState) => {
    if (showComposeComment == ComposeCommentState.HIDE) {
      setShowComposeComment(() => privacy);
    } else {
      setShowComposeComment(() => ComposeCommentState.HIDE);
    }
  };
  return (
    <>
    <div
      className={
        'card-notification--comment ' +
        (comment.privacy == PrivacyType.PRIVATE
          ? ' card-notification--comment-private'
          : '') +
        (isReply ? ' card-notification--reply' : '')
        + focus ? ' card-notification-comment-focus' : ''
      }
    >
      <Comment comment={comment} sessionUser={sessionUser}/>
      <div className={'message__actions ' + (sessionUser && (sessionUser.id == comment.author.id) ? ' ' : 'message__actions--you') }>
        {sessionUser && (
          <>
            {comment.privacy == PrivacyType.PRIVATE && (
              <Btn
                submit={false}
                btnType={BtnType.smallLink}
                caption={t('comment.sendPrivate')}
                contentAlignment={ContentAlignment.right}
                onClick={() =>
                  toggleShowComposeComment(
                    ComposeCommentState.PRIVATE,
                  )
                }
              />
            )}
            {comment.privacy == PrivacyType.PUBLIC && (
              <Btn
                submit={false}
                btnType={BtnType.smallLink}
                caption={t('comment.sendPublic')}
                contentAlignment={ContentAlignment.right}
                onClick={() =>
                  toggleShowComposeComment(ComposeCommentState.PUBLIC)
                }
              />
            )}
          </>
        )}

        {sessionUser && (sessionUser.id == comment.author.id || isButtonOwner || isAdmin(sessionUser)) && (
            <Btn
              submit={true}
              btnType={BtnType.smallLink}
              // iconLink={<IoTrashBinOutline />}
              caption={t('comment.delete')}
              // iconLeft={IconType.circle}
              contentAlignment={ContentAlignment.right}
              onClick={() => deleteComment(comment.id)}
            />
          )}
      </div>
   
    </div>
    {showComposeComment != ComposeCommentState.HIDE && (
        <Compose
          referer={{
            post: post.id,
            comment: comment.commentParentId
              ? comment.commentParentId
              : comment.id,
            privateMessage:
              ComposeCommentState.PRIVATE == showComposeComment,
            mentions: [
              ... sessionUser.username != comment.author.username ? [comment.author.username] : [],
              ...mentionsOfMessage(comment.message, sessionUser.username),
            ],
          }}
          onCreate={() => {
            reloadPosts();
            toggleShowComposeComment(ComposeCommentState.HIDE);
          }}
          onCancel={() => {
            toggleShowComposeComment(ComposeCommentState.HIDE);
          }}
        />
    )}

      {replies.length > 0 && (
        <>
          {replies.map((reply, key) => {
            return (
              <PostComment
                isReply={true}
                key={key}
                comment={reply}
                sessionUser={sessionUser}
                isButtonOwner={isButtonOwner}
                reloadPosts={reloadPosts}
                post={post}
                replies={[]}
              />
            );
          })}
        </>
      )}
      </>
  );
}
export function Comment({ comment, sessionUser }) {
    const onClick = (e) =>{
      e.preventDefault()
      store.emit(new FindAndSetMainPopupCurrentProfile(comment.author.username))
    }

    const isAuthor = sessionUser?.id === comment?.author?.id;
    
  return (
    <>
    {!isAuthor &&
        <div className="message message--you">
          <div className="message__header">
            <div className="message__user-name-container">
              <p className="message__author">
                <span className="message__name">
                  {comment.author.name}
                </span>{' '}
                {/* @{comment.author.username} */}
              </p>
            </div>
          </div>
          <div className="message__content">
            {formatMessage(comment.message, comment.mentions)}
          </div>

          <div className="message__hour">
            {readableTimeLeftToDate(comment.created_at)},{' '}
            {comment.privacy == PrivacyType.PRIVATE && (
              <span style={{ color: 'red' }}>private</span>
            )}
          </div>

          <div className="message__avatar">
          <Link href="#" onClick={onClick}>
            <ImageWrapper
              imageType={ImageType.avatar}
              src={comment.author.avatar}
              alt="Avatar"
            />
          </Link>
          </div>
          <ImageGallery images={comment?.images?.map((image) => {return {src: image, alt: comment.message} })} />
        </div>
      }
      {isAuthor &&
        <div className="message message--others">

          <div className="message__header">
            <div className="message__user-name-container">
              <p className="message__author">
                <span className="message__name">
                  {comment.author.name}
                </span>{' '}
                {/* @{comment.author.username} */}
              </p>
            </div>
          </div>
          <div className="message__content">
            {formatMessage(comment.message, comment.mentions)}
          </div>

          <div className="message__hour">
            {readableTimeLeftToDate(comment.created_at)},{' '}
            {comment.privacy == PrivacyType.PRIVATE && (
              <span style={{ color: 'red' }}>private</span>
            )}
          </div>
          <div className="message__avatar">
          <Link href="#" onClick={onClick}>
            <ImageWrapper
              imageType={ImageType.avatar}
              src={comment.author.avatar}
              alt="Avatar"
            />
          </Link>
          </div>
          
          <ImageGallery images={comment?.images?.map((image) => {return {src: image, alt: comment.message} })} />
        </div>
      }
    </>
  );
}
