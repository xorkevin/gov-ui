import {h, Component} from 'preact';
import {Link} from 'react-router-dom';
import Button from 'component/button';
import FaIcon from 'component/faicon';
import {connect} from 'preact-redux';

const mapStateToProps = state => {
  const {loggedIn, authTags} = state.Auth;
  return {
    loggedIn,
    authTags,
  };
};

const Protected = (child, auth, args) => {
  return connect(mapStateToProps)(
    class extends Component {
      render(props) {
        const {loggedIn, authTags} = props;
        if (!loggedIn) {
          return (
            <div>
              <h4>Not Logged In</h4>
              <Link to="/x/login">
                <Button outline>
                  Login <FaIcon icon="chevron-right" />
                </Button>
              </Link>
            </div>
          );
        }
        if (auth && !new Set(authTags.split(',')).has(auth)) {
          return (
            <div>
              <h4>Unauthorized</h4>
            </div>
          );
        }
        return h(child, Object.assign({}, props, args));
      }
    },
  );
};

export default Protected;
