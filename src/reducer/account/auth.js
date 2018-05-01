import {API} from 'config';
import {getCookie, setCookie} from 'utility';

const LOGIN = Symbol('LOGIN');
const RELOGIN = Symbol('RELOGIN');
const LOGIN_REFRESH = Symbol('LOGIN_REFRESH');
const LOGIN_SUCCESS = Symbol('LOGIN_SUCCESS');
const LOGIN_ERR = Symbol('LOGIN_ERR');

// timeEnd is in seconds
const LoginSuccess = (timeEnd, userid, authTags) => {
  return {
    type: LOGIN_SUCCESS,
    timeEnd,
    userid,
    authTags,
  };
};

const LoginErr = err => {
  return {
    type: LOGIN_ERR,
    err,
  };
};

const Refresh = () => {
  return {
    type: LOGIN_REFRESH,
    time: Date.now() / 1000 + 86400,
  };
};

const Login = (username, password) => {
  return async dispatch => {
    dispatch({
      type: LOGIN,
    });
    try {
      const response = await fetch(API.u.auth.login, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify({username, password}),
      });
      const status = response.status;
      if (status < 200 || status >= 300) {
        throw new Error('Incorrect username or password');
      }
      const data = await response.json();
      if (!data.valid) {
        throw new Error('Incorrect username or password');
      }
      const time = data.claims.exp;
      const userid = data.claims.userid;
      const authTags = data.claims.auth_tags;
      const firstname = data.first_name;
      const lastname = data.last_name;
      dispatch(Refresh());
      dispatch(
        LoginSuccess(time, userid, authTags, username, firstname, lastname),
      );
    } catch (e) {
      dispatch(LoginErr(e.message));
    }
  };
};

const ReLogin = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: RELOGIN,
    });
    try {
      const {loggedIn, timeEnd, timeRefresh} = getState().Auth;
      if (!loggedIn) {
        return {
          relogin: true,
        };
      }

      if (timeEnd < Date.now() / 1000 + 15) {
        const refreshToken = getCookie('refresh_valid');
        if (refreshToken !== 'valid') {
          throw new Error('Unable to refresh authentication');
        }
        if (!timeRefresh || timeRefresh < Date.now() / 1000) {
          const {err} = await RefreshReq();
          if (err) {
            throw new Error(err);
          }
          dispatch(Refresh());
        }
        const response = await fetch(API.u.auth.exchange, {
          method: 'POST',
          //TODO: change to same-origin
          credentials: 'include',
        });
        const status = response.status;
        if (status < 200 || status >= 300) {
          throw new Error('Unable to refresh authentication');
        }
        const data = await response.json();
        if (!data.valid) {
          throw new Error('Unable to refresh authentication');
        }
        const time = data.claims.exp;
        const userid = data.claims.userid;
        const authTags = data.claims.auth_tags;
        dispatch(LoginSuccess(time, userid, authTags));
      }
    } catch (e) {
      dispatch(LoginErr(e.message));
      return {
        relogin: true,
      };
    }
    return {
      relogin: false,
    };
  };
};

const RefreshReq = async () => {
  try {
    const response = await fetch(API.u.auth.refresh, {
      method: 'POST',
      //TODO: change to same-origin
      credentials: 'include',
    });
    const status = response.status;
    if (status < 200 || status >= 300) {
      throw new Error('Unable to refresh authentication');
    }
    const data = await response.json();
    if (!data.valid) {
      throw new Error('Unable to refresh authentication');
    }
    return {
      err: false,
    };
  } catch (e) {
    return {
      err: e.message,
    };
  }
};

const LOGOUT = Symbol('LOGOUT');

const Logout = () => {
  return async dispatch => {
    setCookie('access_token', 'invalid', '/api', 0);
    setCookie('refresh_token', 'invalid', '/api/u/auth', 0);
    setCookie('refresh_valid', 'invalid', '/', 0);
    setCookie('auth_tags', 'invalid', '/', 0);
    dispatch({
      type: LOGOUT,
    });
  };
};

const GETUSER = Symbol('GETUSER');
const GETUSER_SUCCESS = Symbol('GETUSER_SUCCESS');
const GETUSER_ERR = Symbol('GETUSER_ERR');

const GetUserSuccess = data => {
  return {
    type: GETUSER_SUCCESS,
    data,
  };
};

const GetUserErr = err => {
  return {
    type: GETUSER_ERR,
    err,
  };
};

const GetUserAccount = () => {
  return async dispatch => {
    dispatch({
      type: GETUSER,
    });
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      dispatch(GetUserErr('Need to reauthenticate'));
      return;
    }
    try {
      const response = await fetch(API.u.user.get, {
        method: 'GET',
        //TODO: change to same-origin
        credentials: 'include',
      });
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to fetch user data');
        }
      }
      data.creation_time *= 1000;
      dispatch(GetUserSuccess(data));
    } catch (e) {
      dispatch(GetUserErr(e));
    }
  };
};

const defaultState = {
  valid: false,
  loading: false,
  getuserloading: false,
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
  authTags: '',
  email: '',
  creationTime: Date.now(),
};

const initState = () => {
  const k = {valid: true};
  if (getCookie('refresh_valid') === 'valid') {
    k.loggedIn = true;
    k.authTags = getCookie('auth_tags').replace(/^"+|"*$/g, '');
  }
  return Object.assign({}, defaultState, k);
};

const Auth = (state = initState(), action) => {
  switch (action.type) {
    case LOGIN:
    case RELOGIN:
      return Object.assign({}, state, {
        loading: true,
      });
    case LOGIN_REFRESH:
      return Object.assign({}, state, {
        timeRefresh: action.time,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loggedIn: true,
        timeEnd: action.timeEnd,
        err: false,
        userid: action.userid,
        authTags: action.authTags,
      });
    case LOGIN_ERR:
      return Object.assign({}, state, {
        loading: false,
        loggedIn: false,
        err: action.err,
      });
    case LOGOUT:
      return Object.assign({}, defaultState, {valid: true});
    case GETUSER:
      return Object.assign({}, state, {
        getuserloading: true,
      });
    case GETUSER_SUCCESS:
      return Object.assign({}, state, {
        getuserloading: false,
        getusererr: false,
        userid: action.data.userid,
        username: action.data.username,
        firstname: action.data.first_name,
        lastname: action.data.last_name,
        authTags: action.data.auth_tags,
        email: action.data.email,
        creationTime: action.data.creation_time,
      });
    case GETUSER_ERR:
      return Object.assign({}, state, {
        getuserloading: false,
        getusererr: action.err,
      });
    default:
      return state;
  }
};

export {Auth, Login, ReLogin, Logout, GetUserAccount};
