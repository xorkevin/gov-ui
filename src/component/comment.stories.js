import React from 'react';
import {CommentSection, Comment} from 'component/comment';

export default {title: 'Comment section'};

export const plain = () => (
  <CommentSection>
    <Comment
      username="xorkevin"
      score={256}
      time={Date.now() - 0.5 * 86400000}
      content="Lorem ipsum dolor sit amet"
    >
      <Comment
        username="xorkevin"
        score={32}
        time={Date.now() - 0.25 * 86400000}
        content="Consectetur adipiscing elit"
      >
        <Comment
          username="xorkevin"
          score={16}
          time={Date.now()}
          content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
        />
      </Comment>
      <Comment
        username="xorkevin"
        score={128}
        time={Date.now() - 0.325 * 86400000}
        content="Nunc facilisis orci dui, sit amet dictum massa porta at"
      >
        <Comment
          username="xorkevin"
          score={16}
          time={Date.now()}
          content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
        />
        <Comment
          username="xorkevin"
          score={16}
          time={Date.now()}
          content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
        >
          <Comment
            username="xorkevin"
            score={16}
            time={Date.now()}
            content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
          >
            <Comment
              username="xorkevin"
              score={16}
              time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
            />
          </Comment>
        </Comment>
        <Comment
          username="xorkevin"
          score={16}
          time={Date.now()}
          content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
        />
      </Comment>
    </Comment>
    <Comment
      username="xorkevin"
      score={64}
      time={Date.now() - 0.75 * 86400000}
      content="Integer fringilla aliquet condimentum"
    >
      <Comment
        username="xorkevin"
        score={8}
        time={Date.now() - 0.015625 * 86400000}
        content="In hac habitasse platea dictumst"
      />
      <Comment
        username="xorkevin"
        score={16}
        time={Date.now()}
        content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
      />
    </Comment>
    <Comment
      username="xorkevin"
      score={1}
      time={Date.now() - 180000}
      content="Vivamus nibh enim, dignissim quis consequat at, sagittis in magna"
    >
      <Comment
        username="xorkevin"
        score={16}
        time={Date.now()}
        content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
      >
        <Comment
          username="xorkevin"
          score={16}
          time={Date.now()}
          content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
        >
          <Comment
            username="xorkevin"
            score={16}
            time={Date.now()}
            content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
          >
            <Comment
              username="xorkevin"
              score={16}
              time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
            >
              <Comment
                username="xorkevin"
                score={16}
                time={Date.now()}
                content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
              >
                <Comment
                  username="xorkevin"
                  score={16}
                  time={Date.now()}
                  content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                >
                  <Comment
                    username="xorkevin"
                    score={16}
                    time={Date.now()}
                    content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                  >
                    <Comment
                      username="xorkevin"
                      score={16}
                      time={Date.now()}
                      content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                    >
                      <Comment
                        username="xorkevin"
                        score={16}
                        time={Date.now()}
                        content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                      />
                    </Comment>
                  </Comment>
                </Comment>
              </Comment>
            </Comment>
          </Comment>
        </Comment>
      </Comment>
    </Comment>
  </CommentSection>
);
