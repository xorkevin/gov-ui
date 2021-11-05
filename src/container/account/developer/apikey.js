import {Fragment, useCallback, useMemo, useContext} from 'react';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Container,
  Grid,
  Column,
  ListGroup,
  ListItem,
  ModalSurface,
  useModal,
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

import {GovUICtx} from '../../../middleware';

const APIKEY_LIMIT = 32;

const selectAPIKeys = (api) => api.u.apikey.get;
const selectAPICheckKey = (api) => api.u.apikey.check;
const selectAPICreate = (api) => api.u.apikey.create;
const selectAPIUpdate = (api) => api.u.apikey.id.edit;
const selectAPIRotate = (api) => api.u.apikey.id.rotate;
const selectAPIDelete = (api) => api.u.apikey.id.del;

const API_KEY_MESSAGE = (
  <p>
    This API Key allows anyone who has access to it to make API requests on your
    behalf with the permissions you granted. Therefore, to ensure security,
    store the API Key secret below in a safe place, as you will{' '}
    <strong>not</strong> be able to view it again.
  </p>
);

const EditKey = ({
  keyid,
  name,
  desc,
  scope,
  scopeOptions,
  posthookUpd,
  errhook,
  close,
}) => {
  const form = useForm({
    name,
    desc,
    scope: scope.split(' ').filter((s) => s.length > 0),
  });

  const updateSuccess = useCallback(
    (res, data, opts) => {
      close();
      posthookUpd(res, data, opts);
    },
    [close, posthookUpd],
  );
  const [_updateState, execUpdate] = useAuthCall(
    selectAPIUpdate,
    [keyid, form.state.name, form.state.desc, form.state.scope.join(' ')],
    {},
    {posthook: updateSuccess, errhook},
  );

  return (
    <Fragment>
      <h4>Edit Key</h4>
      <h5>Key ID</h5>
      <code>{keyid}</code>
      <Form formState={form.state} onChange={form.update} onSubmit={execUpdate}>
        <Field name="name" label="Name" nohint fullWidth />
        <Field name="desc" label="Description (optional)" nohint fullWidth />
        <FieldMultiSelect
          name="scope"
          label="Permissions"
          options={scopeOptions}
          nohint
          fullWidth
        />
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Cancel</ButtonTertiary>
        <ButtonPrimary onClick={execUpdate}>Update</ButtonPrimary>
      </ButtonGroup>
    </Fragment>
  );
};

