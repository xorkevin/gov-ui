import React, {useCallback} from 'react';
import {useAuthResource} from '@xorkevin/turbine';
import {Grid, Column, usePaginate} from '@xorkevin/nuke';

const ORG_LIMIT = 32;

const selectAPIRoles = (api) => api.u.user.get.roles;

const Orgs = ({orgRoleRegex}) => {
  const paginate = usePaginate(ORG_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookLinks = useCallback(
    (_status, roles) => {
      setAtEnd(roles.length < ORG_LIMIT);
    },
    [setAtEnd],
  );
  const [roles, _reexecute] = useAuthResource(
    selectAPIRoles,
    [ORG_LIMIT, paginate.index],
    [],
    {posthook: posthookLinks},
  );

  return (
    <div>
      <h3>Organizations</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          {roles.data
            .filter((i) => orgRoleRegex.test(i))
            .map((i) => (
              <div key={i}>{i}</div>
            ))}
        </Column>
        <Column fullWidth md={8}>
          sidebar
        </Column>
      </Grid>
    </div>
  );
};

export default Orgs;
