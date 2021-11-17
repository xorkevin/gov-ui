export default {
  personal: {
    url: '/latest',
    method: 'GET',
    transformer: (amount, offset) => ({
      query: {
        amount,
        offset,
      },
    }),
    expectjson: true,
    selector: (_res, data) => data && data.lists,
    err: 'Unable to get mailing list subscriptions',
  },
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
        expectjson: true,
        selector: (_res, data) => data && data.lists,
        err: 'Unable to get mailing lists',
      },
      create: {
        url: '',
        method: 'POST',
        transformer: (creatorid, json) => ({
          params: [creatorid],
          json,
        }),
        expectjson: true,
        err: 'Unable to create mailing list',
      },
      list: {
        url: '/list/{1}',
        children: {
          sub: {
            url: '/sub',
            method: 'PATCH',
            transformer: (creatorid, listname) => ({
              params: [creatorid, listname],
            }),
            expectjson: false,
            err: 'Unable to subscribe to list',
          },
          unsub: {
            url: '/unsub',
            method: 'PATCH',
            transformer: (creatorid, listname) => ({
              params: [creatorid, listname],
            }),
            expectjson: false,
            err: 'Unable to unsubscribe from list',
          },
          edit: {
            url: '',
            method: 'PUT',
            transformer: (creatorid, listname, json) => ({
              params: [creatorid, listname],
              json,
            }),
            expectjson: false,
            err: 'Unable to edit list settings',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (creatorid, listname) => ({
              params: [creatorid, listname],
            }),
            expectjson: false,
            err: 'Unable to delete list',
          },
          member: {
            url: '/member',
            children: {
              edit: {
                url: '',
                method: 'PATCH',
                transformer: (creatorid, listname, remove) => ({
                  params: [creatorid, listname],
                  json: {
                    remove,
                  },
                }),
                expectjson: false,
                err: 'Unable to edit list members',
              },
            },
          },
          msgs: {
            url: '/msgs',
            children: {
              del: {
                url: '',
                method: 'DELETE',
                transformer: (creatorid, listname, msgids) => ({
                  params: [creatorid, listname],
                  json: {
                    msgids,
                  },
                }),
                expectjson: false,
                err: 'Unable to delete list message',
              },
            },
          },
        },
      },
    },
  },
  id: {
    url: '/l/{0}',
    children: {
      get: {
        url: '',
        method: 'GET',
        transformer: (id) => ({
          params: [id],
        }),
        expectjson: true,
        err: 'Unable to get mailing list',
      },
      member: {
        url: '/member',
        method: 'GET',
        transformer: (listid, amount, offset) => ({
          params: [listid],
          query: {
            amount,
            offset,
          },
        }),
        expectjson: true,
        selector: (_res, data) => data && data.members,
        err: 'Unable to get list members',
        children: {
          ids: {
            url: '/ids',
            method: 'GET',
            transformer: (listid, userids) => ({
              params: [listid],
              query: {
                ids: userids.join(','),
              },
            }),
            expectjson: true,
            selector: (_res, data) => data && data.members,
            err: 'Unable to get list members',
          },
        },
      },
      msgs: {
        url: '/msgs',
        method: 'GET',
        transformer: (listid, amount, offset) => ({
          params: [listid],
          query: {
            amount,
            offset,
          },
        }),
        expectjson: true,
        selector: (_res, data) => data && data.msgs,
        err: 'Unable to get list msgs',
        children: {
          id: {
            url: '/id/{1}',
            method: 'GET',
            transformer: (listid, msgid) => ({
              params: [listid, msgid],
            }),
            expectjson: true,
            selector: (_res, data) => data,
            err: 'Unable to get list message',
            children: {
              content: {
                url: '/content',
                method: 'GET',
                transformer: (listid, msgid) => ({
                  params: [listid, msgid],
                }),
                expectjson: false,
                selector: async (res) => res.text(),
                err: 'Unable to get list messages',
              },
            },
          },
        },
      },
      threads: {
        url: '/threads',
        method: 'GET',
        transformer: (listid, amount, offset) => ({
          params: [listid],
          query: {
            amount,
            offset,
          },
        }),
        expectjson: true,
        selector: (_res, data) => data && data.msgs,
        err: 'Unable to get list threads',
        children: {
          id: {
            url: '/id/{1}',
            children: {
              msgs: {
                url: '/msgs',
                method: 'GET',
                transformer: (listid, threadid, amount, offset) => ({
                  params: [listid, threadid],
                  query: {
                    amount,
                    offset,
                  },
                }),
                expectjson: true,
                selector: (_res, data) => data && data.msgs,
                err: 'Unable to get thread messages',
              },
            },
          },
        },
      },
    },
  },
};
