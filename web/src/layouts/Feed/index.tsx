//FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES
import PostComments from 'components/feed/PostComments';
import PostMessage from 'components/feed/PostMessage';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import t from 'i18n';
import {
  IoAddOutline,
  IoArrowUndoOutline,
  IoCloseOutline,
  IoMailOutline,
  IoTrashBinOutline,
} from 'react-icons/io5';

import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { alertService } from 'services/Alert';
import { Button } from 'shared/entities/button.entity';
import {
  CreateNewPost,
  CreateNewPostComment,
  DeletePost,
  LoadPosts,
} from 'state/Posts';
import { isAdmin } from 'state/Users';
import router from 'next/router';
import { useStore } from 'store/Store';
import MessageNew from 'components/feed/MessageNew';
import { CommentPrivacyOptions } from 'shared/types/privacy.enum';
import Link from 'next/link';

export default function Feed({ button }: { button: Button }) {
  const [posts, setPosts] = useState(null);

  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );
  const [refererCompose, setRefererCompose] = useState(null);

  const reloadPosts = () => {
    if (button && button.id) {
      store.emit(
        new LoadPosts(
          button.id,
          (posts) => setPosts(posts),
          (errorMessage) => alertService.error(errorMessage.caption),
        ),
      );
    } else {
      console.error('not button yet?');
    }
  };

  useEffect(() => {
    reloadPosts();
  }, [button]);

  const isButtonOwner = loggedInUser?.id == button.owner.id;
  const buttonOwnerId = button.owner.id;

  return (
    <div className="feed-container">
      {loggedInUser && isButtonOwner && (
        <Compose
          referer={{ button: button.id }}
          onCancel={() => {}}
          onCreate={() => {
            reloadPosts();
          }}
        />
      )}
      &nbsp;
      <div className="feed-line"></div>
      <div className="feed-section">
        {posts &&
          posts.map((post, idx) => (
              <FeedElement
                key={idx}
                post={post}
                loggedInUser={loggedInUser}
                onNewComment={() => {
                  reloadPosts();
                }}
                buttonOwnerId={buttonOwnerId}
                isButtonOwner={isButtonOwner}
                reloadPosts={reloadPosts}
                buttonId={button.id}
              />
          ))}
        {!posts ||
          (posts.length == 0 && (
            <>
              {' '}
              <div className="feed__empty-message">
                {t('common.notfound', ['posts'])}
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
export function FeedElement({
  post,
  loggedInUser,
  onNewComment,
  buttonOwnerId,
  isButtonOwner = false,
  reloadPosts,
  buttonId,
}) {
  const [showComposePostReply, setShowComposePostReply] =
    useState(null);
  const deletePost = (postId) => {
    store.emit(
      new DeletePost(postId, reloadPosts, (error) => {
        alertService.error(error);
      }),
    );
  };
  return (
    <div className="feed-element">
      <div className="card-notification">
        <div className="card-notification__comment-count">
          <div className="card-notification__label">
            <div className="hashtag hashtag--blue">
              {t('feed.update')}
            </div>
          </div>
        </div>
        <PostMessage post={post} />

        <>
          <div className="card-notification__answer-btn">
            {loggedInUser && (
              <>
                <Btn
                  submit={false}
                  btnType={BtnType.iconActions}
                  iconLink={<IoMailOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.right}
                  onClick={() =>
                    setShowComposePostReply(() => {
                      return {
                        post: post.id,
                        privateMessage: true,
                        mentions: [post.author.username],
                      };
                    })
                  }
                />

                <Btn
                  submit={false}
                  btnType={BtnType.iconActions}
                  iconLink={<IoArrowUndoOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.right}
                  onClick={() =>
                    setShowComposePostReply(() => {
                      return {
                        post: post.id,
                        privateMessage: false,
                        mentions: [post.author.username],
                      };
                    })
                  }
                />
              </>
            )}
            {loggedInUser &&
              (loggedInUser.id == post.author.id ||
                isButtonOwner ||
                isAdmin(loggedInUser)) && (
                <Btn
                  submit={false}
                  btnType={BtnType.iconActions}
                  iconLink={<IoTrashBinOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.right}
                  onClick={() => deletePost(post.id)}
                />
              )}
          </div>
          {loggedInUser && showComposePostReply?.post == post.id && (
            <Compose
              referer={showComposePostReply}
              onCancel={() => {
                setShowComposePostReply(null);
              }}
              onCreate={() => {
                reloadPosts();
              }}
            />
          )}
          {!loggedInUser && showComposePostReply?.post == post.id && (
            <>Please <Link href="/Login">login</Link> or <Link href="/Signup">signup</Link> before comment</>
          )}
        </>
        <PostComments
          buttonOwnerId={buttonOwnerId}
          comments={post.comments}
          reloadPosts={reloadPosts}
          loggedInUser={loggedInUser}
          isButtonOwner={isButtonOwner}
          onComposeReplyToComment={(
            commentId,
            commentAuthorUsername,
          ) => {
            setShowComposePostReply(() => {
              return {
                post: post.id,
                comment: commentId,
                mentions: [
                  post.author.username,
                  commentAuthorUsername,
                ],
              };
            });
          }}
        />
      </div>
    </div>
  );
}

export function Compose({
  referer,
  onCreate,
  onCancel,
}) {

  if (!referer) {
    return <></>;
  }
  if (referer.button) {
    return (
      <>
        <MessageNew
          onCreate={(message) => {
            store.emit(
              new CreateNewPost(
                referer.button,
                { message: message },
                () => {
                  alertService.info(
                    t('common.saveSuccess', ['post']),
                  );
                  onCreate();
                },
                (errorMessage) =>
                  alertService.error(errorMessage.caption),
              ),
            );
          }}
          mentions={[]}
        />
      </>
    );
  }
  if (referer.comment) {
    return (
      <>
        <MessageNew
          onCreate={(message) => {
            store.emit(
              new CreateNewPostComment(
                referer.post,
                CommentPrivacyOptions.PUBLIC,
                { message: message },
                () => {
                  alertService.info('comment posted');
                  onCreate();
                },
                (errorMessage) =>
                  alertService.error(errorMessage.caption),
              ),
            );
          }}
          mentions={referer.mentions}
        />

        <Btn
          submit={false}
          btnType={BtnType.iconActions}
          iconLink={<IoCloseOutline />}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.right}
          onClick={() => {
            onCancel();
          }}
        />
      </>
    );
  }

  if (referer.post) {
    return (
      <>
        <MessageNew
          privateMessage={referer?.privateMessage}
          onCreate={(message) => {
            //   if(isGuest)
            // {
            //   store.emit(
            //     new SaveDraftNewPostComment(
            //       postId,
            //       data,
            //     ),
            //   );
            //   alertService.info(t('post.needLogin'));
            //   onSubmit()
            // router.push(`/Login?returnUrl=/ButtonFile/${buttonId}`)
            //   return;
            // }
            let privacy = CommentPrivacyOptions.PUBLIC;
            if (referer?.privateMessage) {
              privacy = CommentPrivacyOptions.PRIVATE;
            }
            store.emit(
              new CreateNewPostComment(
                referer.post,
                privacy,
                { message: message },
                () => {
                  alertService.info('comment posted');
                  onCreate();
                },
                (errorMessage) =>
                  alertService.error(errorMessage.caption),
              ),
            );
          }}
          mentions={referer.mentions}
        />

        <Btn
          submit={false}
          btnType={BtnType.iconActions}
          iconLink={<IoCloseOutline />}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.right}
          onClick={() => {
            onCancel();
          }}
        />
      </>
    );
  }
}
