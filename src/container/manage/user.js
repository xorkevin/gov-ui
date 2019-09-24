import React, {Fragment, useState, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {useResource, selectAPINull} from 'apiclient';
import {useAuthCall} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Chip from 'component/chip';
import Time from 'component/time';
import Button from 'component/button';
import {Form, Input, useForm} from 'component/form';

const selectAPIUser = (api) => api.u.user.name;
const selectAPIRank = (api) => api.u.user.id.edit.rank;

const ManageUser = ({match}) => {
  const history = useHistory();

  const username = match.params.username || '';
  const displayUser = username.length > 0;

  const [editMode, setEdit] = useState(false);
  const toggleEditMode = useCallback(() => setEdit((e) => !e), [setEdit]);

  const {err: errUser, data: user, reexecute} = useResource(
    username.length > 0 ? selectAPIUser : selectAPINull,
    [username],
    {
      userid: '',
      username: '',
      first_name: '',
      last_name: '',
      auth_tags: '',
      creation_time: 0,
    },
  );

  const [searchFormState, updateSearchForm] = useForm({
    username: '',
  });

  const navigateUser = useCallback(() => {
    if (searchFormState.username.length > 0) {
      history.push(`/manage/user/${searchFormState.username}`);
    }
  }, [searchFormState, history]);

  const [formState, updateForm] = useForm({
    add: '',
    remove: '',
  });

  const posthook = useCallback(
    (_status, _data, opts) => {
      reexecute(opts);
      updateForm('add', '');
      updateForm('remove', '');
    },
    [reexecute, updateForm],
  );
  const [_rankState, execRank] = useAuthCall(
    selectAPIRank,
    [user.userid, formState.add, formState.remove],
    {},
    {posthook},
  );

  if (!displayUser) {
    const bar = (
      <Fragment>
        <Button primary onClick={navigateUser}>
          Search
        </Button>
      </Fragment>
    );

    return (
      <Card size="lg" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Search User">
          <Form
            formState={searchFormState}
            onChange={updateSearchForm}
            onEnter={navigateUser}
          >
            <Input label="username" name="username" fullWidth />
          </Form>
        </Section>
      </Card>
    );
  }

  if (editMode) {
    const bar = (
      <Fragment>
        <Button text onClick={toggleEditMode}>
          Cancel
        </Button>
        <Button outline onClick={execRank}>
          Save
        </Button>
      </Fragment>
    );

    return (
      <Card size="lg" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Edit Permissions">
          <ListItem label="userid" item={user.userid} />
          <ListItem label="username" item={user.username} />
          <ListItem
            label="current roles"
            item={
              user.auth_tags.length > 0 &&
              user.auth_tags
                .split(',')
                .map((tag) => <Chip key={tag}>{tag}</Chip>)
            }
          />
          <ListItem
            label="roles to add"
            item={
              formState.add.length > 0 &&
              formState.add
                .split(',')
                .map((tag) => <Chip key={tag.trim()}>{tag.trim()}</Chip>)
            }
          />
          <ListItem
            label="roles to remove"
            item={
              formState.remove.length > 0 &&
              formState.remove
                .split(',')
                .map((tag) => <Chip key={tag.trim()}>{tag.trim()}</Chip>)
            }
          />
          <Form formState={formState} onChange={updateForm} onEnter={execRank}>
            <Input label="add" name="add" fullWidth />
            <Input label="remove" name="remove" fullWidth />
          </Form>
        </Section>
      </Card>
    );
  }

  const bar = (
    <Fragment>
      <Button outline onClick={toggleEditMode}>
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
          item={
            user.auth_tags.length > 0 &&
            user.auth_tags.split(',').map((tag) => <Chip key={tag}>{tag}</Chip>)
          }
        />
        <ListItem
          label="creation time"
          item={<Time value={user.creation_time * 1000} />}
        />
        {errUser && <span>{errUser}</span>}
      </Section>
    </Card>
  );
};

export default ManageUser;
