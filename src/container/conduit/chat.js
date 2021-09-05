import {Fragment, useReducer, useCallback, useMemo} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import {useAPI, useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
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
  FieldDynMultiSelect,
  Form,
  useForm,
  useFormSearch,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const CHATS_LIMIT = 32;
const USERS_LIMIT = 8;

const selectAPIUsers = (api) => api.u.user.ids;
const selectAPILatestChats = (api) => api.conduit.chat.latest;
const selectAPICreateChat = (api) => api.conduit.chat.create;
const selectAPISearch = (api) => api.u.user.search;

const SelectAChat = () => {
  return <div>Select a chat</div>;
};

const Chat = () => {
  const {chatid} = useParams();

  return <div>Hello, World, chatid: {chatid}</div>;
};

const ChatRow = ({chat, usersCache}) => {
  const {userid} = useAuthValue();

  const match = useRouteMatch();
  const menu = useMenu();

  const menuToggle = menu.toggle;
  const toggleMenu = useCallback(
    (e) => {
      // prevent link from being clicked. anchor tag lies outside of event bubbling system.
      e.preventDefault();
      menuToggle();
    },
    [menuToggle],
  );

  const preventDefault = useCallback((e) => {
    // prevent link from being clicked. anchor tag lies outside of event bubbling system.
    e.preventDefault();
  }, []);

  return (
    <ListItem local link={`${match.url}/${chat.chatid}`}>
      <Grid justify="space-between" align="center" nowrap>
        <Column>
          <h5>
            {chat.name ||
              chat.members
                .filter((i) => i !== userid)
                .slice(0, 5)
                .map((i) => {
                  const k = usersCache[i];
                  if (!k) {
                    return '';
                  }
                  return k.username;
                })
                .join(', ')}
          </h5>
          <Time value={chat.last_updated} />
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
              onClick={preventDefault}
            >
              <MenuItem icon={<FaIcon icon="bars" />}>Action</MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const CreateChat = ({close}) => {
  const {userid} = useAuthValue();

  const form = useForm({
    userids: [],
  });

  const posthook = useCallback(() => {
    close();
  }, [close]);
  const [create, execCreate] = useAuthCall(
    selectAPICreateChat,
    ['dm', '', '{}', form.state.userids],
    {},
    {posthook},
  );

  const apiSearch = useAPI(selectAPISearch);
  const searchUsers = useCallback(
    async (search) => {
      const [data, status, err] = await apiSearch(search, USERS_LIMIT);
      if (err || status < 200 || status >= 300 || !Array.isArray(data)) {
        return [];
      }
      return data
        .filter((i) => i.userid !== userid)
        .map((i) => ({value: i.userid, display: i.username}));
    },
    [userid, apiSearch],
  );
  const userSuggest = useFormSearch(searchUsers, 256);

  return (
    <Fragment>
      <h4>New Chat</h4>
      <Form
        formState={form.state}
        onChange={form.update}
        onSubmit={execCreate}
        displays={form.displays}
        putDisplays={form.putDisplays}
        addDisplay={form.addDisplay}
        compactDisplays={form.compactDisplays}
      >
        <FieldDynMultiSelect
          name="userids"
          label="Users"
          onSearch={userSuggest.setSearch}
          options={userSuggest.opts}
          nohint
          fullWidth
        />
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Cancel</ButtonTertiary>
        <ButtonPrimary onClick={execCreate}>Create Chat</ButtonPrimary>
      </ButtonGroup>
      {create.err && <p>{create.err.message}</p>}
    </Fragment>
  );
};

const CHATS_RESET = Symbol('CHATS_RESET');
const CHATS_RCV = Symbol('CHATS_RCV');
const CHATS_APPEND = Symbol('CHATS_APPEND');

const ChatsReset = (chats) => ({
  type: CHATS_RESET,
  chats,
});

const chatsReducer = (state, action) => {
  switch (action.type) {
    case CHATS_RESET: {
      if (!Array.isArray(action.chats)) {
        return state;
      }
      return {
        chats: action.chats.slice().sort((a, b) => {
          const la = a.last_updated || 0;
          const lb = b.last_updated || 0;
          // reverse sort
          return lb - la;
        }),
      };
    }
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

const USERS_APPEND = Symbol('USERS_APPEND');
const USERS_INVALIDATE = Symbol('USERS_INVALIDATE');

const UsersAppend = (users) => ({
  type: USERS_APPEND,
  users,
});

const usersCacheReducer = (state, action) => {
  switch (action.type) {
    case USERS_APPEND: {
      if (!Array.isArray(action.users) || action.users.length === 0) {
        return state;
      }
      return Object.assign(
        {},
        state,
        Object.fromEntries(action.users.map((i) => [i.userid, i])),
      );
    }
    case USERS_INVALIDATE: {
      if (!Array.isArray(action.userids) || action.userids.length === 0) {
        return state;
      }
      const next = Object.assign({}, state);
      for (const i of action.userids) {
        delete next[i];
      }
      return next;
    }
    default:
      return state;
  }
};

const ConduitChat = () => {
  const match = useRouteMatch();

  const [chats, dispatchChats] = useReducer(chatsReducer, {chats: []});

  const posthookInit = useCallback(
    (_status, chats) => {
      dispatchChats(ChatsReset(chats));
    },
    [dispatchChats],
  );
  const [initChats, _execInitChats] = useAuthResource(
    selectAPILatestChats,
    ['dm', 0, CHATS_LIMIT],
    [],
    {posthook: posthookInit},
  );

  const [usersCache, dispatchUsersCache] = useReducer(usersCacheReducer, {});

  const useridDiff = useMemo(
    () =>
      chats.chats.flatMap((i) =>
        Array.isArray(i.members) ? i.members.filter((j) => !usersCache[j]) : [],
      ),
    [chats, usersCache],
  );

  const posthookUsers = useCallback(
    (_status, users) => {
      dispatchUsersCache(UsersAppend(users));
    },
    [dispatchUsersCache],
  );
  const [getUsers, _execGetUsers] = useResource(
    useridDiff.length > 0 ? selectAPIUsers : selectAPINull,
    [useridDiff],
    [],
    {posthook: posthookUsers},
  );

  const modal = useModal();

  return (
    <Grid>
      <Column fullWidth sm={6}>
        <Grid justify="space-between" align="flex-end">
          <Column grow="1">
            <h4>Direct Messages</h4>
          </Column>
          <Column>
            <ButtonGroup>
              <ButtonTertiary
                forwardedRef={modal.anchorRef}
                onClick={modal.toggle}
              >
                <FaIcon icon="plus" />
              </ButtonTertiary>
            </ButtonGroup>
            {modal.show && (
              <ModalSurface size="md" anchor={modal.anchor} close={modal.close}>
                <CreateChat close={modal.close} />
              </ModalSurface>
            )}
          </Column>
        </Grid>
        {initChats.err && <p>{initChats.err.message}</p>}
        {getUsers.err && <p>{getUsers.err.message}</p>}
        <ListGroup className="conduit-chat-list">
          {chats.chats.map((i) => (
            <ChatRow key={i.chatid} chat={i} usersCache={usersCache} />
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
