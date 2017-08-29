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

const Header = Deferrer(({size, fixed, color, image, children})=>{
  let k = [];
  let j = ["inner-static"];
  let l = ["inner"];
  if(size){
    k.push("hero");
    j.push("hero");
    l.push("hero");
    k.push(size);
    j.push(size);
    l.push(size);
  } else {
    k.push("header");
    j.push("header");
    l.push("header");
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
  return <header className={k.join(" ")} style={s}>
    <Container padded>
      {children}
    </Container>
  </header>;
}, {type: 'image', target: 'image'});

export default Header
