import {h, Component} from 'preact';

const Tooltip = ({position, tooltip, children})=>{
  const k = ["tooltip"];
  switch(position){
    case "left":
    case "right":
    case "top":
    case "bottom":
      k.push(position);
      break;
    default:
      k.push("top");
  }

  return <span className="tooltip-parent"><span className={k.join(" ")}>{tooltip}</span>{children && children.length > 0 && children[0]}</span>;
};

export default Tooltip
