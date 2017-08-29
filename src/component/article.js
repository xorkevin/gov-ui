import {h} from 'preact';
import Time from 'component/time';

import './article.scss';

const Article = ({title, author, time, children})=>{
  return <article>
    <h2>{title}</h2>
    <span className="info">{author} | <Time value={time}/></span>
    {children}
  </article>;
};

export default Article
