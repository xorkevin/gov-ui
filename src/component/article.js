import {h} from 'preact';
import Container from 'component/container';
import Time from 'component/time';

const Article = ({title, author, time, children}) => {
  return (
    <article>
      <h2>{title}</h2>
      <span className="info">
        {author} | <Time value={time} />
      </span>
      {children}
    </article>
  );
};

export default Article;
