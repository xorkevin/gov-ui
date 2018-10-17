import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import * as reducers from 'reducer/admin';

const makeStore = () => {
  return createStore(
    combineReducers(Object.assign({}, reducers)),
    applyMiddleware(thunk),
  );
};

export default makeStore;
