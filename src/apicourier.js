export default {
  link: {
    url: '/link',
    children: {
      get: {
        url: '/c/{0}',
        method: 'GET',
        transformer: (creatorid, amount, offset) => ({
          params: [creatorid],
          query: {amount, offset},
        }),
        expectdata: true,
        selector: (_status, data) => data.links,
        err: 'Unable to get links',
      },
      id: {
        url: '/c/{0}/id/{1}',
        children: {
          del: {
            url: '',
            method: 'DELETE',
            transformer: (creatorid, linkid) => ({
              params: [creatorid, linkid],
            }),
            expectdata: false,
            err: 'Unable to delete link',
          },
        },
      },
      create: {
        url: '/c/{0}',
        method: 'POST',
        transformer: (creatorid, body) => ({
          params: [creatorid],
          body,
        }),
        expectdata: false,
        err: 'Unable to create link',
      },
    },
  },
  brand: {
    url: '/brand',
    children: {
      get: {
        url: '/c/{0}',
        method: 'GET',
        transformer: (creatorid, amount, offset) => ({
          params: [creatorid],
          query: {amount, offset},
        }),
        expectdata: true,
        selector: (_status, data) => data.brands,
        err: 'Unable to get brands',
      },
      id: {
        url: '/c/{0}/id/{1}',
        children: {
          image: {
            url: '/image',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (creatorid, brandid) => ({
              params: [creatorid, brandid],
            }),
            expectdata: false,
            err: 'Unable to delete brand',
          },
        },
      },
      create: {
        url: '/c/{0}',
        method: 'POST',
        transformer: (creatorid, {brandid, image}) => {
          const body = new FormData();
          body.set('brandid', brandid);
          body.set('image', image);
          return {
            params: [creatorid],
            body,
          };
        },
        expectdata: false,
        err: 'Unable to create brand',
      },
    },
  },
};
