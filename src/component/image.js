import {h, Component} from 'preact';
import {isWeb} from 'utility';

import './image.scss';

const deferLoadImage = (src)=>{
  return new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=>{
      resolve(src);
    };
    img.src = src;
  });
};

class Img extends Component {
  constructor(props){
    super(props);
    this.state = {
      imgsrc: false,
      loaded: false,
    };
  }

  tick(){
    const innerHeight = window.innerHeight;
    const {top: elemTop, bottom: elemBottom} = this.elem.getBoundingClientRect();
    const halfHeight = innerHeight / 2;
    const topBound = -halfHeight;
    const bottomBound = innerHeight + halfHeight;
    if(elemTop < bottomBound && elemTop > topBound || elemBottom < bottomBound && elemBottom > topBound){
      if(this.props.fixed){
        deferLoadImage(this.props.src).then((src)=>{
          this.setState((prevState)=>{
            return Object.assign({}, prevState, {imgsrc: src});
          });
          this.imgLoaded();
        });
      } else {
        this.setState((prevState)=>{
          return Object.assign({}, prevState, {imgsrc: this.props.src});
        });
      }
      return true;
    }
  }

  imgLoaded(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {loaded: true});
    });
  }

  unbind(){
    if(this.handler){
      window.removeEventListener('scroll', this.handler);
      window.removeEventListener('resize', this.handler);
      this.handler = false;
    }
  }

  componentDidMount(){
    if(isWeb() && this.props.src){
      this.running = false;
      this.handler = ()=>{
        if(!this.running){
          this.running = true;
          window.requestAnimationFrame(()=>{
            if(this.tick()){
              this.unbind();
            }
            this.running = false;
          });
        }
      };
      window.addEventListener('scroll', this.handler);
      window.addEventListener('resize', this.handler);
      this.handler();
    }
  }

  componentWillUnmount(){
    this.unbind();
  }

  render({preview, size, fixed, color, width, height, imgWidth, imgHeight, className}, {imgsrc, loaded}){
    const k = ['img'];

    if(className){
      k.push(className);
    }
    if(!loaded){
      k.push('invisible');
    }
    if(fixed){
      k.push('fixed');
      if(!size){
        size = 'full';
      }
    }
    switch(size){
      case 'sm':
      case 'md':
      case 'lg':
      case 'full':
        k.push(size);
    }

    const s = {};
    let url = undefined;
    if(imgsrc){
      url = imgsrc;
      s.backgroundImage = `url(${imgsrc})`;
    } else if(preview){
      k.push('preview');
      url = preview;
      s.backgroundImage = `url(${preview})`;
    }
    if(color){
      s.backgroundColor = color;
    }

    let image;
    if(fixed){
      image = <div className='image' style={s}/>;
    } else {
      image = <img className='image' src={url} onLoad={()=>{this.imgLoaded();}}/>;
    }

    const l = {};
    if(width){
      l.width = width;
    }
    if(height){
      l.height = height;
    }

    const j = {};
    if(!size && imgWidth && imgHeight && imgWidth !== 0){
      j.paddingBottom = (imgHeight / imgWidth).toFixed(4) * 100 + '%';
    }

    return <div className={k.join(' ')} style={l} ref={(elem)=>{this.elem = elem;}}>
      <div className='inner' style={j}>
        {image}
        <noscript>
          <img className='image' src={this.props.src}/>
        </noscript>
      </div>
    </div>;
  }
}

export default Img
