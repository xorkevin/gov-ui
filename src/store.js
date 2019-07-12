import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Settings from 'service/settings';

const store = createStore(
  combineReducers({
    Settings,
  }),
  applyMiddleware(thunk),
);

export default store;
