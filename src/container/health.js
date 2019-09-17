import React, {Fragment} from 'react';
import {useResource} from 'apiclient';
import Section from 'component/section';
import Time from 'component/time';

const selectAPIHealth = (api) => api.healthz.check;

const HealthContainer = () => {
  const {loading, success, err, data} = useResource(selectAPIHealth, [], {
    time: '',
    errs: [],
  });
  return (
    <Section sectionTitle="Health Check" container padded>
      {loading && <span>Loading</span>}
      {success && (
        <Fragment>
          <div>
            <Time value={data.time * 1000} />
          </div>
          {data.errs && (
            <Fragment>
              <div>Server Errors:</div>
              <ul>
                {data.errs.map((errstring) => (
                  <li key={errstring}>{errstring}</li>
                ))}
              </ul>
            </Fragment>
          )}
        </Fragment>
      )}
      {err && <span>{err}</span>}
    </Section>
  );
};

export default HealthContainer;
