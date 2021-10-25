import {useMemo, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue} from '@xorkevin/turbine';
import {Grid, Column, ButtonGroup} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {GovUICtx} from '../../middleware';

const selectAPIList = (api) => api.mailinglist.id.get;
const selectAPIListMemberIDs = (api) => api.mailinglist.id.member.ids;
const selectAPIUser = (api) => api.u.user.id;
const selectAPIOrg = (api) => api.orgs.id.get;

const List = () => {
  const ctx = useContext(GovUICtx);

  const {listid} = useParams();

  const [list, _reexecute] = useResource(
    listid.length > 0 ? selectAPIList : selectAPINull,
    [listid],
    {
      listid: '',
      creatorid: '',
      listname: '',
      name: '',
      desc: '',
      archive: false,
      sender_policy: 'owner',
      member_policy: 'owner',
      last_updated: 0,
      creation_time: 0,
    },
  );

  const isOrg = list.success && ctx.isOrgName(list.data.creatorid);
  const [user, _execUser] = useResource(
    list.success && !isOrg ? selectAPIUser : selectAPINull,
    [list.data.creatorid],
    {
      userid: '',
      username: '',
      first_name: '',
      last_name: '',
      roles: [],
      creation_time: 0,
    },
  );
  const [org, _reexecuteOrg] = useResource(
    isOrg ? selectAPIOrg : selectAPINull,
    [ctx.orgNameToOrgID(list.data.creatorid)],
    {
      orgid: '',
      name: '',
      display_name: '',
      desc: '',
      creation_time: 0,
    },
  );
  const creatorName = isOrg
    ? org.success
      ? org.data.name
      : ''
    : user.success
    ? user.data.username
    : '';

  const {loggedIn, userid} = useAuthValue();
  const useridArr = useMemo(() => [userid], [userid]);
  const [members, _reexecuteMember] = useResource(
    list.success && loggedIn ? selectAPIListMemberIDs : selectAPINull,
    [list.data.listid, useridArr],
    [],
  );
  const isMember =
    Array.isArray(members.data) && members.data.some((i) => i === userid);

  return (
    <div>
      {list.success && (
        <Grid justify="space-between" align="flex-end">
          <Column grow="1">
            <h2>
              {list.data.name}{' '}
              <small>{`${creatorName}.${list.data.listname}`}</small>
            </h2>
            <p>{list.data.desc}</p>
          </Column>
          <Column>
            <ButtonGroup>
              {loggedIn && !isMember && (
                <ButtonTertiary>Subscribe</ButtonTertiary>
              )}
              {loggedIn && isMember && (
                <ButtonTertiary>Unsubscribe</ButtonTertiary>
              )}
            </ButtonGroup>
          </Column>
        </Grid>
      )}
      {members.err && <p>{members.err.message}</p>}
    </div>
  );
};

export default List;
