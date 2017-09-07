import Deferred from './deferred';

class Battery {
  constructor(store){
    this.promises = [];
    this.store = store;
  }

  size(){
    return this.promises.length;
  }

  charge(contracts){
    contracts.forEach((action)=>{
      const {promise, resolve} = new Deferred();
      const contract = async ()=>{
        await this.store.dispatch(action);
        resolve();
      };
      contract();
      this.promises.push(promise);
    });
  }

  resolve(){
    return Promise.all(this.promises);
  }
}

export default Battery
