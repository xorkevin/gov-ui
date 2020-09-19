const allRoles = Object.freeze([
  'user',
  'admin',
  'usr_user',
  'mod_user',
  'usr_oauth',
  'mod_oauth',
  'usr_courier',
  'mod_courier',
]);

const permissionedRoles = Object.freeze(allRoles.filter((i) => i !== 'user'));

const usrRegex = /^usr_/;
const modRoles = Object.freeze(
  permissionedRoles.filter((i) => !usrRegex.test(i)),
);

const allScopes = Object.freeze([
  // user.account
  'gov.user.account:read',
  'gov.user.account:write',
  'gov.user.account:delete',
  // user.session
  'gov.user.session:read',
  'gov.user.session:write',
  // user.apikey
  'gov.user.apikey:read',
  'gov.user.apikey:write',
  // user.admin
  'gov.user.admin:read',
  'gov.user.admin:write',
  // user.approval
  'gov.user.approval:read',
  'gov.user.approval:write',
  // user.oauth
  'gov.user.oauth.app:read',
  'gov.user.oauth.app:write',
  // profile
  'gov.profile:read',
  'gov.profile:write',
  // courier
  'gov.courier.link:read',
  'gov.courier.link:write',
  'gov.courier.brand:read',
  'gov.courier.brand:write',
]);

const allScopeDesc = Object.freeze({
  // user.account
  'gov.user.account:read': 'Read user account and roles',
  'gov.user.account:write': 'Edit user account',
  'gov.user.account:delete': 'Delete user account',
  // user.session
  'gov.user.session:read': 'Read login sessions',
  'gov.user.session:write': 'Delete login sessions',
  // user.apikey
  'gov.user.apikey:read': 'Read api keys',
  'gov.user.apikey:write': 'Edit api keys',
  // user.admin
  'gov.user.admin:read': 'Read all users',
  'gov.user.admin:write': 'Edit user roles',
  // user.approval
  'gov.user.approval:read': 'Read new user requests',
  'gov.user.approval:write': 'Delete new user requests',
  // user.oauth
  'gov.user.oauth.app:read': 'Read all oauth apps',
  'gov.user.oauth.app:write': 'Edit oauth apps',
  // profile
  'gov.profile:read': 'Read user profile',
  'gov.profile:write': 'Edit user profile',
  // courier
  'gov.courier.link:read': 'Read all courier links',
  'gov.courier.link:write': 'Edit courier links',
  'gov.courier.brand:read': 'Read all courier brands',
  'gov.courier.brand:write': 'Edit courier brands',
});

const rolesToScopes = Object.freeze({
  user: Object.freeze([
    // user.account
    'gov.user.account:read',
    'gov.user.account:write',
    'gov.user.account:delete',
    // user.session
    'gov.user.session:read',
    'gov.user.session:write',
    // user.apikey
    'gov.user.apikey:read',
    'gov.user.apikey:write',
    // profile
    'gov.profile:read',
    'gov.profile:write',
  ]),
  admin: allScopes,
  usr_user: Object.freeze([
    // user.approval
    'gov.user.approval:read',
    'gov.user.approval:write',
  ]),
  mod_user: Object.freeze([
    // user.admin
    'gov.user.admin:write',
  ]),
  usr_oauth: Object.freeze([
    // user.oauth
    'gov.user.oauth.app:read',
    'gov.user.oauth.app:write',
  ]),
  mod_oauth: Object.freeze([
    // user.admin
    'gov.user.admin:write',
  ]),
  usr_courier: Object.freeze([
    // courier
    'gov.courier.link:read',
    'gov.courier.link:write',
    'gov.courier.brand:read',
    'gov.courier.brand:write',
  ]),
  mod_courier: Object.freeze([
    // user.admin
    'gov.user.admin:write',
  ]),
});

export {
  allRoles,
  permissionedRoles,
  modRoles,
  allScopes,
  allScopeDesc,
  rolesToScopes,
};
