export default {
  get: {
    url: '',
    method: 'GET',
    expectdata: true,
    err: 'Unable to get profile',
  },
  edit: {
    url: '',
    method: 'PUT',
    transformer: (json) => ({json}),
    expectdata: false,
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
        expectdata: false,
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
    expectdata: true,
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
    expectdata: true,
    selector: (_status, data) => data && data.profiles,
    err: 'Unable to get profiles',
  },
  create: {
    url: '',
    method: 'POST',
    transformer: () => ({json: {}}),
    expectdata: false,
    err: 'Unable to create profile',
  },
};
