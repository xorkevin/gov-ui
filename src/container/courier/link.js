import React, {Fragment, useState, useCallback, useMemo} from 'react';
import {isValidURL} from '../../../utility';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Section,
  Table,
  Button,
  Time,
  Anchor,
  Form,
  Input,
  useForm,
  usePaginate,
  useSnackbar,
} from '@xorkevin/nuke';

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

const LinkRow = ({
  courierPath,
  linkid,
  url,
  creation_time,
  posthook,
  errhook,
}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [linkid],
    {},
    {posthook, errhook},
  );

  return (
    <tr>
      <td>
        <Anchor ext href={courierPath + '/' + linkid}>
          {courierPath + '/' + linkid}
        </Anchor>
      </td>
      <td>
        <Anchor ext href={url}>
          {url}
        </Anchor>
      </td>
      <td>
        <Anchor ext href={courierPath + '/' + linkid + '/image'}>
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

const CourierLink = ({courierPath}) => {
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
    linkid: '',
    url: '',
    brandid: '',
  });

  const [endPage, setEndPage] = useState(true);
  const page = usePaginate(LIMIT, endPage);

  const posthook = useCallback(
    (_status, links) => {
      setEndPage(links.length < LIMIT);
    },
    [setEndPage],
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
              courierPath={courierPath}
              linkid={linkid}
              url={url}
              creation_time={creation_time}
              posthook={posthookDelete}
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

export default CourierLink;
