import React, {Fragment, useState, useCallback} from 'react';
import {useAuthResource} from '@xorkevin/turbine';
import {
  Section,
  Table,
  Menu,
  Button,
  Chip,
  Time,
  Tooltip,
  FaIcon,
  usePaginate,
  useSnackbar,
} from '@xorkevin/nuke';

const LIMIT = 32;

const selectAPIKeys = (api) => api.u.apikey.get;

const ApikeyRow = ({name, desc, keyid, auth_tags, time}) => {
  return (
    <tr>
      <td>
        <h5>{name}</h5>
        <code>
          <Tooltip tooltip="Key id used to reference this API key">
            {keyid}
          </Tooltip>
        </code>
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

  const [endPage, setEndPage] = useState(true);
  const page = usePaginate(LIMIT, endPage);

  const posthook = useCallback(
    (_status, approvals) => {
      setEndPage(approvals.length < LIMIT);
    },
    [setEndPage],
  );
  const {
    err,
    data: apikeys,
    reexecute: _reexecute,
  } = useAuthResource(selectAPIKeys, [LIMIT, page.value], [], {posthook});

  return (
    <div>
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
