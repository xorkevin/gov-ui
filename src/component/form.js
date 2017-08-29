import {h} from 'preact';
import shortid from 'shortid';

import './form.scss';

const Input = ({valid, error, fullWidth, textarea, label, info})=>{
  const id = shortid.generate();
  let k = ["input"];
  if(valid){
    k.push("valid");
  } else if(error){
    k.push("invalid");
  }

  if(fullWidth){
    k.push("full-width");
  }

  return <div className={k.join(" ")}>
    {!textarea && <input id={id} placeholder=" "/>}
    {textarea && <textarea id={id} placeholder=" "></textarea>}
    <label htmlFor={id}>{label}</label>
    {!error && info && <span className="info">{info}</span>}
    {error && <span className="error">{error}</span>}
  </div>;
};

export default Input
