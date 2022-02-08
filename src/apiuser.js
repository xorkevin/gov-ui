export default {
  roles: {
    url: '/roles',
    children: {
      get: {
        url: '',
        method: 'GET',
        transformer: (prefix, amount, offset) => ({
          query: {prefix, amount, offset},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.roles,
        err: 'Could not get user roles',
      },
      invitation: {
        url: '/invitation',
        children: {
          get: {
            url: '',
            method: 'GET',
            transformer: (amount, offset) => ({
              query: {amount, offset},
            }),
            expectjson: true,
            selector: (_res, data) => data && data.invitations,
            err: 'Could not get user role invitations',
          },
          accept: {
            url: '/{0}/accept',
            method: 'POST',
            transformer: (role) => ({
              params: [role],
            }),
            err: 'Could not accept role invitation',
          },
          del: {
            url: '/{0}',
            method: 'DELETE',
            transformer: (role) => ({
              params: [role],
            }),
            err: 'Could not delete role invitation',
          },
        },
      },
    },
  },
  sessions: {
    url: '/sessions',
    children: {
      get: {
        url: '',
        method: 'GET',
        transformer: (amount, offset) => ({
          query: {amount, offset},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.active_sessions,
        err: 'Could not get sessions',
      },
      del: {
        url: '',
        method: 'DELETE',
        transformer: (session_ids) => ({
          json: {session_ids},
        }),
        expectjson: false,
        err: 'Could not delete sessions',
      },
    },
  },
  edit: {
    url: '',
    method: 'PUT',
    transformer: (json) => ({json}),
    expectjson: false,
    err: 'Could not edit account',
  },
  email: {
    url: '/email',
    children: {
      edit: {
        url: '',
        method: 'PUT',
        transformer: (email, password) => ({
          json: {email, password},
        }),
        expectjson: false,
        err: 'Could not edit email',
        children: {
          confirm: {
            url: '/verify',
            method: 'PUT',
            transformer: (userid, key, password) => ({
              json: {userid, key, password},
            }),
            expectjson: false,
            err: 'Could not edit email',
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
        transformer: (old_password, new_password) => ({
          json: {old_password, new_password},
        }),
        expectjson: false,
        err: 'Could not edit password',
      },
      forgot: {
        url: '/forgot',
        method: 'PUT',
        transformer: (username) => ({
          json: {username},
        }),
        expectjson: false,
        err: 'Could not reset password',
        children: {
          confirm: {
            url: '/reset',
            method: 'PUT',
            transformer: (userid, key, new_password) => ({
              json: {userid, key, new_password},
            }),
            expectjson: false,
            err: 'Could not reset password',
          },
        },
      },
    },
  },
  otp: {
    url: '/otp',
    children: {
      add: {
        url: '',
        method: 'PUT',
        transformer: (alg, digits, password) => ({
          json: {alg, digits, password},
        }),
        expectjson: true,
        err: 'Could not add otp 2fa',
      },
      confirm: {
        url: '/verify',
        method: 'PUT',
        transformer: (code) => ({
          json: {code},
        }),
        expectjson: false,
        err: 'Could not enable otp 2fa',
      },
      remove: {
        url: '',
        method: 'DELETE',
        transformer: (code, backup, password) => ({
          json: {code, backup, password},
        }),
        expectjson: false,
        err: 'Could not remove otp 2fa',
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
    err: 'Unable to get user info',
    children: {
      priv: {
        url: '/private',
        method: 'GET',
        transformer: (userid) => ({
          params: [userid],
        }),
        expectjson: true,
        err: 'Unable to get user info',
      },
      roles: {
        url: '/roles',
        method: 'GET',
        transformer: (userid, prefix, amount, offset) => ({
          params: [userid],
          query: {prefix, amount, offset},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.roles,
        err: 'Unable to get user roles',
      },
      roleint: {
        url: '/roleint',
        method: 'GET',
        transformer: (userid, roles) => ({
          params: [userid],
          query: {
            roles: roles.join(','),
          },
        }),
        expectjson: true,
        selector: (_res, data) => data && data.roles,
        err: 'Could not get user roles',
      },
      edit: {
        url: '',
        children: {
          rank: {
            url: '/rank',
            method: 'PATCH',
            transformer: (userid, add, remove) => ({
              params: [userid],
              json: {add, remove},
            }),
            expectjson: false,
            err: 'Unable to update user permissions',
          },
        },
      },
      del: {
        url: '',
        method: 'DELETE',
        transformer: (userid, username) => ({
          params: [userid],
          json: {username},
        }),
        err: 'Could not delete user',
      },
    },
  },
  name: {
    url: '/name/{0}',
    method: 'GET',
    transformer: (name) => ({
      params: [name],
    }),
    expectjson: true,
    err: 'Unable to get user info',
    children: {
      priv: {
        url: '/private',
        method: 'GET',
        transformer: (name) => ({
          params: [name],
        }),
        expectjson: true,
        err: 'Unable to get user info',
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
    selector: (_res, data) => data && data.users,
    err: 'Unable to get user info',
  },
  all: {
    url: '/all',
    method: 'GET',
    transformer: (amount, offset) => ({
      query: {amount, offset},
    }),
    expectjson: true,
    selector: (_res, data) => data && data.users,
    err: 'Unable to get user info',
  },
  search: {
    url: '/search',
    method: 'GET',
    transformer: (prefix, amount) => ({
      query: {prefix, amount},
    }),
    expectjson: true,
    selector: (_res, data) => data && data.users,
    err: 'Unable to get users',
  },
  role: {
    url: '/role/{0}',
    children: {
      get: {
        url: '',
        method: 'GET',
        transformer: (role, amount, offset) => ({
          params: [role],
          query: {amount, offset},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.users,
        err: 'Unable to get users for role',
      },
      invitation: {
        url: '/invitation',
        children: {
          get: {
            url: '',
            method: 'GET',
            transformer: (role, amount, offset) => ({
              params: [role],
              query: {amount, offset},
            }),
            expectjson: true,
            selector: (_res, data) => data && data.invitations,
            err: 'Could not get role invitations',
          },
          del: {
            url: '/id/{1}',
            method: 'DELETE',
            transformer: (role, userid) => ({
              params: [role, userid],
            }),
            err: 'Could not delete role invitation',
          },
        },
      },
    },
  },
  create: {
    url: '',
    method: 'POST',
    transformer: (json) => ({json}),
    expectjson: true,
    err: 'Could not create account',
    children: {
      confirm: {
        url: '/confirm',
        method: 'POST',
        transformer: (userid, key) => ({
          json: {userid, key},
        }),
        expectjson: true,
        err: 'Could not create account',
      },
    },
  },
  del: {
    url: '',
    method: 'DELETE',
    transformer: (username) => ({
      json: {username},
    }),
    err: 'Could not delete account',
  },
  approvals: {
    url: '/approvals',
    children: {
      get: {
        url: '',
        method: 'GET',
        transformer: (amount, offset) => ({
          query: {amount, offset},
        }),
        expectjson: true,
        selector: (_res, data) => data && data.approvals,
        err: 'Unable to get approvals',
      },
      id: {
        url: '/id/{0}',
        children: {
          approve: {
            url: '',
            method: 'POST',
            transformer: (userid) => ({
              params: [userid],
            }),
            expectjson: false,
            err: 'Unable to approve request',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (userid) => ({
              params: [userid],
            }),
            expectjson: false,
            err: 'Unable to delete request',
          },
        },
      },
    },
  },
};
