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
  IoAdd,
  IoAddOutline,
  IoChatbubbleEllipsesSharp,
  IoCloseOutline,
  IoCreateOutline,
  IoMailOpenOutline,
  IoMailOutline,
  IoPersonOutline,
  IoTrashBinOutline,
} from 'react-icons/io5';

import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
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
import router from 'next/router';
import { useStore } from 'store/Store';
import MessageNew from 'components/feed/MessageNew';
import { CommentPrivacyOptions } from 'shared/types/privacy.enum';
import Link from 'next/link';
import { useToggle } from 'shared/custom.hooks';
import { CardButtonHeadActions } from 'components/button/CardButton';

export default function Feed({ button }: { button: Button }) {
  const [posts, setPosts] = useState(null);
  const [showReplyFirstPost, toggleShowReplyFirstPost] = useToggle(false);

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
      {(loggedInUser && isButtonOwner) && (
        <ComposePost
          referer={{ button: button.id }}
          onCancel={() => {}}
          onCreate={() => {
            reloadPosts();
          }}
        />
      )}
      {!isButtonOwner && (      
        <CardButtonHeadActions button={button} toggleShowReplyFirstPost={toggleShowReplyFirstPost}/>         
      )}
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
                showCompose={(showReplyFirstPost && idx == 0)}
                isLast={idx == (posts.length - 1 )}
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
    if(showCompose)
    {
      setShowComposePostReply(() => {
        return {
          post: post.id,
          privateMessage: false,
          mentions: [post.author.username],
        };
      })
    }
  }, [showCompose])
  return (
    <div className="feed-element">
      <div className="card-notification card-notification--feed">
        <div className="card-notification__comment-count">
          <div className="card-notification__label">
            <div className="hashtag hashtag--blue hashtag--with-icon">
              <IoPersonOutline/>{t('feed.update')}
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
                  btnType={BtnType.filterCorp}
                  iconLink={<IoMailOpenOutline />}
                  caption={t("comment.sendPublic")}
                  iconLeft={IconType.svg}
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
                <Btn
                  submit={false}
                  btnType={BtnType.filterCorp}
                  iconLink={<IoMailOutline />}
                  iconLeft={IconType.svg}
                  caption={t("comment.sendPrivate")}
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
              </>
            )}
            {loggedInUser &&
              (loggedInUser.id == post.author.id ||
                isButtonOwner ||
                isAdmin(loggedInUser)) && (
                  <Btn
                        submit={false}
                        btnType={BtnType.filterCorp}
                        iconLink={<IoTrashBinOutline />}
                        iconLeft={IconType.circle}
                        contentAlignment={ContentAlignment.right}
                        onClick={() => deletePost(post.id)}
                        disabled={isLast}
                      />
              )}
              {!loggedInUser && 
                <Btn
                submit={false}
                btnType={BtnType.filterCorp}
                iconLink={<IoMailOutline />}
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
              }
          </div>
          {loggedInUser && showComposePostReply?.post == post.id && (
            <Compose
              referer={showComposePostReply}
              onCancel={() => {
                setShowComposePostReply(null);
              }}
              onCreate={() => {
                reloadPosts();
                setShowComposePostReply(() => null)
              }}
            />
          )}
          {!loggedInUser && showComposePostReply?.post == post.id && (
            <div className='message message--others'> {t('feed.please')} <Link href="/Login"> {t('feed.loginMessage')}</Link> {t('feed.or')} <Link href="/Signup"> {t('feed.signUp')}</Link> {t('feed.beforeComment')}
            </div>
          )}
        </>
        <PostComments
          comments={post.comments}
          reloadPosts={reloadPosts}
          loggedInUser={loggedInUser}
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
}) {
  const [show, toggleShow]= useToggle(false);
  return (  
    <>
        {show &&

        <Compose referer={referer} onCreate={onCreate} onCancel={onCancel}/> 

        }
        {!show &&
            <div className="card-button__actions">

                <Btn
                  submit={false}
                  btnType={BtnType.corporative}
                  caption={t("button.createUpdate")}
                  iconLink={<IoAdd />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.center}
                  onClick={() => {
                    toggleShow(true);
                  }}
                />
            </div>
          }
    </>
    
  )
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
      
      <div className="button-file__action-section">

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
        
      </div>
    );
  }
  if (referer.comment) {
    return (
      <div className="button-file__action-section">
        {/* <div className="button-file__action-section-close">
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
        </div> */}
        <MessageNew
          isComment={true}
          privateMessage={referer?.privateMessage}
          onCreate={(message) => {
            let privacy = CommentPrivacyOptions.PUBLIC;
            if (referer?.privateMessage) {
              privacy = CommentPrivacyOptions.PRIVATE;
            }
            store.emit(
              new CreateNewCommentReply(
                referer.post,
                referer.comment,
                privacy,
                { message: message },
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
      <div className="button-file__action-section">
        {/* <div className="button-file__action-section-close">
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
        </div> */}
        <MessageNew
          isComment={true}
          privateMessage={referer?.privateMessage}
          onCreate={(message) => {
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
