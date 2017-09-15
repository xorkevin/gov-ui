import {API} from 'config';

const FORGOTPASSWORD = Symbol('FORGOTPASSWORD');
const FORGOTPASSWORD_SUCCESS = Symbol('FORGOTPASSWORD_SUCCESS');
const FORGOTPASSWORD_ERR = Symbol('FORGOTPASSWORD_ERR');

const ForgotPasswordSuccess = ()=>{
  return {
    type: FORGOTPASSWORD_SUCCESS,
  };
};

const ForgotPasswordErr = (err)=>{
  return {
    type: FORGOTPASSWORD_ERR,
    err,
  };
};

const ForgotPasswordReq = (username)=>{
  return async (dispatch)=>{
    dispatch({
      type: FORGOTPASSWORD,
    });
    try {
      const response = await fetch(API.u.user.password.forgot, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username}),
      });
      const status = response.status;
      if(status >= 200 && status < 300){
        dispatch(ForgotPasswordSuccess());
      } else {
        const data = await response.json();
        if(data && data.message){
          throw new Error(data.message);
        } else {
          throw new Error('Could not reset password');
        }
      }
    } catch(e){
      dispatch(ForgotPasswordErr(e.message));
    }
  };
};

const CONFIRMRESET = Symbol('CONFIRMRESET');
const CONFIRMRESET_SUCCESS = Symbol('CONFIRMRESET_SUCCESS');
const CONFIRMRESET_ERR = Symbol('CONFIRMRESET_ERR');

const ConfirmResetSuccess = ()=>{
  return {
    type: CONFIRMRESET_SUCCESS,
  };
};

const ConfirmResetErr = (err)=>{
  return {
    type: CONFIRMRESET_ERR,
    err,
  };
};

const ConfirmResetReq = (key, new_password)=>{
  return async (dispatch)=>{
    dispatch({
      type: CONFIRMRESET,
    });
    try {
      const response = await fetch(API.u.user.password.confirm, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key, new_password}),
      });
      const status = response.status;
      if(status >= 200 && status < 300){
        dispatch(ConfirmResetSuccess());
      } else {
        const data = await response.json();
        if(data && data.message){
          throw new Error(data.message);
        } else {
          throw new Error('Could not reset password');
        }
      }
    } catch(e){
      dispatch(ConfirmResetErr(e.message));
    }
  };
};

const defaultState = {
  loading: false,
  success: false,
  err: false,
  confirmloading: false,
  confirmsuccess: false,
  confirmerr: false,
};

const initState = ()=>{
  return Object.assign({}, defaultState);
};

const ForgotPassword = (state=initState(), action)=>{
  switch(action.type){
    case FORGOTPASSWORD:
      return Object.assign({}, state, {
        loading: true,
      });
    case FORGOTPASSWORD_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        success: true,
        err: false,
      });
    case FORGOTPASSWORD_ERR:
      return Object.assign({}, state, {
        loading: false,
        success: false,
        err: action.err,
      });
    case CONFIRMRESET:
      return Object.assign({}, state, {
        confirmloading: true,
      });
    case CONFIRMRESET_SUCCESS:
      return Object.assign({}, state, {
        confirmloading: false,
        confirmsuccess: true,
        confirmerr: false,
      });
    case CONFIRMRESET_ERR:
      return Object.assign({}, state, {
        confirmloading: false,
        confirmsuccess: false,
        confirmerr: action.err,
      });
    default:
      return state;
  }
};

export {
  ForgotPassword, ForgotPasswordReq, ConfirmResetReq,
}
