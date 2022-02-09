import {
  Fragment,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';
import {Routes, Route, Navigate, useHref, useParams} from 'react-router-dom';
import {useAPI, useResource, selectAPINull} from '@xorkevin/substation';
import {
  useAuthValue,
  useRelogin,
  useAuthCall,
  useAuthResource,
} from '@xorkevin/turbine';
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
  FieldDynSearchSelect,
  FieldDynMultiSelect,
  Form,
  useForm,
  useFormSearch,
  SnackbarSurface,
  useSnackbar,
  usePaginate,
  Anchor,
  ButtonGroup,
  FaIcon,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {
  WSCtx,
  useWSValueCtx,
  useWSSubChan,
  useWSPresenceLocationCtx,
} from '../../component/ws';
import {
  SelectAChat,
  ChatSettings,
  ChatMsgs,
  msgsReducer,
  MsgsReset,
  MsgsRcv,
  MsgsAppend,
} from './chat';

const CHAT_MSG_KIND_TXT = 't';

const CHATS_LIMIT = 32;
const CHATS_SCROLL_LIMIT = 16;
const CHATS_SEARCH_LIMIT = 16;
const MSGS_LIMIT = 32;
const MSGS_SCROLL_LIMIT = 16;
const MSG_TIME_REL_DURATION = 604800000;

const GDM_WS_CHANNELS = 'conduit.chat.gdm.';
const GDM_WS_CHANNEL_MSG = 'conduit.chat.gdm.msg';
const GDM_WS_LOC = 'conduit.gdm';

const selectAPILatestGDMs = (api) => api.conduit.gdm;
const selectAPIGDMs = (api) => api.conduit.gdm.ids;
const selectAPIUpd = (api) => api.conduit.gdm.id.edit;
const selectAPICreate = (api) => api.conduit.gdm.create;
const selectAPISearch = (api) => api.conduit.gdm.search;
const selectAPISearchFriends = (api) => api.conduit.friend.search;
const selectAPIUsers = (api) => api.u.user.ids;
const selectAPIProfiles = (api) => api.profile.ids;
const selectAPIMsgs = (api) => api.conduit.gdm.id.msg;
const selectAPICreateMsg = (api) => api.conduit.gdm.id.msg.create;

const iterTake = (it, f, n) => {
  const s = [];
  let c = 0;
  for (const i of it) {
    const k = f(i);
    if (k) {
      s.push(k);
      c++;
    }
    if (c >= n) {
      break;
    }
  }
  return s;
};

const useChatTitle = (loggedInUserid, chatName, chatMembers, users) => {
  return useMemo(() => {
    if (chatName) {
      return chatName;
    }
    const s = iterTake(
      chatMembers,
      (i) => {
        if (i === loggedInUserid) {
          return null;
        }
        const k = users.value.get(i);
        if (!k) {
          return null;
        }
        return k.username;
      },
      3,
    ).join(', ');
    if (chatMembers.length > 3) {
      return s + ',...';
    }
    return s;
  }, [loggedInUserid, chatName, chatMembers, users]);
};

const parseJSON = (s) => {
  try {
    return JSON.parse(s);
  } catch (_err) {
    return {};
  }
};

const SettingsModal = ({chatid, initState, invalidateChat, close}) => {
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_res, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const form = useForm(
    Object.assign(
      {
        name: '',
        themePreset: '',
      },
      initState,
    ),
  );

  const formState = form.state;
  const t = useMemo(
    () => ({
      name: formState.name,
      theme: JSON.stringify({
        preset: formState.themePreset,
      }),
    }),
    [formState],
  );

  const posthookUpdate = useCallback(() => {
    invalidateChat(chatid);
    close();
  }, [chatid, invalidateChat, close]);
  const [update, execUpdate] = useAuthCall(
    selectAPIUpd,
    [chatid, t],
    {},
    {posthook: posthookUpdate, errhook: displayErrSnack},
  );

  return (
    <ChatSettings
      execUpdateSettings={execUpdate}
      settingsState={form.state}
      settingsUpdate={form.update}
      close={close}
      err={update.err}
    />
  );
};

const Chat = ({chatsMap, users, profiles, invalidateChat, isMobile, back}) => {
  const {userid: loggedInUserid} = useAuthValue();

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_res, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const {chatid} = useParams();

  useEffect(() => {
    if (chatid) {
      invalidateChat(chatid);
    }
  }, [invalidateChat, chatid]);

  const [msgs, dispatchMsgs] = useReducer(msgsReducer, {
    msgs: [],
  });

  const msgsEnd = useRef(false);

  const posthookInit = useCallback(
    (_res, msgs) => {
      dispatchMsgs(MsgsReset(msgs));
      msgsEnd.current = false;
    },
    [dispatchMsgs, msgsEnd],
  );
  const [initMsgs] = useAuthResource(
    chatid ? selectAPIMsgs : selectAPINull,
    [chatid, '', '', MSGS_LIMIT],
    [],
    {posthook: posthookInit},
  );

  const startElem = useRef(null);
  const endElem = useRef(null);

  const firstMsgid =
    msgs.msgs.length === 0 ? '' : msgs.msgs[msgs.msgs.length - 1].msgid;

  const posthookLoadMsgs = useCallback(
    (_res, msgs) => {
      dispatchMsgs(MsgsAppend(msgs));
      if (Array.isArray(msgs) && msgs.length === 0) {
        msgsEnd.current = true;
      }
    },
    [dispatchMsgs, msgsEnd],
  );
  const [_loadMsgs, execLoadMsgs] = useAuthCall(
    selectAPIMsgs,
    [chatid, '', firstMsgid, MSGS_SCROLL_LIMIT],
    [],
    {posthook: posthookLoadMsgs, errhook: displayErrSnack},
  );

  const form = useForm({
    kind: CHAT_MSG_KIND_TXT,
    value: '',
  });

  const formAssign = form.assign;
  const posthookCreate = useCallback(() => {
    formAssign({
      kind: CHAT_MSG_KIND_TXT,
      value: '',
    });
    if (startElem.current) {
      startElem.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [formAssign, startElem]);
  const [_create, execCreate] = useAuthCall(
    selectAPICreateMsg,
    [chatid, form.state],
    {},
    {posthook: posthookCreate, errhook: displayErrSnack},
  );

  const ws = useContext(WSCtx);

  const onmessageWS = useCallback(
    (_channel, value) => {
      if (!value || value.chatid !== chatid) {
        return;
      }
      dispatchMsgs(MsgsRcv(value));
    },
    [dispatchMsgs, chatid],
  );
  useWSSubChan(ws.subChan, GDM_WS_CHANNEL_MSG, {
    onmessage: onmessageWS,
  });

  const chat = chatid ? chatsMap.value.get(chatid) : null;
  const chatTitle = useChatTitle(
    loggedInUserid,
    chat ? chat.name : '',
    chat ? chat.members : [],
    users,
  );

  const modal = useModal();

  const settings = useMemo(() => {
    if (!chat) {
      return {};
    }
    const t = parseJSON(chat.theme);
    return {
      name: chat.name,
      themePreset: t.preset,
    };
  }, [chat]);

  return (
    <Fragment>
      <ChatMsgs
        loggedInUserid={loggedInUserid}
        users={users}
        profiles={profiles}
        chatTitle={chatTitle}
        err={initMsgs.err}
        msgsEnd={msgsEnd}
        startElem={startElem}
        endElem={endElem}
        msgs={msgs}
        theme={chat && chat.theme}
        execLoadMsgs={execLoadMsgs}
        execCreate={execCreate}
        formState={form.state}
        formUpdate={form.update}
        modalAnchorRef={modal.anchorRef}
        modalToggle={modal.toggle}
        isMobile={isMobile}
        back={back}
      />
      {chat && modal.show && (
        <ModalSurface size="md" anchor={modal.anchor} close={modal.close}>
          <SettingsModal
            chatid={chatid}
            initState={settings}
            invalidateChat={invalidateChat}
            close={modal.close}
          />
        </ModalSurface>
      )}
    </Fragment>
  );
};

const useSearchFriends = () => {
  const relogin = useRelogin();
  const apiSearch = useAPI(selectAPISearchFriends);
  const searchUsers = useCallback(
    async ({signal}, search) => {
      const [_data, _res, errLogin] = await relogin();
      if (errLogin) {
        return [];
      }
      const [data, res, err] = await apiSearch(
        {signal},
        search,
        CHATS_SEARCH_LIMIT,
      );
      if (err || !res || !res.ok || !Array.isArray(data)) {
        return [];
      }
      return data.map((i) => ({
        display: i.username,
        value: i.userid,
      }));
    },
    [apiSearch, relogin],
  );
  return useFormSearch(searchUsers, 256);
};

const CreateChat = ({posthookCreate, close}) => {
  const form = useForm({
    name: '',
    theme: '{}',
    members: [],
  });

  const userSuggest = useSearchFriends();

  const posthook = useCallback(() => {
    close();
    posthookCreate();
  }, [posthookCreate, close]);
  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [form.state],
    {},
    {posthook},
  );

  return (
    <Fragment>
      <h4>New Group Chat</h4>
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
          name="members"
          label="Users"
          onSearch={userSuggest.setSearch}
          options={userSuggest.opts}
          nohint
          fullWidth
        />
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Cancel</ButtonTertiary>
        <ButtonPrimary onClick={execCreate}>Create</ButtonPrimary>
      </ButtonGroup>
      {create.err && <p>{create.err.message}</p>}
    </Fragment>
  );
};

const ChatSearchRow = ({chat, users, loggedInUserid}) => {
  const chatTitle = useChatTitle(
    loggedInUserid,
    chat.name,
    chat.members,
    users,
  );
  return (
    <ListItem className="conduit-chat-item">
      <Grid
        className="chat-row"
        justify="space-between"
        align="center"
        nowrap
        strict
      >
        <Column className="minwidth0 info" grow="1">
          <Anchor className="link" local href={chat.chatid}>
            <div>
              <h5>{chatTitle}</h5>
              <small>
                <Time
                  value={chat.last_updated}
                  relDuration={MSG_TIME_REL_DURATION}
                />
              </small>
            </div>
          </Anchor>
        </Column>
      </Grid>
    </ListItem>
  );
};

const SearchChat = ({close, loggedInUserid}) => {
  const form = useForm({
    friendid: '',
  });

  const userSuggest = useSearchFriends();

  const searchFriendid = form.state.friendid;

  const paginate = usePaginate(CHATS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookChats = useCallback(
    (_res, chats) => {
      setAtEnd(chats.length < CHATS_LIMIT);
    },
    [setAtEnd],
  );
  const [chats] = useAuthResource(
    searchFriendid.length > 0 ? selectAPISearch : selectAPINull,
    [searchFriendid, CHATS_LIMIT, paginate.index],
    [],
    {posthook: posthookChats},
  );

  const userids = useMemo(
    () =>
      Array.isArray(chats.data) &&
      Array.from(
        new Set(
          chats.data.flatMap((i) =>
            i.members.filter((j) => j !== loggedInUserid),
          ),
        ),
      ),
    [chats, loggedInUserid],
  );
  const [users] = useResource(
    userids.length > 0 ? selectAPIUsers : selectAPINull,
    [userids],
    [],
  );
  const userMap = useMemo(
    () => ({value: new Map(users.data.map((i) => [i.userid, i]))}),
    [users],
  );

  return (
    <Fragment>
      <Grid>
        <Column className="minwidth0" grow="1">
          <h4>Search Group Chats</h4>
        </Column>
        <Column shrink="0">
          <ButtonGroup>
            <ButtonTertiary onClick={close}>
              <FaIcon icon="times" />
            </ButtonTertiary>
          </ButtonGroup>
        </Column>
      </Grid>
      <Form
        formState={form.state}
        onChange={form.update}
        displays={form.displays}
        putDisplays={form.putDisplays}
        addDisplay={form.addDisplay}
        compactDisplays={form.compactDisplays}
      >
        <FieldDynSearchSelect
          name="friendid"
          placeholder="Search"
          onSearch={userSuggest.setSearch}
          options={userSuggest.opts}
          nohint
          fullWidth
        />
      </Form>
      <ListGroup>
        {Array.isArray(chats.data) &&
          chats.data.map((i) => (
            <ChatSearchRow
              key={i.chatid}
              chat={i}
              users={userMap}
              loggedInUserid={loggedInUserid}
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
      {chats.err && <p>{chats.err.message}</p>}
    </Fragment>
  );
};

const ChatRow = ({chat, users, loggedInUserid}) => {
  const menu = useMenu();
  const chatTitle = useChatTitle(
    loggedInUserid,
    chat.name,
    chat.members,
    users,
  );
  return (
    <ListItem className="conduit-chat-item">
      <Grid
        className="chat-row"
        justify="space-between"
        align="center"
        nowrap
        strict
      >
        <Column className="minwidth0 info" grow="1">
          <Anchor className="link" local href={chat.chatid}>
            <div>
              <h5>{chatTitle}</h5>
              <small>
                <Time
                  value={chat.last_updated}
                  relDuration={MSG_TIME_REL_DURATION}
                />
              </small>
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
const CHATS_LAST_UPDATED = Symbol('CHATS_LAST_UPDATED');
const CHATS_INVALIDATE = Symbol('CHATS_INVALIDATE');

const USERS_APPEND = Symbol('USERS_APPEND');
const USERS_INVALIDATE = Symbol('USERS_INVALIDATE');
const PROFILES_APPEND = Symbol('PROFILES_APPEND');

const ChatsReset = (chats) => ({
  type: CHATS_RESET,
  chats,
});

const ChatsAppend = (chats) => ({
  type: CHATS_APPEND,
  chats,
});

const ChatsLastUpdated = (chatid, last_updated) => ({
  type: CHATS_LAST_UPDATED,
  chatid,
  last_updated,
});

const ChatsInvalidate = (chatids) => ({
  type: CHATS_INVALIDATE,
  chatids,
});

const UsersAppend = (users) => ({
  type: USERS_APPEND,
  users,
});

const ProfilesAppend = (profiles) => ({
  type: PROFILES_APPEND,
  profiles,
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
        i.members.forEach((j) => {
          allUsersSet.add(j);
        });
      });
      const usersDiff = Array.from(allUsersSet);
      const profilesDiff = Array.from(allUsersSet);
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
        profiles: {value: new Map()},
        validProfilesSet: new Set(),
        profilesDiff,
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
      const {allChatsSet, validChatsSet, allUsersSet} = state;
      addedChats.forEach((i) => {
        chatsMap.value.set(i.chatid, i);
        allChatsSet.add(i.chatid);
        validChatsSet.add(i.chatid);
        i.members.forEach((j) => {
          allUsersSet.add(j);
        });
      });
      return Object.assign({}, state, {
        chats,
        chatsMap,
        allChatsSet,
        validChatsSet,
        chatsDiff: iterDiff(allChatsSet.values(), validChatsSet),
        allUsersSet,
        usersDiff: iterDiff(allUsersSet.values(), state.validUsersSet),
        profilesDiff: iterDiff(allUsersSet.values(), state.validProfilesSet),
      });
    }
    case CHATS_LAST_UPDATED: {
      const {allChatsSet, validChatsSet} = state;
      const {chatid} = action;
      if (!allChatsSet.has(chatid)) {
        allChatsSet.add(chatid);
        validChatsSet.delete(chatid);
        return Object.assign({}, state, {
          allChatsSet,
          validChatsSet,
          chatsDiff: iterDiff(allChatsSet.values(), validChatsSet),
        });
      }
      const {chats} = state;
      const {last_updated} = action;
      const idx = chats.findIndex((i) => chatid === i.chatid);
      if (idx < 0 || last_updated <= chats[idx].last_updated) {
        return state;
      }
      const chat = Object.assign({}, chats[idx], {last_updated});
      chats[idx] = chat;
      chats.sort((a, b) => {
        // reverse sort
        return b.last_updated - a.last_updated;
      });
      const chatsMap = {
        value: state.chatsMap.value,
      };
      chatsMap.value.set(chat.chatid, chat);
      return Object.assign({}, state, {
        chats,
        chatsMap,
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
      const {allUsersSet, validUsersSet, validProfilesSet} = state;
      action.userids.forEach((i) => {
        allUsersSet.add(i);
        validUsersSet.delete(i);
        validProfilesSet.delete(i);
      });
      return Object.assign({}, state, {
        allUsersSet,
        validUsersSet,
        usersDiff: iterDiff(allUsersSet.values(), validUsersSet),
        validProfilesSet,
        profilesDiff: iterDiff(allUsersSet.values(), validProfilesSet),
      });
    }
    case PROFILES_APPEND: {
      if (!Array.isArray(action.profiles) || action.profiles.length === 0) {
        return state;
      }
      const profiles = {
        value: state.profiles.value,
      };
      const {validProfilesSet} = state;
      action.profiles.forEach((i) => {
        profiles.value.set(i.userid, i);
        validProfilesSet.add(i.userid);
      });
      return Object.assign({}, state, {
        profiles,
        validProfilesSet,
        profilesDiff: iterDiff(state.allUsersSet.values(), validProfilesSet),
      });
    }
    default:
      return state;
  }
};

const GDMs = ({isMobile}) => {
  const {userid: loggedInUserid} = useAuthValue();

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_res, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

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
    profiles: {value: new Map()},
    validProfilesSet: new Set(),
    profilesDiff: [],
  });

  const posthookInit = useCallback(
    (_res, chats) => {
      dispatchChats(ChatsReset(chats));
    },
    [dispatchChats],
  );
  const [initChats, reinitChats] = useAuthResource(
    selectAPILatestGDMs,
    [0, CHATS_LIMIT],
    [],
    {posthook: posthookInit},
  );

  const startElem = useRef(null);
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
  const [_loadChats, _execLoadChats] = useAuthCall(
    selectAPILatestGDMs,
    [firstLastUpdated, CHATS_SCROLL_LIMIT],
    [],
    {posthook: posthookLoadChats, errhook: displayErrSnack},
  );

  const posthookChats = useCallback(
    (_res, chats) => {
      dispatchChats(ChatsAppend(chats));
    },
    [dispatchChats],
  );
  useAuthResource(
    chats.chatsDiff.length > 0 ? selectAPIGDMs : selectAPINull,
    [chats.chatsDiff],
    [],
    {posthook: posthookChats, errhook: displayErrSnack},
  );

  const posthookUsers = useCallback(
    (_res, users) => {
      dispatchChats(UsersAppend(users));
    },
    [dispatchChats],
  );
  useResource(
    chats.usersDiff.length > 0 ? selectAPIUsers : selectAPINull,
    [chats.usersDiff],
    [],
    {posthook: posthookUsers, errhook: displayErrSnack},
  );

  const posthookProfiles = useCallback(
    (_res, profiles) => {
      dispatchChats(ProfilesAppend(profiles));
    },
    [dispatchChats],
  );
  useResource(
    chats.profilesDiff.length > 0 ? selectAPIProfiles : selectAPINull,
    [chats.profilesDiff],
    [],
    {posthook: posthookProfiles, errhook: displayErrSnack},
  );

  const invalidateChat = useCallback(
    (chatid) => {
      dispatchChats(ChatsInvalidate([chatid]));
    },
    [dispatchChats],
  );

  const modalCreate = useModal();
  const posthookCreate = useCallback(() => {
    reinitChats();
    if (startElem.current) {
      startElem.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [reinitChats, startElem]);
  const modalSearch = useModal();

  const ws = useContext(WSCtx);

  useWSPresenceLocationCtx(ws.sendChan, GDM_WS_LOC);

  const onmessageWS = useCallback(
    (channel, value) => {
      switch (channel) {
        case GDM_WS_CHANNEL_MSG: {
          if (!value) {
            return;
          }
          const {chatid, time_ms} = value;
          dispatchChats(ChatsLastUpdated(chatid, time_ms));
          break;
        }
      }
    },
    [dispatchChats],
  );
  useWSSubChan(ws.subChan, GDM_WS_CHANNELS, {
    onmessage: onmessageWS,
  });

  const {open: wsopen} = useWSValueCtx();
  const j = ['indicator'];
  if (wsopen) {
    j.push('connected');
  }

  const matchURL = useHref('');

  const sidebar = (
    <Grid className="conduit-chat-sidebar" direction="column" nowrap strict>
      <Column>
        <Grid align="center" nowrap strict>
          <Column grow="1">
            <Grid align="center" nowrap>
              <Column>
                <h4>Group Messages</h4>
              </Column>
              <Column shrink="0">
                <Tooltip
                  className="conduit-chat-connection-indicator"
                  position="right"
                  tooltip={wsopen ? 'CONNECTED' : 'DISCONNECTED'}
                >
                  <span className={j.join(' ')}></span>
                </Tooltip>
              </Column>
            </Grid>
          </Column>
          <Column shrink="0">
            <ButtonGroup>
              <ButtonTertiary
                forwardedRef={modalCreate.anchorRef}
                onClick={modalCreate.toggle}
              >
                <FaIcon icon="plus" />
              </ButtonTertiary>
              <ButtonTertiary
                forwardedRef={modalSearch.anchorRef}
                onClick={modalSearch.toggle}
              >
                <FaIcon icon="search" />
              </ButtonTertiary>
            </ButtonGroup>
            {modalCreate.show && (
              <ModalSurface
                size="md"
                anchor={modalCreate.anchor}
                close={modalCreate.close}
              >
                <CreateChat
                  posthookCreate={posthookCreate}
                  close={modalCreate.close}
                />
              </ModalSurface>
            )}
            {modalSearch.show && (
              <ModalSurface
                size="md"
                anchor={modalSearch.anchor}
                close={modalSearch.close}
              >
                <SearchChat close={modalSearch.close} />
              </ModalSurface>
            )}
          </Column>
        </Grid>
        {initChats.err && <p>{initChats.err.message}</p>}
      </Column>
      <Column className="minheight0 chat-col" grow="1" basis="0">
        <ListGroup className="chat-list">
          <div className="start-marker" ref={startElem} />
          {chats.chats.map((i) => (
            <ChatRow
              key={i.chatid}
              chat={i}
              users={chats.users}
              profiles={chats.profiles}
              loggedInUserid={loggedInUserid}
            />
          ))}
          <div className="end-marker" ref={endElem} />
        </ListGroup>
      </Column>
    </Grid>
  );

  return (
    <Grid className="conduit-chat-root" strict>
      {!isMobile && (
        <Column fullWidth md={6}>
          {sidebar}
        </Column>
      )}
      <Column fullWidth md={18}>
        <Routes>
          <Route index element={isMobile ? sidebar : <SelectAChat />} />
          <Route
            path=":chatid"
            element={
              <Chat
                chatsMap={chats.chatsMap}
                users={chats.users}
                profiles={chats.profiles}
                invalidateChat={invalidateChat}
                isMobile={isMobile}
                back={matchURL}
              />
            }
          />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </Column>
    </Grid>
  );
};

export default GDMs;
