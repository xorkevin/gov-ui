import {h} from "preact";
import Img from "component/image";

const Card = ({size, square, restrictWidth, restrictHeight, titleBar, background, preview, title, children, bar})=>{
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

  return <div className={k.join(" ")}>
    <div className={titleclass}>
      {!titleBar && <Img size="fill" src={background} preview={preview}>
        <div className="title-inner">
          {title}
        </div>
      </Img>}
      {titleBar && <div className="title-inner">
        {title}
      </div>}
    </div>
    <div className="body">
      {children}
    </div>
    <div className="bar">
      {bar}
    </div>
  </div>;
};

export default Card
