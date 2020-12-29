import {useState, useCallback, useContext} from 'react';
import {useResource} from '@xorkevin/substation';
import {
  Grid,
  Column,
  Tabbar,
  TabItem,
  usePaginate,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {GovUICtx} from '../../middleware';

const MEMBER_LIMIT = 32;

const selectAPIRoles = (api) => api.u.user.role;

const OrgMembers = ({org}) => {
  const ctx = useContext(GovUICtx);

  const [isViewMod, setViewMod] = useState(false);
  const viewUsr = useCallback(() => {
    setViewMod(false);
  }, [setViewMod]);
  const viewMod = useCallback(() => {
    setViewMod(true);
  }, [setViewMod]);

  const paginate = usePaginate(MEMBER_LIMIT);

  const usrRole = ctx.orgUsrRole(org.orgid);
  const modRole = ctx.orgModRole(org.orgid);

  const setAtEnd = paginate.setAtEnd;
  const posthookUsers = useCallback(
    (_status, users) => {
      setAtEnd(users.length < MEMBER_LIMIT);
    },
    [setAtEnd],
  );
  const [users, _reexecute] = useResource(
    selectAPIRoles,
    [isViewMod ? modRole : usrRole, MEMBER_LIMIT, paginate.index],
    [],
    {posthook: posthookUsers},
  );

  return (
    <div>
      <h3>Members</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <Tabbar>
            <TabItem className={!isViewMod ? 'active' : ''} onClick={viewUsr}>
              Members
            </TabItem>
            <TabItem className={isViewMod ? 'active' : ''} onClick={viewMod}>
              Moderators
            </TabItem>
          </Tabbar>
          {users.data.length > 0 &&
            users.data.map((i) => <div key={i}>{i}</div>)}
          <ButtonGroup>
            <ButtonTertiary disabled={paginate.atFirst} onClick={paginate.prev}>
              prev
            </ButtonTertiary>
            {paginate.page}
            <ButtonTertiary disabled={paginate.atLast} onClick={paginate.next}>
              next
            </ButtonTertiary>
          </ButtonGroup>
          {users.err && <p>{users.err}</p>}
        </Column>
        <Column fullWidth md={8}></Column>
      </Grid>
    </div>
  );
};

export default OrgMembers;
