import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
import {useAPI, useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall} from '@xorkevin/turbine';
import {
  FieldDynSuggest,
  Form,
  useForm,
  useFormSearch,
  SnackbarSurface,
  useSnackbarView,
  ButtonGroup,
  FaIcon,
  Chip,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import ButtonDangerSecondary from '@xorkevin/nuke/src/component/button/dangersecondary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';

const USERS_LIMIT = 8;

const selectAPIUser = (api) => api.u.user.name;
const selectAPIRoles = (api) => api.u.user.id.roleint;
const selectAPIEditRank = (api) => api.u.user.id.edit.rank;
const selectAPISearch = (api) => api.u.user.search;

const UserSearch = ({setUsername, err}) => {
  const form = useForm({
    username: '',
  });

  const formState = form.state;
  const search = useCallback(() => {
    setUsername(formState.username);
  }, [formState, setUsername]);

  const apiSearch = useAPI(selectAPISearch);
  const searchUsers = useCallback(
    async (search) => {
      const [data, res, err] = await apiSearch(search, USERS_LIMIT);
      if (err || !res || !res.ok || !Array.isArray(data)) {
        return [];
      }
      return data.map((i) => i.username);
    },
    [apiSearch],
  );
  const userSuggest = useFormSearch(searchUsers, 256);

  return (
    <Fragment>
      <Form formState={form.state} onChange={form.update} onSubmit={search}>
        <FieldDynSuggest
          name="username"
          label="Username"
          onSearch={userSuggest.setSearch}
          options={userSuggest.opts}
          nohint
          fullWidth
        />
      </Form>
      <ButtonGroup>
        <ButtonPrimary onClick={search}>Search</ButtonPrimary>
      </ButtonGroup>
      {err && <p>{err.message}</p>}
    </Fragment>
  );
};

const MemberDetails = ({org, user, back}) => {
  const ctx = useContext(GovUICtx);

  const {userid: auth_userid} = useAuthValue();

  const usrRole = ctx.orgUsrRole(org.orgid);
  const modRole = ctx.orgModRole(org.orgid);

  const snackMemberAdded = useSnackbarView(
    <SnackbarSurface>&#x2713; Member invited</SnackbarSurface>,
  );
  const snackMemberRemoved = useSnackbarView(
    <SnackbarSurface>&#x2713; Member removed</SnackbarSurface>,
  );

  const userid = user.userid;

  const isSelf = auth_userid === userid;

  const roleint = useMemo(() => [usrRole, modRole], [usrRole, modRole]);
  const [userRoles, reexecute] = useResource(
    selectAPIRoles,
    [userid, roleint],
    [],
  );

  const memberRole = useMemo(
    () => ({
      add: [usrRole],
      remove: [],
    }),
    [usrRole],
  );

  const moderatorRole = useMemo(
    () => ({
      add: [usrRole, modRole],
      remove: [],
    }),
    [usrRole, modRole],
  );

  const posthookAdd = useCallback(() => {
    snackMemberAdded();
    reexecute();
  }, [reexecute, snackMemberAdded]);
  const [addMember, execAddMember] = useAuthCall(
    selectAPIEditRank,
    [userid, memberRole.add, memberRole.remove],
    {},
    {posthook: posthookAdd},
  );
  const [addMod, execAddMod] = useAuthCall(
    selectAPIEditRank,
    [userid, moderatorRole.add, moderatorRole.remove],
    {},
    {posthook: posthookAdd},
  );

  const posthookRemove = useCallback(() => {
    snackMemberRemoved();
    reexecute();
  }, [reexecute, snackMemberRemoved]);
  const [rmMember, execRmMember] = useAuthCall(
    selectAPIEditRank,
    [userid, moderatorRole.remove, moderatorRole.add],
    {},
    {posthook: posthookRemove},
  );

  const isMember =
    Array.isArray(userRoles.data) && userRoles.data.some((i) => i === usrRole);
  const isMod =
    Array.isArray(userRoles.data) && userRoles.data.some((i) => i === modRole);

  return (
    <Fragment>
      <ButtonGroup>
        <ButtonTertiary onClick={back}>
          <FaIcon icon="chevron-left" /> Back
        </ButtonTertiary>
      </ButtonGroup>
      <div>
        <h4>
          <AnchorText
            local
            href={formatURL(ctx.pathUserProfile, user.username)}
          >
            {user.first_name} {user.last_name}
          </AnchorText>{' '}
          <small>{user.username}</small>
          {isMember && (
            <small>
              <Chip>Member</Chip>
            </small>
          )}
          {isMod && (
            <small>
              <Chip>Moderator</Chip>
            </small>
          )}
        </h4>
        {userRoles.err && <p>{userRoles.err.message}</p>}
        {userRoles.success && (
          <ButtonGroup>
            {!isMember && (
              <ButtonPrimary onClick={execAddMember}>
                Add as Member
              </ButtonPrimary>
            )}
            {!isMod && (
              <ButtonPrimary onClick={execAddMod} disabled={isSelf}>
                Add as Moderator
              </ButtonPrimary>
            )}
            {(isMember || isMod) && (
              <ButtonDangerSecondary onClick={execRmMember} disabled={isSelf}>
                Remove Member
              </ButtonDangerSecondary>
            )}
          </ButtonGroup>
        )}
      </div>
      {addMember.err && <p>{addMember.err.message}</p>}
      {addMod.err && <p>{addMod.err.message}</p>}
      {rmMember.err && <p>{rmMember.err.message}</p>}
    </Fragment>
  );
};

const ManageMembers = ({org}) => {
  const [username, setUsername] = useState('');

  const back = useCallback(() => {
    setUsername('');
  }, [setUsername]);

  const hasUsername = username.length > 0;

  const [user, _execUser] = useResource(
    hasUsername ? selectAPIUser : selectAPINull,
    [username],
    {
      userid: '',
      username: '',
      first_name: '',
      last_name: '',
      roles: [],
      creation_time: 0,
    },
  );

  const displayUser = hasUsername && user.success;

  return (
    <div>
      <h3>Manage Members</h3>
      <hr />
      {!displayUser && <UserSearch setUsername={setUsername} err={user.err} />}
      {displayUser && <MemberDetails org={org} user={user.data} back={back} />}
    </div>
  );
};

export default ManageMembers;
