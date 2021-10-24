import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
import {useAPI, useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthCall} from '@xorkevin/turbine';
import {
  Form,
  FieldDynSuggest,
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

const selectAPIListMemberIDs = (api) => api.mailinglist.id.member.ids;
const selectAPIListMemberEdit = (api) => api.mailinglist.group.list.member.edit;
const selectAPIUser = (api) => api.u.user.name;
const selectAPISearch = (api) => api.u.user.search;

const USERS_LIMIT = 8;

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
      const [data, status, err] = await apiSearch(search, USERS_LIMIT);
      if (err || status < 200 || status >= 300 || !Array.isArray(data)) {
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

const MemberDetails = ({list, user, back}) => {
  const ctx = useContext(GovUICtx);

  const snackMemberRemoved = useSnackbarView(
    <SnackbarSurface>&#x2713; Member removed</SnackbarSurface>,
  );

  const userid = user.userid;

  const useridArr = useMemo(() => [userid], [userid]);

  const [members, reexecute] = useResource(
    selectAPIListMemberIDs,
    [list.listid, useridArr],
    [],
  );

  const posthookRemove = useCallback(() => {
    snackMemberRemoved();
    reexecute();
  }, [reexecute, snackMemberRemoved]);
  const [rmMember, execRmMember] = useAuthCall(
    selectAPIListMemberEdit,
    [list.creatorid, list.listname, useridArr],
    {},
    {posthook: posthookRemove},
  );

  const isMember =
    Array.isArray(members.data) && members.data.some((i) => i === userid);

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
        </h4>
        {members.err && <p>{members.err.message}</p>}
        {members.success && (
          <Fragment>
            {!isMember && <p>Not a member</p>}
            <ButtonGroup>
              {isMember && (
                <ButtonDangerSecondary onClick={execRmMember}>
                  Remove Member
                </ButtonDangerSecondary>
              )}
            </ButtonGroup>
          </Fragment>
        )}
      </div>
      {rmMember.err && <p>{rmMember.err.message}</p>}
    </Fragment>
  );
};

const ManageMembers = ({list}) => {
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
      {!displayUser && <UserSearch setUsername={setUsername} err={user.err} />}
      {displayUser && (
        <MemberDetails list={list} user={user.data} back={back} />
      )}
    </div>
  );
};

export default ManageMembers;
