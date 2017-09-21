import {API} from 'config';
import {ReLogin} from 'reducer/account/auth';

const EDITACCOUNT = Symbol('EDITACCOUNT');
const EDITACCOUNT_SUCCESS = Symbol('EDITACCOUNT_SUCCESS');
const EDITACCOUNT_ERR = Symbol('EDITACCOUNT_ERR');

const EditAccountSuccess = ()=>{
  return {
    type: EDITACCOUNT_SUCCESS,
  };
};

const EditAccountErr = (err)=>{
  return {
    type: EDITACCOUNT_ERR,
    err,
  };
};

const EditAccountReq = (options)=>{
  return async (dispatch)=>{
    dispatch({
      type: EDITACCOUNT,
    });
    const {relogin} = await dispatch(ReLogin());
    if(relogin){
      dispatch(EditAccountErr('Need to reauthenticate'));
      return;
    }
    try {
      const response = await fetch(API.u.user.edit, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify(options),
      });
      const status = response.status;
      if(status < 200 || status >= 300){
        const data = await response.json();
        if(data && data.message){
          throw new Error(data.message);
        } else {
          throw new Error('Could not edit account');
        }
      }
      dispatch(EditAccountSuccess());
    } catch(e){
      dispatch(EditAccountErr(e.message));
    }
  };
};

const GETSESSION = Symbol('GETSESSION');
const GETSESSION_SUCCESS = Symbol('GETSESSION_SUCCESS');
const GETSESSION_ERR = Symbol('GETSESSION_ERR');

const GetSessionSuccess = (sessions)=>{
  return {
    type: GETSESSION_SUCCESS,
    sessions,
  };
};

const GetSessionErr = (err)=>{
  return {
    type: GETSESSION_ERR,
    err,
  };
};

const GetSessionReq = ()=>{
  return async (dispatch)=>{
    dispatch({
      type: GETSESSION,
    });
    const {relogin} = await dispatch(ReLogin());
    if(relogin){
      dispatch(GetSessionErr('Need to reauthenticate'));
      return;
    }
    try {
      const response = await fetch(API.u.user.sessions, {
        method: 'GET',
        //TODO: change to same-origin
        credentials: 'include',
      });
      const status = response.status;
      const data = await response.json();
      if(status < 200 || status >= 300){
        if(data && data.message){
          throw new Error(data.message);
        } else {
          throw new Error('Could not get sessions');
        }
      }
      dispatch(GetSessionSuccess(data.active_sessions));
    } catch(e){
      dispatch(GetSessionErr(e.message));
    }
  };
};

const DELSESSION = Symbol('DELSESSION');
const DELSESSION_SUCCESS = Symbol('DELSESSION_SUCCESS');
const DELSESSION_ERR = Symbol('DELSESSION_ERR');

const DelSessionSuccess = ()=>{
  return {
    type: DELSESSION_SUCCESS,
  };
};

const DelSessionErr = (err)=>{
  return {
    type: DELSESSION_ERR,
    err,
  };
};

const DelSessionReq = (sessions)=>{
  return async (dispatch)=>{
    dispatch({
      type: DELSESSION,
    });
    const {relogin} = await dispatch(ReLogin());
    if(relogin){
      dispatch(DelSessionErr('Need to reauthenticate'));
      return;
    }
    try {
      const response = await fetch(API.u.user.sessions, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify({session_ids: sessions}),
      });
      const status = response.status;
      if(status < 200 || status >= 300){
        const data = await response.json();
        if(data && data.message){
          throw new Error(data.message);
        } else {
          throw new Error('Could not delete sessions');
        }
      }
      dispatch(DelSessionSuccess());
      return true;
    } catch(e){
      dispatch(DelSessionErr(e.message));
    }
    return false;
  };
};

const defaultState = {
  loading: false,
  success: false,
  err: false,
  sessions: false,
};

const initState = ()=>{
  return Object.assign({}, defaultState);
};

const EditAccount = (state=initState(), action)=>{
  switch(action.type){
    case EDITACCOUNT:
    case GETSESSION:
    case DELSESSION:
      return Object.assign({}, state, {
        loading: true,
      });
    case EDITACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        success: true,
        err: false,
      });
    case GETSESSION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        success: true,
        err: false,
        sessions: action.sessions,
      });
    case DELSESSION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        success: true,
        err: false,
      });
    case EDITACCOUNT_ERR:
    case GETSESSION_ERR:
    case DELSESSION_ERR:
      return Object.assign({}, state, {
        loading: false,
        success: false,
        err: action.err,
      });
    default:
      return state;
  }
};

export {
  EditAccount, EditAccountReq, GetSessionReq, DelSessionReq,
}
