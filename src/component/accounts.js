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
  const prefixLen = ctx.orgUsrPrefix.length;
  const orgids = useMemo(
    () => roles.data.map((i) => i.slice(prefixLen)),
    [prefixLen, roles],
  );
  const [orgs] = useAuthResource(
    orgids.length > 0 ? selectAPIOrgs : selectAPINull,
    [orgids],
    [],
  );
  return useMemo(
    () =>
      [{display: `${username} (Personal)`, value: userid}].concat(
        orgs.data.map((i) => ({display: i.name, value: ctx.orgRole(i.orgid)})),
      ),
    [ctx, userid, username, orgs],
  );
};

export {useOrgOpts};
