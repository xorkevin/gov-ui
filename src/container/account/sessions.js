import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';
import ListItem from 'component/list';
import Time from 'component/time';

import {connect} from 'react-redux';
import {GetSessionReq, DelSessionReq} from 'reducer/account/edit';

class AccountSessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      err: false,
      session_ids: new Set(),
      sessions: false,
    };
    this.deletesessions = this.deletesessions.bind(this);
    this.getsessions = this.getsessions.bind(this);
  }

  async deletesessions() {
    const {err} = await this.props.deletesessions(
      Array.from(this.state.session_ids),
    );
    if (err) {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          success: false,
          err,
        });
      });
    } else {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          success: true,
          err: false,
        });
      });
      this.getsessions();
    }
  }

  async getsessions() {
    const {err, sessions} = await this.props.getsessions();
    if (err) {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          success: false,
          err,
        });
      });
    } else {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          success: true,
          err: false,
          sessions,
        });
      });
    }
  }

  componentDidMount() {
    this.getsessions();
  }

  render({}, {session_ids, success, err, sessions}) {
    if (!sessions) {
      return false;
    }
    const bar = [];
    bar.push(
      <Button primary onClick={this.deletesessions}>
        Delete
      </Button>,
    );
    return (
      <Card size="lg" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Active Sessions">
          {sessions.map((session) => {
            return (
              <div>
                <Input
                  fullWidth
                  type="checkbox"
                  label={
                    <span>
                      {session.ip} | last accessed{' '}
                      <Time value={session.time * 1000} />
                    </span>
                  }
                  onChange={(value) => {
                    this.setState((prevState) => {
                      if (prevState.session_ids.has(session.session_id)) {
                        prevState.session_ids.delete(session.session_id);
                        return Object.assign({}, prevState, {
                          session_ids: prevState.session_ids,
                        });
                      } else {
                        return Object.assign({}, prevState, {
                          session_ids: prevState.session_ids.add(
                            session.session_id,
                          ),
                        });
                      }
                    });
                  }}
                />
                <span>
                  {session.user_agent} | {session.session_id}
                </span>
              </div>
            );
          })}
        </Section>
        {err && <span>{err}</span>}
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getsessions: () => {
      return dispatch(GetSessionReq());
    },
    deletesessions: (sessions) => {
      return dispatch(DelSessionReq(sessions));
    },
  };
};

AccountSessions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountSessions);

export default AccountSessions;
