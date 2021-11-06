import {Fragment, useCallback, useMemo} from 'react';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {useURL} from '@xorkevin/substation';
import {
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
  FieldFile,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import Anchor from '@xorkevin/nuke/src/component/anchor/text';
import Img from '@xorkevin/nuke/src/component/image/rounded';

const OAUTHAPP_LIMIT = 32;

const selectAPIApps = (api) => api.oauth.app.get;
const selectAPICreate = (api) => api.oauth.app.create;
const selectAPIUpdate = (api) => api.oauth.app.id.edit;
const selectAPIRotate = (api) => api.oauth.app.id.rotate;
const selectAPIDelete = (api) => api.oauth.app.id.del;
const selectAPIImage = (api) => api.oauth.app.id.image;
const selectAPIUpdateImage = (api) => api.oauth.app.id.edit.image;

const OAUTHAPP_MESSAGE = (
  <p>
    The secret authenticates the OAuth App to allow it to retrieve an access
    token on behalf of users. Therefore, to ensure security, store the secret
    below in a safe place, as you will <strong>not</strong> be able to view it
    again.
  </p>
);

const EditApp = ({
  clientid,
  name,
  url,
  redirect_uri,
  posthookUpd,
  errhook,
  close,
}) => {
  const form = useForm({
    name,
    url,
    redirect_uri,
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
    [clientid, form.state],
    {},
    {posthook: updateSuccess, errhook},
  );

  return (
    <Fragment>
      <h4>Edit {name} Client</h4>
      <h5>Client ID</h5>
      <code>{clientid}</code>
      <Form formState={form.state} onChange={form.update} onSubmit={execUpdate}>
        <Field name="name" label="Name" nohint fullWidth />
        <Field name="url" label="URL" hint="app url" fullWidth />
        <Field
          name="redirect_uri"
          label="Redirect URI"
          hint="return uri after authorization"
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

const EditImage = ({clientid, name, posthookUpdImage, errhook, close}) => {
  const form = useForm({
    image: undefined,
  });

  const updateImageSuccess = useCallback(
    (res, data, opts) => {
      close();
      posthookUpdImage(res, data, opts);
    },
    [close, posthookUpdImage],
  );
  const [_editImage, execEditImage] = useAuthCall(
    selectAPIUpdateImage,
    [clientid, form.state.image],
    {},
    {posthook: updateImageSuccess, errhook},
  );

  return (
    <Fragment>
      <h4>Edit {name} Client Logo</h4>
      <Form
        formState={form.state}
        onChange={form.update}
        onSubmit={execEditImage}
      >
        <FieldFile
          name="image"
          hint="Choose an image"
          accept="image/jpeg, image/png"
          onChange={form.update}
          fullWidth
        >
          <ButtonTertiary>Choose</ButtonTertiary>
        </FieldFile>
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Cancel</ButtonTertiary>
        <ButtonPrimary onClick={execEditImage}>Upload</ButtonPrimary>
      </ButtonGroup>
    </Fragment>
  );
};

const AppRow = ({
  clientid,
  name,
  url,
  redirect_uri,
  logo,
  time,
  creation_time,
  posthookDel,
  posthookUpd,
  posthookUpdImage,
  errhook,
}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [clientid],
    {},
    {posthook: posthookDel, errhook},
  );

  const modalEdit = useModal();
  const modalImage = useModal();
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
    [clientid],
    {},
    {posthook: posthookRotate, errhook},
  );

  const imageURL = useURL(selectAPIImage, [clientid]);

  const menu = useMenu();

  const createdAt = useMemo(
    () => new Date(creation_time * 1000).toISOString(),
    [creation_time],
  );

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="minwidth0" grow="1">
          <Grid justify="center" align="center">
            <Column fullWidth sm={6}>
              {logo && (
                <Img
                  className="oauth-app-logo"
                  src={imageURL}
                  preview={logo}
                  ratio={1}
                />
              )}
              <h5 className="text-center">{name}</h5>
            </Column>
            <Column fullWidth sm={18}>
              <div>
                App URL:{' '}
                <Anchor ext href={url}>
                  {url}
                </Anchor>
                <div>Redirect URI: {redirect_uri}</div>
                <div>
                  Client ID: <code>{clientid}</code>
                </div>
                <div>
                  <FaIcon icon="key" />
                  <Tooltip tooltip="For security, the key cannot be shown">
                    &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                  </Tooltip>
                </div>
              </div>
              <p>
                Last Modified <Time value={time * 1000} />
                <br />
                <small>Added {createdAt}</small>
              </p>
            </Column>
          </Grid>
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
                forwardedRef={modalImage.anchorRef}
                onClick={modalImage.toggle}
                icon={<FaIcon icon="picture-o" />}
              >
                Edit Logo
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
              <EditApp
                clientid={clientid}
                name={name}
                url={url}
                redirect_uri={redirect_uri}
                posthookUpd={posthookUpd}
                errhook={errhook}
                close={modalEdit.close}
              />
            </ModalSurface>
          )}
          {modalImage.show && (
            <ModalSurface
              size="md"
              anchor={modalImage.anchor}
              close={modalImage.close}
            >
              <EditImage
                clientid={clientid}
                name={name}
                posthookUpdImage={posthookUpdImage}
                errhook={errhook}
                close={modalImage.close}
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
                  <h4>{name} Client Secret Rotated</h4>
                  {OAUTHAPP_MESSAGE}
                  <div>
                    <h5>Client ID</h5>
                    <code>{rotate.data.client_id}</code>
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

const RegisterApp = ({posthookCreate, close}) => {
  const form = useForm({
    name: '',
    url: '',
    redirect_uri: '',
  });

  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [form.state],
    {},
    {posthook: posthookCreate},
  );

  return (
    <Fragment>
      {!create.success && (
        <Fragment>
          <h4>Register OAuth app</h4>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execCreate}
          >
            <Field name="name" label="Name" nohint fullWidth />
            <Field name="url" label="URL" hint="app url" fullWidth />
            <Field
              name="redirect_uri"
              label="Redirect URI"
              hint="return uri after authorization"
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
          <h4>Success! OAuth App Registered</h4>
          {OAUTHAPP_MESSAGE}
          <div>
            <h5>Client ID</h5>
            <code>{create.data.client_id}</code>
            <h5>Secret</h5>
            <code>{create.data.key}</code>
          </div>
          <ButtonGroup>
            <ButtonTertiary onClick={close}>Close</ButtonTertiary>
          </ButtonGroup>
        </Fragment>
      )}
    </Fragment>
  );
};

const OAuthApps = () => {
  const displaySnackbarDel = useSnackbarView(
    <SnackbarSurface>
      <FaIcon icon="trash" /> OAuth app deleted
    </SnackbarSurface>,
  );
  const displaySnackbarUpd = useSnackbarView(
    <SnackbarSurface>&#x2713; OAuth app updated</SnackbarSurface>,
  );
  const snackImageUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Logo updated</SnackbarSurface>,
  );
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_res, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const paginate = usePaginate(OAUTHAPP_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthook = useCallback(
    (_res, apps) => {
      setAtEnd(apps.length < OAUTHAPP_LIMIT);
    },
    [setAtEnd],
  );
  const [apps, reexecute] = useAuthResource(
    selectAPIApps,
    [OAUTHAPP_LIMIT, paginate.index],
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

  const posthookUpdateImage = useCallback(() => {
    snackImageUpdate();
    reexecute();
  }, [reexecute, snackImageUpdate]);

  const posthookCreate = useCallback(() => {
    reexecute();
  }, [reexecute]);

  const modal = useModal();

  return (
    <div>
      <Grid justify="space-between" align="flex-end">
        <Column grow="1">
          <h3>OAuth apps</h3>
        </Column>
        <Column>
          <ButtonGroup>
            <ButtonTertiary
              forwardedRef={modal.anchorRef}
              onClick={modal.toggle}
            >
              <FaIcon icon="plus" /> Add
            </ButtonTertiary>
          </ButtonGroup>
          {modal.show && (
            <ModalSurface size="md" anchor={modal.anchor} close={modal.close}>
              <RegisterApp
                posthookCreate={posthookCreate}
                close={modal.close}
              />
            </ModalSurface>
          )}
        </Column>
      </Grid>
      <hr />
      {apps.err && <p>{apps.err.message}</p>}
      {apps.success && (
        <Fragment>
          <ListGroup>
            {apps.data.map(
              ({
                client_id,
                name,
                url,
                redirect_uri,
                logo,
                time,
                creation_time,
              }) => (
                <AppRow
                  key={client_id}
                  clientid={client_id}
                  name={name}
                  url={url}
                  redirect_uri={redirect_uri}
                  logo={logo}
                  time={time}
                  creation_time={creation_time}
                  posthookDel={posthookDelete}
                  posthookUpd={posthookUpdate}
                  posthookUpdImage={posthookUpdateImage}
                  errhook={displayErrSnack}
                />
              ),
            )}
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
        </Fragment>
      )}
    </div>
  );
};

export default OAuthApps;
