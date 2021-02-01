export default {
  app: {
    url: '/app',
    children: {
      get: {
        url: '',
        method: 'GET',
        transformer: (amount, offset) => ({
          query: {amount, offset},
        }),
        expectdata: true,
        selector: (_status, data) => data.apps,
        err: 'Unable to get apps',
      },
      ids: {
        url: '/ids',
        method: 'GET',
        transformer: (ids) => ({
          query: {
            ids: ids.join(','),
          },
        }),
        expectdata: true,
        selector: (_status, data) => data.apps,
        err: 'Unable to get apps',
      },
      id: {
        url: '/id/{0}',
        method: 'GET',
        transformer: (clientid) => ({
          params: [clientid],
        }),
        expectdata: true,
        err: 'Unable to get client config',
        children: {
          image: {
            url: '/image',
          },
          edit: {
            url: '',
            method: 'PUT',
            transformer: (clientid, body) => ({
              params: [clientid],
              body,
            }),
            expectdata: false,
            err: 'Unable to edit client config',
            children: {
              image: {
                url: '/image',
                method: 'PUT',
                transformer: (clientid, file) => {
                  const body = new FormData();
                  body.set('image', file);
                  return {
                    params: [clientid],
                    body,
                  };
                },
              },
            },
          },
          rotate: {
            url: '/rotate',
            method: 'PUT',
            transformer: (clientid) => ({
              params: [clientid],
            }),
            expectdata: true,
            err: 'Could not rotate client secret',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (clientid) => ({
              params: [clientid],
            }),
            expectdata: false,
            err: 'Could not delete client config',
          },
        },
      },
      create: {
        url: '',
        method: 'POST',
        expectdata: true,
        err: 'Unable to register app',
      },
    },
  },
  auth: {
    url: '/auth',
    children: {
      code: {
        url: '/code',
        method: 'POST',
        transformer: (body) => ({body}),
        expectdata: true,
        err: 'Could not obtain authorization',
      },
    },
  },
  connections: {
    url: '/connection',
    children: {
      get: {
        url: '',
        method: 'GET',
        transformer: (amount, offset) => ({
          query: {amount, offset},
        }),
        expectdata: true,
        selector: (_status, data) => data.connections,
        err: 'Unable to get OAuth connections',
      },
      id: {
        url: '/id/{0}',
        children: {
          get: {
            url: '',
            method: 'GET',
            transformer: (id) => ({
              params: [id],
            }),
            expectdata: true,
            err: 'Unable to get OAuth connection',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (id) => ({
              params: [id],
            }),
            expectdata: false,
            err: 'Unable to remove OAuth connection',
          },
        },
      },
    },
  },
};
