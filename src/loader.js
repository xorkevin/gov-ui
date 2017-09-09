import {Component} from 'preact';
import {isWeb} from 'utility';

const Loader = (loader, callback)=>{
  return class extends Component {
    constructor(props){
      super(props);
      this.state = {
        loaded: false,
        mod: false,
      };
    }

    load(){
      if(!this.state.loaded){
        if(isWeb()){
          loader().then((mod)=>{
            let k = mod;
            if(mod.default){
              k = mod.default;
            }
            this.setState({
              loaded: true,
              mod: k,
            });
          }).catch((err)=>{
          });
        } else {
          let k = loader();
          if(k.default){
            k = k.default;
          }
          this.setState({
            loaded: true,
            mod: k,
          });
        }
      }
    }

    componentWillMount(){
      this.load();
    }

    render({}, {loaded, mod}){
      return callback && callback(loaded, mod);
    }
  };
};

export default Loader
