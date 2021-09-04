export default {
  chat: {
    url: '/chat',
    children: {
      ids: {
        url: '',
        method: 'GET',
        transformer: (ids) => ({
          query: {
            ids: ids.join(','),
          },
        }),
        expectdata: true,
        selector: (_status, data) => data && data.chats,
        err: 'Unable to get chats',
      },
      latest: {
        url: '/latest',
        method: 'GET',
        transformer: (kind, before, amount) => ({
          query: {kind, before, amount},
        }),
        expectdata: true,
        selector: (_status, data) => data && data.chats,
        err: 'Unable to get latest chats',
      },
      create: {
        url: '',
        method: 'POST',
        transformer: (kind, name, theme, userids) => ({
          body: {kind, name, theme, userids},
        }),
        expectdata: true,
        err: 'Unable to create chat',
      },
    },
  },
};
