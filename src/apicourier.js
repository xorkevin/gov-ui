export default {
  link: {
    url: '/link',
    children: {
      get: {
        url: '/c/{0}?amount={1}&offset={2}',
        method: 'GET',
        transformer: (creatorid, amount, offset) => [
          [creatorid, amount, offset],
          null,
        ],
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
            transformer: (creatorid, linkid) => [[creatorid, linkid], null],
            expectdata: false,
            err: 'Unable to delete link',
          },
        },
      },
      create: {
        url: '/c/{0}',
        transformer: (creatorid, link) => [[creatorid], link],
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
        url: '/c/{0}?amount={1}&offset={2}',
        method: 'GET',
        transformer: (creatorid, amount, offset) => [
          [creatorid, amount, offset],
          null,
        ],
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
            transformer: (creatorid, brandid) => [[creatorid, brandid], null],
            expectdata: false,
            err: 'Unable to delete brand',
          },
        },
      },
      create: {
        url: '/c/{0}',
        method: 'POST',
        transformer: (creatorid, {brandid, image}) => {
          const formData = new FormData();
          formData.set('brandid', brandid);
          formData.set('image', image);
          return [[creatorid], formData];
        },
        expectdata: false,
        err: 'Unable to create brand',
      },
    },
  },
};
