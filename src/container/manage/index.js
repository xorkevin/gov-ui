import React, {Component} from 'react';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';
import Section from 'component/section';
import Tabbar from 'component/tabbar';

import Loader from 'loader';

const loadManageUserContainer = Loader(() => {
  return import('container/manage/user');
});

class ManageContainer extends Component {
  render() {
    const {match} = this.props;
    return (
      <Section container narrow padded sectionTitle="Settings">
        <Tabbar
          left={[
            {
              key: 'user',
              component: <NavLink to={`${match.path}/user`}>User</NavLink>,
            },
          ]}
        />
        <Switch>
          <Route
            path={`${match.url}/user/:username?`}
            component={loadManageUserContainer}
          />
          <Redirect to={`${match.url}/user`} />
        </Switch>
      </Section>
    );
  }
}

export default ManageContainer;
