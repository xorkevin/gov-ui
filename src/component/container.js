import {h} from 'preact';

import './container.scss';

const Container = ({padded, children})=>{
  const k = ["container"];
  if(padded){
    k.push("padded")
  }

  return <div className={k.join(" ")}>
    {children}
  </div>;
};

export default Container
