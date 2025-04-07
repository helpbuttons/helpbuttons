import PostComments from 'components/feed/PostComments';
import PostMessage from 'components/feed/PostMessage';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import t from 'i18n';
import {
  IoAdd,
  IoCallOutline,
  IoCloseOutline,
  IoCreate,
  IoCreateOutline,
  IoLogoWhatsapp,
  IoPencilOutline,
  IoPersonOutline,
} from 'react-icons/io5';

import { GlobalState, store } from 'state';
import { useEffect, useRef, useState } from 'react';
import { alertService } from 'services/Alert';
import { Button } from 'shared/entities/button.entity';
import {
  CreateNewCommentReply,
  CreateNewPost,
  CreateNewPostComment,
  DeletePost,
  LoadPosts,
} from 'state/Posts';
import { isAdmin } from 'state/Users';
import { useStore } from 'state';
import MessageNew from 'components/feed/MessageNew';
import { PrivacyType } from 'shared/types/privacy.enum';
import { useToggle } from 'shared/custom.hooks';
import { ButtonOwnerPhone, CardButtonHeadActions } from 'components/button/CardButton';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import router from 'next/router';

export default function Feed({ button }: { button: Button }) {
  const [posts, setPosts] = useState(null);
  const [showReplyFirstPost, toggleShowReplyFirstPost] =
    useToggle(false);
  const [showNewPostForm, toggleShowNewPostForm] = useToggle(false);
  const sessionUser = useStore(
    store,
    (state: GlobalState) => state.sessionUser,
  );

  const reloadPosts = () => {
    if (button && button.id) {
      store.emit(
        new LoadPosts(
          button.id,
          (posts) => {
            setPosts(posts);
            toggleShowReplyFirstPost(false);
            toggleShowNewPostForm(false);
          },
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

  const isButtonOwner = sessionUser?.id == button.owner.id;
  const buttonOwnerId = button.owner.id;

  return (
    <div className="feed-container">
      <div className="card-button__actions">
        <ButtonOwnerPhone user={button.owner} button={button}/>

        <>
          {sessionUser && isButtonOwner && (
            <>
              <Btn
                btnType={BtnType.corporative}
                iconLeft={IconType.svg}
                contentAlignment={ContentAlignment.left}
                caption={t('button.edit')}
                iconLink={<IoCreateOutline/>}
                onClick={() => {
                  router.push(`/ButtonEdit/${button.id}`);
                }}
              />
              <ComposePost
                referer={{ button: button.id }}
                onCancel={() => {
                  reloadPosts();
                  toggleShowReplyFirstPost(() => false);
                }}
                onCreate={() => {
                  reloadPosts();
                }}
                show={showNewPostForm}
                setShow={() => {toggleShowNewPostForm(true)}}
              />
            </>
          )}
          {sessionUser && (
            <CardButtonHeadActions
              button={button}
              isButtonOwner={isButtonOwner}
              action={() => toggleShowReplyFirstPost(true)}
            />
          )}
          {!sessionUser && (
            <CardButtonHeadActions
              button={button}
              isButtonOwner={isButtonOwner}
              action={
                () =>
                  store.emit(new SetMainPopup(MainPopupPage.LOGIN))
              }
            />
          )}
        </>
      </div>
      <div className="feed-line">{t('feed.messages')}</div>
      <div className="feed-section">
        {posts &&
          posts.map((post, idx) => (
            <FeedElement
              key={idx}
              post={post}
              sessionUser={sessionUser}
              buttonOwnerId={buttonOwnerId}
              isButtonOwner={isButtonOwner}
              reloadPosts={reloadPosts}
              buttonId={button.id}
              showCompose={showReplyFirstPost && idx == 0}
              isLast={idx == posts.length - 1}
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
  sessionUser,
  buttonOwnerId,
  isButtonOwner = false,
  reloadPosts,
  buttonId,
  showCompose = false,
  isLast = false,
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
  useEffect(() => {
    if (showCompose) {
      setShowComposePostReply(() => {
        return {
          post: post.id,
          privateMessage: false,
          mentions: [post.author.username],
        };
      });
    }else{
      setShowComposePostReply(() => null)
    }
  }, [showCompose]);

  return (
    <div className="feed-element">
      <div className="card-notification card-notification--feed">
        <div className="card-notification__comment-count">
          <div className="card-notification__label">
            {/* <div className="hashtag hashtag--blue hashtag--with-icon">
              <IoPersonOutline />
              {t('feed.update')}
            </div> */}
          </div>
        </div>
        <PostMessage post={post} />
        <>
          <div className="card-notification__answer-btn">
            {sessionUser && (
              <>
                <Btn
                  submit={false}
                  btnType={BtnType.smallLink}
                  caption={t('comment.sendPublic')}
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
            {sessionUser &&
              (sessionUser.id == post.author.id ||
                isButtonOwner ||
                isAdmin(sessionUser)) && (
                <Btn
                  submit={false}
                  btnType={BtnType.smallLink}
                  caption={t('comment.delete')}
                  contentAlignment={ContentAlignment.right}
                  onClick={() => deletePost(post.id)}
                  disabled={isLast}
                />
              )}
          </div>
          {(sessionUser && showComposePostReply?.post == post.id) && (
            <Compose
              referer={showComposePostReply}
              onCancel={() => {
                reloadPosts();
                setShowComposePostReply(() => null);
              }}
              onCreate={() => {
                reloadPosts();
                setShowComposePostReply(() => null);
              }}
            />
          )}
          {/* {!sessionUser && 
            <LoginOrSignup/>
          } */}
        </>
        <PostComments
          comments={post.comments}
          reloadPosts={reloadPosts}
          sessionUser={sessionUser}
          isButtonOwner={isButtonOwner}
          post={post}
        />
      </div>
    </div>
  );
}

export function ComposePost({
  referer,
  onCreate,
  onCancel,
  show,
  setShow
}) {
  const refCompose = useRef();

  useEffect(() => {
    if (show && refCompose?.current) {
      refCompose.current.scrollIntoView();
    }
  }, [show]);
  
  return (
    <>
      {show && (
        <Compose
          referer={referer}
          onCreate={onCreate}
          onCancel={onCancel}
        />
      )}
      {!show && (
        <>
          <Btn
            submit={false}
            btnType={BtnType.corporative}
            caption={t('button.createUpdate')}
            iconLink={<IoAdd />}
            iconLeft={IconType.svg}
            contentAlignment={ContentAlignment.left}
            onClick={() => setShow()}
          />
        </>
      )}
    </>
  );
}

export function Compose({ referer, onCreate, onCancel }) {
  if (!referer) {
    return <></>;
  }
  if (referer.button) {
    return (
      <div className="button-file__message-section">
        <div className="button-file__action-section-close">
            <Btn
              submit={false}
              btnType={BtnType.smallCircle}
              iconLink={<IoCloseOutline />}
              iconLeft={IconType.circle}
              contentAlignment={ContentAlignment.center}
              onClick={() => {
                onCancel();
              }}
            />
          </div>
        <MessageNew
          onCreate={(message, images) => {
            store.emit(
              new CreateNewPost(
                referer.button,
                { message, images },
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
      </div>
    );
  }
  if (referer.comment) {
    return (
      <div className="button-file__message-section">
        <div className="button-file__action-section-close">
          <Btn
            submit={false}
            btnType={BtnType.smallCircle}
            iconLink={<IoCloseOutline />}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={() => {
              onCancel();
            }}
          />
        </div>
        <MessageNew
          isComment={true}
          privateMessage={referer?.privateMessage}
          onCreate={(message, images) => {
            let privacy = PrivacyType.PUBLIC;
            if (referer?.privateMessage) {
              privacy = PrivacyType.PRIVATE;
            }
            store.emit(
              new CreateNewCommentReply(
                referer.post,
                referer.comment,
                privacy,
                { message, images },
                () => {
                  alertService.info(t('comment.posted'));
                  onCreate();
                },
                (errorMessage) =>
                  alertService.error(errorMessage.caption),
              ),
            );
          }}
          mentions={referer.mentions}
        />
      </div>
    );
  }

  if (referer.post) {
    return (
      <div className="button-file__message-section">
        <div className="button-file__action-section-close">
          <Btn
            submit={false}
            btnType={BtnType.smallCircle}
            iconLink={<IoCloseOutline />}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={() => {
              onCancel();
            }}
          />
        </div>
        <MessageNew
          isComment={true}
          privateMessage={referer?.privateMessage}
          onCreate={(message, images) => {
            let privacy = PrivacyType.PUBLIC;
            if (referer?.privateMessage) {
              privacy = PrivacyType.PRIVATE;
            }
            store.emit(
              new CreateNewPostComment(
                referer.post,
                privacy,
                { message, images },
                () => {
                  alertService.info(t('comment.posted'));
                  onCreate();
                },
                (errorMessage) =>
                  alertService.error(errorMessage.caption),
              ),
            );
          }}
          mentions={referer.mentions}
        />
      </div>
    );
  }
}
