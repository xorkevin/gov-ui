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
  } else if(dataIsImage(data)){
    images.push(data);
  }

  return class extends Component {
    constructor(props){
      super(props);
      this.state = {};
      if(isWeb()){
        images.forEach(({target})=>{
          if(this.props[target]){
            this.state[target] = false;
          }
        });
      }
    }

    componentWillMount() {
      if(isWeb()){
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
      }
    }

    render(props, state){
      const k = Object.assign({}, props, state);
      return h(component, k);
    }
  };
};

export default Deferrer
