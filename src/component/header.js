import {h} from 'preact';
import Container from 'component/container';
import Deferrer from 'component/deferrer';

import './header.scss';

const nextIndex = (current, cap)=>{
  return (current + 1) % cap;
};

const colorSwitch = (colorName)=>{
  if(!colorName){
    return "";
  }
  if(colorName.length == 7 && colorName[0] == '#'){
    return colorName;
  }
  switch(colorName){
    case "accent":
      return "#FFB74D";
    case "primary":
      return "#224A7F";
  }
  return "";
};

const Header = Deferrer(({semantic, size, fixed, color, image, children})=>{
  let k = [];
  switch(size){
    case "sm":
    case "md":
    case "lg":
    case "full":
      k.push(size);
  }
  if(fixed){
    k.push("fixed");
  }
  const s = {
  };
  if(image){
    s.backgroundImage = `url(${image})`;
  }
  const y = colorSwitch(color);
  if(y !== ""){
    s.backgroundColor = y;
  }
  if(semantic){
    return <header className={k.join(" ")} style={s}>
      <Container padded>
        {children}
      </Container>
    </header>;
  }
  k.push("header");
  return <div className={k.join(" ")} style={s}>
    <Container padded>
      {children}
    </Container>
  </div>;
}, {type: 'image', target: 'image'});

export default Header
