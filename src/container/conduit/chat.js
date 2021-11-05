import {
  Fragment,
  useState,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from 'react';
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
  Field,
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
const CHATS_SCROLL_LIMIT = 16;
const MSGS_LIMIT = 32;
const USERS_LIMIT = 8;

const selectAPIUsers = (api) => api.u.user.ids;
const selectAPISearch = (api) => api.u.user.search;
const selectAPIChats = (api) => api.conduit.chat.ids;
const selectAPILatestChats = (api) => api.conduit.chat.latest;
const selectAPICreateChat = (api) => api.conduit.chat.create;
const selectAPICreateMsg = (api) => api.conduit.chat.id.msg.create;
const selectAPILatestMsgs = (api) => api.conduit.chat.id.msg.latest;

const SelectAChat = () => {
  return <div>Select a chat</div>;
};

const Chat = ({allChatsMap, invalidateChat}) => {
  const {chatid} = useParams();
  useEffect(() => {
    invalidateChat(chatid);
  }, [invalidateChat, chatid]);

  const [initMsgs, _execInitMsgs] = useAuthResource(
    selectAPILatestMsgs,
    [chatid, '', '', MSGS_LIMIT],
    [],
  );

  const form = useForm({
    value: '',
  });

  const [create, execCreate] = useAuthCall(
    selectAPICreateMsg,
    [chatid, 'text', form.state.value],
    {},
  );

  if (!allChatsMap.has(chatid)) {
    return <div>Chat not found</div>;
  }

  const chat = allChatsMap.get(chatid);

  return (
    <div>
      <pre>{JSON.stringify(chat, null, '  ')}</pre>
      <pre>{JSON.stringify(initMsgs, null, '  ')}</pre>
      <Form formState={form.state} onChange={form.update} onSubmit={execCreate}>
        <Field name="value" label="Message" nohint fullWidth />
      </Form>
      <ButtonGroup>
        <ButtonPrimary onClick={execCreate}>Send</ButtonPrimary>
      </ButtonGroup>
      {create.err && <p>{create.err.message}</p>}
    </div>
  );
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
          <ButtonGroup>
            <ButtonTertiary forwardedRef={menu.anchorRef} onClick={toggleMenu}>
              <FaIcon icon="ellipsis-v" />
            </ButtonTertiary>
          </ButtonGroup>
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

const CreateChat = ({close, invalidateChat}) => {
  const {userid} = useAuthValue();

  const form = useForm({
    userids: [],
  });

  const posthook = useCallback(
    (_res, chat) => {
      close();
      // TODO: remove this branch after websockets
      if (chat && chat.chatid) {
        invalidateChat(chat.chatid);
      }
    },
    [close, invalidateChat],
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
      const [data, res, err] = await apiSearch(search, USERS_LIMIT);
      if (err || !res || !res.ok || !Array.isArray(data)) {
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
      const usersDiff = Array.from(
        chats.reduce((a, i) => {
          if (!Array.isArray(i.members)) {
            return a;
          }
          i.members.forEach((j) => {
            a.add(j);
          });
          return a;
        }, new Set()),
      );
      const chatids = chats.map((i) => i.chatid);
      return {
        chats,
        users: {},
        chatsDiff: [],
        usersDiff,
        validChatsSet: new Set(chatids),
        chatsSet: new Set(chatids),
        allChatsMap: new Map(chats.map((i) => [i.chatid, i])),
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
          return i.last_updated >= state.allChatsMap.get(i.chatid).last_updated;
        })
        .sort((a, b) => {
          // reverse sort
          return b.last_updated - a.last_updated;
        });
      if (addedChats.length === 0) {
        return state;
      }
      const addedChatidSet = new Set(addedChats.map((i) => i.chatid));
      const chats = state.chats.filter((i) => !addedChatidSet.has(i.chatid));
      addedChats.forEach((i) => {
        chats.push(i);
      });
      chats.sort((a, b) => {
        // reverse sort
        return b.last_updated - a.last_updated;
      });
      const {validChatsSet, chatsSet, allChatsMap, validUsersSet, usersSet} =
        state;
      addedChats.forEach((i) => {
        validChatsSet.add(i.chatid);
        chatsSet.add(i.chatid);
        allChatsMap.set(i.chatid, i);
        if (Array.isArray(i.members)) {
          i.members.forEach((j) => {
            validUsersSet.delete(j);
            usersSet.add(j);
          });
        }
      });
      return Object.assign({}, state, {
        chats,
        chatsDiff: Array.from(chatsSet).filter((i) => !validChatsSet.has(i)),
        usersDiff: Array.from(usersSet).filter((i) => !validUsersSet.has(i)),
        validChatsSet,
        chatsSet,
        allChatsMap,
        validUsersSet,
        usersSet,
      });
    }
    case CHATS_INVALIDATE: {
      if (!Array.isArray(action.chatids) || action.chatids.length === 0) {
        return state;
      }
      const {validChatsSet, chatsSet} = state;
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
    (_res, chats) => {
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

  const endElem = useRef(null);
  const firstLastUpdated =
    chats.chats.length === 0
      ? 0
      : chats.chats[chats.chats.length - 1].last_updated;
  const [before, setBefore] = useState(0);
  useEffect(() => {
    if (!endElem.current) {
      return;
    }
    if (firstLastUpdated === 0) {
      return;
    }
    if (firstLastUpdated === before) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((i) => i.isIntersecting)) {
        setBefore(firstLastUpdated);
      }
    });
    observer.observe(endElem.current);

    return () => {
      observer.disconnect();
    };
  }, [endElem, setBefore, before, firstLastUpdated]);

  const posthookLoadChats = useCallback(
    (_res, chats) => {
      dispatchChats(ChatsAppend(chats));
    },
    [dispatchChats],
  );
  const [loadChats, _execLoadChats] = useAuthResource(
    before === 0 ? selectAPINull : selectAPILatestChats,
    ['dm', before, CHATS_SCROLL_LIMIT],
    [],
    {posthook: posthookLoadChats},
  );

  const posthookChats = useCallback(
    (_res, chats) => {
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
    (_res, users) => {
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

  const invalidateChat = useCallback(
    (chatid) => {
      dispatchChats(ChatsInvalidate([chatid]));
    },
    [dispatchChats],
  );

  const modal = useModal();

  return (
    <Grid className="conduit-chat-root">
      <Column fullWidth sm={6}>
        <Grid className="conduit-chat-sidebar" direction="column" nowrap strict>
          <Column>
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
                  <ModalSurface
                    size="md"
                    anchor={modal.anchor}
                    close={modal.close}
                  >
                    <CreateChat
                      close={modal.close}
                      invalidateChat={invalidateChat}
                    />
                  </ModalSurface>
                )}
              </Column>
            </Grid>
            {initChats.err && <p>{initChats.err.message}</p>}
            {loadChats.err && <p>{loadChats.err.message}</p>}
            {getChats.err && <p>{getChats.err.message}</p>}
            {getUsers.err && <p>{getUsers.err.message}</p>}
          </Column>
          <Column className="conduit-chat-list-outer" grow="1" basis="0">
            <ListGroup className="conduit-chat-list">
              {chats.chats.map((i) => (
                <ChatRow key={i.chatid} chat={i} usersCache={chats.users} />
              ))}
              <div className="conduit-chat-list-end-marker" ref={endElem} />
            </ListGroup>
          </Column>
        </Grid>
      </Column>
      <Column fullWidth sm={18}>
        <Switch>
          <Route exact path={`${match.path}`}>
            <SelectAChat />
          </Route>
          <Route path={`${match.path}/:chatid`}>
            <Chat
              allChatsMap={chats.allChatsMap}
              invalidateChat={invalidateChat}
            />
          </Route>
          <Redirect to={`${match.url}`} />
        </Switch>
      </Column>
    </Grid>
  );
};

export default ConduitChat;
