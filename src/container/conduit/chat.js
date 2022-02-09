import {Fragment, useEffect, useCallback, useMemo} from 'react';
import {useURL} from '@xorkevin/substation';
import {
  Container,
  Grid,
  Column,
  FieldSearchSelect,
  Field,
  Form,
  Anchor,
  ButtonGroup,
  FaIcon,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import Img from '@xorkevin/nuke/src/component/image/circle';

const MSG_TIME_REL_DURATION = 604800000;
const MSGS_BREAK_DURATION = 1800000;

const selectAPIImage = (api) => api.profile.id.image;

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

const parseJSON = (s) => {
  try {
    return JSON.parse(s);
  } catch (_err) {
    return {};
  }
};

const themeOpts = [
  {display: 'Blue', value: 'blue'},
  {display: 'Citrus', value: 'citrus'},
  {display: 'Peach', value: 'peach'},
];

const styles = Object.freeze({
  citrus: {
    '--msg-bg':
      'linear-gradient(180deg, rgba(253,68,29,1) 0%, rgba(252,149,0,1) 100%) fixed center / cover',
    '--msg-bg-dark':
      'linear-gradient(180deg, rgba(253,68,29,1) 0%, rgba(252,149,0,1) 100%) fixed center / cover',
  },
  peach: {
    '--msg-bg':
      'linear-gradient(180deg, rgba(246,95,15,1) 0%, rgba(242,92,84,1) 100%) fixed center / cover',
    '--msg-bg-dark':
      'linear-gradient(180deg, rgba(246,95,15,1) 0%, rgba(242,92,84,1) 100%) fixed center / cover',
  },
});

const ChatSettings = ({
  execUpdateSettings,
  settingsState,
  settingsUpdate,
  close,
  err,
}) => {
  return (
    <Fragment>
      <h4>Settings</h4>
      <Form
        formState={settingsState}
        onChange={settingsUpdate}
        onSubmit={execUpdateSettings}
      >
        <Field name="name" label="Name" nohint fullWidth />
        <FieldSearchSelect
          name="themePreset"
          options={themeOpts}
          label="Theme"
          nohint
          fullWidth
        />
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Cancel</ButtonTertiary>
        <ButtonPrimary onClick={execUpdateSettings}>Update</ButtonPrimary>
      </ButtonGroup>
      {err && <p>{err.message}</p>}
    </Fragment>
  );
};

const ChatMsgs = ({
  loggedInUserid,
  users,
  profiles,
  chatTitle,
  profile,
  present,
  err,
  msgsEnd,
  startElem,
  endElem,
  msgs,
  theme,
  execLoadMsgs,
  execCreate,
  formState,
  formUpdate,
  modalAnchorRef,
  modalToggle,
  isMobile,
  back,
}) => {
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

  const scrollTop = useCallback(() => {
    if (startElem.current) {
      startElem.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [startElem]);
  const sendMsg = formState.value ? execCreate : scrollTop;

  const j = ['indicator'];
  if (present) {
    j.push('connected');
  }

  const themeObj = useMemo(() => {
    if (!theme) {
      return {};
    }
    return Object.assign({}, parseJSON(theme));
  }, [theme]);

  const s = styles[themeObj.preset];

  return (
    <div className="conduit-chat-msgs-base" style={s}>
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
            {profile && (
              <Column className="profile-picture text-center" shrink="0">
                <ProfileImg profiles={profiles} userid={profile.userid} />
                <Tooltip
                  className="conduit-chat-presence-indicator"
                  position="right"
                  tooltip={present ? 'ONLINE' : 'OFFLINE'}
                >
                  <span className={j.join(' ')}></span>
                </Tooltip>
              </Column>
            )}
            <Column className="minwidth0 chat-name" grow="1">
              <h5>{chatTitle}</h5>
            </Column>
            <Column shrink="0">
              <ButtonTertiary
                forwardedRef={modalAnchorRef}
                onClick={modalToggle}
              >
                <FaIcon icon="ellipsis-v" />
              </ButtonTertiary>
            </Column>
          </Grid>
        </Column>
        <Column className="minheight0 msgs-outer" grow="1" basis="0">
          {err && <p>{err.message}</p>}
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
                <ButtonTertiary onClick={execLoadMsgs}>
                  Load more
                </ButtonTertiary>
              </ButtonGroup>
            </div>
          </div>
        </Column>
        <Column>
          <Form formState={formState} onChange={formUpdate} onSubmit={sendMsg}>
            <Field
              name="value"
              placeholder="Message"
              nohint
              fullWidth
              autoFocus
              iconRight={
                <ButtonTertiary className="conduit-send-msg" onClick={sendMsg}>
                  <FaIcon icon="arrow-right" />
                </ButtonTertiary>
              }
            />
          </Form>
        </Column>
      </Grid>
    </div>
  );
};

export {
  SelectAChat,
  ProfileImg,
  MsgRow,
  ChatSettings,
  ChatMsgs,
  msgsReducer,
  MsgsReset,
  MsgsRcv,
  MsgsAppend,
};
