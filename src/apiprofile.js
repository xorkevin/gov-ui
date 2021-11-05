export default {
  get: {
    url: '',
    method: 'GET',
    expectjson: true,
    err: 'Unable to get profile',
  },
  edit: {
    url: '',
    method: 'PUT',
    transformer: (json) => ({json}),
    expectjson: false,
    err: 'Unable to edit profile',
    children: {
      image: {
        url: '/image',
        method: 'PUT',
        transformer: (file) => {
          const body = new FormData();
          body.set('image', file);
          return {body};
        },
        expectjson: false,
        err: 'Unable to update profile picture',
      },
    },
  },
  id: {
    url: '/id/{0}',
    method: 'GET',
    transformer: (userid) => ({
      params: [userid],
    }),
    expectjson: true,
    err: 'Unable to get profile',
    children: {
      image: {
        url: '/image',
      },
    },
  },
  ids: {
    url: '/ids',
    method: 'GET',
    transformer: (userids) => ({
      query: {
        ids: userids.join(','),
      },
    }),
    expectjson: true,
    selector: (_res, data) => data && data.profiles,
    err: 'Unable to get profiles',
  },
  create: {
    url: '',
    method: 'POST',
    transformer: () => ({json: {}}),
    expectjson: false,
    err: 'Unable to create profile',
  },
};
