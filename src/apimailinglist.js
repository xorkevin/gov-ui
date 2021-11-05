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
    expectdata: true,
    selector: (_status, data) => data && data.lists,
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
        expectdata: true,
        selector: (_status, data) => data && data.lists,
        err: 'Unable to get mailing lists',
      },
      create: {
        url: '',
        method: 'POST',
        transformer: (creatorid, json) => ({
          params: [creatorid],
          json,
        }),
        expectdata: true,
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
            expectdata: false,
            err: 'Unable to subscribe to list',
          },
          unsub: {
            url: '/unsub',
            method: 'PATCH',
            transformer: (creatorid, listname) => ({
              params: [creatorid, listname],
            }),
            expectdata: false,
            err: 'Unable to unsubscribe from list',
          },
          edit: {
            url: '',
            method: 'PUT',
            transformer: (creatorid, listname, json) => ({
              params: [creatorid, listname],
              json,
            }),
            expectdata: false,
            err: 'Unable to edit list settings',
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
                expectdata: false,
                err: 'Unable to edit list members',
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
        expectdata: true,
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
        expectdata: true,
        selector: (_status, data) => data && data.members,
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
            expectdata: true,
            selector: (_status, data) => data && data.members,
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
        expectdata: true,
        selector: (_status, data) => data && data.msgs,
        err: 'Unable to get list msgs',
      },
    },
  },
};
