import React, {Component} from 'react';
import Section from 'component/section';

import {connect} from 'react-redux';
import {TimeGet} from 'reducer/health';

class HealthContainer extends Component {
  componentDidMount() {
    this.props.getTime();
  }

  render({loading, success, time, err}) {
    return (
      <Section sectionTitle="Health Check" container padded>
        <span>{loading && 'loading'}</span>
        <span>{success && time}</span>
        <span>{!success && err}</span>
      </Section>
    );
  }
}

const mapStateToProps = (state) => {
  const {time, err, loading, success} = state.Health;
  return {
    loading,
    success,
    time,
    err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTime: () => {
      dispatch(TimeGet());
    },
  };
};

HealthContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthContainer);

export default HealthContainer;
