import {authopts} from './config';
export default {
  link: {
    url: '/link',
    children: {
      get: {
        url: '?amount={0}&offset={1}',
        method: 'GET',
        transformer: (amount, offset) => [[amount, offset], null],
        expectdata: true,
        err: 'Unable to get links',
        opt: authopts,
      },
      id: {
        url: '/{0}',
        children: {
          del: {
            url: '',
            method: 'DELETE',
            transformer: (linkid) => [[linkid], null],
            expectdata: true,
            err: 'Unable to delete link',
            opt: authopts,
          },
        },
      },
      create: {
        url: '',
        method: 'POST',
        expectdata: true,
        err: 'Unable to create link',
        opt: authopts,
      },
    },
  },
};
