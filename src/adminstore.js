import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import * as reducers from 'reducer/admin';

const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const makeStore = ()=>{
  return createStore(
    combineReducers(Object.assign({}, reducers)),
    applyMiddleware(thunk)
  );
};

export default makeStore
