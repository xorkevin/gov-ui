const Deferred = (timeout = 1000)=>{
  let r;
  const k = new Promise((resolve)=>{
    r = resolve;
  });

  let resolved = false;
  const timer = setTimeout(()=>{
    if(!resolved){
      resolved = true;
      r();
    }
  }, timeout);

  return {
    promise: k,
    resolve: ()=>{
      if(!resolved){
        clearTimeout(timer);
        resolved = true;
        r();
      }
    },
  };
};

export default Deferred
