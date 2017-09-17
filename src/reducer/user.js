import {API} from 'config';
import {ReLogin} from 'reducer/auth';

const GETUSER = Symbol('GETUSER');
const GETUSER_SUCCESS = Symbol('GETUSER_SUCCESS');
const GETUSER_ERR = Symbol('GETUSER_ERR');

const GetUserSuccess = (data)=>{
  return {
    type: GETUSER_SUCCESS,
    data,
  };
};

const GetUserErr = (err)=>{
  return {
    type: GETUSER_ERR,
    err,
  };
};

const GetUserByName = (username)=>{
  return async (dispatch)=>{
    const {relogin} = await dispatch(ReLogin());
    if(relogin){
      return {
        err: 'Need to reauthenticate',
      };
    }
    try {
      const response = await fetch(API.u.user.get, {
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
          throw new Error('Unable to fetch user data');
        }
      }
      data.creation_time *= 1000;
      data.auth_tags = new Set(data.auth_tags.split(','));
      dispatch(GetUserSuccess(data));
    } catch(e){
      return {
        err: e,
      };
    }
  };
};

const defaultState = {
  loading: false,
  loggedIn: false,
  timeEnd: false,
  timeRefresh: false,
  err: false,
  logouterr: false,
  getusererr: false,
  userid: '',
  username: '',
  firstname: '',
  lastname: '',
  authTags: new Set(),
  email: '',
  creationTime: Date.now(),
};

const initState = ()=>{
  const k = {};
  if(isWeb() && getCookie('refresh_valid') === 'valid'){
    k.loggedIn = true;
  }
  return Object.assign({}, defaultState, k);
};

export {
  Auth, Login, ReLogin, Logout, GetUserAccount,
}
