import {h, Component} from 'preact';
import {isWeb} from 'utility';

const loadingDefault = ()=>{
  return <div>LOADING</div>;
};

const Loader = (loader, callback, loading)=>{
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
          Promise.resolve(loader()).then((mod)=>{
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
      if(loaded){
        return callback && callback(mod) || h(mod, this.props.args);
      }
      return loading && loading() || loadingDefault();
    }
  };
};

export default Loader
