export default {
  get: {
    url: '',
    method: 'GET',
    transformer: (amount, offset) => ({
      query: {amount, offset},
    }),
    expectjson: true,
    selector: (_res, data) => data && data.apikeys,
    err: 'Could not get apikeys',
  },
  check: {
    url: '/check',
    method: 'GET',
    transformer: (keyid, key, roles, scope) => ({
      query: {roles, scope},
      headers: {Authorization: `Basic ${btoa(keyid + ':' + key)}`},
    }),
    expectjson: true,
    err: 'Could not create apikey',
  },
  create: {
    url: '',
    method: 'POST',
    transformer: (name, desc, scope) => ({
      json: {name, desc, scope},
    }),
    expectjson: true,
    err: 'Could not create apikey',
  },
  id: {
    url: '/id/{0}',
    children: {
      edit: {
        url: '',
        method: 'PUT',
        transformer: (keyid, name, desc, scope) => ({
          params: [keyid],
          json: {name, desc, scope},
        }),
        expectjson: false,
        err: 'Could not edit apikey',
      },
      rotate: {
        url: '/rotate',
        method: 'PUT',
        transformer: (keyid) => ({
          params: [keyid],
        }),
        expectjson: true,
        err: 'Could not rotate apikey',
      },
      del: {
        url: '',
        method: 'DELETE',
        transformer: (keyid) => ({
          params: [keyid],
        }),
        expectjson: false,
        err: 'Could not delete apikey',
      },
    },
  },
};
