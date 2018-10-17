import {h, Component} from 'preact';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from 'preact-redux';

import {DarkMode} from 'reducer/settings';
import {Logout} from 'reducer/account/auth';

import Loader from 'loader';
import Protected from 'protected';

import MainContent from 'component/maincontent';
import Navbar from 'component/navbar';
import Menu from 'component/menu';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

const loadAdminContainer = Protected(
  Loader(() => {
    return import('container/admin');
  }),
);
const loadLoginContainer = Loader(() => {
  return import('container/login');
});
const loadAccountContainer = Protected(
  Loader(() => {
    return import('container/account');
  }),
);
const loadUserContainer = Protected(
  Loader(() => {
    return import('container/user');
  }),
);
const loadManageContainer = Protected(
  Loader(() => {
    return import('container/manage');
  }),
  'admin',
);
const loadHealthContainer = Protected(
  Loader(() => {
    return import('container/health');
  }),
  'admin',
);
const loadSetupContainer = Loader(() => {
  return import('container/setup');
});

class Admin extends Component {
  constructor(props) {
    super(props);
    this.toggleDark = this.toggleDark.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleDark() {
    this.props.toggleDark();
  }

  logout() {
    this.props.logout();
  }

  render({loggedIn}, {dark}) {
    return (
      <div>
        {loggedIn && (
          <Navbar
            sidebar
            left={[
              {
                key: 'home',
                home: true,
                component: (
                  <NavLink exact to="/">
                    <FaIcon icon="home" />
                    <small>Home</small>
                  </NavLink>
                ),
              },
              {
                key: 'health',
                component: (
                  <NavLink to="/health">
                    <FaIcon icon="server" />
                    <small>Health</small>
                  </NavLink>
                ),
              },
              {
                key: 'manage',
                component: (
                  <NavLink to="/manage">
                    <FaIcon icon="building-o" />
                    <small>Manage</small>
                  </NavLink>
                ),
              },
            ]}
            right={[
              {
                key: 'settings',
                component: (
                  <Menu
                    icon={[<FaIcon icon="cog" />, <small>Settings</small>]}
                    size="md"
                    fixed
                    align="left"
                    position="top"
                  >
                    <Link to="/a/account">
                      <FaIcon icon="address-card-o" /> Account
                    </Link>
                    <span onClick={this.toggleDark}>
                      <FaIcon icon="bolt" /> Dark Mode
                    </span>
                    <Anchor ext href="https://github.com/xorkevin">
                      <FaIcon icon="github" /> xorkevin
                    </Anchor>
                    <span onClick={this.logout}>
                      <FaIcon icon="sign-out" /> Sign out
                    </span>
                  </Menu>
                ),
              },
            ]}
          />
        )}

        <MainContent withSidebar={loggedIn} sectionNoMargin>
          <Switch>
            <Route exact path="/" component={loadAdminContainer} />
            <Route path="/x" component={loadLoginContainer} />
            <Route path="/a" component={loadAccountContainer} />
            <Route path="/u" component={loadUserContainer} />
            <Route path="/manage" component={loadManageContainer} />
            <Route path="/health" component={loadHealthContainer} />
            <Route path="/setup" component={loadSetupContainer} />
            <Redirect to="/" />
          </Switch>
        </MainContent>

        <Footer withSidebar={loggedIn}>
          <Grid map center sm={8}>
            <div colkey="left" className="text-center">
              <h4>Nuke</h4>a reactive frontend for governor
            </div>
            <div colkey="center" className="text-center">
              <ul>
                <li>
                  <Anchor noColor ext href="https://github.com/hackform/nuke">
                    <FaIcon icon="github" /> Github
                  </Anchor>
                </li>
                <li>
                  Designed for{' '}
                  <Anchor
                    noColor
                    ext
                    href="https://github.com/hackform/governor"
                  >
                    hackform/governor
                  </Anchor>
                </li>
              </ul>
            </div>
            <div colkey="right" className="text-center">
              <h5>
                <FaIcon icon="code" /> with <FaIcon icon="heart-o" /> by{' '}
                <Anchor noColor ext href="https://github.com/xorkevin">
                  <FaIcon icon="github" /> xorkevin
                </Anchor>
              </h5>
            </div>
          </Grid>
        </Footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {loggedIn} = state.Auth;
  return {
    loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDark: () => {
      dispatch(DarkMode());
    },
    logout: () => {
      dispatch(Logout());
    },
  };
};

Admin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Admin);
Admin = withRouter(Admin);

export default Admin;
