import {Fragment, useState, useCallback, useMemo} from 'react';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {useURL} from '@xorkevin/substation';
import {
  Container,
  Grid,
  Column,
  ListGroup,
  ListItem,
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

const MODE_BASE = 0;
const MODE_EDIT = 1;
const MODE_EDIT_IMAGE = 2;
const MODE_ROTATE = 3;

const OAUTHAPP_MESSAGE = (
  <p>
    The secret authenticates the OAuth App to allow it to retrieve an access
    token on behalf of users. Therefore, to ensure security, store the secret
    below in a safe place, as you will <strong>not</strong> be able to view it
    again.
  </p>
);

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

  const form = useForm({
    name: '',
    url: '',
    redirect_uri: '',
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
    [clientid, form.state],
    {},
    {posthook: updateSuccess, errhook},
  );

  const imageform = useForm({
    image: undefined,
  });
  const updateImageSuccess = useCallback(
    (status, data, opts) => {
      setMode(MODE_BASE);
      posthookUpdImage(status, data, opts);
    },
    [setMode, posthookUpdImage],
  );
  const [_editImage, execEditImage] = useAuthCall(
    selectAPIUpdateImage,
    [clientid, imageform.state.image],
    {},
    {posthook: updateImageSuccess, errhook},
  );

  const formAssign = form.assign;
  const beginEdit = useCallback(() => {
    formAssign({
      name,
      url,
      redirect_uri,
    });
    setMode(MODE_EDIT);
  }, [name, url, redirect_uri, formAssign, setMode]);

  const beginEditImage = useCallback(() => {
    setMode(MODE_EDIT_IMAGE);
  }, [setMode]);

  const cancelEdit = useCallback(() => setMode(MODE_BASE), [setMode]);

  const posthookRotate = useCallback(() => {
    setMode(MODE_ROTATE);
  }, [setMode]);
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
      {mode === MODE_BASE && (
        <Grid justify="space-between" align="center" nowrap>
          <Column grow="1">
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
              <Menu size="md" anchor={menu.anchor} close={menu.close}>
                <MenuItem onClick={beginEdit} icon={<FaIcon icon="pencil" />}>
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={beginEditImage}
                  icon={<FaIcon icon="picture-o" />}
                >
                  Edit Logo
                </MenuItem>
                <MenuItem onClick={execRotate} icon={<FaIcon icon="repeat" />}>
                  Rotate key
                </MenuItem>
                <MenuItem onClick={execDelete} icon={<FaIcon icon="trash" />}>
                  Delete
                </MenuItem>
              </Menu>
            )}
          </Column>
        </Grid>
      )}
      {mode === MODE_EDIT && (
        <Container padded>
          <h4>Edit Client</h4>
          <h5>Client ID</h5>
          <code>{clientid}</code>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execUpdate}
          >
            <Field name="name" label="Name" nohint />
            <Field name="url" label="URL" hint="app url" />
            <Field
              name="redirect_uri"
              label="Redirect URI"
              hint="return uri after authorization"
            />
          </Form>
          <ButtonGroup>
            <ButtonTertiary onClick={cancelEdit}>Cancel</ButtonTertiary>
            <ButtonPrimary onClick={execUpdate}>Update</ButtonPrimary>
          </ButtonGroup>
        </Container>
      )}
      {mode === MODE_EDIT_IMAGE && (
        <Container padded>
          <h4>Edit Logo</h4>
          <h5>{name}</h5>
          <Form
            formState={imageform.state}
            onChange={imageform.update}
            onSubmit={execEditImage}
          >
            <FieldFile
              name="image"
              hint="Choose an image"
              accept="image/jpeg, image/png"
              onChange={imageform.update}
              fullWidth
            >
              <ButtonTertiary>Choose</ButtonTertiary>
            </FieldFile>
          </Form>
          <ButtonGroup>
            <ButtonTertiary onClick={cancelEdit}>Cancel</ButtonTertiary>
            <ButtonPrimary onClick={execEditImage}>Upload</ButtonPrimary>
          </ButtonGroup>
        </Container>
      )}
      {mode === MODE_ROTATE && (
        <Container padded>
          {rotate.success && (
            <div>
              <h4>Client Secret Rotated</h4>
              {OAUTHAPP_MESSAGE}
              <div>
                <h5>Client ID</h5>
                <code>{rotate.data.client_id}</code>
                <h5>Secret</h5>
                <code>{rotate.data.key}</code>
              </div>
              <ButtonGroup>
                <ButtonTertiary onClick={cancelEdit}>Close</ButtonTertiary>
              </ButtonGroup>
            </div>
          )}
        </Container>
      )}
    </ListItem>
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
    (_status, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const paginate = usePaginate(OAUTHAPP_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthook = useCallback(
    (_status, apps) => {
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

  const form = useForm({
    name: '',
    url: '',
    redirect_uri: '',
  });

  const formAssign = form.assign;
  const posthookCreate = useCallback(
    (_status, _data, opts) => {
      formAssign({
        name: '',
        url: '',
        redirect_uri: '',
      });
      reexecute(opts);
    },
    [reexecute, formAssign],
  );
  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [form.state],
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

  return (
    <div>
      <h3>OAuth apps</h3>
      <hr />
      {apps.err && <p>{apps.err.message}</p>}
      {apps.success && (
        <Fragment>
          <Grid>
            <Column fullWidth md={16}>
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
                      posthookUpdImage={snackImageUpdate}
                      errhook={displayErrSnack}
                    />
                  ),
                )}
              </ListGroup>
              <ButtonGroup>
                <ButtonTertiary
                  disabled={paginate.atFirst}
                  onClick={paginate.prev}
                >
                  prev
                </ButtonTertiary>
                {paginate.page}
                <ButtonTertiary
                  disabled={paginate.atLast}
                  onClick={paginate.next}
                >
                  next
                </ButtonTertiary>
              </ButtonGroup>
            </Column>
            <Column fullWidth md={8}>
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
                <ButtonPrimary onClick={execCreate}>Create</ButtonPrimary>
              </ButtonGroup>
              {create.err && <p>{create.err.message}</p>}
              {create.success && (
                <div>
                  <h4>Success! OAuth App Registered</h4>
                  {OAUTHAPP_MESSAGE}
                  <div>
                    <h5>Client ID</h5>
                    <code>{create.data.client_id}</code>
                    <h5>Secret</h5>
                    <code>{create.data.key}</code>
                  </div>
                </div>
              )}
            </Column>
          </Grid>
        </Fragment>
      )}
    </div>
  );
};

export default OAuthApps;
