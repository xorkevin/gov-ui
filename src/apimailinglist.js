export default {
  group: {
    url: '/c/{0}',
    children: {
      latest: {
        url: '/latest',
        method: 'GET',
        transformer: (before, amount) => ({
          query: {
            before,
            amount,
          },
        }),
        expectdata: true,
        selector: (_status, data) => data && data.lists,
        err: 'Unable to get mailing lists',
      },
    },
  },
};
