import {useParams} from 'react-router-dom';
import {useURL, useResource, selectAPINull} from '@xorkevin/substation';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Card,
  Time,
} from '@xorkevin/nuke';
import Img from '@xorkevin/nuke/src/component/image/rounded';

const selectAPIUser = (api) => api.u.user.name;
const selectAPIProfile = (api) => api.profile.id;
const selectAPIImage = (api) => api.profile.id.image;

const UserDetails = () => {
  const {username} = useParams();

  const [account] = useResource(selectAPIUser, [username], {
    userid: '',
    first_name: '',
    last_name: '',
    username: '',
    creation_time: '',
  });
  const imageURL = useURL(selectAPIImage, [account.data.userid]);

  const [profile] = useResource(
    account.data.userid.length > 0 ? selectAPIProfile : selectAPINull,
    [account.data.userid],
    {bio: '', image: ''},
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
                    <Img
                      className="card-border dark"
                      src={imageURL}
                      preview={profile.data.image}
                      ratio={1}
                    />
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
                    {profile.data.bio && <p>{profile.data.bio}</p>}
                  </Container>
                </Card>
              )}
              {(account.err || profile.err) && (
                <p>{account.err.message || profile.err.message}</p>
              )}
            </Column>
            <Column fullWidth sm={16} grow="1"></Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default UserDetails;
