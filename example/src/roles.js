import {DefaultRoleIntersect} from '@xorkevin/turbine';

const roleIntersect = DefaultRoleIntersect;
const permissionedRoles = roleIntersect.filter((i) => i !== 'user');

export {roleIntersect, permissionedRoles};
