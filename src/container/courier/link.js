import {useCallback, useMemo} from 'react';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  Field,
  FieldSuggest,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import Anchor from '@xorkevin/nuke/src/component/anchor/nocolor';

import {isValidURL} from '../../utility';

const LINK_LIMIT = 32;
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

const prehookValidate = ([accountid, form]) => {
  if (accountid.length === 0) {
    return {message: 'An account must be provided'};
  }
  const {url} = form;
  if (url.length === 0) {
    return {message: 'A url must be provided'};
  }
};

const LinkRow = ({
  courierPath,
  creatorid,
  linkid,
  url,
  creation_time,
  posthookDelete,
  errhook,
}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [creatorid, linkid],
    {},
    {posthook: posthookDelete, errhook},
  );

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="courier-link-item-name" grow="1">
          <h5>
            <Anchor className="courier-link-destination" ext href={url}>
              {url}
            </Anchor>
          </h5>
          <Field
            noctx
            value={`${courierPath}/${linkid}`}
            readOnly
            nohint
            fullWidth
          />
          <div>
            <Anchor ext href={`${courierPath}/${linkid}`}>
              <FaIcon icon="link fa-lg" />
            </Anchor>{' '}
            <Anchor ext href={`${courierPath}/${linkid}/image`}>
              <FaIcon icon="qrcode fa-lg" />
            </Anchor>{' '}
            Created <Time value={creation_time * 1000} />
          </div>
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem onClick={execDelete} icon={<FaIcon icon="trash" />}>
                Delete
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const CourierLink = ({accountid, courierPath}) => {
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_status, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const form = useForm({
    linkid: '',
    url: '',
    brandid: '',
  });

  const paginate = usePaginate(LINK_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookLinks = useCallback(
    (_status, links) => {
      setAtEnd(links.length < LINK_LIMIT);
    },
    [setAtEnd],
  );
  const [links, reexecute] = useAuthResource(
    selectAPILinks,
    [accountid, LINK_LIMIT, paginate.index],
    [],
    {posthook: posthookLinks},
  );

  const formAssign = form.assign;
  const posthookRefresh = useCallback(() => {
    formAssign({
      linkid: '',
      url: '',
      brandid: '',
    });
    reexecute();
  }, [reexecute, formAssign]);
  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [accountid, form.state],
    {},
    {prehook: prehookValidate, posthook: posthookRefresh},
  );

  const posthookDelete = useCallback(() => {
    reexecute();
  }, [reexecute]);

  const [brands] = useAuthResource(
    selectAPIBrands,
    [accountid, BRAND_LIMIT, 0],
    [],
  );
  const brandOptions = useMemo(
    () => brands.data.map(({brandid}) => brandid),
    [brands],
  );

  return (
    <div>
      <h3>Shortlinks</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16} lg={18}>
          <ListGroup>
            {Array.isArray(links.data) &&
              links.data.map(({linkid, url, creatorid, creation_time}) => (
                <LinkRow
                  key={linkid}
                  courierPath={courierPath}
                  creatorid={creatorid}
                  linkid={linkid}
                  url={url}
                  creation_time={creation_time}
                  posthookDelete={posthookDelete}
                  errhook={displayErrSnack}
                />
              ))}
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
          {links.err && <p>{links.err.message}</p>}
        </Column>
        <Column fullWidth md={8} lg={6}>
          <h4>Create new shortlink</h4>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execCreate}
            errCheck={formErrCheck}
            validCheck={formValidCheck}
          >
            <Field
              name="linkid"
              label="Link ID (optional)"
              hint={`format: ${courierPath}/${
                form.state.linkid.length > 0 ? form.state.linkid : ':linkid'
              }`}
              fullWidth
            />
            <Field name="url" label="Link URL" hint="destination" fullWidth />
            <FieldSuggest
              name="brandid"
              options={brandOptions}
              label="QR Brand (optional)"
              fullWidth
            />
          </Form>
          <ButtonGroup>
            <ButtonPrimary onClick={execCreate}>Create Link</ButtonPrimary>
          </ButtonGroup>
          {create.err && <p>{create.err.message}</p>}
          {brands.err && <p>{brands.err.message}</p>}
        </Column>
      </Grid>
    </div>
  );
};

export default CourierLink;
