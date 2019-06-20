import {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getCookie, setCookie} from 'utility';
import {useAPI} from 'apiclient';

// Actions

const LOGIN_SUCCESS = Symbol('LOGIN_SUCCESS');
const LoginSuccess = (userid, authTags, timeEnd) => ({
  type: LOGIN_SUCCESS,
  userid,
  authTags,
  timeEnd, // timeEnd is in seconds
});

const secondsDay = 86400;

const LOGIN_REFRESH = Symbol('LOGIN_REFRESH');
const Refresh = () => ({
  type: LOGIN_REFRESH,
  time: Date.now() / 1000 + secondsDay, // time is in seconds
});

const NOT_LOGGEDIN = Symbol('NOT_LOGGEDIN');
const NotLoggedIn = () => ({type: NOT_LOGGEDIN});

const LOGOUT = Symbol('LOGOUT');
const Logout = () => ({type: LOGOUT});

// Reducer

const defaultState = Object.freeze({
  valid: false,
  loggedIn: false,
  userid: '',
  authTags: '',
  timeEnd: 0,
  timeRefresh: 0,
});

const initState = () => {
  const k = {valid: true};
  if (getCookie('refresh_valid') === 'valid') {
    k.loggedIn = true;
    k.userid = getCookie('userid');
    k.authTags = getCookie('auth_tags').replace(/^"+|"+$/g, '');
  }
  return Object.assign({}, defaultState, k);
};

const Auth = (state = initState(), action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loggedIn: true,
        userid: action.userid,
        authTags: action.authTags,
        timeEnd: action.timeEnd,
      });
    case LOGIN_REFRESH:
      return Object.assign({}, state, {
        timeRefresh: action.time,
      });
    case NOT_LOGGEDIN:
      return Object.assign({}, state, {
        loggedIn: false,
      });
    case LOGOUT:
      return Object.assign({}, defaultState, {valid: true});
    default:
      return state;
  }
};

// Hooks

const selectReducerAuth = (store) => store.Auth;

const useAuth = () => useSelector(selectReducerAuth);

const selectAPILogin = (api) => api.u.auth.login;

const useLogin = () => {
  const dispatch = useDispatch();
  const [loading, success, err, data, execute] = useAPI(selectAPILogin);
  const login = useCallback(
    async (username, password) => {
      const [data, err] = await execute(username, password);
      if (err) {
        return false;
      }
      const {userid, authTags, time} = data;
      dispatch(Refresh());
      dispatch(LoginSuccess(userid, authTags, time));
      return true;
    },
    [dispatch, execute],
  );
  return [loading, success, err, login];
};

const selectAPIExchange = (api) => api.u.auth.exchange;

const selectAPIRefresh = (api) => api.u.auth.refresh;

const useRelogin = () => {
  const dispatch = useDispatch();
  const {loggedIn, timeEnd, timeRefresh} = useAuth();
  const [loading, success, errEx, , execEx] = useAPI(selectAPIExchange);
  const [, , errRe, , execRe] = useAPI(selectAPIRefresh);
  const relogin = useCallback(async () => {
    if (!loggedIn) {
      return false;
    }
    if (Date.now() / 1000 + 15 < timeEnd) {
      return true;
    }
    const refreshValid = getCookie('refresh_valid');
    if (refreshValid !== 'valid') {
      dispatch(NotLoggedIn());
      return false;
    }
    if (Date.now() / 1000 > timeRefresh) {
      const [, err] = await execRe();
      if (err) {
        dispatch(NotLoggedIn());
        return false;
      }
      dispatch(Refresh());
    }
    const [data, err] = await execEx();
    if (err) {
      dispatch(NotLoggedIn());
      return false;
    }
    const {userid, authTags, time} = data;
    dispatch(LoginSuccess(userid, authTags, time));
    return true;
  }, [dispatch, loggedIn, timeEnd, timeRefresh, execEx, execRe]);
  return [loading, success, errRe || errEx, relogin];
};

const useLogout = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    setCookie('access_token', 'invalid', '/api', 0);
    setCookie('refresh_token', 'invalid', '/api/u/auth', 0);
    setCookie('refresh_valid', 'invalid', '/', 0);
    setCookie('auth_tags', 'invalid', '/', 0);
    setCookie('userid', 'invalid', '/', 0);
    dispatch(Logout());
  }, [dispatch]);
  return logout;
};

export {Auth as default, Auth, useAuth, useLogin, useRelogin, useLogout};
