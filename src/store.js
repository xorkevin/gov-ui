import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Settings from 'service/settings';
import Snackbar from 'service/snackbar';

const store = createStore(
  combineReducers({
    Settings,
    Snackbar,
  }),
  applyMiddleware(thunk),
);

export default store;
