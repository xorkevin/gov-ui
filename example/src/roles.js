const roleIntersect = Object.freeze([
  'user',
  'admin',
  'usr_user',
  'mod_user',
  'usr_courier',
  'mod_courier',
]);

const permissionedRoles = roleIntersect.filter((i) => i !== 'user');

export {roleIntersect, permissionedRoles};
