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
import {Tabbar, TabItem} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';

const ManageMsgs = lazy(() => import('./managemsgs'));
const ManageMembers = lazy(() => import('./managemembers'));
const ManageSettings = lazy(() => import('./managesettings'));

const selectAPIList = (api) => api.mailinglist.id.get;
const selectAPIOrg = (api) => api.orgs.id.get;

const ManageList = () => {
  const ctx = useContext(GovUICtx);
  const {userid, username} = useAuthValue();

  const match = useRouteMatch();
  const {listid} = useParams();

  const [list, reexecute] = useResource(
    listid.length > 0 ? selectAPIList : selectAPINull,
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
      {isOwner && (
        <Fragment>
          <h2>
            {list.data.name}{' '}
            <small>{`${creatorName}.${list.data.listname}`}</small>
          </h2>
          <p>{list.data.desc}</p>
          <Tabbar>
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
              <Route path={`${match.path}/msgs`}>
                <ManageMsgs list={list.data} />
              </Route>
              <Route path={`${match.path}/members`}>
                <ManageMembers list={list.data} />
              </Route>
              <Route path={`${match.path}/settings`}>
                <ManageSettings
                  list={list.data}
                  creatorName={creatorName}
                  refresh={reexecute}
                />
              </Route>
              <Redirect to={`${match.path}/msgs`} />
            </Switch>
          </Suspense>
        </Fragment>
      )}
      {list.err && <p>{list.err.message}</p>}
      {roles.err && <p>{roles.err.message}</p>}
    </div>
  );
};

export default ManageList;
