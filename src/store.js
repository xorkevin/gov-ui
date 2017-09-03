import {createStore, combineReducers, applyMiddleware} from 'redux';

import * as reducers from 'reducer';

const makeStore = ()=>{
  return createStore(
    combineReducers(Object.assign({}, reducers)),
  );
};

export default makeStore
