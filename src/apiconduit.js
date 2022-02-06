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
  dm: {
    url: '/dm',
    method: 'GET',
    transformer: (before, amount) => ({
      query: {before, amount},
    }),
    expectjson: true,
    selector: (_res, data) => data && data.dms,
    err: 'Failed to get dms',
    children: {
      ids: {
        url: '/ids',
        method: 'GET',
        transformer: (ids) => ({
          query: {ids},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.dms,
        err: 'Failed to get dms',
      },
      search: {
        url: '/search',
        method: 'GET',
        transformer: (prefix, amount) => ({
          query: {prefix, amount},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.dms,
        err: 'Failed to search dms',
      },
      id: {
        url: '/id/{0}',
        children: {
          edit: {
            url: '',
            method: 'PUT',
            transformer: (chatid, json) => ({
              params: [chatid],
              json,
            }),
            expectjson: true,
            err: 'Failed to update dm settings',
          },
          msg: {
            url: '/msg',
            method: 'GET',
            transformer: (chatid, kind, before, amount) => ({
              params: [chatid],
              query: {kind, before, amount},
            }),
            expectjson: true,
            selector: (_res, data) => data && data.msgs,
            err: 'Failed to get messages',
            children: {
              create: {
                url: '',
                method: 'POST',
                transformer: (chatid, json) => ({
                  params: [chatid],
                  json,
                }),
                expectjson: true,
                err: 'Failed to send chat message',
              },
              del: {
                url: '/id/{1}',
                method: 'POST',
                transformer: (chatid, msgid) => ({
                  params: [chatid, msgid],
                }),
                err: 'Failed to delete chat message',
              },
            },
          },
        },
      },
    },
  },
  gdm: {
    url: '/gdm',
    method: 'GET',
    transformer: (before, amount) => ({
      query: {before, amount},
    }),
    expectjson: true,
    selector: (_res, data) => data && data.dms,
    err: 'Failed to get group chats',
    children: {
      ids: {
        url: '/ids',
        method: 'GET',
        transformer: (ids) => ({
          query: {ids},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.dms,
        err: 'Failed to get group chats',
      },
      search: {
        url: '/search',
        method: 'GET',
        transformer: (id, amount, offset) => ({
          query: {id, amount, offset},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.dms,
        err: 'Failed to search dms',
      },
      create: {
        url: '',
        method: 'POST',
        transformer: (json) => ({
          json,
        }),
        expectjson: true,
        err: 'Unable to create group chat',
      },
      id: {
        url: '/id/{0}',
        children: {
          edit: {
            url: '',
            method: 'PUT',
            transformer: (chatid, json) => ({
              params: [chatid],
              json,
            }),
            expectjson: true,
            err: 'Failed to update group chat settings',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (chatid) => ({
              params: [chatid],
            }),
            expectjson: true,
            err: 'Failed to delete group chat',
          },
          member: {
            url: '/member',
            children: {
              add: {
                url: '/add',
                method: 'PATCH',
                transformer: (members) => ({
                  json: {
                    members,
                  },
                }),
                expectjson: false,
                err: 'Unable to add members to group chat',
              },
              rm: {
                url: '/rm',
                method: 'PATCH',
                transformer: (members) => ({
                  json: {
                    members,
                  },
                }),
                expectjson: false,
                err: 'Unable to remove members from group chat',
              },
            },
          },
          msg: {
            url: '/msg',
            method: 'GET',
            transformer: (chatid, kind, before, amount) => ({
              params: [chatid],
              query: {kind, before, amount},
            }),
            expectjson: true,
            selector: (_res, data) => data && data.msgs,
            err: 'Failed to get messages',
            children: {
              create: {
                url: '',
                method: 'POST',
                transformer: (chatid, json) => ({
                  params: [chatid],
                  json,
                }),
                expectjson: true,
                err: 'Failed to send chat message',
              },
              del: {
                url: '/id/{1}',
                method: 'POST',
                transformer: (chatid, msgid) => ({
                  params: [chatid, msgid],
                }),
                err: 'Failed to delete chat message',
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
