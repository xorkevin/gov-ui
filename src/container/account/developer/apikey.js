import React, {Fragment, useState, useCallback, useMemo} from 'react';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  Field,
  FieldMultiSelect,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const APIKEY_LIMIT = 32;

const selectAPIKeys = (api) => api.u.apikey.get;
const selectAPICheckKey = (api) => api.u.apikey.check;
const selectAPICreate = (api) => api.u.apikey.create;
const selectAPIUpdate = (api) => api.u.apikey.id.edit;
const selectAPIRotate = (api) => api.u.apikey.id.rotate;
const selectAPIDelete = (api) => api.u.apikey.id.del;

const MODE_BASE = 0;
const MODE_EDIT = 1;
const MODE_ROTATE = 2;

const API_KEY_MESSAGE = (
  <p>
    This API Key allows anyone who has access to it to make API requests on your
    behalf with the permissions you granted. Therefore, to ensure security,
    store the API Key secret below in a safe place, as you will{' '}
    <strong>not</strong> be able to view it again.
  </p>
);

const ApikeyRow = ({
  name,
  desc,
  keyid,
  auth_tags,
  time,
  posthookDel,
  posthookUpd,
  errhook,
  allPermissions,
}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [keyid],
    {},
    {posthook: posthookDel, errhook},
  );

  const form = useForm({
    name: '',
    desc: '',
    auth_tags: [],
  });
  const [mode, setMode] = useState(MODE_BASE);
  const updateSuccess = useCallback(
    (status, data, opts) => {
      setMode(MODE_BASE);
      posthookUpd(status, data, opts);
    },
    [setMode, posthookUpd],
  );
  const [_updateState, execUpdate] = useAuthCall(
    selectAPIUpdate,
    [keyid, form.state.name, form.state.desc, form.state.auth_tags.join(',')],
    {},
    {posthook: updateSuccess, errhook},
  );

  const formAssign = form.assign;
  const beginEdit = useCallback(() => {
    formAssign({
      name,
      desc,
      auth_tags: auth_tags.split(','),
    });
    setMode(MODE_EDIT);
  }, [name, desc, auth_tags, formAssign, setMode]);

  const cancelEdit = useCallback(() => setMode(MODE_BASE), [setMode]);

  const posthookRotate = useCallback(() => {
    setMode(MODE_ROTATE);
  }, [setMode]);
  const [rotate, execRotate] = useAuthCall(
    selectAPIRotate,
    [keyid],
    {},
    {posthook: posthookRotate, errhook},
  );

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column>
          <h5>
            {name}
            {desc.length > 0 ? ' - ' : ''}
            {desc}
          </h5>
          <div>
            {auth_tags.split(',').map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
          <p>
            ID: <code>{keyid}</code>
          </p>
          <p>
            <FaIcon icon="key" />
            <Tooltip tooltip="For security purposes, the key cannot be shown">
              &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
            </Tooltip>
          </p>
          <div>
            Created <Time value={time * 1000} />
          </div>
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem onClick={beginEdit}>
                <FaIcon icon="pencil" /> Edit
              </MenuItem>
              <MenuItem onClick={execRotate}>
                <FaIcon icon="repeat" /> Rotate key
              </MenuItem>
              <MenuItem onClick={execDelete}>
                <FaIcon icon="trash" /> Delete
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
      {mode === MODE_EDIT && (
        <Grid>
          <Column>
            <h4>Edit</h4>
            <Form
              formState={form.state}
              onChange={form.update}
              onSubmit={execUpdate}
            >
              <Field name="name" label="Name" nohint />
              <Field name="desc" label="Description (optional)" nohint />
              <FieldMultiSelect
                name="auth_tags"
                label="Permissions"
                options={allPermissions}
                nohint
              />
            </Form>
            <ButtonGroup>
              <ButtonTertiary onClick={cancelEdit}>Cancel</ButtonTertiary>
              <ButtonPrimary onClick={execUpdate}>
                <FaIcon icon="floppy-o" /> Update
              </ButtonPrimary>
            </ButtonGroup>
          </Column>
        </Grid>
      )}
      {mode === MODE_ROTATE && (
        <Grid>
          <Column>
            {rotate.success && (
              <div>
                <h4>API Key Rotated</h4>
                {API_KEY_MESSAGE}
                <p>
                  <h5>Key ID</h5>
                  <code>{rotate.data.keyid}</code>
                  <h5>Secret</h5>
                  <code>{rotate.data.key}</code>
                </p>
                <ButtonGroup>
                  <ButtonTertiary onClick={cancelEdit}>Close</ButtonTertiary>
                </ButtonGroup>
              </div>
            )}
          </Column>
        </Grid>
      )}
    </ListItem>
  );
};