const ApikeyRow = ({
  name,
  desc,
  keyid,
  scope,
  time,
  posthookDel,
  posthookUpd,
  errhook,
  scopeOptions,
  allScopeDesc,
}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [keyid],
    {},
    {posthook: posthookDel, errhook},
  );

  const modalEdit = useModal();
  const modalRotate = useModal();

  const modalRotateToggle = modalRotate.toggle;
  const posthookRotate = useCallback(
    (res, data, opts) => {
      modalRotateToggle();
      posthookUpd(res, data, opts);
    },
    [modalRotateToggle, posthookUpd],
  );
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
        <Column grow="1">
          <Container padded>
            <h5>
              {name}
              {desc.length > 0 ? ' - ' : ''}
              {desc}
            </h5>
            <div>
              <div>
                ID: <code>{keyid}</code>
              </div>
              <div>
                <FaIcon icon="key" />
                <Tooltip tooltip="For security, the key cannot be shown">
                  &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                </Tooltip>
              </div>
            </div>
            <div>
              {scope
                .split(' ')
                .filter((s) => s.length > 0)
                .map((s) => (
                  <Chip key={s}>
                    <Tooltip tooltip={allScopeDesc[s]}>{s}</Tooltip>
                  </Chip>
                ))}
            </div>
            <p>
              Created <Time value={time * 1000} />
            </p>
          </Container>
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu
              size="md"
              anchor={menu.anchor}
              close={menu.close}
              onClick={menu.close}
            >
              <MenuItem
                forwardedRef={modalEdit.anchorRef}
                onClick={modalEdit.toggle}
                icon={<FaIcon icon="pencil" />}
              >
                Edit
              </MenuItem>
              <MenuItem
                forwardedRef={modalRotate.anchorRef}
                onClick={execRotate}
                icon={<FaIcon icon="repeat" />}
              >
                Rotate key
              </MenuItem>
              <MenuItem onClick={execDelete} icon={<FaIcon icon="trash" />}>
                Delete
              </MenuItem>
            </Menu>
          )}
          {modalEdit.show && (
            <ModalSurface
              size="md"
              anchor={modalEdit.anchor}
              close={modalEdit.close}
            >
              <EditKey
                keyid={keyid}
                name={name}
                desc={desc}
                scope={scope}
                scopeOptions={scopeOptions}
                posthookUpd={posthookUpd}
                errhook={errhook}
                close={modalEdit.close}
              />
            </ModalSurface>
          )}
          {modalRotate.show && (
            <ModalSurface
              size="md"
              anchor={modalRotate.anchor}
              close={modalRotate.close}
            >
              {rotate.success && (
                <Fragment>
                  <h4>API Key Rotated</h4>
                  {API_KEY_MESSAGE}
                  <div>
                    <h5>Key ID</h5>
                    <code>{rotate.data.keyid}</code>
                    <h5>Secret</h5>
                    <code>{rotate.data.key}</code>
                  </div>
                  <ButtonGroup>
                    <ButtonTertiary onClick={modalRotate.close}>
                      Close
                    </ButtonTertiary>
                  </ButtonGroup>
                </Fragment>
              )}
            </ModalSurface>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const CheckKey = () => {
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>&#x2713; Key OK</SnackbarSurface>,
  );
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_res, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const form = useForm({
    keyid: '',
    key: '',
    roles: '',
    scope: '',
  });

  const formAssign = form.assign;
  const clearForm = useCallback(() => {
    formAssign({
      keyid: '',
      key: '',
      roles: '',
      scope: '',
    });
  }, [formAssign]);
  const [_checkKey, execCheckKey] = useAuthCall(
    selectAPICheckKey,
    [form.state.keyid, form.state.key, form.state.roles, form.state.scope],
    {},
    {posthook: displaySnackbar, errhook: displayErrSnack},
  );

  return (
    <Fragment>
      <h3>Check key</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
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
            <Field name="roles" label="Roles" nohint fullWidth />
            <Field name="scope" label="Scopes" nohint fullWidth />
          </Form>
          <ButtonGroup>
            <ButtonTertiary onClick={clearForm}>Clear</ButtonTertiary>
            <ButtonPrimary onClick={execCheckKey}>Check key</ButtonPrimary>
          </ButtonGroup>
        </Column>
      </Grid>
    </Fragment>
  );
};

const CreateKey = ({posthookCreate, close, scopeOptions}) => {
  const form = useForm({
    name: '',
    desc: '',
    scope: [],
  });

  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [form.state.name, form.state.desc, form.state.scope.join(' ')],
    {},
    {posthook: posthookCreate},
  );

  return (
    <Fragment>
      {!create.success && (
        <Fragment>
          <h4>Create new API key</h4>
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
              name="scope"
              label="Scopes"
              options={scopeOptions}
              nohint
              fullWidth
            />
          </Form>
          <ButtonGroup>
            <ButtonTertiary onClick={close}>Close</ButtonTertiary>
            <ButtonPrimary onClick={execCreate}>Create</ButtonPrimary>
          </ButtonGroup>
        </Fragment>
      )}
      {create.err && <p>{create.err.message}</p>}
      {create.success && (
        <Fragment>
          <h4>Success! API Key Created</h4>
          {API_KEY_MESSAGE}
          <div>
            <h5>Key ID</h5>
            <code>{create.data.keyid}</code>
            <h5>Secret</h5>
            <code>{create.data.key}</code>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const Apikeys = () => {
  const ctx = useContext(GovUICtx);
  const displaySnackbarDel = useSnackbarView(
    <SnackbarSurface>
      <FaIcon icon="trash" /> API key deleted
    </SnackbarSurface>,
  );
  const displaySnackbarUpd = useSnackbarView(
    <SnackbarSurface>&#x2713; API key updated</SnackbarSurface>,
  );
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_res, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const paginate = usePaginate(APIKEY_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthook = useCallback(
    (_res, apikeys) => {
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

  const posthookDelete = useCallback(() => {
    displaySnackbarDel();
    reexecute();
  }, [reexecute, displaySnackbarDel]);

  const posthookUpdate = useCallback(() => {
    displaySnackbarUpd();
    reexecute();
  }, [reexecute, displaySnackbarUpd]);

  const posthookCreate = useCallback(() => {
    reexecute();
  }, [reexecute]);

  const modal = useModal();

  const {roles} = useAuthValue();
  const scopeOptions = useMemo(() => {
    const scopeSet = new Set(
      roles.flatMap((role) => ctx.apiRolesToScopes[role]),
    );
    return ctx.apiAllScopes
      .filter((i) => scopeSet.has(i))
      .map((i) => ({display: i, value: i}));
  }, [ctx, roles]);

  return (
    <div>
      <Grid justify="space-between" align="flex-end">
        <Column grow="1">
          <h3>API keys</h3>
        </Column>
        <Column>
          <ButtonGroup>
            <ButtonTertiary
              forwardedRef={modal.anchorRef}
              onClick={modal.toggle}
            >
              <FaIcon icon="plus" /> New
            </ButtonTertiary>
          </ButtonGroup>
          {modal.show && (
            <ModalSurface size="md" anchor={modal.anchor} close={modal.close}>
              <CreateKey
                posthookCreate={posthookCreate}
                close={modal.close}
                scopeOptions={scopeOptions}
              />
            </ModalSurface>
          )}
        </Column>
      </Grid>
      <hr />
      <ListGroup>
        {apikeys.data.map(({name, desc, keyid, scope, time}) => (
          <ApikeyRow
            key={keyid}
            keyid={keyid}
            name={name}
            desc={desc}
            scope={scope}
            time={time}
            posthookDel={posthookDelete}
            posthookUpd={posthookUpdate}
            errhook={displayErrSnack}
            scopeOptions={scopeOptions}
            allScopeDesc={ctx.apiAllScopeDesc}
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
      {apikeys.err && <p>{apikeys.err.message}</p>}
      <CheckKey />
    </div>
  );
};

export default Apikeys;
