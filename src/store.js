import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import * as reducers from 'reducer';

const makeStore = () => {
  return createStore(
    combineReducers(Object.assign({}, reducers)),
    applyMiddleware(thunk),
  );
};

export default makeStore;
