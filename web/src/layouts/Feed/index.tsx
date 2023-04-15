//FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES
import PostCommentNew from 'components/feed/PostCommentNew';
import PostComments from 'components/feed/PostComments';
import PostMessage from 'components/feed/PostMessage';
import PostNew from 'components/feed/PostNew';
import Dropdown from 'elements/Dropdown/DropDown';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { alertService } from 'services/Alert';
import { LoadPosts } from 'state/Posts';
import { useRef } from 'store/Store';

export default function Feed({ buttonId, buttonOwnerId = -1 }) {
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
    if (!posts && buttonId) {
      reloadPosts(buttonId);
    }
  }, [buttonId]);

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
      {loggedInUser && buttonId  && buttonOwnerId == loggedInUser.id && (
        <PostNew
          buttonId={buttonId}
          onSubmit={() => {
            reloadPosts(buttonId);
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
                            ? '+' +
                              post.comments.length +
                              ' comment' +
                              (post.comments.length > 1 ? 's' : '')
                            : ''}
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {loggedInUser && (
                          <>
                            <button class="btn-filter-with-icon"
                              onClick={() => {
                                setShowNewCommentDialog(
                                  !showNewCommentDialog,
                                );
                              }}
                            >
                              Leave comment +
                            </button>
                            {showNewCommentDialog && (
                              <PostCommentNew
                                postId={post.id}
                                onSubmit={() => {
                                  reloadPosts(buttonId);
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
          {(posts && posts.length == 0) && 
            <>
            No posts here
            </>
          }
      </div>
    </div>
  );
}
