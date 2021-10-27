import {useMemo, useContext} from 'react';
import {selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthResource} from '@xorkevin/turbine';

import {GovUICtx} from '../middleware';

const selectAPIRoles = (api) => api.u.user.roles.get;
const selectAPIOrgs = (api) => api.orgs.get;

const ORG_LIMIT = 32;

const useOrgOpts = () => {
  const ctx = useContext(GovUICtx);
  const {userid, username} = useAuthValue();

  const [roles] = useAuthResource(
    selectAPIRoles,
    [ctx.orgUsrPrefix, ORG_LIMIT, 0],
    [],
  );
  const roleToOrgID = ctx.roleToOrgID;
  const orgids = useMemo(
    () => roles.data.map((i) => roleToOrgID(i)),
    [roleToOrgID, roles],
  );
  const [orgs] = useAuthResource(
    orgids.length > 0 ? selectAPIOrgs : selectAPINull,
    [orgids],
    [],
  );
  const orgName = ctx.orgName;
  return useMemo(
    () =>
      [{display: `${username} (Personal)`, value: userid}].concat(
        orgs.data.map((i) => ({display: i.name, value: orgName(i.orgid)})),
      ),
    [orgName, userid, username, orgs],
  );
};

export {useOrgOpts};
