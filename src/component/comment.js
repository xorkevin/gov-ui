import React, {useState, useEffect} from 'react';
import Container from 'component/container';
import Time from 'component/time';

const Comment = ({depth, username, score, time, content, children}) => {
  const [hidden, setHidden] = useState(false);
  const k = ['comment'];
  if (hidden) {
    k.push('hidden');
  }
  return (
    <div className={k.join(' ')}>
      <div className="inner">
        <div className="info">
          <span className="data hide">
            <a className="no-color" onClick={() => setHidden((h) => !h)}>
              [{hidden && '+'}
              {!hidden && '-'}]
            </a>
          </span>
          <span className="username">
            <a>{username}</a>
          </span>
          <span className="data score">{score} points</span>
          <span className="data time">
            <Time value={time} />
          </span>
        </div>
        <div className="content">{content}</div>
        <div className="options">
          <span>
            <a className="no-color">link</a>
          </span>
          <span>
            <a className="no-color">source</a>
          </span>
          <span>
            <a className="no-color">reply</a>
          </span>
          <span>
            <a className="no-color">report</a>
          </span>
        </div>
      </div>
      {!hidden && children && (
        <div className="children">
          {depth > 0 &&
            React.Children.map(children, (child) => {
              return React.cloneElement(child, {
                depth: depth - 1,
              });
            })}
          {depth <= 0 && (
            <span>
              <a className="no-color">continue &gt;</a>
            </span>
          )}
          {!depth && typeof depth !== 'number' && children}
        </div>
      )}
    </div>
  );
};

const WIDTH = {
  sm: 768,
};
WIDTH.md = WIDTH.sm * 1.5;
WIDTH.xs = WIDTH.sm / 2;

const DEPTH = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
};

const widthToDepth = (width) => {
  if (width > WIDTH.md) {
    return DEPTH.md;
  } else if (width > WIDTH.sm) {
    return DEPTH.sm;
  } else if (width > WIDTH.xs) {
    return DEPTH.xs;
  }
  return DEPTH.xxs;
};

const CommentSection = ({children}) => {
  const [depth, setDepth] = useState(widthToDepth(window.innerWidth));

  useEffect(() => {
    let running = false;
    const handler = () => {
      if (!running) {
        running = true;
        window.requestAnimationFrame(() => {
          setDepth(widthToDepth(window.innerWidth));
          running = false;
        });
      }
    };
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return (
    <Container padded narrow>
      <h5>Comments</h5>
      <div className="comment-section">
        {children &&
          React.Children.map(children, (child) => {
            return React.cloneElement(child, {
              depth: depth - 1,
            });
          })}
        {!children && <span>No comments</span>}
      </div>
    </Container>
  );
};

const Components = {Comment, CommentSection};

export {Comment, CommentSection};

export default Components;
