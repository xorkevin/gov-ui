export default {
  friend: {
    url: '/friend',
    method: 'GET',
    transformer: (prefix, amount, offset) => ({
      query: {prefix, amount, offset},
    }),
    expectjson: true,
    selector: (_res, data) => data && data.friends,
    err: 'Failed to get friends',
    children: {
      id: {
        url: '/id/{0}',
        children: {
          remove: {
            url: '',
            method: 'DELETE',
            transformer: (id) => ({
              params: [id],
            }),
            err: 'Failed to remove friend',
          },
        },
      },
      invitation: {
        url: '/invitation',
        method: 'GET',
        transformer: (amount, offset) => ({
          query: {amount, offset},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.invitations,
        err: 'Failed to get friend invitations',
        children: {
          id: {
            url: '/id/{0}',
            children: {
              send: {
                url: '',
                method: 'POST',
                transformer: (id) => ({
                  params: [id],
                }),
                err: 'Failed to send friend invitation',
              },
              accept: {
                url: '/accept',
                method: 'POST',
                transformer: (id) => ({
                  params: [id],
                }),
                err: 'Failed to accept friend invitation',
              },
              del: {
                url: '',
                method: 'DELETE',
                transformer: (id) => ({
                  params: [id],
                }),
                err: 'Failed to delete friend invitation',
              },
            },
          },
          invited: {
            url: '/invited',
            method: 'GET',
            transformer: (amount, offset) => ({
              query: {amount, offset},
            }),
            expectjson: true,
            selector: (_res, data) => data && data.invitations,
            err: 'Failed to get friend invitations',
            children: {
              del: {
                url: '/{0}',
                method: 'DELETE',
                transformer: (id) => ({
                  params: [id],
                }),
                err: 'Failed to delete friend invitation',
              },
            },
          },
        },
      },
    },
  },
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
        expectjson: true,
        selector: (_res, data) => data && data.chats,
        err: 'Unable to get chats',
      },
      latest: {
        url: '/latest',
        method: 'GET',
        transformer: (kind, before, amount) => ({
          query: {kind, before, amount},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.chats,
        err: 'Unable to get latest chats',
      },
      create: {
        url: '',
        method: 'POST',
        transformer: (kind, name, theme, userids) => ({
          json: {kind, name, theme, userids},
        }),
        expectjson: true,
        err: 'Unable to create chat',
      },
      id: {
        url: '/id/{0}',
        children: {
          msg: {
            url: '/msg',
            children: {
              create: {
                url: '',
                method: 'POST',
                transformer: (chatid, kind, value) => ({
                  params: [chatid],
                  json: {kind, value},
                }),
                expectjson: true,
                err: 'Unable to send chat msg',
              },
              latest: {
                url: '/latest',
                method: 'GET',
                transformer: (chatid, kind, before, amount) => ({
                  params: [chatid],
                  query: {kind, before, amount},
                }),
                expectjson: true,
                selector: (_res, data) => data && data.msgs,
                err: 'Unable to get latest msgs',
              },
            },
          },
        },
      },
    },
  },
};
