import {h, Component} from 'preact';
import Container from 'component/container';

const scrollTime = 384;
const scrollTimeSqrt = Math.sqrt(scrollTime);
const navHeight = 64;
const scrollDistanceCap = 4096;

const easing = (t)=>{
  if(t<.5){
    return 4*t*t*t;
  } else {
    return (t-1) * (2*t-2) * (2*t-2) + 1;
  }
};

const scrollTo = (element)=>{
  const startingY = window.pageYOffset;
  let elementY = 0;
  if(element){
    elementY = window.scrollY + document.getElementById(element).getBoundingClientRect().top;
  }
  let targetY = elementY - navHeight;
  if(targetY < 0) {
    targetY = 0;
  }
  const scrollHeight = document.body.scrollHeight;
  const innerHeight = window.innerHeight;
  if(scrollHeight - elementY < innerHeight){
    targetY = scrollHeight - innerHeight;
  }
  const diff = targetY - startingY;
  let start;
  if(!diff){
    return;
  }
  const duration = Math.min(Math.sqrt(Math.abs(diff) * scrollTime / scrollDistanceCap) * scrollTimeSqrt, scrollTime);
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

class Navbar extends Component {
  render({sidebar, left, right, children}){
    const className = [];
    if(sidebar){
      className.push("sidebar");
    }
    let j = [];
    let k = [];
    if(left){
      for(let i = 0; i < left.length; i++){
        const l = left[i];
        if(l.scroll){
          j.push(<div key={l.key} className="item" onClick={()=>{scrollTo(l.target);}}>{l.component}</div>);
        } else {
          j.push(<div key={l.key} className="item">{l.component}</div>);
        }
      }
    }
    if(right){
      for(let i = 0; i < right.length; i++){
        const l = right[i];
        if(l.scroll){
          k.push(<div key={l.key} className="item" onClick={()=>{scrollTo(l.target);}}>{l.component}</div>);
        } else {
          k.push(<div key={l.key} className="item">{l.component}</div>);
        }
      }
    }
    return <nav className={className.join(" ")}>
      <div className="nav-container">
        <Container>
          <div className="element">
            {j}
          </div>
          {children && children.length > 0 && <div className="element">
            {children}
          </div>}
          <div className="element">
            {k}
          </div>
        </Container>
      </div>
    </nav>;
  }
}

export default Navbar
