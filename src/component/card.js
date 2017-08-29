import {h} from 'preact';
import Deferrer from 'component/deferrer';

import './card.scss';

const Card = Deferrer(({size, square, restrictWidth, restrictHeight, titleBar, background, title, children, bar})=>{
  let k = ["card"];
  if(size){
    switch(size){
      case "sm":
      case "md":
      case "lg":
        k.push(size);
      default:
        k.push("sm");
    }
  }

  if(square){
    k.push("restrict-width");
    k.push("restrict-height");
  } else if(restrictWidth){
    k.push("restrict-width");
  } else if(restrictHeight){
    k.push("restrict-height");
  }

  let titleclass = "title";
  if(titleBar){
    titleclass = "title-bar";
    k.push("accent");
  }

  let s = {};
  if(background){
    s = {
      backgroundImage: `url(${background})`,
    };
  }

  return <div className={k.join(" ")}>
    <div className={titleclass} style={s}>
      <div className="inner">
        {title}
      </div>
    </div>
    <div className="body">
      {children}
    </div>
    <div className="bar">
      {bar}
    </div>
  </div>;
}, {type: 'image', target: 'background'});

export default Card
