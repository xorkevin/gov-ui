import {createContext} from 'react';

const GovUIDefaultOpts = Object.freeze({
  fallbackView: 'Loading',
});

const GovUICtx = createContext(Object.assign({}, GovUIDefaultOpts));

const GovUIMiddleware = (value) => {
  const v = Object.assign({}, GovUIDefaultOpts, value);
  return {
    ctxProvider: ({children}) => (
      <GovUICtx.Provider value={v}>{children}</GovUICtx.Provider>
    ),
  };
};
