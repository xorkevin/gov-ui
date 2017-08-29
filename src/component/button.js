import {h} from 'preact';

import './button.scss';

const Button = ({primary, outline, text, fixedWidth, raised, children})=>{
  const k = [];
  if(primary){
    k.push("primary");
  } else if(outline){
    k.push("outline");
  } else if(text){
    k.push("text");
  }

  if(fixedWidth){
    k.push("fixed-width");
  }

  if(raised){
    k.push("raised");
  }

  return <button className={k.join(" ")}>{children}</button>
};

export default Button
