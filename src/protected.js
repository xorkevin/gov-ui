import {h, Component} from 'preact';
import {connect} from 'preact-redux';
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

Protected = connect(mapStateToProps)(Protected);
Protected = withRouter(Protected);

export default Protected
