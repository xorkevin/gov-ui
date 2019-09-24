import React, {useEffect, useCallback, useMemo, useContext} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {useSelector, useDispatch, useStore} from 'react-redux';
import {
  getCookie,
  setCookie,
  getSearchParams,
  searchParamsToString,
} from 'utility';
import {useAPI, useAPICall, useResource} from 'apiclient';
import {URL} from 'config';

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
    case LOGOUT:
      return Object.assign({}, defaultState, {valid: true});
    default:
      return state;
  }
};

// Hooks

const selectReducerAuth = (store) => store.Auth;

const useAuthState = () => useSelector(selectReducerAuth);

const selectAPILogin = (api) => api.u.auth.login;

const logoutCookies = () => {
  setCookie('access_token', 'invalid', '/api', 0);
  setCookie('refresh_token', 'invalid', '/api/u/auth', 0);
  setCookie('refresh_valid', 'invalid', '/', 0);
  setCookie('auth_tags', 'invalid', '/', 0);
  setCookie('userid', 'invalid', '/', 0);
};

const useLogout = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    logoutCookies();
    dispatch(Logout());
  }, [dispatch]);
  return logout;
};

const useLoginCall = (username, password) => {
  const dispatch = useDispatch();
  const [apiState, execute] = useAPICall(selectAPILogin, [username, password], {
    userid: '',
    authTags: '',
    time: 0,
  });

  const login = useCallback(async () => {
    const [data, _status, err] = await execute();
    if (err) {
      return;
    }
    const {userid, authTags, time} = data;
    dispatch(Refresh());
    dispatch(LoginSuccess(userid, authTags, time));
  }, [dispatch, execute]);

  return [apiState, login];
};

const selectAPIExchange = (api) => api.u.auth.exchange;

const selectAPIRefresh = (api) => api.u.auth.refresh;

const useRelogin = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const execEx = useAPI(selectAPIExchange);
  const execRe = useAPI(selectAPIRefresh);
  const execLogout = useLogout();

  const relogin = useCallback(async () => {
    const {loggedIn, timeEnd, timeRefresh} = store.getState().Auth;
    if (!loggedIn) {
      return [null, -1, 'Not logged in'];
    }
    if (Date.now() / 1000 + 5 < timeEnd) {
      return [null, 0, null];
    }
    const refreshValid = getCookie('refresh_valid');
    if (refreshValid !== 'valid') {
      execLogout();
      return [null, -1, 'Session expired'];
    }
    if (Date.now() / 1000 > timeRefresh) {
      const [data, status, err] = await execRe();
      if (err) {
        execLogout();
        return [data, status, err];
      }
      dispatch(Refresh());
      const {userid, authTags, time} = data;
      dispatch(LoginSuccess(userid, authTags, time));
      return [data, status, err];
    }
    const [data, status, err] = await execEx();
    if (err) {
      execLogout();
      return [data, status, err];
    }
    const {userid, authTags, time} = data;
    dispatch(LoginSuccess(userid, authTags, time));
    return [data, status, err];
  }, [dispatch, store, execEx, execRe, execLogout]);

  return relogin;
};

const useAuth = (callback) => {
  const relogin = useRelogin();

  const exec = useCallback(
    async (opts) => {
      const [_data, _status, err] = await relogin();
      if (err) {
        return err;
      }
      return callback(opts);
    },
    [relogin, callback],
  );

  return exec;
};

const useAuthCall = (selector, args, initState, opts) => {
  const [apiState, execute] = useAPICall(selector, args, initState, opts);
  return [apiState, useAuth(execute)];
};

const useAuthResource = (selector, args, initState, opts = {}) => {
  const relogin = useRelogin();

  const {prehook} = opts;

  const reloginhook = useCallback(
    async (args, opts) => {
      const [_data, _status, err] = await relogin();
      if (opts.cancelRef && opts.cancelRef.current) {
        return;
      }
      if (err) {
        return err;
      }
      if (prehook) {
        return prehook(args, opts);
      }
    },
    [relogin, prehook],
  );

  const reloginOpts = Object.assign({}, opts, {
    prehook: reloginhook,
  });

  return useResource(selector, args, initState, reloginOpts);
};

// Higher Order

const DefaultProtectedFallback = 'Unauthorized';
const ProtectedFallbackContext = React.createContext(DefaultProtectedFallback);
const ProtectedFallback = ProtectedFallbackContext.Provider;

const redirectParamName = 'redir';

const Protected = (child, allowedAuth) => {
  const Inner = (props) => {
    const {pathname, search} = useLocation();
    const history = useHistory();
    const {valid, loggedIn, authTags} = useAuthState();
    const fallback = useContext(ProtectedFallbackContext);

    useEffect(() => {
      if (valid && !loggedIn) {
        const searchParams = getSearchParams(search);
        searchParams.delete(redirectParamName);
        if (pathname !== URL.home) {
          searchParams.set(redirectParamName, pathname);
        }
        history.replace({
          pathname: URL.login,
          search: searchParamsToString(searchParams),
        });
      }
    }, [valid, loggedIn, pathname, search, history]);

    const authorized = useMemo(() => {
      if (!allowedAuth) {
        return true;
      }
      const authTagSet = new Set(authTags.split(','));
      if (!Array.isArray(allowedAuth)) {
        return authTagSet.has(allowedAuth);
      }
      const intersection = new Set(
        allowedAuth.filter((x) => authTagSet.has(x)),
      );
      return intersection.size > 0;
    }, [authTags]);

    if (!authorized) {
      return fallback;
    }
    return React.createElement(child, props);
  };
  return Inner;
};

const AntiProtected = (child) => {
  const Inner = (props) => {
    const {search} = useLocation();
    const history = useHistory();
    const {loggedIn} = useAuthState();

    useEffect(() => {
      if (loggedIn) {
        const searchParams = getSearchParams(search);
        let redir = searchParams.get(redirectParamName);
        searchParams.delete(redirectParamName);
        if (!redir) {
          redir = URL.home;
        }
        history.replace({
          pathname: redir,
          search: searchParamsToString(searchParams),
        });
      }
    }, [loggedIn, search, history]);

    return React.createElement(child, props);
  };
  return Inner;
};

export {
  Auth as default,
  Auth,
  useAuthState,
  useLoginCall,
  useRelogin,
  useAuth,
  useAuthCall,
  useAuthResource,
  useLogout,
  Protected,
  AntiProtected,
  ProtectedFallback,
};
