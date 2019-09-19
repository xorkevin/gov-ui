export default {
  link: {
    url: '/link',
    children: {
      get: {
        url: '?amount={0}&offset={1}',
        method: 'GET',
        transformer: (amount, offset) => [[amount, offset], null],
        expectdata: true,
        selector: (_status, data) => data.links,
        err: 'Unable to get links',
      },
      id: {
        url: '/{0}',
        children: {
          del: {
            url: '',
            method: 'DELETE',
            transformer: (linkid) => [[linkid], null],
            expectdata: false,
            err: 'Unable to delete link',
          },
        },
      },
      create: {
        url: '',
        method: 'POST',
        expectdata: false,
        err: 'Unable to create link',
      },
    },
  },
  brand: {
    url: '/brand',
    children: {
      get: {
        url: '?amount={0}&offset={1}',
        method: 'GET',
        transformer: (amount, offset) => [[amount, offset], null],
        expectdata: true,
        selector: (_status, data) => data.brands,
        err: 'Unable to get brands',
      },
      id: {
        url: '/{0}',
        children: {
          image: {
            url: '/image',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (brandid) => [[brandid], null],
            expectdata: false,
            err: 'Unable to delete brand',
          },
        },
      },
      create: {
        url: '',
        method: 'POST',
        transformer: ({brandid, image}) => {
          const formData = new FormData();
          formData.set('brandid', brandid);
          formData.set('image', image);
          return [null, formData];
        },
        expectdata: false,
        err: 'Unable to create brand',
      },
    },
  },
};
