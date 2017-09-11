import {API} from 'config';

const LOGIN = Symbol('LOGIN');
const RELOGIN = Symbol('RELOGIN');
const LOGIN_SUCCESS = Symbol('LOGIN_SUCCESS');
const LOGIN_ERR = Symbol('LOGIN_ERR');

// timeEnd is in seconds
const LoginSuccess = (timeEnd, userid, username, firstname, lastname, authTags)=>{
  return {
    type: LOGIN_SUCCESS,
    timeEnd,
    username,
    firstname,
    lastname,
    authTags,
  };
};

const LoginErr = (err)=>{
  return {
    type: LOGIN_ERR,
    err,
  };
};

const Login = (username, password)=>{
  return async (dispatch, getState)=>{
    dispatch({
      type: LOGIN,
    });
    try {
      //TODO: login route
      const time = 840 + Date.now() / 1000;
      const firstname = 'Kevin';
      const lastname = 'Wang';
      const authTags = 'admin,user'.split(',');
      const username = 'xorkevin';
      dispatch(LoginSuccess(time, username, firstname, lastname, authTags));
    } catch(e){
      dispatch(LoginErr(e.message));
    }
  };
};

const ReLogin = ()=>{
  return async (dispatch, getState)=>{
    dispatch({
      type: RELOGIN,
    });
    try {
      const {loggedIn, timeEnd} = getState().Auth;
      if(loggedIn){
        if(timeEnd < Date.now() / 1000){
          //TODO: check cookies if it has been a day for refreshToken, refresh
          //TODO: try exchange token
          const time = 840 + Date.now() / 1000;
          const firstname = 'Kevin';
          const lastname = 'Wang';
          const authTags = 'admin,user'.split(',');
          const username = 'xorkevin';
          dispatch(LoginSuccess(time, username, firstname, lastname, authTags));
          //TODO: if refresh fail or beyond a week, relogin true
          //return {
          //  relogin: true,
          //};
        }
      } else {
        return {
          relogin: true,
        };
      }
    } catch(e){
      dispatch(LoginErr(e.message));
    }
    return {
      relogin: false,
    };
  };
};

const defaultState = {
  loading: false,
  loggedIn: false,
  timeEnd: false,
  err: '',
  username: '',
};

const initState = ()=>{
  //TODO: read cookies if refreshToken valid then loggedIn
  return Object.assign({}, defaultState);
};

const Auth = (state=initState(), action)=>{
  switch(action.type){
    case LOGIN:
    case RELOGIN:
      return Object.assign({}, state, {
        loading: true,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loggedIn: true,
        timeEnd: action.timeEnd,
        err: '',
        username: action.username,
      });
    case LOGIN_ERR:
      return Object.assign({}, state, {
        loading: false,
        loggedIn: false,
        err: action.err,
      });
    default:
      return state;
  }
};

export {
  Auth, Login, ReLogin,
}
