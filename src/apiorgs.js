export default {
  get: {
    url: '/ids',
    method: 'GET',
    transformer: (ids) => ({
      query: {
        ids: ids.join(','),
      },
    }),
    expectdata: true,
    selector: (_status, data) => data.orgs,
    err: 'Unable to get orgs',
  },
  getall: {
    url: '',
    method: 'GET',
    transformer: (amount, offset) => ({
      query: {amount, offset},
    }),
    expectdata: true,
    selector: (_status, data) => data.orgs,
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
        expectdata: true,
        err: 'Unable to get org',
      },
      edit: {
        url: '',
        method: 'PUT',
        transformer: (id, body) => ({
          params: [id],
          body,
        }),
        expectdata: false,
        err: 'Unable to edit org',
      },
      del: {
        url: '',
        method: 'DELETE',
        transformer: (id) => ({
          params: [id],
        }),
        expectdata: false,
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
    expectdata: true,
    err: 'Unable to get org',
  },
  create: {
    url: '',
    method: 'POST',
    transformer: (body) => ({body}),
    expectdata: true,
    err: 'Unable to create org',
  },
};
