import {formatStrArgs} from 'utility';

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

const makeFetchJSON = ({
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
    const [params, body, reqheaders, reqopts] = transformargs(...args);
    const tempheaders = {};
    if (body) {
      tempheaders['Content-Type'] = JSON_MIME;
    }
    const headers = Object.assign(tempheaders, baseheaders, reqheaders);
    const opts = Object.assign({}, baseopts, reqopts, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
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

const authopts = Object.freeze({
  credentials: 'same-origin',
});

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
        method: 'GET',
        expectdata: true,
        err: 'Unable to get user info',
        opts: authopts,
        children: {
          sessions: {
            url: '/sessions',
            method: 'GET',
            expectdata: true,
            err: 'Could not get sessions',
            opts: authopts,
            children: {
              del: {
                url: '',
                method: 'DELETE',
                transformer: (sessions_ids) => [null, {session_ids}],
                expectdata: false,
                err: 'Could not delete sessions',
                opts: authopts,
              },
            },
          },
          edit: {
            url: '',
            method: 'PUT',
            expectdata: false,
            err: 'Could not edit account',
            opts: authopts,
          },
          email: {
            url: '/email',
            children: {
              edit: {
                url: '',
                method: 'PUT',
                transformer: (email, password) => [null, {email, password}],
                expectdata: false,
                err: 'Could not edit email',
                opts: authopts,
                children: {
                  confirm: {
                    url: '/verify',
                    method: 'PUT',
                    transformer: (key, password) => [null, {key, password}],
                    expectdata: false,
                    err: 'Could not edit email',
                    opts: authopts,
                  },
                },
              },
            },
          },
          pass: {
            url: '/password',
            children: {
              edit: {
                url: '',
                method: 'PUT',
                transformer: (old_password, new_password) => [
                  null,
                  {old_password, new_password},
                ],
                expectdata: false,
                err: 'Could not edit password',
                opts: authopts,
              },
              forgot: {
                url: '/forgot',
                method: 'PUT',
                expectdata: true,
                err: 'Could not reset password',
                children: {
                  confirm: {
                    url: '/reset',
                    method: 'PUT',
                    expectdata: true,
                    err: 'Could not reset password',
                  },
                },
              },
            },
          },
          id: {
            url: '/id/{0}',
            method: 'GET',
            transformer: (userid) => [[userid], null],
            expectdata: true,
            err: 'Unable to get user info',
            children: {
              priv: {
                url: '/private',
                method: 'GET',
                transformer: (userid) => [[userid], null],
                expectdata: true,
                err: 'Unable to get user info',
                opt: authopts,
              },
              edit: {
                url: '',
                children: {
                  rank: {
                    url: '/rank',
                    method: 'PATCH',
                    transformer: (userid, add, remove) => [
                      [userid],
                      {add, remove},
                    ],
                    expectdata: false,
                    err: 'Unable to update user permissions',
                    opts: authopts,
                  },
                },
              },
            },
          },
          name: {
            url: '/name/{0}',
            method: 'GET',
            transformer: (name) => [[name], null],
            expectdata: true,
            err: 'Unable to get user info',
            children: {
              priv: {
                url: '/private',
                method: 'GET',
                transformer: (name) => [[name], null],
                expectdata: true,
                err: 'Unable to get user info',
                opts: authopts,
              },
            },
          },
          ids: {
            url: '/ids?ids={0}',
            method: 'GET',
            transformer: (userids) => [[userids.join(',')], null],
            expectdata: true,
            err: 'Unable to get user info',
          },
          create: {
            url: '',
            method: 'POST',
            expectdata: true,
            err: 'Could not create account',
            children: {
              confirm: {
                url: '/confirm',
                method: 'POST',
                transformer: (key) => [null, {key}],
                expectdata: true,
                err: 'Could not create account',
              },
            },
          },
        },
      },
      auth: {
        url: '/auth',
        children: {
          login: {
            url: '/login',
            method: 'POST',
            transformer: (username, password) => [null, {username, password}],
            expectdata: true,
            selector: (status, data) => {
              const {exp: time, userid, auth_tags: authTags} = data.claims;
              return {
                time,
                userid,
                authTags,
              };
            },
            err: 'Incorrect username or password',
            opts: authopts,
          },
          exchange: {
            url: '/exchange',
            method: 'POST',
            expectdata: true,
            selector: (status, data) => {
              const {exp: time, userid, auth_tags: authTags} = data.claims;
              return {
                time,
                userid,
                authTags,
              };
            },
            err: 'Login session expired',
            opt: authopts,
          },
          refresh: {
            url: '/refresh',
            method: 'POST',
            expectdata: false,
            err: 'Login session expired',
            opt: authopts,
          },
        },
      },
    },
  },
};

const APIClientBuilder = (baseurl, apiconfig) => {
  return Object.freeze(
    Object.fromEntries(
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
    ),
  );
};

const APIClient = APIClientBuilder(APIBASE_URL, API);

export default APIClient;
