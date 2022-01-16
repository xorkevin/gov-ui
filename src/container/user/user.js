import {useCallback, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {useURL, useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Card,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  ButtonGroup,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import Img from '@xorkevin/nuke/src/component/image/rounded';

import {GovUICtx} from '../../middleware';

const selectAPIUser = (api) => api.u.user.name;
const selectAPIProfile = (api) => api.profile.id;
const selectAPIImage = (api) => api.profile.id.image;
const selectAPISendInvite = (api) => api.conduit.friend.invitation.id.send;

const UserDetails = () => {
  const ctx = useContext(GovUICtx);
  const {loggedIn, username: loggedInUsername} = useAuthValue();
  const {username} = useParams();

  const snackInviteSent = useSnackbarView(
    <SnackbarSurface>&#x2713; Request sent</SnackbarSurface>,
  );
  const snackbar = useSnackbar();
  const posthookErr = useCallback(
    (_deleteState, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const [account] = useResource(selectAPIUser, [username], {
    userid: '',
    first_name: '',
    last_name: '',
    username: '',
    creation_time: '',
  });
  const imageURL = useURL(selectAPIImage, [account.data.userid]);

  const [profile] = useResource(
    ctx.enableUserProfile && account.data.userid.length > 0
      ? selectAPIProfile
      : selectAPINull,
    [account.data.userid],
    {bio: '', image: ''},
  );

  const [_sendInv, execSendInv] = useAuthCall(
    loggedIn && ctx.enableConduit && account.data.userid.length > 0
      ? selectAPISendInvite
      : selectAPINull,
    [account.data.userid],
    {},
    {posthook: snackInviteSent, errhook: posthookErr},
  );

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column>
              {account.success && (
                <Card
                  width="sm"
                  title={
                    profile.success && profile.data.image ? (
                      <Img
                        className="card-border dark"
                        src={imageURL}
                        preview={profile.data.image}
                        ratio={1}
                      />
                    ) : null
                  }
                >
                  <Container padded>
                    <h4>
                      {account.data.first_name} {account.data.last_name}{' '}
                      <small>@{account.data.username}</small>
                    </h4>
                    <h6>
                      joined <Time value={account.data.creation_time * 1000} />
                    </h6>
                    {profile.success && profile.data.bio && (
                      <p>{profile.data.bio}</p>
                    )}
                    {loggedIn && username !== loggedInUsername && (
                      <ButtonGroup>
                        <ButtonTertiary onClick={execSendInv}>
                          Send Friend Request
                        </ButtonTertiary>
                      </ButtonGroup>
                    )}
                  </Container>
                </Card>
              )}
              {account.err && <p>{account.err.message}</p>}
              {profile.err && <p>{profile.err.message}</p>}
            </Column>
            <Column fullWidth sm={16} grow="1"></Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default UserDetails;
