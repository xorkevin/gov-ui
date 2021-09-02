import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
import {useAPI, useResource, selectAPINull} from '@xorkevin/substation';
import {AuthCtx, useAuthValue, useAuthCall} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  FieldDynSuggest,
  FieldMultiSelect,
  Form,
  useForm,
  useFormSearch,
  SnackbarSurface,
  useSnackbarView,
  ButtonGroup,
  Chip,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const modRegex = /^mod\..+/;

const USERS_LIMIT = 8;

const selectAPIUser = (api) => api.u.user.name;
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
    <Grid>
      <Column fullWidth md={16}>
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
      </Column>
    </Grid>
  );
};

const UserDetails = ({user, back, reexecute}) => {
  const {roleIntersect} = useContext(AuthCtx);

  const snackRolesUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Role invitations sent</SnackbarSurface>,
  );

  const form = useForm({
    add: [],
    remove: [],
  });

  const formAssign = form.assign;
  const clearForm = useCallback(() => {
    formAssign({
      add: [],
      remove: [],
    });
  }, [formAssign]);
  const posthook = useCallback(() => {
    clearForm();
    snackRolesUpdate();
    reexecute();
  }, [reexecute, snackRolesUpdate, clearForm]);
  const [edit, execEdit] = useAuthCall(
    selectAPIEditRank,
    [user.userid, form.state.add, form.state.remove],
    {},
    {posthook},
  );

  const {roles} = useAuthValue();
  const allPermissions = useMemo(() => {
    if (!Array.isArray(roleIntersect)) {
      return [];
    }
    if (roles.includes('admin')) {
      return roleIntersect.map((i) => ({display: i, value: i}));
    }
    return roles
      .filter((i) => modRegex.test(i))
      .flatMap((i) => {
        const name = i.substring(4);
        return ['usr.' + name, 'mod.' + name];
      })
      .map((i) => ({display: i, value: i}));
  }, [roleIntersect, roles]);

  return (
    <Fragment>
      <ButtonGroup>
        <ButtonTertiary onClick={back}>
          <FaIcon icon="chevron-left" /> Back
        </ButtonTertiary>
      </ButtonGroup>
      <Grid>
        <Column fullWidth md={16}>
          <h4>{`${user.first_name} ${user.last_name}`}</h4>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execEdit}
          >
            <FieldMultiSelect
              name="add"
              label="Add"
              options={allPermissions}
              nohint
              fullWidth
            />
            <FieldMultiSelect
              name="remove"
              label="Remove"
              options={allPermissions}
              nohint
              fullWidth
            />
          </Form>
          <ButtonGroup>
            <ButtonTertiary onClick={clearForm}>Clear</ButtonTertiary>
            <ButtonPrimary onClick={execEdit}>Update Roles</ButtonPrimary>
          </ButtonGroup>
          {edit.err && <p>{edit.err.message}</p>}
        </Column>
        <Column fullWidth md={8}>
          <h5>Userid</h5>
          <code>{user.userid}</code>
          <h5>Username</h5>
          <div>{user.username}</div>
          <h5>Current Roles</h5>
          {Array.isArray(user.roles) &&
            user.roles.map((tag) => <Chip key={tag}>{tag}</Chip>)}
          <p>
            Created <Time value={user.creation_time * 1000} />
          </p>
        </Column>
      </Grid>
    </Fragment>
  );
};

const Users = () => {
  const [username, setUsername] = useState('');

  const back = useCallback(() => {
    setUsername('');
  }, [setUsername]);

  const hasUsername = username.length > 0;

  const [user, reexecute] = useResource(
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
      <h3>Manage Roles</h3>
      <hr />
      {!displayUser && <UserSearch setUsername={setUsername} err={user.err} />}
      {displayUser && (
        <UserDetails user={user.data} back={back} reexecute={reexecute} />
      )}
    </div>
  );
};

export default Users;
