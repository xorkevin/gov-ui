import {h, Component} from 'preact';
import {Link, withRouter} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';

import {connect} from 'preact-redux';
import {CreateProfileReq} from 'reducer/account/profile';

class ProfileNew extends Component {
  constructor(props){
    super(props);
    this.state = {
      bio: '',
      contact_email: '',
      image: '',
    };
    this.createprofile = this.createprofile.bind(this);
    this.navigateProfile = this.navigateProfile.bind(this);
  }

  navigateProfile(){
    this.props.history.replace('/a/profile');
  }

  createprofile(){
    console.log(this.state);
    //this.props.createprofile(this.state);
  }

  componentDidMount(){
    if(!this.props.canCreate){
      this.navigateProfile();
    }
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.canCreate){
      this.navigateProfile();
    }
  }

  render({canCreate, createsuccess, createerr}, {}){
    if(!canCreate){
      return false;
    }
    const bar = [];
    if(createsuccess){
      bar.push(<Link to="/a/profile"><Button outline>Back</Button></Link>);
    } else {
      bar.push(<Link to="/a/profile"><Button text>Cancel</Button></Link>);
      bar.push(<Button primary onClick={this.createprofile}>Create</Button>);
    }

    return <div>
      <Card size="md" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Profile">
          <Input fullWidth label="contact email" onChange={linkstate(this, 'contact_email')}/>
          <Input textarea fullWidth label="bio" onChange={linkstate(this, 'bio')}/>
        </Section>
        {createerr && <span>{createerr}</span>}
        {createsuccess && <span>Profile created</span>}
      </Card>
    </div>;
  }
}

const mapStateToProps = (state)=>{
  const {canCreate, createsuccess, createerr} = state.Profile;
  return {
    canCreate, createsuccess, createerr,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    createprofile: (options)=>{
      dispatch(CreateProfileReq(options));
    },
  };
};

ProfileNew = connect(mapStateToProps, mapDispatchToProps)(ProfileNew);
ProfileNew = withRouter(ProfileNew);

export default ProfileNew
