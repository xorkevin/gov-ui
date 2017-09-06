import {h, Component} from 'preact';

import Battery from './battery';

class Terminal extends Component {
  constructor(props, context){
    super(props, context);
    this.battery = props.battery;
  }

  getChildContext(){
    return {
      'battery': this.battery,
    };
  }

  render({children}){
    if(children.length > 0){
      return children[0];
    }
    return false;
  }
}

export default Terminal
