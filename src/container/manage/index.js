import React, {Component, Fragment, lazy, Suspense} from 'react';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';
import Section from 'component/section';
import Tabbar from 'component/tabbar';

const ManageUserContainer = lazy(() => import('container/manage/user'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

class ManageContainer extends Component {
  render() {
    const {match} = this.props;
    return (
      <Section container narrow padded sectionTitle="Settings">
        <Tabbar
          left={
            <Fragment>
              <NavLink to={`${match.path}/user`}>User</NavLink>
            </Fragment>
          }
        />
        <Suspense fallback={FallbackView}>
          <Switch>
            <Route
              path={`${match.url}/user/:username?`}
              component={ManageUserContainer}
            />
            <Redirect to={`${match.url}/user`} />
          </Switch>
        </Suspense>
      </Section>
    );
  }
}

export default ManageContainer;
