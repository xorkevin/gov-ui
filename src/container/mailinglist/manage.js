import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {
  useAuthValue,
  useAuthCall,
  useAuthResource,
  useIntersectRoles,
} from '@xorkevin/turbine';
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
  FieldSwitch,
  FieldSelect,
  FieldSearchSelect,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  usePaginate,
  Anchor,
  ButtonGroup,
  FaIcon,
  Chip,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {useOrgOpts} from '../../component/accounts';

const LISTS_LIMIT = 32;

const selectAPIList = (api) => api.mailinglist.id.get;
const selectAPILists = (api) => api.mailinglist.group.latest;
const selectAPICreate = (api) => api.mailinglist.group.create;
const selectAPIOrg = (api) => api.orgs.id.get;

const useFormLock = () => {
  const [locked, setLocked] = useState(true);
  const lock = useCallback(() => {
    setLocked(true);
  }, [setLocked]);
  const unlock = useCallback(() => {
    setLocked(false);
  }, [setLocked]);
  return [locked, lock, unlock];
};

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

const senderPolicyOpts = [
  {display: 'Owner', value: 'owner'},
  {display: 'Member', value: 'member'},
  {display: 'User', value: 'user'},
];
const memberPolicyOpts = [
  {display: 'Owner', value: 'owner'},
  {display: 'User', value: 'user'},
];

const CreateList = ({accountid, posthookCreate, close}) => {
  const form = useForm({
    listname: '',
    name: '',
    desc: '',
    sender_policy: 'owner',
    member_policy: 'owner',
  });

  const posthook = useCallback(
    (status, data, opts) => {
      close();
      posthookCreate(status, data, opts);
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
  baseurl,
}) => {
  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="mailinglist-item-name">
          <h5 className="mailinglist-item-heading">
            <AnchorText local href="#">
              {name}
            </AnchorText>{' '}
            <small>{`${creatorName}.${listname}`}</small>
          </h5>{' '}
          <small>{archive && <Chip>Archived</Chip>}</small> Last updated{' '}
          <Time value={lastUpdated} />
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
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

const ManageLists = ({baseurl}) => {
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

  const paginate = usePaginate(LISTS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookLists = useCallback(
    (_status, lists) => {
      setAtEnd(lists.length < LISTS_LIMIT);
    },
    [setAtEnd],
  );
  const [lists, reexecute] = useAuthResource(
    selectAPILists,
    [form.state.accountid, LISTS_LIMIT, paginate.index],
    [],
    {posthook: posthookLists},
  );

  const posthookCreate = useCallback(
    (_status, _data, opts) => {
      displaySnackbarCreate();
      reexecute(opts);
    },
    [displaySnackbarCreate, reexecute],
  );

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
              description={i.description}
              archive={i.archive}
              senderPolicy={i.sender_policy}
              memberPolicy={i.member_policy}
              lastUpdated={i.last_updated}
              creationTime={i.creation_time}
              creatorName={creatorName}
              baseurl={baseurl}
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

const ManageListForm = ({list, creatorName}) => {
  const [locked, lock, unlock] = useFormLock();

  const form = useForm({
    name: list.name,
    description: list.description,
    archive: list.archive,
    sender_policy: list.sender_policy,
    member_policy: list.member_policy,
  });

  return (
    <Grid>
      <Column fullWidth md={16}>
        <Form formState={form.state} onChange={form.update}>
          <Field
            className="mailinglist-field-disabled-solid"
            name="name"
            label="Name"
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldTextarea
            className="mailinglist-field-disabled-solid"
            name="description"
            label="Description"
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldSelect
            className="mailinglist-field-disabled-solid"
            name="sender_policy"
            label="Sender policy"
            options={senderPolicyOpts}
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldSelect
            className="mailinglist-field-disabled-solid"
            name="member_policy"
            label="Member policy"
            options={memberPolicyOpts}
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldSwitch
            className="mailinglist-field-disabled-solid"
            name="archive"
            label="Archive"
            danger
            hint="Archives the mailing list"
            disabled={locked}
            fullWidth
          />
        </Form>
        <ButtonGroup>
          {locked ? (
            <Fragment>
              <FaIcon icon="lock" />
              <ButtonTertiary onClick={unlock}>Edit</ButtonTertiary>
            </Fragment>
          ) : (
            <Fragment>
              <FaIcon icon="unlock-alt" />
              <ButtonTertiary onClick={lock}>Cancel</ButtonTertiary>
              <ButtonPrimary>Update Settings</ButtonPrimary>
            </Fragment>
          )}
        </ButtonGroup>
      </Column>
      <Column fullWidth md={8}>
        <h5>Listid</h5>
        <code>{list.listid}</code>
        <h5>Address</h5>
        <div>{`${creatorName}.${list.listname}`}</div>
        <p>
          Created <Time value={list.creation_time * 1000} />
        </p>
      </Column>
    </Grid>
  );
};

const ManageList = ({baseurl}) => {
  const ctx = useContext(GovUICtx);
  const {userid, username} = useAuthValue();

  const {listid} = useParams();

  const [list, _reexecute] = useResource(
    listid.length > 0 ? selectAPIList : selectAPINull,
    [listid],
    {
      listid: '',
      creatorid: '',
      listname: '',
      name: '',
      description: '',
      archive: false,
      sender_policy: 'owner',
      member_policy: 'owner',
      last_updated: 0,
      creation_time: 0,
    },
  );

  const isOrg = list.success && ctx.isOrgName(list.data.creatorid);
  const ownerOrgRole = isOrg ? ctx.usrRole(list.data.creatorid) : '';
  const orgRoles = useMemo(() => {
    if (ownerOrgRole) {
      return [ownerOrgRole];
    }
    return [];
  }, [ownerOrgRole]);
  const [roles] = useIntersectRoles(orgRoles);
  const roleSet = useMemo(() => {
    if (!roles.success) {
      return new Set();
    }
    return new Set(roles.data);
  }, [roles]);
  const isOwner = isOrg
    ? roleSet.has(ownerOrgRole)
    : list.success && list.data.creatorid === userid;

  const [org, _reexecuteOrg] = useResource(
    isOrg ? selectAPIOrg : selectAPINull,
    [ctx.orgNameToOrgID(list.data.creatorid)],
    {
      orgid: '',
      name: '',
      display_name: '',
      desc: '',
      creation_time: 0,
    },
  );
  const creatorName = isOrg ? (org.success ? org.data.name : '') : username;

  return (
    <div>
      <ButtonGroup>
        <Anchor local href={baseurl}>
          <ButtonTertiary>
            <FaIcon icon="chevron-left" /> Back
          </ButtonTertiary>
        </Anchor>
      </ButtonGroup>
      {list.success && isOwner && (
        <ManageListForm list={list.data} creatorName={creatorName} />
      )}
      {list.err && <p>{list.err.message}</p>}
    </div>
  );
};

const Manage = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <ManageLists baseurl={match.url} />
      </Route>
      <Route path={`${match.path}/:listid`}>
        <ManageList baseurl={match.url} />
      </Route>
      <Redirect to={match.url} />
    </Switch>
  );
};

export default Manage;
