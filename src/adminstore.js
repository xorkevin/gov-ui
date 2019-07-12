import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Settings from 'service/settings';
import Auth from 'service/auth';

const store = createStore(
  combineReducers({
    Settings,
    Auth,
  }),
  applyMiddleware(thunk),
);

export default store;
