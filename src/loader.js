import {Component} from 'preact';

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
          console.error(err);
        });
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
