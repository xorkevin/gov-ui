export default {
  get: {
    url: '',
    method: 'GET',
    transformer: (amount, offset) => ({
      query: {amount, offset},
    }),
    expectdata: true,
    selector: (_status, data) => data && data.apikeys,
    err: 'Could not get apikeys',
  },
  check: {
    url: '/check',
    method: 'GET',
    transformer: (keyid, key, roles, scope) => ({
      query: {roles, scope},
      headers: {Authorization: `Basic ${btoa(keyid + ':' + key)}`},
    }),
    expectdata: true,
    err: 'Could not create apikey',
  },
  create: {
    url: '',
    method: 'POST',
    transformer: (name, desc, scope) => ({
      json: {name, desc, scope},
    }),
    expectdata: true,
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
        expectdata: false,
        err: 'Could not edit apikey',
      },
      rotate: {
        url: '/rotate',
        method: 'PUT',
        transformer: (keyid) => ({
          params: [keyid],
        }),
        expectdata: true,
        err: 'Could not rotate apikey',
      },
      del: {
        url: '',
        method: 'DELETE',
        transformer: (keyid) => ({
          params: [keyid],
        }),
        expectdata: false,
        err: 'Could not delete apikey',
      },
    },
  },
};
