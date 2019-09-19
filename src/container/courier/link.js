import React, {Fragment, useCallback, useMemo} from 'react';
import {isValidURL} from 'utility';
import {usePaginate} from 'apiclient';
import {useAuthCall, useAuthResource} from 'service/auth';
import {useSnackbar} from 'service/snackbar';
import Section from 'component/section';
import Table from 'component/table';
import Button from 'component/button';
import Time from 'component/time';
import Anchor from 'component/anchor';
import {Form, Input, useForm} from 'component/form';

import {URL} from 'config';

const LIMIT = 32;
const BRAND_LIMIT = 128;

const selectAPILinks = (api) => api.courier.link.get;
const selectAPICreate = (api) => api.courier.link.create;
const selectAPIDelete = (api) => api.courier.link.id.del;
const selectAPIBrands = (api) => api.courier.brand.get;

const formErrCheck = ({url}) => {
  const err = {};
  if (url.length > 0 && !isValidURL(url)) {
    err.url = true;
  }
  return err;
};

const formValidCheck = ({url}) => {
  const valid = {};
  if (url.length > 0 && isValidURL(url)) {
    valid.url = true;
  }
  return valid;
};

const prehookValidate = ([form]) => {
  const {url} = form;
  if (url.length === 0) {
    return 'A url must be provided';
  }
};

const LinkRow = ({linkid, url, creation_time, posthook, errhook}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [linkid],
    {},
    {posthook, errhook},
  );

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
      <td>
        <Time value={creation_time * 1000} />
      </td>
      <td>
        <Button text onClick={execDelete}>
          Delete
        </Button>
      </td>
    </tr>
  );
};

const CourierLink = () => {
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_stage, err) => {
      snackbar(
        <Fragment>
          <span>Failed to delete link: {err}</span>
        </Fragment>,
      );
    },
    [snackbar],
  );

  const [formState, updateForm] = useForm({
    linkid: '',
    url: '',
    brandid: '',
  });

  const page = usePaginate(LIMIT);
  const pageSetEnd = page.setEnd;

  const posthook = useCallback(
    (_status, links) => {
      pageSetEnd(links.length < LIMIT);
    },
    [pageSetEnd],
  );
  const {err, data: links, reexecute} = useAuthResource(
    selectAPILinks,
    [LIMIT, page.value],
    [],
    {posthook},
  );

  const posthookRefresh = useCallback(
    (_status, _data, opts) => {
      reexecute(opts);
      updateForm('linkid', '');
      updateForm('url', '');
      updateForm('brandid', '');
    },
    [reexecute, updateForm],
  );
  const [createState, execCreate] = useAuthCall(
    selectAPICreate,
    [formState],
    {},
    {prehook: prehookValidate, posthook: posthookRefresh},
  );

  const posthookDelete = useCallback(
    (_status, _data, opts) => {
      reexecute(opts);
    },
    [reexecute],
  );

  const {err: errCreate} = createState;

  const {err: errBrand, data: brands} = useAuthResource(
    selectAPIBrands,
    [BRAND_LIMIT, 0],
    [],
  );
  const brandOptions = useMemo(() => {
    const k = brands.map(({brandid}) => ({text: brandid, value: brandid}));
    k.unshift({text: 'None', value: ''});
    return k;
  }, [brands]);

  return (
    <div>
      <Section subsection sectionTitle="Add Link">
        <Form
          formState={formState}
          onChange={updateForm}
          onEnter={execCreate}
          errCheck={formErrCheck}
          validCheck={formValidCheck}
        >
          <Input
            label="link id"
            info="usage: /link/:linkid; (optional)"
            name="linkid"
          />
          <Input label="link url" info="destination url" name="url" />
          <Input
            label="qr brand"
            info="(optional)"
            dropdown={brandOptions}
            name="brandid"
          />
        </Form>
        <Button onClick={execCreate}>Add Link</Button>
        {errCreate && <span>{errCreate}</span>}
        {errBrand && <span>{errBrand}</span>}
      </Section>
      {err && <span>{err}</span>}
      <Section subsection sectionTitle="Links">
        <Table
          fullWidth
          head={
            <Fragment>
              <th>shortlink</th>
              <th>url</th>
              <th>qr code</th>
              <th>creation time</th>
              <th></th>
            </Fragment>
          }
        >
          {links.map(({linkid, url, creation_time}) => (
            <LinkRow
              key={linkid}
              linkid={linkid}
              url={url}
              creation_time={creation_time}
              posthook={posthookDelete}
              errhook={displayErrSnack}
            />
          ))}
        </Table>
      </Section>
    </div>
  );
};

export default CourierLink;
