const allRoles = Object.freeze([
  'user',
  'admin',
  'usr_user',
  'mod_user',
  'usr_courier',
  'mod_courier',
]);

const permissionedRoles = Object.freeze(allRoles.filter((i) => i !== 'user'));

const usrRegex = /^usr_/;
const modRoles = Object.freeze(
  permissionedRoles.filter((i) => !usrRegex.test(i)),
);

export {allRoles, permissionedRoles, modRoles};
