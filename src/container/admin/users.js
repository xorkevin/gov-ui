import React, {
  Fragment,
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {AuthCtx, useAuthValue, useAuthCall} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Field,
  FieldMultiSelect,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  ButtonGroup,
  Chip,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIUser = (api) => api.u.user.name;
const selectAPIEditRank = (api) => api.u.user.id.edit.rank;

const UserSearch = ({setUsername, err}) => {
  const form = useForm({
    username: '',
  });

  const formState = form.state;
  const search = useCallback(() => {
    setUsername(formState.username);
  }, [formState, setUsername]);

  return (
    <Grid>
      <Column fullWidth md={16}>
        <Form formState={form.state} onChange={form.update} onSubmit={search}>
          <Field name="username" label="Username" fullWidth />
        </Form>
        <ButtonGroup>
          <ButtonPrimary onClick={search}>Search</ButtonPrimary>
        </ButtonGroup>
        {err && <p>{err}</p>}
      </Column>
    </Grid>
  );
};

const UserDetails = ({user, reexecute, back}) => {
  const snackRolesUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Roles updated</SnackbarSurface>,
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
  const posthook = useCallback(
    (_status, _data, opts) => {
      clearForm();
      reexecute(opts);
      snackRolesUpdate();
    },
    [snackRolesUpdate, reexecute, clearForm],
  );
  const [edit, execEdit] = useAuthCall(
    selectAPIEditRank,
    [user.data.userid, form.state.add, form.state.remove],
    {},
    {posthook},
  );

  const {roleIntersect} = useContext(AuthCtx);
  const {roles} = useAuthValue();
  const allPermissions = useMemo(() => {
    if (roles.includes('admin')) {
      return roleIntersect.slice().sort();
    }
    return roles.filter((i) => i !== 'user');
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
          {edit.err && <p>{edit.err}</p>}
        </Column>
        <Column fullWidth md={8}>
          <h5>Userid</h5>
          <code>{user.data.userid}</code>
          <h5>Username</h5>
          <div>{user.data.username}</div>
          <h5>Current Roles</h5>
          {user.data.roles.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
          <p>
            Created <Time value={user.data.creation_time * 1000} />
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
        <UserDetails user={user} reexecute={reexecute} back={back} />
      )}
    </div>
  );
};

export default Users;
