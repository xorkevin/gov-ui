import {useReducer, useEffect, useCallback, useRef, useContext} from 'react';
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from 'react-router-dom';
import {useAPI, useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Container,
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  FieldDynSearchSelect,
  Form,
  useForm,
  useFormSearch,
  Anchor,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';

const CHATS_LIMIT = 32;
const CHATS_SCROLL_LIMIT = 16;
const CHATS_SEARCH_LIMIT = 16;

const selectAPILatestDMs = (api) => api.conduit.dm;
const selectAPIDMs = (api) => api.conduit.dm.ids;
const selectAPISearch = (api) => api.conduit.dm.search;
const selectAPIUsers = (api) => api.u.user.ids;

const SelectAChat = () => {
  return (
    <Container padded narrow>
      <div className="conduit-bg-msg">
        <FaIcon icon="commenting" />
        <br />
        Select a chat
      </div>
    </Container>
  );
};

const Chat = ({chatsMap, users, invalidateChat}) => {
  const ctx = useContext(GovUICtx);

  const {chatid} = useParams();
  const chat = chatid ? chatsMap.value.get(chatid) : null;
  const user = chat ? users.value.get(chat.userid) : null;

  useEffect(() => {
    if (chatid) {
      invalidateChat(chatid);
    }
  }, [invalidateChat, chatid]);

  return (
    <div>
      <h5>
        {user ? (
          <AnchorText
            local
            href={formatURL(ctx.pathUserProfile, user.username)}
          >
            {chat.name || `${user.first_name} ${user.last_name}`}
          </AnchorText>
        ) : (
          chat && chat.name
        )}
      </h5>
      <pre>{JSON.stringify(chat, null, '  ')}</pre>
    </div>
  );
};

const ChatRow = ({chat, users}) => {
  const menu = useMenu();
  const user = users.value.get(chat.userid);
  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="minwidth0" grow="1">
          <Anchor local href={chat.chatid}>
            <div>
              <h5>{chat.name || (user && user.username)}</h5>
              <Time value={chat.last_updated} />
            </div>
          </Anchor>
        </Column>
        <Column shrink="0">
          <ButtonGroup>
            <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
              <FaIcon icon="ellipsis-v" />
            </ButtonTertiary>
          </ButtonGroup>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem icon={<FaIcon icon="bars" />}>Action</MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
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

const iterDiff = (it, s) => {
  const diff = [];
  for (const k of it) {
    if (!s.has(k)) {
      diff.push(k);
    }
  }
  return diff;
};

const chatsReducer = (state, action) => {
  switch (action.type) {
    case CHATS_RESET: {
      if (!Array.isArray(action.chats)) {
        return state;
      }
      const chats = action.chats;
      const chatids = chats.map((i) => i.chatid);
      const allUsersSet = new Set();
      chats.forEach((i) => {
        allUsersSet.add(i.userid);
      });
      const usersDiff = Array.from(allUsersSet);
      return {
        chats,
        chatsMap: {value: new Map(chats.map((i) => [i.chatid, i]))},
        allChatsSet: new Set(chatids),
        validChatsSet: new Set(chatids),
        chatsDiff: [],
        users: {value: new Map()},
        allUsersSet,
        validUsersSet: new Set(),
        usersDiff,
      };
    }
    case CHATS_APPEND: {
      if (!Array.isArray(action.chats) || action.chats.length === 0) {
        return state;
      }
      const addedChats = action.chats.filter((i) => {
        if (!state.chatsMap.value.has(i.chatid)) {
          return true;
        }
        return (
          i.last_updated >= state.chatsMap.value.get(i.chatid).last_updated
        );
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
      const chatsMap = {
        value: state.chatsMap.value,
      };
      const {allChatsSet, validChatsSet, allUsersSet, validUsersSet} = state;
      addedChats.forEach((i) => {
        chatsMap.value.set(i.chatid, i);
        allChatsSet.add(i.chatid);
        validChatsSet.add(i.chatid);
        allUsersSet.add(i.userid);
        validUsersSet.delete(i.userid);
      });
      return Object.assign({}, state, {
        chats,
        chatsMap,
        allChatsSet,
        validChatsSet,
        chatsDiff: iterDiff(allChatsSet.values(), validChatsSet),
        allUsersSet,
        validUsersSet,
        usersDiff: iterDiff(allUsersSet.values(), validUsersSet),
      });
    }
    case CHATS_INVALIDATE: {
      if (!Array.isArray(action.chatids) || action.chatids.length === 0) {
        return state;
      }
      const {allChatsSet, validChatsSet} = state;
      action.chatids.forEach((i) => {
        allChatsSet.add(i);
        validChatsSet.delete(i);
      });
      return Object.assign({}, state, {
        allChatsSet,
        validChatsSet,
        chatsDiff: iterDiff(allChatsSet.values(), validChatsSet),
      });
    }
    case USERS_APPEND: {
      if (!Array.isArray(action.users) || action.users.length === 0) {
        return state;
      }
      const users = {
        value: state.users.value,
      };
      const {allUsersSet, validUsersSet} = state;
      action.users.forEach((i) => {
        users.value.set(i.userid, i);
        allUsersSet.add(i.userid);
        validUsersSet.add(i.userid);
      });
      return Object.assign({}, state, {
        users,
        allUsersSet,
        validUsersSet,
        usersDiff: iterDiff(allUsersSet.values(), validUsersSet),
      });
    }
    case USERS_INVALIDATE: {
      if (!Array.isArray(action.userids) || action.userids.length === 0) {
        return state;
      }
      const {allUsersSet, validUsersSet} = state;
      action.userids.forEach((i) => {
        allUsersSet.add(i);
        validUsersSet.delete(i);
      });
      return Object.assign({}, state, {
        allUsersSet,
        validUsersSet,
        usersDiff: iterDiff(allUsersSet.values(), validUsersSet),
      });
    }
    default:
      return state;
  }
};

const DMs = () => {
  const [chats, dispatchChats] = useReducer(chatsReducer, {
    chats: [],
    chatsMap: {value: new Map()},
    allChatsSet: new Set(),
    validChatsSet: new Set(),
    chatsDiff: [],
    users: {value: new Map()},
    allUsersSet: new Set(),
    validUsersSet: new Set(),
    usersDiff: [],
  });

  const posthookInit = useCallback(
    (_res, chats) => {
      dispatchChats(ChatsReset(chats));
    },
    [dispatchChats],
  );
  const [initChats] = useAuthResource(
    selectAPILatestDMs,
    [0, CHATS_LIMIT],
    [],
    {posthook: posthookInit},
  );

  const endElem = useRef(null);

  const firstLastUpdated =
    chats.chats.length === 0
      ? 0
      : chats.chats[chats.chats.length - 1].last_updated;

  const posthookLoadChats = useCallback(
    (_res, chats) => {
      dispatchChats(ChatsAppend(chats));
    },
    [dispatchChats],
  );
  const [loadChats, _execLoadChats] = useAuthCall(
    selectAPILatestDMs,
    [firstLastUpdated, CHATS_SCROLL_LIMIT],
    [],
    {posthook: posthookLoadChats},
  );

  const posthookChats = useCallback(
    (_res, chats) => {
      dispatchChats(ChatsAppend(chats));
    },
    [dispatchChats],
  );
  const [getChats] = useAuthResource(
    chats.chatsDiff.length > 0 ? selectAPIDMs : selectAPINull,
    [chats.chatsDiff],
    [],
    {posthook: posthookChats},
  );

  const posthookUsers = useCallback(
    (_res, users) => {
      dispatchChats(UsersAppend(users));
    },
    [dispatchChats],
  );
  const [getUsers] = useResource(
    chats.usersDiff.length > 0 ? selectAPIUsers : selectAPINull,
    [chats.usersDiff],
    [],
    {posthook: posthookUsers},
  );

  const invalidateChat = useCallback(
    (chatid) => {
      dispatchChats(ChatsInvalidate([chatid]));
    },
    [dispatchChats],
  );

  const form = useForm({
    chatid: '',
  });

  const apiSearch = useAPI(selectAPISearch);
  const searchUsers = useCallback(
    async ({signal}, search) => {
      const [data, res, err] = await apiSearch(
        {signal},
        search,
        CHATS_SEARCH_LIMIT,
      );
      if (err || !res || !res.ok || !Array.isArray(data)) {
        return [];
      }
      return data.map((i) => ({
        display: i.name || i.username,
        value: i.chatid,
      }));
    },
    [apiSearch],
  );
  const userSuggest = useFormSearch(searchUsers, 256);

  const navigate = useNavigate();

  const formAssign = form.assign;
  const searchChatid = form.state.chatid;
  const goToDM = useCallback(() => {
    if (searchChatid) {
      navigate(searchChatid);
    }
    formAssign({
      chatid: '',
    });
  }, [formAssign, navigate, searchChatid]);

  return (
    <Grid className="conduit-chat-root" strict>
      <Column fullWidth sm={6}>
        <Grid className="conduit-chat-sidebar" direction="column" nowrap strict>
          <Column>
            <h4>Direct Messages</h4>
            {initChats.err && <p>{initChats.err.message}</p>}
            {loadChats.err && <p>{loadChats.err.message}</p>}
            {getChats.err && <p>{getChats.err.message}</p>}
            {getUsers.err && <p>{getUsers.err.message}</p>}
            <Form
              formState={form.state}
              onChange={form.update}
              displays={form.displays}
              putDisplays={form.putDisplays}
              addDisplay={form.addDisplay}
              compactDisplays={form.compactDisplays}
            >
              <FieldDynSearchSelect
                name="chatid"
                placeholder="Search"
                onSearch={userSuggest.setSearch}
                options={userSuggest.opts}
                nohint
                fullWidth
                iconRight={
                  <ButtonTertiary onClick={goToDM}>
                    <FaIcon icon="search" />
                  </ButtonTertiary>
                }
              />
            </Form>
          </Column>
          <Column className="conduit-chat-list-outer" grow="1" basis="0">
            <ListGroup className="conduit-chat-list">
              {chats.chats.map((i) => (
                <ChatRow key={i.chatid} chat={i} users={chats.users} />
              ))}
              <div className="conduit-chat-list-end-marker" ref={endElem} />
            </ListGroup>
          </Column>
        </Grid>
      </Column>
      <Column fullWidth sm={18}>
        <div className="conduit-chat">
          <Routes>
            <Route index element={<SelectAChat />} />
            <Route
              path=":chatid"
              element={
                <Chat
                  chatsMap={chats.chatsMap}
                  users={chats.users}
                  invalidateChat={invalidateChat}
                />
              }
            />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </div>
      </Column>
    </Grid>
  );
};

export default DMs;
