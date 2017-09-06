import {h, Component} from 'preact';
import Section from 'component/section';

import {connect} from 'preact-redux';
import {TimeGet} from 'reducer/health';

class HealthContainer extends Component {
  componentWillMount(){
    this.props.getTime();
  }

  render({success, time, err}){
    return <div>
      <Section sectionTitle="Health Check" container padded>
        <span>{success && time}</span>
        <span>{!success && err}</span>
      </Section>
    </div>;
  }
};

const mapStateToProps = (state)=>{
  const {time, err, loading, success} = state.Health;
  return {
    time, err, loading, success,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    getTime: ()=>{
      dispatch(TimeGet());
    },
  };
};

HealthContainer = connect(mapStateToProps, mapDispatchToProps)(HealthContainer);

export default HealthContainer
