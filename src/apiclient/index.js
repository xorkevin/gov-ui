import React, {useState, useEffect, useCallback, useContext} from 'react';
import {formatStrArgs} from 'utility';
import {authopts} from './config';
import courierAPI from './courier';
import profileAPI from './profile';
import authAPI from './auth';
import userAPI from './user';

const JSON_MIME = 'application/json';

const defaultTransformer = (...args) => {
  if (args.length === 0) {
    return [null, null, null, null];
  }
  if (args.length === 1) {
    return [null, args[1], null, null];
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
        body = JSON.stringify(body);
      }
    }

    const headers = Object.assign(tempheaders, baseheaders, reqheaders);
    const opts = Object.assign({}, baseopts, reqopts, {method, headers, body});
    const finalurl = params ? formatStrArgs(url, params) : url;

    try {
      const res = await fetch(finalurl, opts);
      const status = response.status;
      if (status < 200 || status >= 300) {
        const data = await response.json();
        return {
          status,
          data: null,
          err: onerr(status, data),
        };
      }
      if (!expectdata) {
        return {
          status,
          data: onsuccess(status),
          err: null,
        };
      }
      const data = await response.json();
      return {
        status,
        data: onsuccess(status, data),
        err: null,
      };
    } catch (e) {
      return {
        status: -1,
        data: null,
        err: oncatch(err),
      };
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
        expectdata: false,
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

const makeAPIClient = (baseurl, apiconfig) => {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(apiconfig).map(([k, v]) => {
        const url = baseurl + v.url;
        const fn = v.method
          ? makeFetch(Object.assign({}, v, {url, children: undefined}))
          : {};
        if (v.children) {
          Object.assign(fn, makeAPIClient(url, v.children));
        }
        Object.assign(fn, {
          api_prop: {
            url,
            formatUrl: (...args) => formatStrArgs(url, args),
          },
        });
        return [k, Object.freeze(fn)];
      }),
    ),
  );
};

const APIClient = makeAPIClient(APIBASE_URL, API);

const APIContext = React.createContext(APIClient);

const useAPI = (selector) => {
  const apiClient = useContext(APIContext);
  const route = selector(apiClient);

  const execute = useCallback(
    async (...args) => {
      const {status, data, err} = await route(...args);
      return [data, status, err];
    },
    [route],
  );

  return execute;
};

const useResource = (selector, args, initState, prehook) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState(null);
  const [data, setData] = useState(initState);
  const execute = useAPI(selector);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    (async () => {
      if (prehook) {
        const err = await prehook();
        if (cancel) {
          return;
        }
        if (err) {
          setSuccess(false);
          setErr(err);
          setLoading(false);
          return;
        }
      }
      const [data, status, err] = await execute(...args);
      if (cancel) {
        return;
      }
      if (err) {
        setSuccess(false);
        setErr(err);
      } else {
        setSuccess(true);
        setErr(null);
        setData(data);
      }
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [setLoading, setSuccess, setErr, setData, prehook, execute, ...args]);

  return [loading, success, err, data];
};

export {APIClient, APIContext, useAPI, useResource};
