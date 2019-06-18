import {formatStrArgs} from 'utility';

const JSON_MIME = 'application/json';

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

const defaultCatcher = (err) => {
  return err.message;
};

const makeFetchJSON = ({
  url,
  method,
  expectdata,
  selector,
  errhandler,
  catcher,
  headers: baseheaders,
  opts: baseopts,
}) => {
  const onsuccess = selector || defaultSelector;
  const onerr = errhandler || defaultErrHandler;
  const oncatch = catcher || defaultCatcher;

  return async (params, body, reqheaders, reqopts) => {
    const tempheaders = {};
    if (body) {
      tempheaders['Content-Type'] = JSON_MIME;
    }
    const headers = Object.assign(tempheaders, baseheaders, reqheaders);
    const opts = Object.assign({}, baseopts, reqopts, {
      method,
      headers,
      body,
    });
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
    errhandler: defaultErrHandler('Could not run server setup'),
  },
  healthz: {
    url: '/healthz',
    children: {
      check: {
        url: '/check',
        method: 'GET',
        expectdata: false,
        errhandler: defaultErrHandler('Could not get time from api server'),
      },
    },
  },
};

const APIClientBuilder = (baseurl, apiconfig) => {
  return Object.fromEntries(
    Object.entries(apiconfig).map(([k, v]) => {
      const url = baseurl + v.url;
      const fn = v.method
        ? makeFetchJSON(Object.assign({}, v, {url, children: undefined}))
        : {};
      if (v.children) {
        Object.assign(fn, APIClientBuilder(url, v.children));
      }
      return [k, Object.freeze(fn)];
    }),
  );
};

const APIClient = Object.freeze(APIClientBuilder(APIBASE_URL, API));

export default APIClient;
