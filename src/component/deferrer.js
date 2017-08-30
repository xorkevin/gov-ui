import {h, Component} from 'preact';
import {isWeb} from 'utility';

const deferLoadImage = (url)=>{
  return new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=>{
      resolve(url);
    };
    img.src = url;
  });
};

const dataIsImage = ({type, target})=>{
  return type == 'image' && typeof target === 'string' && target.length > 0;
};

const Deferrer = (component, data)=>{
  let images = [];
  if(Array.isArray(data)){
    images = data.filter(dataIsImage);
  } else if(data && dataIsImage(data)){
    images.push(data);
  }

  return class extends Component {
    constructor(props){
      super(props);
      this.state = {};
      if(isWeb() && images.length > 0){
        images.forEach(({target})=>{
          if(this.props[target]){
            this.state[target] = false;
          }
        });
      }
    }

    tick(){
      const innerHeight = window.innerHeight;
      const {top: elemTop, bottom: elemBottom} = this.elem.getBoundingClientRect();
      const halfHeight = innerHeight / 2;
      const topBound = -halfHeight;
      const bottomBound = innerHeight + halfHeight;
      if(elemTop < bottomBound && elemTop > topBound || elemBottom < bottomBound && elemBottom > topBound){
        images.forEach(({target})=>{
          if(this.props[target]){
            deferLoadImage(this.props[target]).then((url)=>{
              this.setState((prevState)=>{
                const k = {};
                k[target] = url;
                return Object.assign({}, prevState, k);
              });
            });
          }
        });
        return true;
      }
    }

    unbind(){
      if(this.registered){
        window.removeEventListener("scroll", this.handler);
        window.removeEventListener("resize", this.handler);
      }
      if(this.handler){
        this.handler = false;
      }
    }

    componentDidMount(){
      if(isWeb() && images.length > 0){
        let prefired = false;
        this.running = false;
        this.registered = false;
        this.handler = ()=>{
          if(!this.running){
            this.running = true;
            window.requestAnimationFrame(()=>{
              if(this.tick()){
                prefired = true;
                this.unbind();
              }
              this.running = false;
            });
          }
        };
        this.handler();
        if(!prefired){
          window.addEventListener("scroll", this.handler);
          window.addEventListener("resize", this.handler);
          this.registered = true;
        }
      }
    }

    componentWillUnmount(){
      this.unbind();
    }

    render(props, state){
      const k = Object.assign({}, props, state);
      return <div ref={(elem)=>{this.elem = elem;}}>{h(component, k)}</div>;
    }
  };
};

export default Deferrer
