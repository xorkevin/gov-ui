const formatStr = (str, ...args)=>{
  return str.replace(/{(\d+)}/g, (match, number)=>{
    if(typeof args[number] != 'undefined'){
      return args[number];
    }
    return match;
  });
};

const IS_WEB = typeof window !== 'undefined';

const isWeb = ()=>{
  return IS_WEB;
};

const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

export {
  formatStr, isWeb, logger,
}
