import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Health from 'reducer/health';
import Settings from 'reducer/settings';
import Auth from 'reducer/auth';

const store = createStore(
  combineReducers({
    Health,
    Settings,
    Auth,
  }),
  applyMiddleware(thunk),
);

export default store;
