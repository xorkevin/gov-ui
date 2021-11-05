import {Fragment, useCallback, useContext} from 'react';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  ModalSurface,
  useModal,
  useMenu,
  Menu,
  MenuItem,
  Field,
  FieldTextarea,
  FieldSelect,
  FieldSearchSelect,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';
import AnchorSecondary from '@xorkevin/nuke/src/component/anchor/secondary';

import {GovUICtx} from '../../../middleware';
import {formatURL} from '../../../utility';
import {useOrgOpts} from '../../../component/accounts';
import {senderPolicyOpts, memberPolicyOpts} from './opts';

const LISTS_LIMIT = 32;

const selectAPILists = (api) => api.mailinglist.group.latest;
const selectAPICreate = (api) => api.mailinglist.group.create;
const selectAPIOrg = (api) => api.orgs.id.get;

const formValidCheck = ({listname, name}) => {
  const valid = {};
  if (listname.length > 0) {
    valid.listname = true;
  }
  if (name.length > 0) {
    valid.name = true;
  }
  return valid;
};

const prehookValidate = ([accountid, form]) => {
  if (accountid.length === 0) {
    return {message: 'An account must be provided'};
  }
  const {listname, name} = form;
  if (listname.length === 0) {
    return {message: 'A list address must be provided'};
  }
  if (name.length === 0) {
    return {message: 'A list name must be provided'};
  }
};

const CreateList = ({accountid, posthookCreate, close}) => {
  const form = useForm({
    listname: '',
    name: '',
    desc: '',
    sender_policy: 'owner',
    member_policy: 'owner',
  });

  const posthook = useCallback(
    (res, data, opts) => {
      close();
      posthookCreate(res, data, opts);
    },
    [posthookCreate, close],
  );
  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [accountid, form.state],
    {},
    {prehook: prehookValidate, posthook},
  );

  return (
    <Fragment>
      <h4>Create new list</h4>
      <Form
        formState={form.state}
        onChange={form.update}
        onSubmit={execCreate}
        validCheck={formValidCheck}
      >
        <Field name="listname" label="List address" nohint fullWidth />
        <Field name="name" label="Display name" nohint fullWidth />
        <FieldTextarea name="desc" label="Description" nohint fullWidth />
        <FieldSelect
          name="sender_policy"
          label="Sender policy"
          options={senderPolicyOpts}
          nohint
          fullWidth
        />
        <FieldSelect
          name="member_policy"
          label="Member policy"
          options={memberPolicyOpts}
          nohint
          fullWidth
        />
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Close</ButtonTertiary>
        <ButtonPrimary onClick={execCreate}>Create List</ButtonPrimary>
      </ButtonGroup>
      {create.err && <p>{create.err.message}</p>}
    </Fragment>
  );
};

const ListRow = ({
  listid,
  listname,
  name,
  archive,
  lastUpdated,
  creatorName,
  emailDomain,
  baseurl,
  listurl,
}) => {
  const menu = useMenu();
  const emailAddr = `${creatorName}.${listname}@${emailDomain}`;
  const url = formatURL(listurl, listid);
  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="mailinglist-item-name">
          <h5 className="mailinglist-item-heading">
            <AnchorText local href={url}>
              {name}
            </AnchorText>
          </h5>{' '}
          <small>
            <AnchorSecondary ext href={`mailto:${emailAddr}`}>
              {emailAddr}
            </AnchorSecondary>
          </small>{' '}
          <small>{archive && <Chip>Archived</Chip>}</small> Last updated{' '}
          <Time value={lastUpdated} />
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem local link={url}>
                View
              </MenuItem>
              <MenuItem local link={`${baseurl}/${listid}`}>
                Settings
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const ManageLists = ({baseurl, listurl}) => {
  const ctx = useContext(GovUICtx);
  const {userid, username} = useAuthValue();

  const displaySnackbarCreate = useSnackbarView(
    <SnackbarSurface>&#x2713; Org created</SnackbarSurface>,
  );

  const form = useForm({
    accountid: userid,
  });
  const orgOpts = useOrgOpts();

  const isOrg = ctx.isOrgName(form.state.accountid);
  const [org, _reexecuteOrg] = useResource(
    isOrg ? selectAPIOrg : selectAPINull,
    [ctx.orgNameToOrgID(form.state.accountid)],
    {
      orgid: '',
      name: '',
      display_name: '',
      desc: '',
      creation_time: 0,
    },
  );
  const creatorName = isOrg ? (org.success ? org.data.name : '') : username;
  const emailDomain = isOrg ? ctx.mailinglistOrg : ctx.mailinglistUsr;

  const paginate = usePaginate(LISTS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookLists = useCallback(
    (_res, lists) => {
      setAtEnd(lists.length < LISTS_LIMIT);
    },
    [setAtEnd],
  );
  const [lists, reexecute] = useResource(
    selectAPILists,
    [form.state.accountid, LISTS_LIMIT, paginate.index],
    [],
    {posthook: posthookLists},
  );

  const posthookCreate = useCallback(() => {
    displaySnackbarCreate();
    reexecute();
  }, [displaySnackbarCreate, reexecute]);

  const modal = useModal();

  return (
    <div>
      <Grid justify="space-between" align="flex-end">
        <Column grow="1">
          <h3>Manage Mailing Lists</h3>
        </Column>
        <Column>
          <ButtonGroup>
            <ButtonTertiary
              forwardedRef={modal.anchorRef}
              onClick={modal.toggle}
            >
              <FaIcon icon="plus" /> New
            </ButtonTertiary>
          </ButtonGroup>
          {modal.show && (
            <ModalSurface size="md" anchor={modal.anchor} close={modal.close}>
              <CreateList
                accountid={form.state.accountid}
                posthookCreate={posthookCreate}
                close={modal.close}
              />
            </ModalSurface>
          )}
        </Column>
      </Grid>
      <hr />
      <Form formState={form.state} onChange={form.update}>
        <FieldSearchSelect
          name="accountid"
          options={orgOpts}
          label="Account"
          nohint
        />
      </Form>
      <ListGroup>
        {Array.isArray(lists.data) &&
          lists.data.map((i) => (
            <ListRow
              key={i.listid}
              listid={i.listid}
              creatorid={i.creatorid}
              listname={i.listname}
              name={i.name}
              desc={i.desc}
              archive={i.archive}
              senderPolicy={i.sender_policy}
              memberPolicy={i.member_policy}
              lastUpdated={i.last_updated}
              creationTime={i.creation_time}
              creatorName={creatorName}
              emailDomain={emailDomain}
              baseurl={baseurl}
              listurl={listurl}
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
      {org.err && <p>{org.err.message}</p>}
      {lists.err && <p>{lists.err.message}</p>}
    </div>
  );
};

export default ManageLists;
