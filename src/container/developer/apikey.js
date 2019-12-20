import React, {Fragment, useState, useCallback} from 'react';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Section,
  Table,
  Menu,
  Button,
  Chip,
  Time,
  Tooltip,
  FaIcon,
  Input,
  Form,
  useForm,
  usePaginate,
  useSnackbar,
} from '@xorkevin/nuke';

const LIMIT = 32;

const selectAPIKeys = (api) => api.u.apikey.get;
const selectAPICreate = (api) => api.u.apikey.create;

const ApikeyRow = ({name, desc, keyid, auth_tags, time}) => {
  return (
    <tr>
      <td>
        <h5>{name}</h5>
        <p>
          <h6>Key ID:</h6>
          <code>{keyid}</code>
        </p>
        <p>{desc}</p>
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
          <span>
            <FaIcon icon="trash" /> Delete
          </span>
        </Menu>
      </td>
    </tr>
  );
};

const Apikeys = () => {
  const snackbar = useSnackbar();
  const _displayErrSnack = useCallback(
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
    auth_tags: '',
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
      updateForm('auth_tags', '');
    },
    [reexecute, updateForm],
  );
  const [createState, execCreate] = useAuthCall(
    selectAPICreate,
    [formState],
    {},
    {posthook: posthookRefresh},
  );
  const {err: errCreate} = createState;

  return (
    <div>
      <Section subsection sectionTitle="Create API Key">
        <Form formState={formState} onChange={updateForm} onEnter={execCreate}>
          <Input label="name" name="name" />
          <Input label="description (optional)" name="desc" />

          {formState.auth_tags.length > 0 &&
            formState.auth_tags
              .split(',')
              .map((tag) => <Chip key={tag.trim()}>{tag.trim()}</Chip>)}
          <Input label="permissions" name="auth_tags" />
        </Form>
        <Button onClick={execCreate}>Create</Button>
        {errCreate && <span>{errCreate}</span>}
      </Section>
      {err && <span>{err}</span>}
      <Section subsection sectionTitle="API Keys">
        <Table
          fullWidth
          head={
            <Fragment>
              <th>Name</th>
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
