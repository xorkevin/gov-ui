const Charge = (timeout = 1000)=>{
  const id = new Symbol();
  let r;
  const k = new Promise((resolve)=>{
    r = resolve;
  });

  let resolved = false;
  const timer = setTimeout(()=>{
    if(!resolved){
      resolved = true;
      r(id);
    }
  }, timeout);

  return {
    promise: k,
    id: id,
    resolver: ()=>{
      if(!resolved){
        clearTimeout(timer);
        resolved = true;
        r(id);
      }
    },
  };
};

export default Charge
