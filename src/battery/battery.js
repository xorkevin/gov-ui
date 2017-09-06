class Battery {
  constructor(store){
    this.promises = [];
    this.store = store;
  }

  getStore(){
    return {
      dispatch: this.store.dispatch,
      getState: this.store.getState,
    };
  }

  charge(promises){
    this.promises.concat(promises);
  }

  resolve(){
    return Promise.all(this.promises);
  }
}

export default Battery
