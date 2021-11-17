import {Fragment, lazy, Suspense, useMemo, useContext} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useIntersectRoles} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Tabbar,
  TabItem,
  Anchor,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../../middleware';
import {formatURL} from '../../../utility';

const Msgs = lazy(() => import('./msgs'));
const Threads = lazy(() => import('./threads'));
const Thread = lazy(() => import('./thread'));
const Members = lazy(() => import('./members'));
const Settings = lazy(() => import('./settings'));

const selectAPIList = (api) => api.mailinglist.id.get;
const selectAPIOrg = (api) => api.orgs.id.get;

const List = ({listurl, baseurl}) => {
  const ctx = useContext(GovUICtx);
  const {userid, username} = useAuthValue();

  const match = useRouteMatch();
  const {listid} = useParams();

  const [list, reexecute] = useResource(
    listid && listid.length > 0 ? selectAPIList : selectAPINull,
    [listid],
    {
      listid: '',
      creatorid: '',
      listname: '',
      name: '',
      desc: '',
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

  const [org] = useResource(
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

  const emailAddr = `${creatorName}.${list.data.listname}@${
    isOrg ? ctx.mailinglistOrg : ctx.mailinglistUsr
  }`;

  return (
    <div>
      {isOwner && (
        <Fragment>
          <Grid justify="space-between" align="flex-end">
            <Column grow="1">
              <h3>{list.data.name} </h3>
              <AnchorText ext href={`mailto:${emailAddr}`}>
                {emailAddr}
              </AnchorText>
            </Column>
            <Column>
              <ButtonGroup>
                <Anchor local href={formatURL(listurl, listid)}>
                  <ButtonTertiary>List Profile</ButtonTertiary>
                </Anchor>
              </ButtonGroup>
            </Column>
          </Grid>
          <hr />
          <Tabbar>
            <TabItem local link={`${match.url}/threads`}>
              Threads
            </TabItem>
            <TabItem local link={`${match.url}/msgs`}>
              Messages
            </TabItem>
            <TabItem local link={`${match.url}/members`}>
              Members
            </TabItem>
            <TabItem local link={`${match.url}/settings`}>
              Settings
            </TabItem>
          </Tabbar>
          <Suspense fallback={ctx.fallbackView}>
            <Switch>
              <Route exact path={`${match.path}/threads`}>
                <Threads
                  list={list.data}
                  threadurl={`${match.url}/threads/{0}`}
                />
              </Route>
              <Route path={`${match.path}/threads/:threadid`}>
                <Thread list={list.data} />
              </Route>
              <Route path={`${match.path}/msgs`}>
                <Msgs list={list.data} />
              </Route>
              <Route path={`${match.path}/members`}>
                <Members list={list.data} />
              </Route>
              <Route path={`${match.path}/settings`}>
                <Settings
                  list={list.data}
                  creatorName={creatorName}
                  refresh={reexecute}
                  baseurl={baseurl}
                />
              </Route>
              <Redirect to={`${match.path}/threads`} />
            </Switch>
          </Suspense>
        </Fragment>
      )}
      {list.err && <p>{list.err.message}</p>}
      {roles.err && <p>{roles.err.message}</p>}
    </div>
  );
};

export default List;
