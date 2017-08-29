const formatStr = (str, ...args)=>{
  return str.replace(/{(\d+)}/g, (match, number)=>{
    if(typeof args[number] != 'undefined'){
      return args[number];
    }
    return match;
  });
};

const isWeb = ()=>{
  return typeof window !== 'undefined';
};

export {
  formatStr, isWeb,
}
