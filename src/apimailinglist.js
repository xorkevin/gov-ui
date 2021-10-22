export default {
  group: {
    url: '/c/{0}',
    children: {
      latest: {
        url: '/latest',
        method: 'GET',
        transformer: (creatorid, amount, offset) => ({
          params: [creatorid],
          query: {
            amount,
            offset,
          },
        }),
        expectdata: true,
        selector: (_status, data) => data && data.lists,
        err: 'Unable to get mailing lists',
      },
      create: {
        url: '',
        method: 'POST',
        transformer: (creatorid, body) => ({
          params: [creatorid],
          body,
        }),
        expectdata: true,
        err: 'Unable to create mailing list',
      },
    },
  },
};
