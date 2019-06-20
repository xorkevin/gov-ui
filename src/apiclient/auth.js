import {authopts} from './config';
export default {
  login: {
    url: '/login',
    method: 'POST',
    transformer: (username, password) => [null, {username, password}],
    expectdata: true,
    selector: (status, data) => {
      const {userid, auth_tags: authTags, exp: time} = data.claims;
      return {
        userid,
        authTags,
        time,
      };
    },
    err: 'Incorrect username or password',
    opts: authopts,
  },
  exchange: {
    url: '/exchange',
    method: 'POST',
    expectdata: true,
    selector: (status, data) => {
      const {userid, auth_tags: authTags, exp: time} = data.claims;
      return {
        userid,
        authTags,
        time,
      };
    },
    err: 'Login session expired',
    opt: authopts,
  },
  refresh: {
    url: '/refresh',
    method: 'POST',
    expectdata: false,
    err: 'Login session expired',
    opt: authopts,
  },
};
