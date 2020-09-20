export default {
  app: {
    url: '/app',
    children: {
      get: {
        url: '?amount={0}&offset={1}',
        method: 'GET',
        transformer: (amount, offset) => [[amount, offset], null],
        expectdata: true,
        selector: (_status, data) => data.apps,
        err: 'Unable to get apps',
      },
      id: {
        url: '/{0}',
        method: 'GET',
        transformer: (clientid) => [[clientid], null],
        expectdata: true,
        err: 'Unable to get client config',
        children: {
          image: {
            url: '/image',
          },
          edit: {
            url: '',
            method: 'PUT',
            transformer: (clientid, body) => [[clientid], body],
            expectdata: false,
            err: 'Unable to edit client config',
            children: {
              image: {
                url: '/image',
                method: 'PUT',
                transformer: (clientid, file) => {
                  const formData = new FormData();
                  formData.set('image', file);
                  return [[clientid], formData];
                },
              },
            },
          },
          rotate: {
            url: '/rotate',
            method: 'PUT',
            transformer: (clientid) => [[clientid], null],
            expectdata: true,
            err: 'Could not rotate client secret',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (clientid) => [[clientid], null],
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
};
