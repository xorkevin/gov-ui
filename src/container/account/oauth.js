import {useCallback, useMemo, useContext} from 'react';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';
import Img from '@xorkevin/nuke/src/component/image/rounded';

import {GovUICtx} from '../../middleware';

const APP_LIMIT = 32;

const selectAPIConns = (api) => api.oauth.connections.get;
const selectAPIDel = (api) => api.oauth.connections.id.del;
const selectAPIApps = (api) => api.oauth.app.ids;
const selectAPIImage = (api) => api.oauth.app.id.image;

const AppRow = ({clientid, scope, creation_time, app, refresh}) => {
  const ctx = useContext(GovUICtx);

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_deleteState, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const snackRemovedConn = useSnackbarView(
    <SnackbarSurface>&#x2713; Removed connected app</SnackbarSurface>,
  );

  const menu = useMenu();
  const {name, url, logo} = app;
  const scopeSet = useMemo(() => new Set(scope.split(' ')), [scope]);
  const imageURL = useURL(selectAPIImage, [clientid]);

  const posthookRemove = useCallback(
    (_status, _data, opts) => {
      snackRemovedConn();
      refresh(opts);
    },
    [refresh, snackRemovedConn],
  );
  const [_removeApp, execRemove] = useAuthCall(
    selectAPIDel,
    [clientid],
    {},
    {posthook: posthookRemove, errhook: displayErrSnack},
  );

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column grow="1">
          <Grid justify="center" align="center">
            <Column fullWidth sm={6}>
              {logo && (
                <Img
                  className="oauth-app-logo"
                  src={imageURL}
                  preview={logo}
                  ratio={1}
                />
              )}
              <h5 className="text-center">
                <AnchorText ext href={url}>
                  {name}
                </AnchorText>
              </h5>
            </Column>
            <Column fullWidth sm={18}>
              <div>
                <h5>Permissions</h5>
                {ctx.openidAllScopes
                  .filter((i) => scopeSet.has(i) && ctx.openidAllScopeDesc[i])
                  .map((i) => (
                    <Tooltip key={i} tooltip={ctx.openidAllScopeDesc[i]}>
                      <Chip>{i}</Chip>
                    </Tooltip>
                  ))}
              </div>
              <div>
                Access granted on <Time value={creation_time * 1000} />
              </div>
            </Column>
          </Grid>
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem onClick={execRemove}>Remove</MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const Apps = () => {
  const paginate = usePaginate(APP_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookConns = useCallback(
    (_status, conns) => {
      setAtEnd(conns.length < APP_LIMIT);
    },
    [setAtEnd],
  );
  const [conns, reexecute] = useAuthResource(
    selectAPIConns,
    [APP_LIMIT, paginate.index],
    [],
    {posthook: posthookConns},
  );

  const clientids = useMemo(() => conns.data.map((i) => i.client_id), [conns]);
  const [apps] = useResource(
    clientids.length > 0 ? selectAPIApps : selectAPINull,
    [clientids],
    [],
  );
  const appMap = useMemo(
    () => Object.fromEntries(apps.data.map((i) => [i.client_id, i])),
    [apps],
  );

  return (
    <div>
      <h3>Connected Apps</h3>
      <hr />
      <Grid>
        <Column fullWidth md={24}>
          <ListGroup>
            {conns.data
              .filter((i) => appMap[i.client_id])
              .map((i) => (
                <AppRow
                  key={i.client_id}
                  clientid={i.client_id}
                  scope={i.scope}
                  time={i.time}
                  creation_time={i.creation_time}
                  app={appMap[i.client_id]}
                  refresh={reexecute}
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
          {conns.err && <p>{conns.err.message}</p>}
          {apps.err && <p>{apps.err.message}</p>}
        </Column>
      </Grid>
    </div>
  );
};

export default Apps;
