import {h, Component} from 'preact';
import Time from 'component/time';
import {isWeb} from 'utility';

import './comment.scss';

class Comment extends Component {
  constructor(props){
    super(props);
    this.state = {
      hidden: props.hidden || false
    };
  }

  hide(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {hidden: true});
    });
  }

  show(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {hidden: false});
    });
  }

  toggleHidden(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {hidden: !prevState.hidden});
    });
  }

  render({depth, username, score, time, content, children}, {hidden}){
    const k = ["comment"];
    if(hidden){
      k.push("hidden");
    }
    return <div className={k.join(" ")}>
      <div className="inner">
        <div className="info">
          <span className="data hide"><a className="no-color" onClick={()=>{
            this.toggleHidden();
          }}>[{hidden && "+"}{!hidden && "-"}]</a></span>
          <span className="username"><a>{username}</a></span>
          <span className="data score">{score} points</span>
          <span className="data time"><Time value={time}/></span>
        </div>
        <div className="content">{content}</div>
        <div className="options">
          <span><a className="no-color">link</a></span>
          <span><a className="no-color">source</a></span>
          <span><a className="no-color">reply</a></span>
          <span><a className="no-color">report</a></span>
        </div>
      </div>
      {!hidden && children && <div className="children">
        {depth > 0 && children.map((child)=>{
          child.attributes.depth = depth - 1;
          return child;
        })}
        {depth <= 0 && <span><a className="no-color">continue &gt;</a></span>}
        {!depth && typeof depth !== 'number' && children}
      </div>}
    </div>;
  }
}

const WIDTH = {
  sm: 768,
};
WIDTH.md = WIDTH.sm * 1.5;
WIDTH.lg = WIDTH.md * 1.5;
WIDTH.xs = WIDTH.sm / 2;

const DEPTH = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
};

const widthToDepth = (width)=>{
  if(width > WIDTH.lg){
    return DEPTH.lg;
  } else if(width > WIDTH.md){
    return DEPTH.md;
  } else if(width > WIDTH.sm){
    return DEPTH.sm;
  } else if(width > WIDTH.xs){
    return DEPTH.xs;
  }
  return DEPTH.xxs;
};

class CommentSection extends Component {
  constructor(props){
    super(props);
    let width = WIDTH.md;
    if(isWeb()){
      width = window.innerWidth;
    }
    this.state = {
      depth: widthToDepth(width),
    };
  }

  tick(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {depth: widthToDepth(window.innerWidth)});
    });
  }

  componentDidMount(){
    if(isWeb()){
      this.running = false;
      this.handler = ()=>{
        if(!this.running){
          this.running = true;
          window.requestAnimationFrame(()=>{
            this.tick();
            this.running = false;
          });
        }
      };
      window.addEventListener("resize", this.handler);
    }
  }

  componentWillUnmount(){
    if(this.handler){
      window.removeEventListener("resize", this.handler);
    }
  }

  render({children}, {depth}){
    return <div className="comment-section">
      {children && children.map((child)=>{
        child.attributes.depth = depth - 1;
        return child;
      })}
      {!children && <span>No comments</span>}
    </div>;
  }
}

const Components = {Comment, CommentSection};

export {Comment, CommentSection}

export default Components
