import {h, Component} from 'preact';

import {TERMINALKEY} from './terminal';
import Deferred from './deferred';

const Connector = (contracts)=>{
  return (Child)=>{
    return class extends Component {
      componentWillMount(){
        this.context[TERMINALKEY].charge(contracts.map((contract)=>{
          const {promise, resolver} = new Deferred();
          contract(resolver);
          return promise;
        }));
      }

      render(){
        return h(Child);
      }
    };
  };
};

export default Connector
