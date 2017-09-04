import {isWeb} from 'utility';

class Battery {
  constructor(){
    this.promises = [];
  }

  charge(promises){
    if(!isWeb()){
      this.promises.concat(promises);
    }
  }

  resolve(){
    return new Promise.all(this.promises);
  }
}

export default Battery
