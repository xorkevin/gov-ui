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
    try {
      const {relogin} = await dispatch(ReLogin());
      if(relogin){
        throw new Error('Need to reauthenticate');
      }
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
      return {
        err: false,
      };
    } catch(e){
      return {
        err: e.message,
      };
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
    try {
      const {relogin} = await dispatch(ReLogin());
      if(relogin){
        throw new Error('Need to reauthenticate');
      }
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
      return {
        err: false,
        sessions: data.active_sessions,
      };
    } catch(e){
      return {
        err: e.message,
      };
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
    try {
      const {relogin} = await dispatch(ReLogin());
      if(relogin){
        throw new Error('Need to reauthenticate');
      }
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
      return {
        err: false,
      };
      return true;
    } catch(e){
      return {
        err: e.message,
      };
    }
    return false;
  };
};

export {
  EditAccountReq, GetSessionReq, DelSessionReq,
}
