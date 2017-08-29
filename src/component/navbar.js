import {h} from 'preact';
import Container from 'component/container';
import Anchor from 'component/anchor';

import './navbar.scss';

const scrollTime = 384;
const navHeight = 64;

const easing = (t)=>{
  if(t<.5){
    return 4*t*t*t;
  } else {
    return (t-1) * (2*t-2) * (2*t-2) + 1;
  }
};

const scrollTo = (element, duration)=>{
  const startingY = window.pageYOffset;
  let elementY = 0;
  if(element){
    elementY = window.scrollY + document.getElementById(element).getBoundingClientRect().top;
  }
  let targetY = elementY - navHeight;
  if(targetY < 0) {
    targetY = 0;
  }
  if(document.body.scrollHeight - elementY < window.innerHeight){
    targetY = document.body.scrollHeight - window.innerHeight;
  }
  const diff = targetY - startingY;
  let start;
  if(!diff){
    return;
  }
  window.requestAnimationFrame(function step(timestamp) {
    if (!start){
      start = timestamp;
    }
    const time = timestamp - start;
    window.scrollTo(0, startingY + diff * easing(Math.min(time / duration, 1)));
    if(time < duration) {
      window.requestAnimationFrame(step)
    }
  });
};

const Navbar = ({left, right, children})=>{
  let j = [];
  let k = [];
  if(left){
    for(let i = 0; i < left.length; i++){
      const l = left[i];
      if(l.scroll){
        j.push(<div key={l.key} className="item" onClick={()=>{scrollTo(l.target, scrollTime);}}>{l.component}</div>);
      } else {
        j.push(<div key={l.key} className="item"><Anchor noStyle ext={l.ext} href={l.target}>{l.component}</Anchor></div>);
      }
    }
  }
  if(right){
    for(let i = 0; i < right.length; i++){
      const l = right[i];
      if(l.scroll){
        k.push(<div key={l.key} className="item" onClick={()=>{scrollTo(l.target, scrollTime);}}>{l.component}</div>);
      } else {
        k.push(<div key={l.key} className="item"><Anchor noStyle ext={l.ext} href={l.target}>{l.component}</Anchor></div>);
      }
    }
  }
  return <nav>
    <div className="nav-container">
      <Container padded>
        <div className="element">
          {j}
        </div>
        <div className="element">
          {children}
        </div>
        <div className="element">
          {k}
        </div>
      </Container>
    </div>
  </nav>;
};

export default Navbar
