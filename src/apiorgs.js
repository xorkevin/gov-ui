export default {
  get: {
    url: '/ids?ids={0}',
    method: 'GET',
    transformer: (ids) => [[ids.join(',')], null],
    expectdata: true,
    selector: (_status, data) => data.orgs,
    err: 'Unable to get orgs',
  },
  getall: {
    url: '?amount={0}&offset={1}',
    method: 'GET',
    transformer: (amount, offset) => [[amount, offset], null],
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
        transformer: (id) => [[id], null],
        expectdata: true,
        err: 'Unable to get org',
      },
      edit: {
        url: '',
        method: 'PUT',
        transformer: (id, name, display_name, desc) => [
          [id],
          {name, display_name, desc},
        ],
        expectdata: false,
        err: 'Unable to edit org',
      },
      del: {
        url: '',
        method: 'PUT',
        transformer: (id) => [[id], null],
        expectdata: false,
        err: 'Unable to delete org',
      },
    },
  },
  name: {
    url: '/name/{0}',
    method: 'GET',
    transformer: (name) => [[name], null],
    expectdata: true,
    err: 'Unable to get org',
  },
  create: {
    url: '',
    method: 'POST',
    transformer: (body) => [[], body],
    expectdata: true,
    err: 'Unable to create org',
  },
};
