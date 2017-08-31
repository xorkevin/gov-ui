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

export {
  formatStr, isWeb,
}
