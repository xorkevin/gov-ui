import {h, Component} from 'preact';
import {formatStr} from 'utility';
import {API} from 'config';
import {Link} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Button from 'component/button';
import Img from 'component/image';

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

  render({loading, success, err, canCreate, profile, userid}, {}){
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
          <ListItem label="profile image" item={profile.image && 
            <Img rounded preview={profile.image} imgWidth={384} imgHeight={384} src={formatStr(API.profile.idimage, userid)}/>
          }/>
        </Section>
      </Card>}
    </div>;
  }
}

const mapStateToProps = (state)=>{
  const {loading, success, err, canCreate, profile} = state.Profile;
  const {userid} = state.Auth;
  return {
    loading, success, err, canCreate, profile, userid,
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
