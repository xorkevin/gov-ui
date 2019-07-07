import React, {useCallback} from 'react';
import {usePaginate} from 'apiclient';
import {useAuthCall, useAuthResource} from 'service/auth';
import Section from 'component/section';
import Table from 'component/table';
import Button from 'component/button';
import Time from 'component/time';
import Anchor from 'component/anchor';
import Input, {useForm} from 'component/form';

import {URL} from 'config';

const LIMIT = 32;

const selectAPILinks = (api) => api.courier.link.get;
const selectAPICreate = (api) => api.courier.link.create;
const selectAPIDelete = (api) => api.courier.link.id.del;

const CourierLink = () => {
  const [formState, updateForm] = useForm({
    linkid: '',
    url: '',
  });

  const page = usePaginate(LIMIT);

  const posthook = useCallback(
    (data) => {
      page.setEnd(data.length < LIMIT);
      //Array.from(new Set(data.links.map(({creatorid}) => creatorid)));
    },
    [page.setEnd],
  );
  const {success, err, data: links, reexecute} = useAuthResource(
    selectAPILinks,
    [LIMIT, page.value],
    [],
    null,
    posthook,
  );

  //getUserInfo(userids) {
  //  this.props.getUserInfo(userids, (err, data) => {
  //    if (err) {
  //      return this.setState((prevState) => {
  //        return Object.assign({}, prevState, {err});
  //      });
  //    }
  //    this.setState((prevState) => {
  //      return Object.assign({}, prevState, {
  //        err: false,
  //        usernames: data.users.reduce((obj, {userid, username}) => {
  //          obj[userid] = username;
  //          return obj;
  //        }, {}),
  //      });
  //    });
  //  });
  //}

  const prehook = useCallback(({linkid, url}) => {
    if (url.length === 0) {
      return 'A url must be provided';
    }
  }, []);
  const posthookRefresh = useCallback(() => {
    updateForm('linkid', '');
    updateForm('url', '');
    reexecute();
  }, [reexecute, updateForm]);
  const [createState, execCreate] = useAuthCall(
    selectAPICreate,
    [formState],
    {},
    prehook,
    posthookRefresh,
  );

  //const [deleteState, execDelete] = useAuthCall(selectAPIDelete, [], {}, null, reexecute);

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
      </Section>
      {err && <span>Error: {err}</span>}
      <Section subsection sectionTitle="Links">
        <Table
          fullWidth
          head={[
            {key: 'shortlink', component: 'shortlink'},
            {key: 'url', component: 'url'},
            {key: 'image', component: 'qr code'},
            {key: 'creator', component: 'creator'},
            {key: 'time', component: 'creation time'},
            {key: 'delete', component: ''},
          ]}
          data={links.map(({linkid, url, creatorid, creation_time}) => {
            return {
              key: linkid,
              row: [
                {
                  key: 'shortlink',
                  component: (
                    <Anchor ext href={URL.courier + '/' + linkid}>
                      {URL.courier + '/' + linkid}
                    </Anchor>
                  ),
                },
                {
                  key: 'url',
                  component: (
                    <Anchor ext href={url}>
                      {url}
                    </Anchor>
                  ),
                },
                {
                  key: 'image',
                  component: (
                    <Anchor ext href={URL.courier + '/' + linkid + '/image'}>
                      image
                    </Anchor>
                  ),
                },
                {
                  key: 'creator',
                  component: /*usernames[creatorid]*/ 'creator',
                },
                {
                  key: 'time',
                  component: <Time value={creation_time * 1000} />,
                },
                {
                  key: 'delete',
                  component: (
                    <Button
                      text
                      onClick={/*() => this.deleteLink(linkid)*/ false}
                    >
                      Delete
                    </Button>
                  ),
                },
              ],
            };
          })}
        />
      </Section>
    </div>
  );
};

export default CourierLink;
