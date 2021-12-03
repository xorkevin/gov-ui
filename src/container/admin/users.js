import {Fragment, useCallback, useMemo, useContext} from 'react';
import {Routes, Route, useHref, useParams} from 'react-router-dom';
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
  Anchor,
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

const UserSearch = () => {
  const form = useForm({
    username: '',
  });

  const apiSearch = useAPI(selectAPISearch);
  const searchUsers = useCallback(
    async ({signal}, search) => {
      const [data, res, err] = await apiSearch({signal}, search, USERS_LIMIT);
      if (err || !res || !res.ok || !Array.isArray(data)) {
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
        <Form formState={form.state} onChange={form.update}>
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
          <Anchor local href={form.state.username}>
            <ButtonPrimary>Search</ButtonPrimary>
          </Anchor>
        </ButtonGroup>
      </Column>
    </Grid>
  );
};

const UserDetails = ({back}) => {
  const {username} = useParams();

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

  const [user, reexecute] = useResource(
    username ? selectAPIUser : selectAPINull,
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

  const posthook = useCallback(() => {
    clearForm();
    snackRolesUpdate();
    reexecute();
  }, [reexecute, snackRolesUpdate, clearForm]);
  const [edit, execEdit] = useAuthCall(
    selectAPIEditRank,
    [user.data.userid, form.state.add, form.state.remove],
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
        <Anchor local href={back}>
          <ButtonTertiary>
            <FaIcon icon="chevron-left" /> Back
          </ButtonTertiary>
        </Anchor>
      </ButtonGroup>
      {user.success && (
        <Grid>
          <Column fullWidth md={16}>
            <h4>{`${user.data.first_name} ${user.data.last_name}`}</h4>
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
            <code>{user.data.userid}</code>
            <h5>Username</h5>
            <div>{user.data.username}</div>
            <h5>Current Roles</h5>
            {Array.isArray(user.data.roles) &&
              user.data.roles.map((tag) => <Chip key={tag}>{tag}</Chip>)}
            <p>
              Created <Time value={user.data.creation_time * 1000} />
            </p>
          </Column>
        </Grid>
      )}
      {user.err && <p>{user.err.message}</p>}
    </Fragment>
  );
};

const Users = () => {
  const matchURL = useHref('');
  return (
    <div>
      <h3>Manage Roles</h3>
      <hr />
      <Routes>
        <Route index element={<UserSearch />} />
        <Route path=":username" element={<UserDetails back={matchURL} />} />
      </Routes>
    </div>
  );
};

export default Users;
