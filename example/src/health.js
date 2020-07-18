import React, {Fragment} from 'react';
import {useResource} from '@xorkevin/substation';
import {Section, Time} from '@xorkevin/nuke';

const selectAPIHealth = (api) => api.healthz.ready;

const HealthContainer = () => {
  const [health] = useResource(selectAPIHealth, [], {
    time: '',
    errs: [],
  });
  return (
    <Section sectionTitle="Health Check" container narrow padded>
      {health.loading && <span>Loading</span>}
      {health.success && (
        <Fragment>
          <div>
            <Time value={health.data.time * 1000} />
          </div>
          {health.data.errs && (
            <Fragment>
              <div>Server Errors:</div>
              <ul>
                {health.data.errs.map((errstring) => (
                  <li key={errstring}>{errstring}</li>
                ))}
              </ul>
            </Fragment>
          )}
        </Fragment>
      )}
      {health.err && <span>{health.err}</span>}
    </Section>
  );
};

export default HealthContainer;
