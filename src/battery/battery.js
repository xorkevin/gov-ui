class Battery {
  constructor(){
    this.promises = [];
  }

  charge(promises){
    this.promises.concat(promises);
  }

  resolve(){
    return new Promise.all(this.promises);
  }
}

export default Battery
