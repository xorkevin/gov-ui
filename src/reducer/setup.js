import {API} from 'config';

const SETUP = Symbol('SETUP');
const SETUP_SUCCESS = Symbol('SETUP_SUCCESS');
const SETUP_ERR = Symbol('SETUP_ERR');

const SetupSuccess = (config)=>{
  return {
    type: SETUP_SUCCESS,
    config,
  };
};

const SetupErr = (err)=>{
  return {
    type: SETUP_ERR,
    err,
  };
};

const SetupReq = (options)=>{
  return async (dispatch)=>{
    dispatch({
      type: SETUP,
    });
    try {
      const response = await fetch(API.setupz, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(options),
      });
      const status = response.status;
      const data = await response.json();
      if(status >= 200 && status < 300){
        dispatch(SetupSuccess(data));
      } else if(data && data.message){
        throw new Error(data.message);
      } else {
        throw new Error('Could not setup server');
      }
    } catch(e) {
      dispatch(SetupErr(e.message));
    }
  };
};


const defaultState = {
  loading: false,
  success: false,
  config: false,
  err: false,
};

const initState = ()=>{
  return Object.assign({}, defaultState);
};

const Setup = (state=initState(), action)=>{
  switch(action.type){
    case SETUP:
      return Object.assign({}, state, {
        loading: true,
      });
    case SETUP_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        success: true,
        config: action.config,
        err: false,
      });
    case SETUP_ERR:
      return Object.assign({}, state, {
        loading: false,
        success: false,
        config: false,
        err: action.err,
      });
    default:
      return state;
  }
};

export {
  Setup, SetupReq,
}
