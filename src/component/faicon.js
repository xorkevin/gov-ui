import {h} from 'preact';

const FaIcon = ({border, icon})=>{
  if(border){
    return <span className="faicon border">
      <span className="inner">
        <i className={"fa fa-fw fa-" + icon}></i>
      </span>
    </span>;
  }
  return <i className={"fa fa-fw fa-" + icon}></i>;
};

export default FaIcon
