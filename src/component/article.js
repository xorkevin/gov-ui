import React from 'react';
import Section from 'component/section';
import Chip from 'component/chip';
import Time from 'component/time';

const Article = ({title, subtitle, author, time, tags, children}) => {
  return (
    <article>
      <h1 className="title">{title}</h1>
      {subtitle && <h3 className="subtitle">{subtitle}</h3>}
      <span className="info">
        {author} | <Time value={time} />
      </span>
      {children}
      <span className="info">
        {Array.isArray(tags) && tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}
      </span>
      <hr />
    </article>
  );
};

export default Article;
