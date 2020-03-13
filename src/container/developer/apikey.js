import React, {Fragment, useState, useCallback, useMemo} from 'react';
import {useAuthState, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Section,
  Table,
  Menu,
  Button,
  Chip,
  Time,
  Tooltip,
  FaIcon,
  Description,
  Input,
  Form,
  useForm,
  usePaginate,
  useSnackbar,
  useSnackbarView,
  fuzzyFilter,
} from '@xorkevin/nuke';

const LIMIT = 32;

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
    behalf with the permissions you granted. As such, for security purposes,
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
  posthook,
  posthookUpd,
  errhook,
}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [keyid],
    {},
    {posthook, errhook},
  );
  const [formState, updateForm] = useForm({
    name,
    desc,
    auth_tags: auth_tags.split(','),
  });
  const [mode, setMode] = useState(MODE_BASE);
  const updateSuccess = useCallback(() => {
    setMode(MODE_BASE);
    posthookUpd();
  }, [setMode, posthookUpd]);
  const [_updateState, execUpdate] = useAuthCall(
    selectAPIUpdate,
    [keyid, formState.name, formState.desc, formState.auth_tags.join(',')],
    {},
    {posthook: updateSuccess, errhook},
  );
  const beginEdit = useCallback(() => {
    updateForm('name', name);
    updateForm('desc', desc);
    updateForm('auth_tags', auth_tags.split(','));
    setMode(MODE_EDIT);
  }, [name, desc, auth_tags, updateForm, setMode]);
  const cancelEdit = useCallback(() => setMode(MODE_BASE), [setMode]);
  const {authTags} = useAuthState();
  const allPermissions = useMemo(
    () =>
      fuzzyFilter(
        8,
        authTags.split(',').map((tag) => ({value: tag})),
        getAuthTagVal,
        formState._search_auth_tags,
      ),
    [authTags, formState._search_auth_tags],
  );
  const posthookRotate = useCallback(() => {
    setMode(MODE_ROTATE);
  }, [setMode]);
  const [rotateState, execRotate] = useAuthCall(
    selectAPIRotate,
    [keyid],
    {},
    {posthook: posthookRotate, errhook},
  );
  const {success: successRotate, data: resRotate} = rotateState;

  return (
    <Fragment>
      <tr>
        <td>
          <Fragment>
            <h5>{name}</h5>
            <p>{desc}</p>
          </Fragment>
        </td>
        <td>
          <code>{keyid}</code>
        </td>
        <td>
          <Tooltip tooltip="For security purposes, the key cannot be shown">
            <FaIcon icon="key" />
            &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
          </Tooltip>
        </td>
        <td>
          {auth_tags.split(',').map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </td>
        <td>
          <Time value={time * 1000} />
        </td>
        <td>
          <Menu
            icon={
              <Button text>
                <FaIcon icon="ellipsis-v" />
              </Button>
            }
            size="md"
            fixed
            align="right"
            position="bottom"
          >
            <span onClick={beginEdit}>
              <FaIcon icon="pencil" /> Edit
            </span>
            <span onClick={execRotate}>
              <FaIcon icon="repeat" /> Rotate key
            </span>
            <span onClick={execDelete}>
              <FaIcon icon="trash" /> Delete
            </span>
          </Menu>
        </td>
      </tr>
      {mode === MODE_EDIT && (
        <tr>
          <td colSpan={6}>
            <Form
              formState={formState}
              onChange={updateForm}
              onEnter={execUpdate}
            >
              <Input label="name" name="name" />
              <Input label="description (optional)" name="desc" />
              <Input
                label="permissions"
                multiple
                dropdowninput={allPermissions}
                name="auth_tags"
              />
            </Form>
            <div>
              <Button text onClick={cancelEdit}>
                Cancel
              </Button>
              <Button primary onClick={execUpdate}>
                <FaIcon icon="floppy-o" /> Save
              </Button>
            </div>
          </td>
        </tr>
      )}
      {mode === MODE_ROTATE && (
        <tr>
          <td colSpan={6}>
            {successRotate && (
              <div>
                <div>
                  <h4>API Key Rotated</h4>
                  {API_KEY_MESSAGE}
                  <Description
                    label="Key ID"
                    item={<code>{resRotate.keyid}</code>}
                  />
                  <Description
                    label="Secret"
                    item={<code>{resRotate.key}</code>}
                  />
                </div>
                <div>
                  <Button text onClick={cancelEdit}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </Fragment>
  );
};

const CheckKey = () => {
  const displaySnackbar = useSnackbarView(
    <Fragment>
      <span>Key OK</span>
    </Fragment>,
  );
  const [formState, updateForm] = useForm({
    keyid: '',
    key: '',
    auth_tags: '',
  });
  const clearForm = useCallback(() => {
    updateForm('keyid', '');
    updateForm('key', '');
    updateForm('auth_tags', '');
  }, [updateForm]);
  const [checkState, execCheckKey] = useAuthCall(
    selectAPICheckKey,
    [formState.keyid, formState.key, formState.auth_tags],
    {},
    {posthook: displaySnackbar},
  );
  const {err} = checkState;
  return (
    <div>
      <Form formState={formState} onChange={updateForm} onEnter={execCheckKey}>
        <Input label="Key ID" name="keyid" />
        <Input label="Key" name="key" />
        <div>
          {formState.auth_tags.length > 0 &&
            formState.auth_tags
              .split(',')
              .map((tag) => <Chip key={tag.trim()}>{tag.trim()}</Chip>)}
        </div>
        <Input label="roles" name="auth_tags" />
      </Form>
      <Button text onClick={clearForm}>
        Clear
      </Button>
      <Button onClick={execCheckKey}>Check key</Button>
      {err && <span>{err}</span>}
    </div>
  );
};

const getAuthTagVal = (i) => i.value;

const Apikeys = () => {
  const displaySnackbar = useSnackbarView(
    <Fragment>
      <span>API Key deleted</span>
    </Fragment>,
  );
  const displaySnackbarUpd = useSnackbarView(
    <Fragment>
      <span>API Key updated</span>
    </Fragment>,
  );
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_status, err) => {
      snackbar(
        <Fragment>
          <span>{err}</span>
        </Fragment>,
      );
    },
    [snackbar],
  );

  const [formState, updateForm] = useForm({
    name: '',
    desc: '',
    auth_tags: [],
  });

  const [endPage, setEndPage] = useState(true);
  const page = usePaginate(LIMIT, endPage);

  const posthook = useCallback(
    (_status, approvals) => {
      setEndPage(approvals.length < LIMIT);
    },
    [setEndPage],
  );
  const {err, data: apikeys, reexecute} = useAuthResource(
    selectAPIKeys,
    [LIMIT, page.value],
    [],
    {posthook},
  );

  const posthookRefresh = useCallback(
    (_status, _data, opts) => {
      reexecute(opts);
      updateForm('name', '');
      updateForm('desc', '');
      updateForm('auth_tags', []);
    },
    [reexecute, updateForm],
  );
  const [createState, execCreate] = useAuthCall(
    selectAPICreate,
    [formState.name, formState.desc, formState.auth_tags.join(',')],
    {},
    {posthook: posthookRefresh},
  );
  const {err: errCreate, success: successCreate, data: resCreate} = createState;

  const {authTags} = useAuthState();
  const allPermissions = useMemo(
    () =>
      fuzzyFilter(
        8,
        authTags.split(',').map((tag) => ({value: tag})),
        getAuthTagVal,
        formState._search_auth_tags,
      ),
    [authTags, formState._search_auth_tags],
  );

  const posthookDelete = useCallback(
    (_status, _data, opts) => {
      displaySnackbar();
      reexecute(opts);
    },
    [reexecute, displaySnackbar],
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
      <Section subsection sectionTitle="Create API Key">
        <Grid>
          <Column md={12}>
            <Form
              formState={formState}
              onChange={updateForm}
              onEnter={execCreate}
            >
              <Input label="name" name="name" />
              <Input label="description (optional)" name="desc" />

              <Input
                label="permissions"
                multiple
                dropdowninput={allPermissions}
                name="auth_tags"
              />
            </Form>
            <Button onClick={execCreate}>Create</Button>
            {errCreate && <span>{errCreate}</span>}
          </Column>
          <Column md={12}>
            {successCreate && (
              <div>
                <h4>Success! API Key Created</h4>
                {API_KEY_MESSAGE}
                <Description
                  label="Key ID"
                  item={<code>{resCreate.keyid}</code>}
                />
                <Description
                  label="Secret"
                  item={<code>{resCreate.key}</code>}
                />
              </div>
            )}
          </Column>
        </Grid>
      </Section>
      {err && <span>{err}</span>}
      <Section subsection sectionTitle="API Keys">
        <Table
          fullWidth
          head={
            <Fragment>
              <th>Name</th>
              <th>Key ID</th>
              <th>Key</th>
              <th>Permissions</th>
              <th>Time</th>
            </Fragment>
          }
        >
          {apikeys.map(({name, desc, keyid, auth_tags, time}) => (
            <ApikeyRow
              key={keyid}
              keyid={keyid}
              name={name}
              desc={desc}
              auth_tags={auth_tags}
              time={time}
              posthook={posthookDelete}
              posthookUpd={posthookUpdate}
              errhook={displayErrSnack}
            />
          ))}
        </Table>
        <div>
          <Button onClick={page.prev}>prev</Button>
          {page.num}
          <Button onClick={page.next}>next</Button>
        </div>
      </Section>
      <Section subsection sectionTitle="Check key">
        <h5>Warning</h5>
        <p>
          This should be used for <strong>debug</strong> purposes only. Rotate
          keys after testing.
        </p>
        <CheckKey />
      </Section>
    </div>
  );
};

export default Apikeys;
