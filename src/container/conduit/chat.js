import {Fragment, useReducer, useCallback} from 'react';
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
const selectAPIChats = (api) => api.conduit.chat.ids;
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

const CreateChat = ({close, addChat}) => {
  const {userid} = useAuthValue();

  const form = useForm({
    userids: [],
  });

  const posthook = useCallback(
    (_status, chat) => {
      close();
      // TODO: remove this branch after websockets
      if (chat && chat.chatid) {
        addChat(chat.chatid);
      }
    },
    [close, addChat],
  );
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
const CHATS_APPEND = Symbol('CHATS_APPEND');
const CHATS_INVALIDATE = Symbol('CHATS_INVALIDATE');

const USERS_APPEND = Symbol('USERS_APPEND');
const USERS_INVALIDATE = Symbol('USERS_INVALIDATE');

const ChatsReset = (chats) => ({
  type: CHATS_RESET,
  chats,
});

const ChatsAppend = (chats) => ({
  type: CHATS_APPEND,
  chats,
});

const ChatsInvalidate = (chatids) => ({
  type: CHATS_INVALIDATE,
  chatids,
});

const UsersAppend = (users) => ({
  type: USERS_APPEND,
  users,
});

const chatsReducer = (state, action) => {
  switch (action.type) {
    case CHATS_RESET: {
      if (!Array.isArray(action.chats)) {
        return state;
      }
      const chats = action.chats
        .filter((i) => i.chatid && i.last_updated > 0)
        .sort((a, b) => {
          // reverse sort
          return b.last_updated - a.last_updated;
        });
      const usersDiff = chats.flatMap((i) =>
        Array.isArray(i.members) ? i.members : [],
      );
      const chatids = chats.map((i) => i.chatid);
      return {
        chats,
        users: {},
        chatsDiff: [],
        usersDiff,
        validChatsSet: new Set(chatids),
        chatsSet: new Set(chatids),
        allChatsMap: new Map(chats.map((i) => [i.chatid, i.last_updated])),
        validUsersSet: new Set(),
        usersSet: new Set(usersDiff),
      };
    }
    case CHATS_APPEND: {
      if (!Array.isArray(action.chats) || action.chats.length === 0) {
        return state;
      }
      const addedChats = action.chats
        .filter((i) => {
          if (!i.chatid || !i.last_updated) {
            return false;
          }
          if (!state.allChatsMap.has(i.chatid)) {
            return true;
          }
          return i.last_updated > state.allChatsMap.get(i.chatid);
        })
        .sort((a, b) => {
          // reverse sort
          return b.last_updated - a.last_updated;
        });
      const addedChatidSet = new Set(addedChats.map((i) => i.chatid));
      const chats = state.chats.filter((i) => !addedChatidSet.has(i.chatid));
      addedChats.forEach((i) => {
        chats.push(i);
      });
      chats.sort((a, b) => {
        // reverse sort
        return b.last_updated - a.last_updated;
      });
      const validChatsSet = state.validChatsSet;
      const chatsSet = state.chatsSet;
      const allChatsMap = state.allChatsMap;
      const usersSet = state.usersSet;
      addedChats.forEach((i) => {
        validChatsSet.add(i.chatid);
        chatsSet.add(i.chatid);
        allChatsMap.set(i.chatid, i.last_updated);
        if (Array.isArray(i.members)) {
          i.members.forEach((j) => {
            usersSet.add(j);
          });
        }
      });
      return Object.assign({}, state, {
        chats,
        chatsDiff: Array.from(chatsSet).filter((i) => !validChatsSet.has(i)),
        usersDiff: Array.from(usersSet).filter(
          (i) => !state.validUsersSet.has(i),
        ),
        validChatsSet,
        chatsSet,
        allChatsMap,
        usersSet,
      });
    }
    case CHATS_INVALIDATE: {
      if (!Array.isArray(action.chatids) || action.chatids.length === 0) {
        return state;
      }
      const validChatsSet = state.validChatsSet;
      const chatsSet = state.chatsSet;
      action.chatids.forEach((i) => {
        validChatsSet.delete(i);
        chatsSet.add(i);
      });
      return Object.assign({}, state, {
        chatsDiff: Array.from(chatsSet).filter((i) => !validChatsSet.has(i)),
        validChatsSet,
        chatsSet,
      });
    }
    case USERS_APPEND: {
      if (!Array.isArray(action.users) || action.users.length === 0) {
        return state;
      }
      const users = Object.assign(
        {},
        state.users,
        Object.fromEntries(action.users.map((i) => [i.userid, i])),
      );
      const validUsersSet = state.validUsersSet;
      action.users.forEach((i) => {
        validUsersSet.add(i.userid);
      });
      return Object.assign({}, state, {
        users,
        usersDiff: Array.from(state.usersSet).filter(
          (i) => !validUsersSet.has(i),
        ),
        validUsersSet,
      });
    }
    case USERS_INVALIDATE: {
      if (!Array.isArray(action.userids) || action.userids.length === 0) {
        return state;
      }
      const validUsersSet = state.validUsersSet;
      action.userids.forEach((i) => {
        validUsersSet.delete(i);
      });
      return Object.assign({}, state, {
        usersDiff: Array.from(state.usersSet).filter(
          (i) => !validUsersSet.has(i),
        ),
        validUsersSet,
      });
    }
    default:
      return state;
  }
};

const ConduitChat = () => {
  const match = useRouteMatch();

  const [chats, dispatchChats] = useReducer(chatsReducer, {
    chats: [],
    users: {},
    chatsDiff: [],
    usersDiff: [],
    validChatsSet: new Set(),
    chatsSet: new Set(),
    allChatsMap: new Map(),
    validUsersSet: new Set(),
    usersSet: new Set(),
  });

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

  const posthookChats = useCallback(
    (_status, chats) => {
      dispatchChats(ChatsAppend(chats));
    },
    [dispatchChats],
  );
  const chatsDiff = chats.chatsDiff;
  const [getChats, _execGetChats] = useAuthResource(
    chatsDiff.length > 0 ? selectAPIChats : selectAPINull,
    [chatsDiff],
    [],
    {posthook: posthookChats},
  );

  const posthookUsers = useCallback(
    (_status, users) => {
      dispatchChats(UsersAppend(users));
    },
    [dispatchChats],
  );
  const usersDiff = chats.usersDiff;
  const [getUsers, _execGetUsers] = useResource(
    usersDiff.length > 0 ? selectAPIUsers : selectAPINull,
    [usersDiff],
    [],
    {posthook: posthookUsers},
  );

  const addChat = useCallback(
    (chatid) => {
      dispatchChats(ChatsInvalidate([chatid]));
    },
    [dispatchChats],
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
                <CreateChat close={modal.close} addChat={addChat} />
              </ModalSurface>
            )}
          </Column>
        </Grid>
        {initChats.err && <p>{initChats.err.message}</p>}
        {getChats.err && <p>{getChats.err.message}</p>}
        {getUsers.err && <p>{getUsers.err.message}</p>}
        <ListGroup className="conduit-chat-list">
          {chats.chats.map((i) => (
            <ChatRow key={i.chatid} chat={i} usersCache={chats.users} />
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
