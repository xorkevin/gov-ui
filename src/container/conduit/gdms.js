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
import {useAPI, useURL, useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Container,
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
  Field,
  Form,
  useForm,
  useFormSearch,
  SnackbarSurface,
  useSnackbar,
  Anchor,
  ButtonGroup,
  FaIcon,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import Img from '@xorkevin/nuke/src/component/image/circle';

import {
  WSCtx,
  useWSValueCtx,
  useWSSubChan,
  useWSPresenceLocationCtx,
} from '../../component/ws';

const CHAT_MSG_KIND_TXT = 't';

const CHATS_LIMIT = 32;
const CHATS_SCROLL_LIMIT = 16;
const CHATS_SEARCH_LIMIT = 16;
const MSGS_LIMIT = 32;
const MSGS_SCROLL_LIMIT = 16;
const MSG_TIME_REL_DURATION = 604800000;
const MSGS_BREAK_DURATION = 1800000;

const GDM_WS_CHANNELS = 'conduit.chat.gdm.';
const GDM_WS_CHANNEL_MSG = 'conduit.chat.gdm.msg';
const GDM_WS_LOC = 'conduit.gdm';

const selectAPILatestGDMs = (api) => api.conduit.gdm;
const selectAPIGDMs = (api) => api.conduit.gdm.ids;
const selectAPICreate = (api) => api.conduit.gdm.create;
const selectAPISearch = (api) => api.conduit.friend.search;
const selectAPIUsers = (api) => api.u.user.ids;
const selectAPIProfiles = (api) => api.profile.ids;
const selectAPIImage = (api) => api.profile.id.image;
const selectAPIMsgs = (api) => api.conduit.gdm.id.msg;
const selectAPICreateMsg = (api) => api.conduit.gdm.id.msg.create;

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

const ProfileImg = ({userid, profiles}) => {
  const profile = profiles.value.get(userid);
  const imageURL = useURL(selectAPIImage, [userid]);
  if (!profile || !profile.image) {
    return <FaIcon icon="user fa-lg" />;
  }
  return <Img src={imageURL} preview={profile.image} ratio="1 / 1" />;
};

const MsgRow = ({
  loggedInUserid,
  users,
  profiles,
  userid,
  time_ms,
  value,
  first,
  last,
}) => {
  const isSelf = userid === loggedInUserid;
  const username =
    isSelf || !users.value.get(userid) ? '' : users.value.get(userid).username;
  const k = ['conduit-chat-msg'];
  if (isSelf) {
    k.push('self');
  }
  if (first) {
    k.push('first');
  }
  if (last) {
    k.push('last');
  }
  return (
    <div className={k.join(' ')}>
      {last && (
        <Grid
          className="base"
          direction={isSelf ? 'row-reverse' : 'row'}
          align="center"
          nowrap
          strict
        >
          <Column className="picture-spacer" align="flex-end" shrink="0" />
          <Column className="info minwidth0">
            {!isSelf && username}{' '}
            <span className="time">
              <small>
                <Time
                  position={isSelf ? 'left' : 'right'}
                  value={time_ms}
                  relDuration={MSG_TIME_REL_DURATION}
                />
              </small>
            </span>
          </Column>
        </Grid>
      )}
      <Grid
        className="base"
        direction={isSelf ? 'row-reverse' : 'row'}
        align="center"
        nowrap
        strict
      >
        <Column
          className="profile-picture text-center"
          align="flex-end"
          shrink="0"
        >
          {!isSelf && first && (
            <ProfileImg profiles={profiles} userid={userid} />
          )}
        </Column>
        <Column className="value minwidth0">{value}</Column>
        {!last && (
          <Column className="time" shrink="0">
            <small>
              <Time
                position={isSelf ? 'left' : 'right'}
                value={time_ms}
                relDuration={MSG_TIME_REL_DURATION}
              />
            </small>
          </Column>
        )}
      </Grid>
    </div>
  );
};

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

const MSGS_RESET = Symbol('MSGS_RESET');
const MSGS_RCV = Symbol('MSGS_RCV');
const MSGS_APPEND = Symbol('MSGS_APPEND');

const MsgsReset = (msgs) => ({
  type: MSGS_RESET,
  msgs,
});

const MsgsRcv = (msg) => ({
  type: MSGS_RCV,
  msg,
});

const MsgsAppend = (msgs) => ({
  type: MSGS_APPEND,
  msgs,
});

const msgsReducer = (state, action) => {
  switch (action.type) {
    case MSGS_RESET: {
      if (!Array.isArray(action.msgs)) {
        return state;
      }
      const {msgs} = action;
      return {
        msgs,
      };
    }
    case MSGS_RCV: {
      const {msg} = action;
      const {msgs} = state;
      if (msgs.length === 0 || msg.msgid > msgs[0].msgid) {
        msgs.unshift(msg);
        return {
          msgs,
        };
      }
      const idx = msgs.findIndex((i) => i.msgid === msg.msgid);
      if (idx >= 0) {
        return state;
      }
      msgs.push(msg);
      msgs.sort((a, b) => {
        // reverse sort
        if (b > a) {
          return 1;
        } else if (b < a) {
          return -1;
        }
        return 0;
      });
      return {
        msgs,
      };
    }
    case MSGS_APPEND: {
      if (!Array.isArray(action.msgs) || action.msgs.length === 0) {
        return state;
      }
      const {msgs} = state;
      if (msgs.length === 0) {
        return {
          msgs: action.msgs,
        };
      }
      const last = msgs[msgs.length - 1].msgid;
      const idx = action.msgs.findIndex((i) => i.msgid < last);
      if (idx < 0) {
        return state;
      }
      if (idx === 0) {
        msgs.push(...action.msgs);
        return {
          msgs,
        };
      }
      msgs.push(...action.msgs.slice(idx));
      return {
        msgs,
      };
    }
    default:
      return state;
  }
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
  const chat = chatid ? chatsMap.value.get(chatid) : null;

  const chatTitle = useChatTitle(
    loggedInUserid,
    chat ? chat.name : '',
    chat ? chat.members : [],
    users,
  );

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

  useEffect(() => {
    if (!endElem.current) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (msgsEnd.current) {
        return;
      }
      if (entries.some((i) => i.isIntersecting)) {
        execLoadMsgs();
      }
    });
    observer.observe(endElem.current);
    return () => {
      observer.disconnect();
    };
  }, [endElem, execLoadMsgs, msgsEnd]);

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
  const scrollTop = useCallback(() => {
    if (startElem.current) {
      startElem.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [startElem]);
  const sendMsg = form.state.value ? execCreate : scrollTop;

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

  return (
    <Grid className="conduit-chat-msgs-root" direction="column" nowrap strict>
      <Column className="header">
        <Grid className="header-row" align="center" nowrap strict>
          {isMobile && (
            <Column shrink="0">
              <Anchor local href={back}>
                <ButtonTertiary>
                  <FaIcon icon="arrow-left" />
                </ButtonTertiary>
              </Anchor>
            </Column>
          )}
          <Column className="minwidth0 chat-name" grow="1">
            <h5>{chatTitle}</h5>
          </Column>
        </Grid>
      </Column>
      <Column className="minheight0 msgs-outer" grow="1" basis="0">
        {initMsgs.err && <p>{initMsgs.err.message}</p>}
        <div className="msgs">
          <div className="start-marker" ref={startElem} />
          {msgs.msgs.map((i, n, arr) => (
            <MsgRow
              key={i.msgid}
              loggedInUserid={loggedInUserid}
              users={users}
              profiles={profiles}
              msgid={i.msgid}
              userid={i.userid}
              kind={i.kind}
              time_ms={i.time_ms}
              value={i.value}
              first={
                n === 0 ||
                arr[n - 1].userid !== i.userid ||
                arr[n - 1].time_ms - i.time_ms > MSGS_BREAK_DURATION
              }
              last={
                n === arr.length - 1 ||
                arr[n + 1].userid !== i.userid ||
                i.time_ms - arr[n + 1].time_ms > MSGS_BREAK_DURATION
              }
            />
          ))}
          <div className="end-marker" ref={endElem}>
            <ButtonGroup>
              <ButtonTertiary onClick={execLoadMsgs}>Load more</ButtonTertiary>
            </ButtonGroup>
          </div>
        </div>
      </Column>
      <Column>
        <Form formState={form.state} onChange={form.update} onSubmit={sendMsg}>
          <Field
            name="value"
            placeholder="Message"
            nohint
            fullWidth
            autoFocus
            iconRight={
              <ButtonPrimary onClick={sendMsg}>
                <FaIcon icon="arrow-right" />
              </ButtonPrimary>
            }
          />
        </Form>
      </Column>
    </Grid>
  );
};

const useSearchFriends = () => {
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
        display: i.username,
        value: i.userid,
      }));
    },
    [apiSearch],
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
        <Column className="profile-picture text-center" shrink="0">
          <FaIcon icon="user fa-lg" />
        </Column>
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

  const form = useForm({
    friendid: '',
  });

  const userSuggest = useSearchFriends();

  const searchFriendid = form.state.friendid;

  const modal = useModal();
  const posthookCreate = useCallback(() => {
    reinitChats();
    if (startElem.current) {
      startElem.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [reinitChats, startElem]);

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
          <Column shrink="0">
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
                <CreateChat
                  posthookCreate={posthookCreate}
                  close={modal.close}
                />
              </ModalSurface>
            )}
          </Column>
        </Grid>
        {initChats.err && <p>{initChats.err.message}</p>}
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
            iconRight={
              <ButtonTertiary>
                <FaIcon icon={searchFriendid ? 'arrow-right' : 'search'} />
              </ButtonTertiary>
            }
          />
        </Form>
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
