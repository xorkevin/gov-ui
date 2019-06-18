import {authopts} from './config';
export default {
  get: {
    url: '',
    method: 'GET',
    expectdata: true,
    err: 'Unable to get user info',
    opts: authopts,
  },
  sessions: {
    url: '/sessions',
    method: 'GET',
    expectdata: true,
    err: 'Could not get sessions',
    opts: authopts,
    children: {
      del: {
        url: '',
        method: 'DELETE',
        transformer: (sessions_ids) => [null, {session_ids}],
        expectdata: false,
        err: 'Could not delete sessions',
        opts: authopts,
      },
    },
  },
  edit: {
    url: '',
    method: 'PUT',
    expectdata: false,
    err: 'Could not edit account',
    opts: authopts,
  },
  email: {
    url: '/email',
    children: {
      edit: {
        url: '',
        method: 'PUT',
        transformer: (email, password) => [null, {email, password}],
        expectdata: false,
        err: 'Could not edit email',
        opts: authopts,
        children: {
          confirm: {
            url: '/verify',
            method: 'PUT',
            transformer: (key, password) => [null, {key, password}],
            expectdata: false,
            err: 'Could not edit email',
            opts: authopts,
          },
        },
      },
    },
  },
  pass: {
    url: '/password',
    children: {
      edit: {
        url: '',
        method: 'PUT',
        transformer: (old_password, new_password) => [
          null,
          {old_password, new_password},
        ],
        expectdata: false,
        err: 'Could not edit password',
        opts: authopts,
      },
      forgot: {
        url: '/forgot',
        method: 'PUT',
        expectdata: true,
        err: 'Could not reset password',
        children: {
          confirm: {
            url: '/reset',
            method: 'PUT',
            expectdata: true,
            err: 'Could not reset password',
          },
        },
      },
    },
  },
  id: {
    url: '/id/{0}',
    method: 'GET',
    transformer: (userid) => [[userid], null],
    expectdata: true,
    err: 'Unable to get user info',
    children: {
      priv: {
        url: '/private',
        method: 'GET',
        transformer: (userid) => [[userid], null],
        expectdata: true,
        err: 'Unable to get user info',
        opt: authopts,
      },
      edit: {
        url: '',
        children: {
          rank: {
            url: '/rank',
            method: 'PATCH',
            transformer: (userid, add, remove) => [[userid], {add, remove}],
            expectdata: false,
            err: 'Unable to update user permissions',
            opts: authopts,
          },
        },
      },
    },
  },
  name: {
    url: '/name/{0}',
    method: 'GET',
    transformer: (name) => [[name], null],
    expectdata: true,
    err: 'Unable to get user info',
    children: {
      priv: {
        url: '/private',
        method: 'GET',
        transformer: (name) => [[name], null],
        expectdata: true,
        err: 'Unable to get user info',
        opts: authopts,
      },
    },
  },
  ids: {
    url: '/ids?ids={0}',
    method: 'GET',
    transformer: (userids) => [[userids.join(',')], null],
    expectdata: true,
    err: 'Unable to get user info',
  },
  create: {
    url: '',
    method: 'POST',
    expectdata: true,
    err: 'Could not create account',
    children: {
      confirm: {
        url: '/confirm',
        method: 'POST',
        transformer: (key) => [null, {key}],
        expectdata: true,
        err: 'Could not create account',
      },
    },
  },
};
