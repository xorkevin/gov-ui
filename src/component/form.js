import {h} from 'preact';

import './form.scss';

const Input = ({valid, error, fullWidth, textarea, label, info})=>{
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
    {!textarea && <input placeholder=" "/>}
    {textarea && <textarea placeholder=" "></textarea>}
    <label>{label}</label>
    {!error && info && <span className="info">{info}</span>}
    {error && <span className="error">{error}</span>}
  </div>;
};

export default Input
