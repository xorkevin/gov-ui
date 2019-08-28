export default {
  link: {
    url: '/link',
    children: {
      get: {
        url: '?amount={0}&offset={1}',
        method: 'GET',
        transformer: (amount, offset) => [[amount, offset], null],
        expectdata: true,
        selector: (_status, data) => data.links,
        err: 'Unable to get links',
      },
      id: {
        url: '/{0}',
        children: {
          del: {
            url: '',
            method: 'DELETE',
            transformer: (linkid) => [[linkid], null],
            expectdata: false,
            err: 'Unable to delete link',
          },
        },
      },
      create: {
        url: '',
        method: 'POST',
        expectdata: false,
        err: 'Unable to create link',
      },
    },
  },
};
