import React, {Component, Fragment} from 'react';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Chip from 'component/chip';
import Time from 'component/time';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'react-redux';
import {GetUserAccountByName} from 'reducer/user';
import {PatchRank} from 'reducer/manage/user';

class ManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      err: false,
      username: props.match.params.username || '',
      user: false,
      edit: false,
      rank: {
        add: '',
        remove: '',
      },
    };
    this.fetchUser = this.fetchUser.bind(this);
    this.navigateUser = this.navigateUser.bind(this);
    this.edit = this.edit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
  }

  navigateUser() {
    if (this.state.username.length > 0) {
      this.props.history.push(`/manage/user/${this.state.username}`);
      this.fetchUser();
    }
  }

  edit() {
    this.setState((prevState) => {
      return Object.assign({}, prevState, {edit: true});
    });
  }

  cancel() {
    this.setState((prevState) => {
      return Object.assign({}, prevState, {edit: false});
    });
  }

  save() {
    const rank = {};
    if (this.state.rank.add.length > 0) {
      rank.add = this.state.rank.add
        .split(',')
        .map((tag) => tag.trim())
        .join(',');
    }
    if (this.state.rank.remove.length > 0) {
      rank.remove = this.state.rank.remove
        .split(',')
        .map((tag) => tag.trim())
        .join(',');
    }
    this.props.patchrank(this.state.user.userid, rank, (err) => {
      if (err) {
        this.setState((prevState) => {
          return Object.assign({}, prevState, {err});
        });
      } else {
        this.setState((prevState) => {
          return Object.assign({}, prevState, {
            err: false,
            edit: false,
          });
        });
        this.fetchUser();
      }
    });
  }

  fetchUser() {
    if (this.state.username.length > 0) {
      this.props.userbyname(this.state.username, (err, user) => {
        this.setState((prevState) => {
          return Object.assign({}, prevState, {err, user});
        });
      });
    }
  }

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    const {err, username, user, edit, rank} = this.state;
    if (edit) {
      const bar = (
        <Fragment>
          <Button text onClick={this.cancel}>
            Cancel
          </Button>
          <Button outline onClick={this.save}>
            Save
          </Button>
        </Fragment>
      );

      return (
        <Card size="md" restrictWidth center bar={bar}>
          <Section subsection sectionTitle="Edit Permissions">
            <ListItem label="userid" item={user.userid} />
            <ListItem label="username" item={user.username} />
            <ListItem
              label="current roles"
              item={user.auth_tags.split(',').map((tag) => {
                return <Chip>{tag}</Chip>;
              })}
            />
            <ListItem
              label="roles to add"
              item={rank.add.split(',').map((tag) => {
                return <Chip>{tag.trim()}</Chip>;
              })}
            />
            <ListItem
              label="roles to remove"
              item={rank.remove.split(',').map((tag) => {
                return <Chip>{tag.trim()}</Chip>;
              })}
            />
            <Input
              fullWidth
              label="add"
              onChange={linkstate(this, 'rank.add')}
            />
            <Input
              fullWidth
              label="remove"
              onChange={linkstate(this, 'rank.remove')}
            />
            {err && <span>{err}</span>}
          </Section>
        </Card>
      );
    }

    if (user) {
      const bar = (
        <Fragment>
          <Button outline onClick={this.edit}>
            Edit
          </Button>
        </Fragment>
      );

      return (
        <Card size="lg" restrictWidth center bar={bar}>
          <Section subsection sectionTitle="Account Details">
            <ListItem label="userid" item={user.userid} />
            <ListItem label="username" item={user.username} />
            <ListItem label="first name" item={user.first_name} />
            <ListItem label="last name" item={user.last_name} />
            <ListItem
              label="roles"
              item={user.auth_tags.split(',').map((tag) => {
                return <Chip>{tag}</Chip>;
              })}
            />
            <ListItem
              label="creation time"
              item={<Time value={user.creation_time} />}
            />
          </Section>
        </Card>
      );
    }

    const bar = (
      <Fragment>
        <Button primary onClick={this.navigateUser}>
          Search
        </Button>
      </Fragment>
    );

    return (
      <Card size="md" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Search User">
          <Input
            fullWidth
            label="username"
            error={err}
            onChange={linkstate(this, 'username')}
            onEnter={this.navigateUser}
          />
        </Section>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    userbyname: async (username, callback) => {
      const data = await dispatch(GetUserAccountByName(username));
      callback(data.err, data.data);
    },
    patchrank: async (userid, rank, callback) => {
      const data = await dispatch(PatchRank(userid, rank));
      callback(data.err);
    },
  };
};

ManageUser = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageUser);

export default ManageUser;
