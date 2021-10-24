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
      list: {
        url: '/list/{1}',
        children: {
          member: {
            url: '/member',
            children: {
              edit: {
                url: '',
                method: 'PATCH',
                transformer: (creatorid, listname, remove) => ({
                  params: [creatorid, listname],
                  body: {
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
    },
  },
};
