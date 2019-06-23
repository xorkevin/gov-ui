import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Health from 'reducer/health';
import Settings from 'service/settings';
import Auth from 'service/auth';

const store = createStore(
  combineReducers({
    Health,
    Settings,
    Auth,
  }),
  applyMiddleware(thunk),
);

export default store;
