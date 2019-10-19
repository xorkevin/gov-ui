import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Auth from '@xorkevin/turbine';
import Settings from 'service/settings';
import Snackbar from 'service/snackbar';

const store = createStore(
  combineReducers({
    Auth,
    Settings,
    Snackbar,
  }),
  applyMiddleware(thunk),
);

export default store;
