import {h, Component} from 'preact';
import Section from 'component/section';
import {isWeb} from 'utility';

import {connect} from 'preact-redux';
import {Connector} from 'battery';
import {TimeGet} from 'reducer/health';

class HealthContainer extends Component {
  componentWillMount(){
    this.props.getTime();
  }

  render({loading, success, time, err}){
    return <div>
      <Section sectionTitle="Health Check" container padded>
        <span>{loading && "loading"}</span>
        <span>{success && time}</span>
        <span>{!success && err}</span>
      </Section>
    </div>;
  }
};

const mapStateToProps = (state)=>{
  const {time, err, loading, success} = state.Health;
  return {
    loading, success, time, err,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    getTime: ()=>{
      if(isWeb()){
        dispatch(TimeGet());
      }
    },
  };
};

const contracts = [
  ({dispatch}, resolver)=>{
    dispatch(TimeGet(resolver));
  },
];

HealthContainer = connect(mapStateToProps, mapDispatchToProps)(HealthContainer);
HealthContainer = Connector(contracts)(HealthContainer);

export default HealthContainer
