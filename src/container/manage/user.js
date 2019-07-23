import React, {Fragment, useState, useCallback} from 'react';
import {useResource, selectAPINull} from 'apiclient';
import {useAuthCall} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Chip from 'component/chip';
import Time from 'component/time';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

const selectAPIUser = (api) => api.u.user.name;
const selectAPIRank = (api) => api.u.user.id.edit.rank;

const ManageUser = ({history, match}) => {
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
  }, [searchFormState]);

  const [formState, updateForm] = useForm({
    add: '',
    remove: '',
  });

  const posthook = useCallback(() => {
    reexecute();
    updateForm('add', '');
    updateForm('remove', '');
  }, [reexecute, updateForm]);
  const [rankState, execRank] = useAuthCall(
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
          <Input
            label="username"
            name="username"
            value={searchFormState.username}
            onChange={updateSearchForm}
            onEnter={navigateUser}
            fullWidth
          />
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
          <Input
            label="add"
            name="add"
            value={formState.add}
            onChange={updateForm}
            fullWidth
          />
          <Input
            label="remove"
            name="remove"
            value={formState.remove}
            onChange={updateForm}
            fullWidth
          />
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
