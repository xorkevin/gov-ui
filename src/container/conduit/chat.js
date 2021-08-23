import {useReducer, useCallback} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
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
  Form,
  useForm,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPILatestChats = (api) => api.conduit.chat.latest;
const selectAPICreateChat = (api) => api.conduit.chat.create;

const SelectAChat = () => {
  return <div>Select a chat</div>;
};

const Chat = () => {
  const {chatid} = useParams();

  return <div>Hello, World, chatid: {chatid}</div>;
};

const ChatRow = ({chatid}) => {
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
    <ListItem local link={`${match.url}/${chatid}`}>
      <Grid justify="space-between" align="center" nowrap>
        <Column>
          <h5>{chatid}</h5>
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

const CHATS_LIMIT = 32;

const CHATS_RESET = Symbol('CHATS_RESET');
const CHATS_RCV = Symbol('CHATS_RCV');
const CHATS_APPEND = Symbol('CHATS_APPEND');

const ChatsReset = (chatids) => ({
  type: CHATS_RESET,
  chatids,
});

const chatsReducer = (state, action) => {
  switch (action.type) {
    case CHATS_RESET:
      return {
        chatids: action.chatids,
      };
    case CHATS_RCV: {
      return state;
    }
    case CHATS_APPEND: {
      return state;
    }
    default:
      return state;
  }
};

const ConduitChat = () => {
  const match = useRouteMatch();

  const [chats, dispatchChats] = useReducer(chatsReducer, {chatids: []});

  const posthookInit = useCallback(
    (_status, chatids) => {
      dispatchChats(ChatsReset(chatids));
    },
    [dispatchChats],
  );
  useAuthResource(selectAPILatestChats, ['dm', 0, CHATS_LIMIT], [], {
    posthook: posthookInit,
  });

  const form = useForm({
    userids: '',
  });

  const formAssign = form.assign;
  const posthookCreate = useCallback(() => {
    formAssign({
      userids: '',
    });
  }, [formAssign]);
  const [create, execCreate] = useAuthCall(
    selectAPICreateChat,
    ['dm', '', '{}', form.state.userids.split(',')],
    {},
    {posthook: posthookCreate},
  );

  return (
    <Grid>
      <Column fullWidth sm={6}>
        <h4>Direct Messages</h4>
        <Form
          formState={form.state}
          onChange={form.update}
          onSubmit={execCreate}
        >
          <Field name="userids" label="Users" nohint />
        </Form>
        <ButtonGroup>
          <ButtonPrimary onClick={execCreate}>Create Chat</ButtonPrimary>
        </ButtonGroup>
        {create.err && <p>{create.err.message}</p>}
        <ListGroup className="conduit-chat-list">
          {chats.chatids.map((i) => (
            <ChatRow key={i} chatid={i} />
          ))}
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
