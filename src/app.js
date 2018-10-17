import {h, Component} from 'preact';
import {Switch, Route, Redirect, NavLink, withRouter} from 'react-router-dom';
import {connect} from 'preact-redux';

import {DarkMode} from 'reducer/settings';

import Loader from 'loader';

import MainContent from 'component/maincontent';
import Navbar from 'component/navbar';
import Menu from 'component/menu';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

const loadHomeContainer = Loader(() => {
  return import('container/home');
});
const loadFormContainer = Loader(() => {
  return import('container/form');
});
const loadCardContainer = Loader(() => {
  return import('container/card');
});
const loadHealthContainer = Loader(() => {
  return import('container/health');
});

class App extends Component {
  constructor(props) {
    super(props);
    this.toggleDark = this.toggleDark.bind(this);
  }

  toggleDark() {
    this.props.toggleDark();
  }

  render({dark}, {}) {
    let darkmodetext = 'Dark';
    if (dark) {
      darkmodetext = 'Light';
    }
    return (
      <div>
        <Navbar
          hideOnScroll
          left={[
            {
              key: 'home',
              home: true,
              component: (
                <NavLink exact to="/">
                  Home
                </NavLink>
              ),
            },
            {key: 'form', component: <NavLink to="/form">Form</NavLink>},
            {key: 'cards', component: <NavLink to="/cards">Cards</NavLink>},
            {key: 'health', component: <NavLink to="/health">Health</NavLink>},
          ]}
          right={[
            {
              key: 'settings',
              component: (
                <Menu
                  icon={
                    <span>
                      <FaIcon icon="cog" /> Settings
                    </span>
                  }
                  size="md"
                  fixed
                  align="right"
                  position="bottom">
                  <span onClick={this.toggleDark}>
                    <FaIcon icon="bolt" /> {darkmodetext} Mode
                  </span>
                  <Anchor ext href="https://github.com/xorkevin">
                    <FaIcon icon="github" /> xorkevin
                  </Anchor>
                </Menu>
              ),
            },
          ]}
        />

        <MainContent>
          <Switch>
            <Route exact path="/" component={loadHomeContainer} />
            <Route path="/form" component={loadFormContainer} />
            <Route path="/cards" component={loadCardContainer} />
            <Route path="/health" component={loadHealthContainer} />
            <Redirect to="/" />
          </Switch>
        </MainContent>

        <Footer>
          <Grid center map sm={8}>
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
                    href="https://github.com/hackform/governor">
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
  const {dark} = state.Settings;
  return {
    dark,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDark: () => {
      dispatch(DarkMode());
    },
  };
};

App = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
App = withRouter(App); // needed to force rerender on location change

export default App;
