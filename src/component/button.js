import {h} from 'preact';

const Button = ({primary, outline, text, fixedWidth, raised, label, children})=>{
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

  return <button className={k.join(" ")} aria-label={label}>{children}</button>
};

export default Button
