export default {
  chat: {
    url: '/chat',
    children: {
      latest: {
        url: '/latest',
        method: 'GET',
        transformer: (kind, before, amount) => ({
          query: {kind, before, amount},
        }),
        expectdata: true,
        selector: (_status, data) => data.chatids,
        err: 'Unable to get latest chats',
      },
    },
  },
};
