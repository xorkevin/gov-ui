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
};
