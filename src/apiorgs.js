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
  search: {
    url: '/search',
    method: 'GET',
    transformer: (prefix, amount, offset) => ({
      query: {
        prefix,
        amount,
        offset,
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
      member: {
        url: '/member',
        method: 'GET',
        transformer: (id, prefix, amount, offset) => ({
          params: [id],
          query: {
            prefix,
            amount,
            offset,
          },
        }),
        expectjson: true,
        selector: (_res, data) => data && data.members,
        err: 'Unable to get org members',
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
