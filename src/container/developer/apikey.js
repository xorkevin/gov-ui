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
const selectAPICreate = (api) => api.u.apikey.create;
const selectAPIUpdate = (api) => api.u.apikey.id.edit;
const selectAPIDelete = (api) => api.u.apikey.id.del;

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
  const [edit, setEdit] = useState(false);
  const updateSuccess = useCallback(() => {
    setEdit(false);
    posthookUpd();
  }, [setEdit, posthookUpd]);
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
    setEdit(true);
  }, [name, desc, auth_tags, updateForm, setEdit]);
  const cancelEdit = useCallback(() => setEdit(false), [setEdit]);
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
            <span onClick={execDelete}>
              <FaIcon icon="trash" /> Delete
            </span>
          </Menu>
        </td>
      </tr>
      {edit && (
        <tr>
          <td colSpan={5}>
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
    </Fragment>
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
                <p>
                  This API Key allows anyone who has access to it to make API
                  requests on your behalf with the permissions you granted. As
                  such, for security purposes, store the API Key secret below in
                  a safe place, as you will <strong>not</strong> be able to view
                  it again.
                </p>
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
    </div>
  );
};

export default Apikeys;