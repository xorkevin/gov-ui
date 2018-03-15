import {h, Component} from 'preact';

const loadingDefault = () => {
  return <div>LOADING</div>;
};

const Loader = (loader, callback, args, loading) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loaded: false,
        mod: false,
      };
    }

    load() {
      if (!this.state.loaded) {
        loader()
          .then(mod => {
            let k = mod;
            if (mod.default) {
              k = mod.default;
            }
            this.setState({
              loaded: true,
              mod: k,
            });
          })
          .catch(err => {});
      }
    }

    componentWillMount() {
      this.load();
    }

    render({}, {loaded, mod}) {
      if (loaded) {
        return (callback && callback(mod)) || h(mod, args);
      }
      return (loading && loading()) || loadingDefault();
    }
  };
};

export default Loader;
