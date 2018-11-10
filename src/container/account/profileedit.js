import {h, Component} from 'preact';
import {Link} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';

import {connect} from 'preact-redux';
import {GetProfileReq, EditProfileReq} from 'reducer/account/profile';

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      err: false,
      success: false,
      profile: {
        bio: '',
        contact_email: '',
        image: undefined,
      },
    };
    this.getprofile = this.getprofile.bind(this);
    this.editprofile = this.editprofile.bind(this);
  }

  getprofile() {
    this.props.getprofile((err, data) => {
      if (err) {
        return this.setState((prevState) => {
          return Object.assign({}, prevState, {
            err,
            success: false,
          });
        });
      }
      return this.setState((prevState) => {
        return Object.assign({}, prevState, {
          err: false,
          profile: {
            bio: data.bio,
            contact_email: data.contact_email,
            image: undefined,
          },
        });
      });
    });
  }

  editprofile() {
    this.props.editprofile(this.state.profile, (err) => {
      if (err) {
        return this.setState((prevState) => {
          return Object.assign({}, prevState, {
            err,
            success: false,
          });
        });
      }
      return this.setState((prevState) => {
        return Object.assign({}, prevState, {
          err: false,
          success: true,
        });
      });
    });
  }

  componentDidMount() {
    this.getprofile();
  }

  render({}, {err, success, profile}) {
    const bar = [];
    bar.push(
      <Link to="/a/profile">
        <Button text>{success ? 'Back' : 'Cancel'}</Button>
      </Link>,
    );
    bar.push(
      <Button primary onClick={this.editprofile}>
        Save
      </Button>,
    );

    return (
      <div>
        <Card size="md" restrictWidth center bar={bar}>
          <Section subsection sectionTitle="Profile">
            <Input
              fullWidth
              label="contact email"
              value={profile.contact_email}
              onChange={linkstate(this, 'profile.contact_email')}
            />
            <Input
              textarea
              fullWidth
              label="bio"
              value={profile.bio}
              onChange={linkstate(this, 'profile.bio')}
            />
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              fullWidth
              label="profile image"
              onChange={linkstate(this, 'profile.image')}
            />
          </Section>
          {err && <span>{err}</span>}
          {success && <span>Changes saved</span>}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getprofile: async (callback) => {
      const data = await dispatch(GetProfileReq());
      callback(data.err, data.data);
    },
    editprofile: async (options, callback) => {
      const data = await dispatch(EditProfileReq(options));
      callback(data.err);
    },
  };
};

ProfileEdit = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileEdit);

export default ProfileEdit;
