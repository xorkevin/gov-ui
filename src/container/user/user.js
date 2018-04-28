import {h, Component} from 'preact';
import {API} from 'config';
import {formatStr} from 'utility';
import {Grid, Column} from 'component/grid';
import Section from 'component/section';
import Card from 'component/card';
import Time from 'component/time';

import {connect} from 'preact-redux';
import {GetUserByName} from 'reducer/user';

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      err: false,
      errProf: false,
      username: props.match.params.username || '',
      user: false,
    };
    this.fetchUser = this.fetchUser.bind(this);
  }

  fetchUser() {
    if (this.state.username.length > 0) {
      this.props.userbyname(this.state.username, (err, errProf, user) => {
        this.setState(prevState => {
          return Object.assign({}, prevState, {err, errProf, user});
        });
      });
    }
  }

  componentDidMount() {
    this.fetchUser();
  }

  render({}, {err, errProf, username, user}) {
    return (
      <Section container padded>
        <Grid>
          <Column sm={8} md={6}>
            {user && (
              <Card
                title=""
                imgHeight={384}
                imgWidth={384}
                background={formatStr(API.profile.idimage, user.userid)}
                preview={user.image}>
                <h4>
                  {user.first_name} {user.last_name}{' '}
                  <small>@{user.username}</small>
                </h4>
                <h6>
                  joined <Time value={user.creation_time} />
                </h6>
                {user.bio && <p>{user.bio}</p>}
              </Card>
            )}
            {err && <span>{err}</span>}
            {errProf && <span>{errProf}</span>}
          </Column>
          <Column sm={16} md={18} />
        </Grid>
      </Section>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    userbyname: async (username, callback) => {
      const data = await dispatch(GetUserByName(username));
      callback(data.err, data.profileErr, data.data);
    },
  };
};

UserDetails = connect(mapStateToProps, mapDispatchToProps)(UserDetails);

export default UserDetails;
