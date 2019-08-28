import React, {Fragment, useState, useCallback} from 'react';
import {usePaginate, selectAPINull} from 'apiclient';
import {useAuthCall, useAuthResource} from 'service/auth';
import Section from 'component/section';
import Table from 'component/table';
import Button from 'component/button';
import Time from 'component/time';
import Anchor from 'component/anchor';
import Tooltip from 'component/tooltip';
import Input, {useForm} from 'component/form';

import {URL} from 'config';

const LIMIT = 32;

const selectAPILinks = (api) => api.courier.link.get;
const selectAPICreate = (api) => api.courier.link.create;
const selectAPIDelete = (api) => api.courier.link.id.del;
const selectAPIUsers = (api) => api.u.user.ids;

const LinkRow = ({linkid, url, username, creation_time, reexecute}) => {
  const posthook = useCallback(
    (_status, _data, opts) => {
      reexecute(opts);
    },
    [reexecute],
  );
  const [deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [linkid],
    {},
    {posthook},
  );

  const {err} = deleteState;

  return (
    <tr>
      <td>
        <Anchor ext href={URL.courier + '/' + linkid}>
          {URL.courier + '/' + linkid}
        </Anchor>
      </td>
      <td>
        <Anchor ext href={url}>
          {url}
        </Anchor>
      </td>
      <td>
        <Anchor ext href={URL.courier + '/' + linkid + '/image'}>
          image
        </Anchor>
      </td>
      <td>{username}</td>
      <td>
        <Time value={creation_time * 1000} />
      </td>
      <td>
        <Button text onClick={execDelete}>
          Delete
        </Button>
        {err && <small>{err}</small>}
      </td>
    </tr>
  );
};

const CourierLink = () => {
  const [formState, updateForm] = useForm({
    linkid: '',
    url: '',
  });

  const page = usePaginate(LIMIT);
  const pageSetEnd = page.setEnd;

  const [userids, setUserids] = useState([]);

  const {
    err: errUsername,
    data: users,
    reexecute: reexecuteUsernames,
  } = useAuthResource(
    userids.length > 0 ? selectAPIUsers : selectAPINull,
    [userids.join(',')],
    [],
  );
  const usernames = Object.fromEntries(
    users.map(({userid, username, first_name, last_name}) => [
      userid,
      <Tooltip key={userid} tooltip={first_name + ' ' + last_name}>
        {username}
      </Tooltip>,
    ]),
  );

  const posthook = useCallback(
    (_status, links, opts) => {
      pageSetEnd(links.length < LIMIT);
      setUserids(
        Array.from(new Set(links.map(({creatorid}) => creatorid))).sort(),
      );
      reexecuteUsernames(opts);
    },
    [pageSetEnd, setUserids, reexecuteUsernames],
  );
  const {err, data: links, reexecute: reexecuteLinks} = useAuthResource(
    selectAPILinks,
    [LIMIT, page.value],
    [],
    {posthook},
  );

  const prehook = useCallback(([form]) => {
    const {url} = form;
    if (url.length === 0) {
      return 'A url must be provided';
    }
  }, []);
  const posthookRefresh = useCallback(
    (_status, _data, opts) => {
      reexecuteLinks(opts);
      updateForm('linkid', '');
      updateForm('url', '');
    },
    [reexecuteLinks, updateForm],
  );
  const [createState, execCreate] = useAuthCall(
    selectAPICreate,
    [formState],
    {},
    {prehook, posthook: posthookRefresh},
  );

  const {err: errCreate} = createState;

  return (
    <div>
      <Section subsection sectionTitle="Add Link">
        <Input
          label="link id"
          info="usage: /link/:linkid; (optional)"
          name="linkid"
          value={formState.linkid}
          onChange={updateForm}
        />
        <Input
          label="link url"
          info="destination url"
          name="url"
          value={formState.url}
          onChange={updateForm}
          onEnter={execCreate}
        />
        <Button onClick={execCreate}>Add Link</Button>
        {errCreate && <span>{errCreate}</span>}
      </Section>
      {(err || errUsername) && <span>{err || errUsername}</span>}
      <Section subsection sectionTitle="Links">
        <Table
          fullWidth
          head={
            <Fragment>
              <th>shortlink</th>
              <th>url</th>
              <th>qr code</th>
              <th>creator</th>
              <th>creation time</th>
              <th></th>
            </Fragment>
          }
        >
          {links.map(({linkid, url, creatorid, creation_time}) => (
            <LinkRow
              key={linkid}
              linkid={linkid}
              url={url}
              username={usernames[creatorid] || creatorid}
              creation_time={creation_time}
              reexecute={reexecuteLinks}
            />
          ))}
        </Table>
      </Section>
    </div>
  );
};

export default CourierLink;
