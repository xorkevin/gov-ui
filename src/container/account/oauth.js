import {useCallback, useMemo} from 'react';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

const APP_LIMIT = 32;

const selectAPIConns = (api) => api.oauth.connections.get;
const selectAPIApps = (api) => api.oauth.app.ids;

const AppRow = ({time, creation_time, app}) => {
  const menu = useMenu();
  const {name, url} = app || {};
  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="account-oauth-app-item-name">
          <h5 className="account-oauth-app-item-heading">
            <AnchorText local href={url || ''}>
              {name}
            </AnchorText>
          </h5>
          <div>
            Last accessed <Time value={time * 1000} />
          </div>
          <div>
            Added <Time value={creation_time * 1000} />
          </div>
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem>Remove</MenuItem>
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
            {conns.data.map((i) => (
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
