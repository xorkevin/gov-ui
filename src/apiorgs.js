export default {
  get: {
    url: '/ids',
    method: 'GET',
    transformer: (ids) => ({
      query: {
        ids: ids.join(','),
      },
    }),
    expectjson: true,
    selector: (_res, data) => data && data.orgs,
    err: 'Unable to get orgs',
  },
  getall: {
    url: '',
    method: 'GET',
    transformer: (amount, offset) => ({
      query: {amount, offset},
    }),
    expectjson: true,
    selector: (_res, data) => data && data.orgs,
    err: 'Unable to get orgs',
  },
  id: {
    url: '/id/{0}',
    children: {
      get: {
        url: '',
        method: 'GET',
        transformer: (id) => ({
          params: [id],
        }),
        expectjson: true,
        err: 'Unable to get org',
      },
      edit: {
        url: '',
        method: 'PUT',
        transformer: (id, json) => ({
          params: [id],
          json,
        }),
        expectjson: false,
        err: 'Unable to edit org',
      },
      del: {
        url: '',
        method: 'DELETE',
        transformer: (id) => ({
          params: [id],
        }),
        expectjson: false,
        err: 'Unable to delete org',
      },
    },
  },
  name: {
    url: '/name/{0}',
    method: 'GET',
    transformer: (name) => ({
      params: [name],
    }),
    expectjson: true,
    err: 'Unable to get org',
  },
  create: {
    url: '',
    method: 'POST',
    transformer: (json) => ({json}),
    expectjson: true,
    err: 'Unable to create org',
  },
};
