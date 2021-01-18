const permissionedRoles = Object.freeze([
  'admin',
  'usr.gov.user',
  'mod.gov.user',
  'usr.gov.oauth',
  'mod.gov.oauth',
]);

const allRoles = Object.freeze(['user'].concat(permissionedRoles));

export {allRoles, permissionedRoles};
