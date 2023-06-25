//FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES
import PostCommentNew from 'components/feed/PostCommentNew';
import PostComments from 'components/feed/PostComments';
import PostMessage from 'components/feed/PostMessage';
import PostNew from 'components/feed/PostNew';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import Dropdown from 'elements/Dropdown/DropDown';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { alertService } from 'services/Alert';
import { Button } from 'shared/entities/button.entity';
import { Post } from 'shared/entities/post.entity';
import { LoadPosts } from 'state/Posts';
import { useRef } from 'store/Store';

export default function Feed({ button }: { button: Button }) {
  const [posts, setPosts] = useState(null);

  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

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

  // if (!feed && currentButton) {
  //   const singleFeedItem = {
  //     author: currentButton.owner,
  //     message: 'my message',
  //     created: '2023-03-02T18:40:24.126Z',
  //     modified: Date(),
  //     comments: [
  //       {
  //         author: currentButton.owner,
  //         message: 'comment from someone',
  //         created: Date(),
  //         modified: Date(),
  //       },
  //       {
  //         author: currentButton.owner,
  //         message: 'comment from someone',
  //         created: Date(),
  //         modified: Date(),
  //       },
  //     ],
  //     reactions: [
  //       {
  //         ':like:': 10,
  //         ':heart:': 5,
  //       },
  //     ],
  //   };
  //   const feed = [singleFeedItem, singleFeedItem, singleFeedItem];
  //   setFeed(feed);
  // }

  return (
    <div className="feed-container">
      {/* <div className="feed-selector">
        <Dropdown />
      </div> */}
      {loggedInUser &&
        button.id &&
        button.owner.id == loggedInUser.id && (
          <PostNew
            buttonId={button.id}
            onCreate={() => reloadPosts()}
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
export function FeedElement({ post, loggedInUser, onNewComment }) {
  const [showNewCommentDialog, setShowNewCommentDialog] =
    useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="feed-element">
      <div className="card-notification">
        <div className="card-notification__comment-count">
          <div className="card-notification__label">
            <div className="hashtag hashtag--blue">New update</div>
          </div>
        </div>

        <PostMessage post={post} />

        <>
          <div className="card-notification__answer-btn">
            <a
              className="card-notification__comment-count"
              onClick={() => {
                setShowComments(!showComments);
              }}
            >
              {post.comments.length > 0
                ? `${showComments ? 'Ocultar' : 'Ver'} ${
                    post.comments.length
                  } ${t('post.comment')}${
                    post.comments.length > 1 ? 's' : ''
                  }`
                : ''}
            </a>
            {loggedInUser && (
              <Btn
                submit={true}
                btnType={BtnType.corporative}
                caption={t('post.newComment')}
                contentAlignment={ContentAlignment.center}
                onClick={() => {
                  setShowNewCommentDialog(!showNewCommentDialog);
                }}
              />
            )}
          </div>

          {(showNewCommentDialog && loggedInUser )&& (
            <PostCommentNew
              postId={post.id}
              onSubmit={() => {
                onNewComment();
                setShowComments(true);
                setShowNewCommentDialog(false);
              }}
            />
          )}
        </>
        {showComments && (
            <PostComments comments={post.comments} />
        )}
      </div>
    </div>
  );
}
