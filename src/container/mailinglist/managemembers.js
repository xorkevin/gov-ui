import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
import {useAPI, useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthCall} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  Form,
  FieldDynSuggest,
  useForm,
  useFormSearch,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  usePaginate,
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

const selectAPIListMembers = (api) => api.mailinglist.id.member;
const selectAPIListMemberIDs = (api) => api.mailinglist.id.member.ids;
const selectAPIListMemberEdit = (api) => api.mailinglist.group.list.member.edit;
const selectAPIUser = (api) => api.u.user.name;
const selectAPIUsers = (api) => api.u.user.ids;
const selectAPISearch = (api) => api.u.user.search;

const USERS_LIMIT = 8;
const MEMBERS_LIMIT = 32;

const MemberRow = ({
  userid,
  username,
  first_name,
  last_name,
  list,
  pathUserProfile,
  posthookRemove,
  errhookRemove,
}) => {
  const useridArr = useMemo(() => [userid], [userid]);

  const [_rmMember, execRmMember] = useAuthCall(
    selectAPIListMemberEdit,
    [list.creatorid, list.listname, useridArr],
    {},
    {posthook: posthookRemove, errhook: errhookRemove},
  );

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="mailinglist-item-name">
          <h5 className="mailinglist-item-heading">
            <AnchorText local href={formatURL(pathUserProfile, username)}>
              {first_name} {last_name}
            </AnchorText>{' '}
            <small>{username}</small>
          </h5>
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem onClick={execRmMember}>Remove</MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const UserSearch = ({list, setUsername, err}) => {
  const ctx = useContext(GovUICtx);

  const snackMemberRemoved = useSnackbarView(
    <SnackbarSurface>&#x2713; Member removed</SnackbarSurface>,
  );
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_status, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

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

  const paginate = usePaginate(MEMBERS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookMembers = useCallback(
    (_status, members) => {
      setAtEnd(members.length < MEMBERS_LIMIT);
    },
    [setAtEnd],
  );
  const [members, reexecute] = useResource(
    selectAPIListMembers,
    [list.listid, MEMBERS_LIMIT, paginate.index],
    [],
    {posthook: posthookMembers},
  );

  const [users] = useResource(
    members.data.length > 0 ? selectAPIUsers : selectAPINull,
    [members.data],
    [],
  );

  const posthookRemove = useCallback(() => {
    snackMemberRemoved();
    reexecute();
  }, [reexecute, snackMemberRemoved]);

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
      <ListGroup>
        {Array.isArray(users.data) &&
          users.data.map((i) => (
            <MemberRow
              key={i.userid}
              userid={i.userid}
              username={i.username}
              first_name={i.first_name}
              last_name={i.last_name}
              list={list}
              pathUserProfile={ctx.pathUserProfile}
              posthookRemove={posthookRemove}
              errhookRemove={displayErrSnack}
            />
          ))}
      </ListGroup>
      <ButtonGroup>
        <ButtonTertiary disabled={paginate.atFirst} onClick={paginate.prev}>
          prev
        </ButtonTertiary>
        {paginate.page}
        <ButtonTertiary disabled={paginate.atLast} onClick={paginate.next}>
          next
        </ButtonTertiary>
      </ButtonGroup>
      {members.err && <p>{members.err.message}</p>}
      {users.err && <p>{users.err.message}</p>}
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
      {!displayUser && (
        <UserSearch list={list} setUsername={setUsername} err={user.err} />
      )}
      {displayUser && (
        <MemberDetails list={list} user={user.data} back={back} />
      )}
    </div>
  );
};

export default ManageMembers;
