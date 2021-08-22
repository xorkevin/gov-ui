import {useCallback} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const SelectAChat = () => {
  return <div>Select a chat</div>;
};

const Chat = () => {
  const {chatid} = useParams();

  return <div>Hello, World, chatid: {chatid}</div>;
};

const ChatRow = () => {
  const match = useRouteMatch();
  const menu = useMenu();

  const menuToggle = menu.toggle;
  const toggleMenu = useCallback(
    (e) => {
      // prevent link from being clicked. anchor tag lies outside of event bubbling system.
      e.preventDefault();
      e.stopPropagation();
      menuToggle();
    },
    [menuToggle],
  );

  const preventPropagate = useCallback((e) => {
    // prevent link from being clicked. anchor tag lies outside of event bubbling system.
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <ListItem local link={`${match.url}/some-user-id`}>
      <Grid justify="space-between" align="center" nowrap>
        <Column>
          <h5>Gandalf the Grey</h5>
          <Time value={Date.now()} />
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={toggleMenu}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu
              size="md"
              anchor={menu.anchor}
              close={menu.close}
              onClick={preventPropagate}
            >
              <MenuItem icon={<FaIcon icon="bars" />}>Action</MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const ConduitChat = () => {
  const match = useRouteMatch();
  return (
    <Grid>
      <Column fullWidth sm={6}>
        <h4>Direct Messages</h4>
        <ListGroup>
          <ChatRow />
        </ListGroup>
      </Column>
      <Column fullWidth sm={18}>
        <Switch>
          <Route exact path={`${match.path}`}>
            <SelectAChat />
          </Route>
          <Route path={`${match.path}/:chatid`}>
            <Chat />
          </Route>
          <Redirect to={`${match.url}`} />
        </Switch>
      </Column>
    </Grid>
  );
};

export default ConduitChat;
