const CHARGE = new Symbol('CHARGE');

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
    action: {
      type: CHARGE,
      promise: k,
      id: id,
    },
    resolver: ()=>{
      if(!resolved){
        resolved = true;
        clearTimeout(timer);
        r(id);
      }
    },
  };
};

export {Charge, CHARGE}
