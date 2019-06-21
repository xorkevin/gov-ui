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
    expectdata: false,
    err: 'Unable to edit profile',
    image: {
      url: '/image',
      method: 'PUT',
      transformer: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return [null, formData];
      },
      expectdata: false,
      err: 'Unable to update profile picture',
    },
  },
  id: {
    url: '/{0}',
    method: 'GET',
    transformer: (userid) => [[userid], null],
    expectdata: true,
    err: 'Unable to get profile',
    children: {
      image: {
        url: '/image',
      },
    },
  },
  create: {
    url: '',
  },
};
