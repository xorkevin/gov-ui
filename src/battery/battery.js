import Deferred from './deferred';

class Battery {
  constructor(store){
    this.promises = [];
    this.store = store;
  }

  size(){
    return this.promises.length;
  }

  getStore(){
    return {
      dispatch: this.store.dispatch,
      getState: this.store.getState,
    };
  }

  charge(contracts){
    contracts.forEach((contract)=>{
      const {promise, resolver} = new Deferred();
      contract(this.getStore(), resolver);
      this.promises.push(promise);
    });
  }

  resolve(){
    return Promise.all(this.promises);
  }
}

export default Battery
