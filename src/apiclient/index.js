import React, {useState, useEffect, useCallback, useContext} from 'react';
import {formatStrArgs, max0} from 'utility';
import courierAPI from './courier';
import profileAPI from './profile';
import authAPI from './auth';
import userAPI from './user';

// API Client

const JSON_MIME = 'application/json';

const defaultTransformer = (...args) => {
  if (args.length === 0) {
    return [null, null, null, null];
  }
  if (args.length === 1) {
    return [null, args[0], null, null];
  }
  const k = args.length - 1;
  return [args.slice(0, k), args[k], null, null];
};

const defaultSelector = (status, data) => {
  if (data) {
    return data;
  }
  return null;
};

const defaultErrHandler = (defaultMessage) => (status, data) => {
  if (data && data.message) {
    return data.message;
  }
  return defaultMessage;
};

const defaultCatcher = (err) => err.message;

const makeFetch = ({
  url,
  method,
  transformer,
  expectdata,
  selector,
  err,
  catcher,
  headers: baseheaders,
  opts: baseopts,
}) => {
  const transformargs = transformer || defaultTransformer;
  const onsuccess = selector || defaultSelector;
  const onerr = (() => {
    if (!err) {
      return defaultErrHandler('Request error');
    }
    if (typeof err === 'string') {
      return defaultErrHandler(err);
    }
    return err;
  })();
  const oncatch = catcher || defaultCatcher;

  return async (...args) => {
    const [params, bodycontent, reqheaders, reqopts] = transformargs(...args);

    const tempheaders = {};
    let body = undefined;
    if (bodycontent) {
      if (bodycontent instanceof FormData) {
        body = bodycontent;
      } else {
        tempheaders['Content-Type'] = JSON_MIME;
        body = JSON.stringify(bodycontent);
      }
    }

    const headers = Object.assign(tempheaders, baseheaders, reqheaders);
    const opts = Object.assign({}, baseopts, reqopts, {method, headers, body});
    const finalurl = params ? formatStrArgs(url, params) : url;

    try {
      const res = await fetch(finalurl, opts);
      const status = res.status;
      if (status < 200 || status >= 300) {
        const err = await res.json();
        return [null, status, onerr(status, err)];
      }
      if (!expectdata) {
        return [onsuccess(status), status, null];
      }
      const data = await res.json();
      return [onsuccess(status, data), status, null];
    } catch (err) {
      return [null, -1, oncatch(err)];
    }
  };
};

const API = {
  setupz: {
    url: '/setupz',
    method: 'POST',
    expectdata: true,
    err: 'Could not run server setup',
  },
  healthz: {
    url: '/healthz',
    children: {
      check: {
        url: '/check',
        method: 'GET',
        expectdata: true,
        err: 'Could not get time from api server',
      },
    },
  },
  u: {
    url: '/u',
    children: {
      user: {
        url: '/user',
        children: userAPI,
      },
      auth: {
        url: '/auth',
        children: authAPI,
      },
    },
  },
  profile: {
    url: '/profile',
    children: profileAPI,
  },
  courier: {
    url: '/courier',
    children: courierAPI,
  },
};

const makeAPIClient = (baseurl, baseopts, apiconfig) => {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(apiconfig).map(([k, v]) => {
        const url = baseurl + v.url;
        const fn = v.method
          ? makeFetch(
              Object.assign({opts: baseopts}, v, {url, children: undefined}),
            )
          : {};
        if (v.children) {
          Object.assign(fn, makeAPIClient(url, baseopts, v.children));
        }
        Object.assign(fn, {
          api_prop: {
            url,
            formatUrl: (args) => formatStrArgs(url, args),
          },
        });
        return [k, Object.freeze(fn)];
      }),
    ),
  );
};

const BASEOPTS = Object.freeze({
  credentials: 'include',
});

const APIClient = makeAPIClient(APIBASE_URL, BASEOPTS, API);

// Hooks

const APIContext = React.createContext(APIClient);

const useAPI = (selector) => {
  const apiClient = useContext(APIContext);
  return selector(apiClient);
};

const useURL = (selector, args = []) =>
  useAPI(selector).api_prop.formatUrl(args);

const API_CANCEL = Symbol('API_CANCEL');

const useAPICall = (
  selector,
  args = [],
  initState,
  {prehook, posthook, errhook} = {},
) => {
  const [apiState, setApiState] = useState({
    loading: false,
    success: false,
    err: null,
    status: -1,
    data: initState,
  });
  const route = useAPI(selector);

  const apicall = useCallback(
    async (args, prehook, posthook, {cancelRef} = {}) => {
      setApiState((s) =>
        Object.assign({}, s, {
          loading: true,
        }),
      );

      if (prehook) {
        const err = await prehook(...args);
        if (cancelRef && cancelRef.current) {
          return [null, -1, API_CANCEL];
        }
        if (err) {
          setApiState({
            loading: false,
            success: false,
            err,
            status: -1,
            data: initState,
          });
          if (errhook) {
            errhook('prehook', err);
          }
          return [null, -1, err];
        }
      }

      const [data, status, err] = await route(...args);
      if (cancelRef && cancelRef.current) {
        return [null, -1, API_CANCEL];
      }
      if (err) {
        setApiState({
          loading: false,
          success: false,
          err,
          status,
          data: initState,
        });
        if (errhook) {
          errhook('api', err);
        }
        return [data, status, err];
      }

      if (posthook) {
        const err = await posthook(data, status);
        if (cancelRef && cancelRef.current) {
          return [null, -1, API_CANCEL];
        }
        if (err) {
          setApiState({
            loading: false,
            success: false,
            err,
            status,
            data,
          });
          if (errhook) {
            errhook('posthook', err);
          }
          return [data, status, err];
        }
      }

      setApiState({
        loading: false,
        success: true,
        err: null,
        status,
        data,
      });
      return [data, status, err];
    },
    [setApiState, route],
  );

  const execute = useCallback(
    (opts) => {
      return apicall(args, prehook, posthook, opts);
    },
    [prehook, posthook, apicall, ...args],
  );

  return [apiState, execute];
};

const selectAPINull = () => null;

const useResource = (selector, args, initState, opts) => {
  const [apiState, execute] = useAPICall(selector, args, initState, opts);

  useEffect(() => {
    let cancelRef = {current: false};
    if (selector !== selectAPINull) {
      execute({cancelRef});
    }
    return () => {
      cancelRef.current = true;
    };
  }, [selector, execute]);

  const reexecute = useCallback(() => {
    execute();
  }, [execute]);

  return {...apiState, reexecute};
};

// Utility Hooks

const endNextPage = () => {};

const usePaginate = (limit = 8, offset = 0) => {
  const [value, setVal] = useState(offset);
  const [end, setEnd] = useState(false);

  const next = useCallback(() => setVal((i) => max0(i + limit)), [
    setVal,
    limit,
  ]);
  const prev = useCallback(() => setVal((i) => max0(i - limit)), [
    setVal,
    limit,
  ]);
  const set = useCallback((i) => setVal(i), [setVal]);
  const first = useCallback(() => setVal(0), [setVal]);

  return {
    value,
    next: end ? endNextPage : next,
    prev,
    prev,
    set,
    first,
    setEnd,
  };
};

export {
  APIClient,
  APIContext,
  useAPI,
  useURL,
  useAPICall,
  useResource,
  selectAPINull,
  usePaginate,
};
