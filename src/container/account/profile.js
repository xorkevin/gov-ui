import {h, Component} from 'preact';
import {formatStr} from 'utility';
import {API} from 'config';
import {Link} from 'react-router-dom';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Button from 'component/button';
import Img from 'component/image';

import {connect} from 'preact-redux';
import {GetProfileReq, CreateProfileReq} from 'reducer/account/profile';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      err: false,
      canCreate: false,
      profile: false,
    };
    this.getprofile = this.getprofile.bind(this);
    this.createprofile = this.createprofile.bind(this);
  }

  getprofile() {
    this.props.getprofile((err, canCreate, data) => {
      if (canCreate) {
        return this.setState((prevState) => {
          return Object.assign({}, prevState, {
            err: err,
            canCreate: true,
          });
        });
      }
      if (err) {
        return this.setState((prevState) => {
          return Object.assign({}, prevState, {
            err,
            canCreate: false,
          });
        });
      }
      return this.setState((prevState) => {
        return Object.assign({}, prevState, {
          err: false,
          canCreate: false,
          profile: data,
        });
      });
    });
  }

  createprofile() {
    this.props.createprofile((err) => {
      if (err) {
        return this.setState((prevState) => {
          return Object.assign({}, prevState, {err});
        });
      }
      this.setState((prevState) => {
        return Object.assign({}, prevState, {err: false});
      });
      this.getprofile();
    });
  }

  componentDidMount() {
    this.getprofile();
  }

  render({userid}, {err, canCreate, profile}) {
    const bar = [];
    if (profile) {
      bar.push(
        <Link to="/a/profile/edit">
          <Button outline>Edit</Button>
        </Link>,
      );
    }

    return (
      <div>
        {err && <span>{err}</span>}
        {canCreate && (
          <Button primary onClick={this.createprofile}>
            Create Profile
          </Button>
        )}
        {profile && (
          <Card size="lg" restrictWidth center bar={bar}>
            <Section subsection sectionTitle="Profile">
              <ListItem label="contact email" item={profile.contact_email} />
              <ListItem label="bio" item={profile.bio} />
              <ListItem
                label="profile image"
                item={
                  profile.image && (
                    <Img
                      rounded
                      preview={profile.image}
                      imgWidth={384}
                      imgHeight={384}
                      src={formatStr(API.profile.idimage, userid)}
                    />
                  )
                }
              />
            </Section>
          </Card>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {userid} = state.Auth;
  return {
    userid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getprofile: async (callback) => {
      const data = await dispatch(GetProfileReq());
      callback(data.err, data.canCreate, data.data);
    },
    createprofile: async (callback) => {
      const data = await dispatch(CreateProfileReq());
      callback(data.err);
    },
  };
};

Profile = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);

export default Profile;
