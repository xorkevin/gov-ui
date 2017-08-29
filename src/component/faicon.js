import {h} from 'preact';

import './faicon.scss';

const FaIcon = ({border, icon})=>{
  if(border){
    return <span className="faicon border">
      <span className="inner">
        <i className={"fa fa-" + icon}></i>
      </span>
    </span>;
  }
  return <i className={"fa fa-" + icon}></i>;
};

export default FaIcon
