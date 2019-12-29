import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Auth from '@xorkevin/turbine';
import {DarkMode, Snackbar} from '@xorkevin/nuke';

const _logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const store = createStore(
  combineReducers({
    Auth,
    DarkMode,
    Snackbar,
  }),
  applyMiddleware(thunk),
);

export default store;
