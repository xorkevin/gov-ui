import {h, Component} from 'preact';

const Connector = (contracts)=>{
  return (Child)=>{
    return class extends Component {
      constructor(props, context){
        super(props, context);
        if(context.battery){
          context.battery.charge(contracts);
        }
      }

      render(){
        return h(Child);
      }
    };
  };
};

export default Connector
