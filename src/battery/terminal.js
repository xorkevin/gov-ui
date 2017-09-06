import {h, Component} from 'preact';

import Battery from './battery';

const TERMINALKEY = Symbol('TERMINALKEY');

class Terminal extends Component {
  constructor(props, context){
    super(props, context);
    this.battery = props.battery || new Battery();
  }

  getChildContext(){
    return {
      [TERMINALKEY]: this.battery,
    };
  }

  render({children}){
    if(children.length > 0){
      return children[0];
    }
    return false;
  }
}

export {
  TERMINALKEY, Terminal,
}