import {h, Component} from 'preact';
import {withRouter} from 'react-router-dom';

const Protected = (child)=>{
  return class extends Component {
    componentWillMount(){
      if(!this.props.loggedIn){
        this.props.history.replace('/login');
      }
    }

    componentWillReceiveProps(nextProps){
      if(!nextProps.loggedIn){
        this.props.history.replace('/login');
      }
    }

    render({loggedIn}){
      if(loggedIn){
        return h(child);
      }
      return false;
    }
  };
};

const mapStateToProps = (state)=>{
  const {loggedIn} = state.Auth;
  return {
    loggedIn,
  };
};

ProtectedRoute = withRouter(ProtectedRoute);
ProtectedRoute = connect(mapStateToProps)(ProtectedRoute);

export default Protected
