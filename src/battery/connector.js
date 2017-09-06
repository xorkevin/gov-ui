import {h, Component} from 'preact';

import {isWeb} from 'utility';
import Deferred from './deferred';

const Connector = (contracts)=>{
  return (Child)=>{
    return class extends Component {
      componentWillMount(){
        if(!isWeb()){
          const battery = this.context.battery;
          const store = battery.getStore();
          battery.charge(contracts.map((contract)=>{
            const {promise, resolver} = new Deferred();
            contract(store, resolver);
            return promise;
          }));
        }
      }

      render(){
        return h(Child);
      }
    };
  };
};

export default Connector
