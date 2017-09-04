import {h, Component} from 'preact';

import {TERMINALKEY} from './terminal';

const Connector = (promises)=>{
  return (Child)=>{
    return class extends Component {
      componentWillMount(){
        this.context[TERMINALKEY].charge(promises());
      }

      render(){
        return h(Child);
      }
    };
  };
};

export default Connector
