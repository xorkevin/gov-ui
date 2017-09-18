import {h, Component} from 'preact';
import {Link} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Button from 'component/button';

import {connect} from 'preact-redux';
import {CreateProfileReq, GetProfileReq} from 'reducer/account/profile';

class Profile extends Component {
  constructor(props){
    super(props);
    this.getprofile = this.getprofile.bind(this);
    this.createprofile = this.createprofile.bind(this);
  }

  getprofile(){
    this.props.getprofile();
  }

  createprofile(){
    this.props.createprofile();
  }

  componentDidMount(){
    this.getprofile();
  }

  render({loading, success, err, canCreate, profile}, {}){
    const bar = [];
    if(profile){
      bar.push(<Link to="/a/profile/edit"><Button outline>Edit</Button></Link>);
    }

    return <div>
      {!loading && err && <span>{err}</span>}
      {!loading && canCreate && <Button primary onClick={this.createprofile}>Create Profile</Button>}
      {!loading && profile && <Card size="lg" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Profile">
          <ListItem label="contact email" item={profile.contact_email}/>
          <ListItem label="bio" item={profile.bio}/>
        </Section>
      </Card>}
    </div>;
  }
}

const mapStateToProps = (state)=>{
  const {loading, success, err, canCreate, profile} = state.Profile;
  return {
    loading, success, err, canCreate, profile,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    getprofile: ()=>{
      dispatch(GetProfileReq());
    },
    createprofile: async ()=>{
      await dispatch(CreateProfileReq());
      dispatch(GetProfileReq());
    },
  };
};

Profile = connect(mapStateToProps, mapDispatchToProps)(Profile);

export default Profile
