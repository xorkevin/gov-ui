import {h, Component} from 'preact';
import {Link} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';

import {connect} from 'preact-redux';
import {EditProfileReq} from 'reducer/account/profile';

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    const {bio, contact_email} = props.profile;
    this.state = {
      bio,
      contact_email,
      image: undefined,
    };
    this.editprofile = this.editprofile.bind(this);
    this.navigateProfile = this.navigateProfile.bind(this);
  }

  navigateProfile() {
    this.props.history.replace('/a/profile');
  }

  editprofile() {
    this.props.editprofile(this.state);
  }

  componentDidMount() {
    if (!this.props.profile) {
      this.navigateProfile();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.profile) {
      this.navigateProfile();
    }
  }

  render({profile, editloading, editsuccess, editerr}, {contact_email, bio}) {
    if (!profile) {
      return false;
    }
    const bar = [];
    bar.push(
      <Link to="/a/profile">
        <Button text>Cancel</Button>
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
              value={contact_email}
              onChange={linkstate(this, 'contact_email')}
            />
            <Input
              textarea
              fullWidth
              label="bio"
              value={bio}
              onChange={linkstate(this, 'bio')}
            />
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              fullWidth
              label="profile image"
              onChange={linkstate(this, 'image')}
            />
          </Section>
          {editerr && <span>{editerr}</span>}
          {editsuccess && <span>Changes saved</span>}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {profile, editloading, editsuccess, editerr} = state.Profile;
  return {
    profile,
    editloading,
    editsuccess,
    editerr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editprofile: (options) => {
      dispatch(EditProfileReq(options));
    },
  };
};

ProfileEdit = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileEdit);

export default ProfileEdit;