const CheckKey = () => {
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>Key OK</SnackbarSurface>,
  );
  const form = useForm({
    keyid: '',
    key: '',
    auth_tags: '',
  });

  const formAssign = form.assign;
  const clearForm = useCallback(() => {
    formAssign({
      keyid: '',
      key: '',
      auth_tags: '',
    });
  }, [formAssign]);
  const [checkKey, execCheckKey] = useAuthCall(
    selectAPICheckKey,
    [form.state.keyid, form.state.key, form.state.auth_tags],
    {},
    {posthook: displaySnackbar},
  );
  return (
    <Fragment>
      <h3>Check key</h3>
      <hr />
      <Grid>
        <Column md={16}>
          <h5>Warning</h5>
          <p>
            This should be used for <strong>debug</strong> purposes only. Rotate
            keys after testing.
          </p>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execCheckKey}
          >
            <Field name="keyid" label="Key ID" nohint fullWidth />
            <Field name="key" label="Key" nohint fullWidth />
            <Field name="auth_tags" label="Roles" nohint fullWidth />
          </Form>
          <ButtonGroup>
            <ButtonTertiary onClick={clearForm}>Clear</ButtonTertiary>
            <ButtonPrimary onClick={execCheckKey}>Check key</ButtonPrimary>
          </ButtonGroup>
          {checkKey.err && <p>{checkKey.err}</p>}
        </Column>
      </Grid>
    </Fragment>
  );
};

const Apikeys = () => {
  const displaySnackbarDel = useSnackbarView(
    <SnackbarSurface>API Key deleted</SnackbarSurface>,
  );
  const displaySnackbarUpd = useSnackbarView(
    <SnackbarSurface>API Key updated</SnackbarSurface>,
  );
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_status, err) => {
      snackbar(<SnackbarSurface>{err}</SnackbarSurface>);
    },
    [snackbar],
  );

  const paginate = usePaginate(APIKEY_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthook = useCallback(
    (_status, apikeys) => {
      setAtEnd(apikeys.length < APIKEY_LIMIT);
    },
    [setAtEnd],
  );
  const [apikeys, reexecute] = useAuthResource(
    selectAPIKeys,
    [APIKEY_LIMIT, paginate.index],
    [],
    {posthook},
  );

  const form = useForm({
    name: '',
    desc: '',
    auth_tags: [],
  });

  const formAssign = form.assign;
  const posthookCreate = useCallback(
    (_status, _data, opts) => {
      formAssign({
        name: '',
        desc: '',
        auth_tags: [],
      });
      reexecute(opts);
    },
    [reexecute, formAssign],
  );
  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [form.state.name, form.state.desc, form.state.auth_tags.join(',')],
    {},
    {posthook: posthookCreate},
  );

  const posthookDelete = useCallback(
    (_status, _data, opts) => {
      displaySnackbarDel();
      reexecute(opts);
    },
    [reexecute, displaySnackbarDel],
  );

  const posthookUpdate = useCallback(
    (_status, _data, opts) => {
      displaySnackbarUpd();
      reexecute(opts);
    },
    [reexecute, displaySnackbarUpd],
  );

  const {authTags} = useAuthValue();
  const allPermissions = useMemo(
    () => (authTags.length > 0 ? authTags.split(',') : []),
    [authTags],
  );

  return (
    <div>
      <h3>API Keys</h3>
      <hr />
      <Grid>
        <Column md={16}>
          <ListGroup>
            {apikeys.data.map(({name, desc, keyid, auth_tags, time}) => (
              <ApikeyRow
                key={keyid}
                keyid={keyid}
                name={name}
                desc={desc}
                auth_tags={auth_tags}
                time={time}
                posthookDel={posthookDelete}
                posthookUpd={posthookUpdate}
                errhook={displayErrSnack}
                allPermissions={allPermissions}
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
          {apikeys.err && <p>{apikeys.err}</p>}
        </Column>
        <Column md={8}>
          <h4>Create New API Key</h4>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execCreate}
          >
            <Field name="name" label="Name" nohint fullWidth />
            <Field
              name="desc"
              label="Description (optional)"
              nohint
              fullWidth
            />
            <FieldMultiSelect
              name="auth_tags"
              label="Permissions"
              options={allPermissions}
              nohint
              fullWidth
            />
          </Form>
          <ButtonGroup>
            <ButtonPrimary onClick={execCreate}>Create</ButtonPrimary>
          </ButtonGroup>
          {create.err && <p>{create.err}</p>}
          {create.success && (
            <div>
              <h4>Success! API Key Created</h4>
              {API_KEY_MESSAGE}
              <p>
                <h5>Key ID</h5>
                <code>{create.data.keyid}</code>
                <h5>Secret</h5>
                <code>{create.data.key}</code>
              </p>
            </div>
          )}
        </Column>
      </Grid>
      <CheckKey />
    </div>
  );
};

export default Apikeys;
