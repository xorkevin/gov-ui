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
    userid,
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
      const response = await fetch(API.u.auth.login, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify({username,password}),
      });
      const status = response.status;
      if(status < 200 || status >= 300){
        throw new Error('Incorrect username or password');
      }
      const data = await response.json();
      if(!data.valid){
        throw new Error('Incorrect username or password');
      }
      const time = data.claims.exp;
      const userid = data.claims.userid;
      const firstname = data.first_name;
      const lastname = data.last_name;
      const authTags = new Set(data.claims.auth_tags.split(','));
      dispatch(LoginSuccess(time, userid, username, firstname, lastname, authTags));
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
      console.log('relogin');
      const {loggedIn, timeEnd} = getState().Auth;
      if(loggedIn){
        if(timeEnd < Date.now() / 1000){
          //TODO: check cookies if it has been a day for refreshToken, refresh
          console.log('relogin exchange');
          //TODO: try exchange token
          const time = 840 + Date.now() / 1000;
          const firstname = 'Kevin';
          const lastname = 'Wang';
          const authTags = new Set('admin,user'.split(','));
          const username = 'xorkevin';
          const userid = 'userid';
          dispatch(LoginSuccess(time, userid, username, firstname, lastname, authTags));
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
  err: false,
  userid: '',
  username: '',
  firstname: '',
  lastname: '',
  authTags: new Set(),
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
        err: false,
        userid: action.userid,
        username: action.username,
        firstname: action.firstname,
        lastname: action.lastname,
        authTags: action.authTags,
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
