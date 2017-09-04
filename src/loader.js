import {Component} from 'preact';

const Loader = (moduleName, callback)=>{
  return class extends Component {
    constructor(props){
      super(props);
      this.state = {
        loaded: false,
        mod: false,
      };
    }

    load(){
      if(!this.state.loaded && typeof moduleName === 'string' && moduleName.length > 0){
        import('./'+moduleName).then((mod)=>{
          let k = mod;
          if(mod.default){
            k = mod.default;
          }
          this.setState({
            loaded: true,
            mod: k,
          });
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
