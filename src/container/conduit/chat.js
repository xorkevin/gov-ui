import {useURL} from '@xorkevin/substation';
import {
  Container,
  Grid,
  Column,
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

const ChatMsgs = ({
  loggedInUserid,
  users,
  profiles,
  chatTitle,
  profile,
  present,
  err,
  startElem,
  endElem,
  msgs,
  execLoadMsgs,
  sendMsg,
  formState,
  formUpdate,
  isMobile,
  back,
}) => {
  const j = ['indicator'];
  if (present) {
    j.push('connected');
  }
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
              <ButtonTertiary onClick={execLoadMsgs}>Load more</ButtonTertiary>
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

export {SelectAChat, ProfileImg, MsgRow, ChatMsgs};
