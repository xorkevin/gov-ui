import {Fragment, useCallback, useMemo, useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Container,
  Grid,
  Column,
  ListGroup,
  ListItem,
  Tabbar,
  TabItem,
  useMenu,
  Menu,
  MenuItem,
  SnackbarSurface,
  useSnackbar,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';

const CHATS_LIMIT = 32;

const selectAPIDMs = (api) => api.conduit.dm;

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
        chatsMap: new Map(chats.map((i) => [i.chatid, i])),
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
        if (!state.chatsMap.has(i.chatid)) {
          return true;
        }
        return i.last_updated >= state.chatsMap.get(i.chatid).last_updated;
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
      const {chatsMap, allChatsSet, validChatsSet, allUsersSet, validUsersSet} =
        state;
      addedChats.forEach((i) => {
        chatsMap.set(i.chatid, i);
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
    chatsMap: new Map(),
    allChatsSet: new Set(),
    validChatsSet: new Set(),
    chatsDiff: [],
    users: {value: new Map()},
    allUsersSet: new Set(),
    validUsersSet: new Set(),
    usersDiff: [],
  });
  return (
    <Grid className="conduit-chat-root">
      <Column fullWidth sm={6}>
        <Grid className="conduit-chat-sidebar" direction="column" nowrap strict>
          <Column>
            <h4>Direct Messages</h4>
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
        <Routes>
          <Route index element={<SelectAChat />} />
          <Route
            path=":chatid"
            element={
              <Chat
                allChatsMap={chats.allChatsMap}
                invalidateChat={invalidateChat}
              />
            }
          />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </Column>
    </Grid>
  );
};

export default DMs;
