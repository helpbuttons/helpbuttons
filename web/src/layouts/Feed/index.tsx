//FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES
import PostCommentNew from 'components/feed/PostCommentNew';
import PostComments from 'components/feed/PostComments';
import PostMessage from 'components/feed/PostMessage';
import PostNew from 'components/feed/PostNew';
import Dropdown from 'elements/Dropdown/DropDown';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { alertService } from 'services/Alert';
import { Button } from 'shared/entities/button.entity';
import { LoadPosts } from 'state/Posts';
import { useRef } from 'store/Store';

export default function Feed({ button }: { button: Button }) {
  const [posts, setPosts] = useState(null);
  const [showNewCommentDialog, setShowNewCommentDialog] =
    useState(false);
  const [showComments, setShowComments] = useState(false);

  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const reloadPosts = (buttonId) => {
    store.emit(
      new LoadPosts(
        buttonId,
        (posts) => setPosts(posts),
        (errorMessage) => alertService.error(errorMessage),
      ),
    );
  };
  useEffect(() => {
    if (!posts && button && button.id) {
      reloadPosts(button.id);
    }
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
            reloadPosts={() => {
              reloadPosts(button.id);
            }}
          />
        )}
      &nbsp;
      <div className="feed-line"></div>
      <div className="feed-section">
        {posts &&
          posts.map((post, idx) => {
            return (
              <div className="feed-element" key={idx}>
                <div className="card-notification card-notification--need">
                  <div className="card-notification__content">
                    <div className="card-notification__text">
                      <PostMessage post={post} />
                      <div>
                        <a
                          onClick={() => {
                            setShowComments(!showComments);
                          }}
                        >
                          {post.comments.length > 0
                            ? `+${post.comments.length} ${t(
                                'post.comment',
                              )}${
                                post.comments.length > 1 ? 's' : ''
                              }`
                            : ''}
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {loggedInUser && (
                          <>
                            <button
                              className="btn-filter-with-icon"
                              onClick={() => {
                                setShowNewCommentDialog(
                                  !showNewCommentDialog,
                                );
                              }}
                            >
                              {t('post.newComment')}
                            </button>
                            {showNewCommentDialog && (
                              <PostCommentNew
                                postId={post.id}
                                onSubmit={() => {
                                  reloadPosts(button.id);
                                  setShowComments(true);
                                  setShowNewCommentDialog(false);
                                }}
                              />
                            )}
                          </>
                        )}
                        <PostComments
                          comments={post.comments}
                          showComments={showComments}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {!posts || posts.length == 0 && <>{t('common.notfound', ['posts'])}</>}
      </div>
    </div>
  );
}
