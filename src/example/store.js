import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Auth from '@xorkevin/turbine';
import {DarkMode, Snackbar} from '@xorkevin/nuke';

const store = createStore(
  combineReducers({
    Auth,
    DarkMode,
    Snackbar,
  }),
  applyMiddleware(thunk),
);

export default store;
