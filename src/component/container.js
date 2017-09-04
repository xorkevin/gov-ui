import {h} from 'preact';

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
