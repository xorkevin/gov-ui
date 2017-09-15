import {API} from 'config';

const CREATEACCOUNT = Symbol('CREATEACCOUNT');
const CREATEACCOUNT_SUCCESS = Symbol('CREATEACCOUNT_SUCCESS');
const CREATEACCOUNT_ERR = Symbol('CREATEACCOUNT_ERR');

const CreateAccountSuccess = (config)=>{
  return {
    type: CREATEACCOUNT_SUCCESS,
    config,
  };
};

const CreateAccountErr = (err)=>{
  return {
    type: CREATEACCOUNT_ERR,
    err,
  };
};

const CreateAccountReq = (options)=>{
  return async (dispatch)=>{
    dispatch({
      type: CREATEACCOUNT,
    });
    try {
      const response = await fetch(API.u.user.new, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(options),
      });
      const status = response.status;
      const data = await response.json();
      if(status >= 200 && status < 300){
        dispatch(CreateAccountSuccess(data));
      } else if(data && data.message){
        throw new Error(data.message);
      } else {
        throw new Error('Could not create account');
      }
    } catch(e){
      dispatch(CreateAccountErr(e.message));
    }
  };
};

const CONFIRMACCOUNT = Symbol('CONFIRMACCOUNT');
const CONFIRMACCOUNT_SUCCESS = Symbol('CONFIRMACCOUNT_SUCCESS');
const CONFIRMACCOUNT_ERR = Symbol('CONFIRMACCOUNT_ERR');

const ConfirmAccountSuccess = (config)=>{
  return {
    type: CONFIRMACCOUNT_SUCCESS,
    config,
  };
};

const ConfirmAccountErr = (err)=>{
  return {
    type: CONFIRMACCOUNT_ERR,
    err,
  };
};

const ConfirmAccountReq = (key)=>{
  return async (dispatch)=>{
    dispatch({
      type: CONFIRMACCOUNT,
    });
    try {
      const response = await fetch(API.u.user.confirm, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key}),
      });
      const status = response.status;
      const data = await response.json();
      if(status >= 200 && status < 300){
        dispatch(ConfirmAccountSuccess(data));
      } else if(data && data.message){
        throw new Error(data.message);
      } else {
        throw new Error('Could not create account');
      }
    } catch(e){
      dispatch(ConfirmAccountErr(e.message));
    }
  };
};

const defaultState = {
  loading: false,
  success: false,
  config: false,
  err: false,
  confirmloading: false,
  confirmsuccess: false,
  confirmconfig: false,
  confirmerr: false,
};

const initState = ()=>{
  return Object.assign({}, defaultState);
};

const CreateAccount = (state=initState(), action)=>{
  switch(action.type){
    case CREATEACCOUNT:
      return Object.assign({}, state, {
        loading: true,
      });
    case CREATEACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        success: true,
        config: action.config,
        err: false,
      });
    case CREATEACCOUNT_ERR:
      return Object.assign({}, state, {
        loading: false,
        success: false,
        config: false,
        err: action.err,
      });
    case CONFIRMACCOUNT:
      return Object.assign({}, state, {
        confirmloading: true,
      });
    case CONFIRMACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        confirmloading: false,
        confirmsuccess: true,
        confirmconfig: action.config,
        confirmerr: false,
      });
    case CONFIRMACCOUNT_ERR:
      return Object.assign({}, state, {
        confirmloading: false,
        confirmsuccess: false,
        confirmconfig: false,
        confirmerr: action.err,
      });
    default:
      return state;
  }
};

export {
  CreateAccount, CreateAccountReq, ConfirmAccountReq,
}
