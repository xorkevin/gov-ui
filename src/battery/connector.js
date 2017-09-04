import {h, Component} from 'preact';

const Connector = (Child)=>{
  return class extends Component {
    render(){
      return h(Child);
    }
  };
};
