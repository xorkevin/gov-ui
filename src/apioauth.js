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
        expectjson: true,
        selector: (_res, data) => data && data.apps,
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
        expectjson: true,
        selector: (_res, data) => data && data.apps,
        err: 'Unable to get apps',
      },
      id: {
        url: '/id/{0}',
        method: 'GET',
        transformer: (clientid) => ({
          params: [clientid],
        }),
        expectjson: true,
        err: 'Unable to get client config',
        children: {
          image: {
            url: '/image',
          },
          edit: {
            url: '',
            method: 'PUT',
            transformer: (clientid, json) => ({
              params: [clientid],
              json,
            }),
            expectjson: false,
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
            expectjson: true,
            err: 'Could not rotate client secret',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (clientid) => ({
              params: [clientid],
            }),
            expectjson: false,
            err: 'Could not delete client config',
          },
        },
      },
      create: {
        url: '',
        method: 'POST',
        transformer: (json) => ({json}),
        expectjson: true,
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
        transformer: (json) => ({json}),
        expectjson: true,
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
        expectjson: true,
        selector: (_res, data) => data && data.connections,
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
            expectjson: true,
            err: 'Unable to get OAuth connection',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (id) => ({
              params: [id],
            }),
            expectjson: false,
            err: 'Unable to remove OAuth connection',
          },
        },
      },
    },
  },
};
