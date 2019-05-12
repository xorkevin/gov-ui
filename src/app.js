import React, {Component, Fragment, lazy, Suspense} from 'react';
import {Switch, Route, Redirect, NavLink, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {DarkMode} from 'reducer/settings';

import MainContent from 'component/maincontent';
import Section from 'component/section';
import {Navbar, Navitem} from 'component/navbar';
import Menu from 'component/menu';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

const HomeContainer = lazy(() => import('container/home'));
const FormContainer = lazy(() => import('container/form'));
const CardContainer = lazy(() => import('container/card'));
const HealthContainer = lazy(() => import('container/health'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

const styletoppaths = ['/'];

class App extends Component {
  constructor(props) {
    super(props);
    this.toggleDark = this.toggleDark.bind(this);
  }

  toggleDark() {
    this.props.toggleDark();
  }

  render() {
    const {dark, location} = this.props;
    let darkmodetext = 'Dark';
    if (dark) {
      darkmodetext = 'Light';
    }
    return (
      <div>
        <Navbar
          hideOnScroll
          styletop={styletoppaths.includes(location.pathname)}
          left={
            <Fragment>
              <Navitem home scroll>
                <NavLink exact to="/">
                  Home
                </NavLink>
              </Navitem>
              <Navitem scroll="typography">
                <div>Typography</div>
              </Navitem>
              <Navitem>
                <NavLink to="/form">Form</NavLink>
              </Navitem>
              <Navitem>
                <NavLink to="/cards">Cards</NavLink>
              </Navitem>
              <Navitem>
                <NavLink to="/health">Health</NavLink>
              </Navitem>
            </Fragment>
          }
          right={
            <Fragment>
              <Navitem>
                <Menu
                  icon={
                    <Fragment>
                      <FaIcon icon="cog" /> Settings
                    </Fragment>
                  }
                  size="md"
                  fixed
                  align="right"
                  position="bottom"
                >
                  <span onClick={this.toggleDark}>
                    <FaIcon icon="bolt" /> {darkmodetext} Mode
                  </span>
                  <Anchor ext href="https://github.com/xorkevin">
                    <FaIcon icon="github" /> xorkevin
                  </Anchor>
                </Menu>
              </Navitem>
            </Fragment>
          }
        />

        <MainContent>
          <Suspense fallback={FallbackView}>
            <Switch>
              <Route exact path="/" component={HomeContainer} />
              <Route path="/form" component={FormContainer} />
              <Route path="/cards" component={CardContainer} />
              <Route path="/health" component={HealthContainer} />
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </MainContent>

        <Footer>
          <Grid center map sm={8}>
            <div className="text-center">
              <h4>Nuke</h4>a reactive frontend for governor
            </div>
            <div className="text-center">
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
            <div className="text-center">
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
