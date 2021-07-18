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
        expectdata: true,
        selector: (_status, data) => data && data.roles,
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
            expectdata: true,
            selector: (_status, data) => data && data.invitations,
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
        expectdata: true,
        selector: (_status, data) => data && data.active_sessions,
        err: 'Could not get sessions',
      },
      del: {
        url: '',
        method: 'DELETE',
        transformer: (session_ids) => ({
          body: {session_ids},
        }),
        expectdata: false,
        err: 'Could not delete sessions',
      },
    },
  },
  edit: {
    url: '',
    method: 'PUT',
    expectdata: false,
    err: 'Could not edit account',
  },
  email: {
    url: '/email',
    children: {
      edit: {
        url: '',
        method: 'PUT',
        transformer: (email, password) => ({
          body: {email, password},
        }),
        expectdata: false,
        err: 'Could not edit email',
        children: {
          confirm: {
            url: '/verify',
            method: 'PUT',
            transformer: (userid, key, password) => ({
              body: {userid, key, password},
            }),
            expectdata: false,
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
          body: {old_password, new_password},
        }),
        expectdata: false,
        err: 'Could not edit password',
      },
      forgot: {
        url: '/forgot',
        method: 'PUT',
        transformer: (username) => ({
          body: {username},
        }),
        expectdata: false,
        err: 'Could not reset password',
        children: {
          confirm: {
            url: '/reset',
            method: 'PUT',
            transformer: (userid, key, new_password) => ({
              body: {userid, key, new_password},
            }),
            expectdata: false,
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
          body: {alg, digits, password},
        }),
        expectdata: true,
        err: 'Could not add otp 2fa',
      },
      confirm: {
        url: '/verify',
        method: 'PUT',
        transformer: (code) => ({
          body: {code},
        }),
        expectdata: false,
        err: 'Could not enable otp 2fa',
      },
      remove: {
        url: '',
        method: 'DELETE',
        transformer: (code, backup, password) => ({
          body: {code, backup, password},
        }),
        expectdata: false,
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
    expectdata: true,
    err: 'Unable to get user info',
    children: {
      priv: {
        url: '/private',
        method: 'GET',
        transformer: (userid) => ({
          params: [userid],
        }),
        expectdata: true,
        err: 'Unable to get user info',
      },
      roles: {
        url: '/roles',
        method: 'GET',
        transformer: (userid, prefix, amount, offset) => ({
          params: [userid],
          query: {prefix, amount, offset},
        }),
        expectdata: true,
        selector: (_status, data) => data && data.roles,
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
        expectdata: true,
        selector: (_status, data) => data && data.roles,
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
              body: {add, remove},
            }),
            expectdata: false,
            err: 'Unable to update user permissions',
          },
        },
      },
    },
  },
  name: {
    url: '/name/{0}',
    method: 'GET',
    transformer: (name) => ({
      params: [name],
    }),
    expectdata: true,
    err: 'Unable to get user info',
    children: {
      priv: {
        url: '/private',
        method: 'GET',
        transformer: (name) => ({
          params: [name],
        }),
        expectdata: true,
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
    expectdata: true,
    selector: (_status, data) => data && data.users,
    err: 'Unable to get user info',
  },
  all: {
    url: '/all',
    method: 'GET',
    transformer: (amount, offset) => ({
      query: {amount, offset},
    }),
    expectdata: true,
    selector: (_status, data) => data && data.users,
    err: 'Unable to get user info',
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
        expectdata: true,
        selector: (_status, data) => data && data.users,
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
            expectdata: true,
            selector: (_status, data) => data && data.invitations,
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
    transformer: (body) => ({body}),
    expectdata: true,
    err: 'Could not create account',
    children: {
      confirm: {
        url: '/confirm',
        method: 'POST',
        transformer: (userid, key) => ({
          body: {userid, key},
        }),
        expectdata: true,
        err: 'Could not create account',
      },
    },
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
        expectdata: true,
        selector: (_status, data) => data && data.approvals,
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
            expectdata: false,
            err: 'Unable to approve request',
          },
          del: {
            url: '',
            method: 'DELETE',
            transformer: (userid) => ({
              params: [userid],
            }),
            expectdata: false,
            err: 'Unable to delete request',
          },
        },
      },
    },
  },
};
