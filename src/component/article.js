import {h} from 'preact';
import Container from 'component/container';
import Time from 'component/time';

const Article = ({title, subtitle, author, time, children}) => {
  return (
    <article>
      <h2 className="title">{title}</h2>
      {subtitle && <h4 className="subtitle">{subtitle}</h4>}
      <span className="info">
        {author} | <Time value={time} />
      </span>
      {children}
    </article>
  );
};

export default Article;
