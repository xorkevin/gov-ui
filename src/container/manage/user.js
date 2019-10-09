import React, {Fragment, useState, useCallback} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthCall} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import Description from 'component/description';
import Chip from 'component/chip';
import Time from 'component/time';
import Button from 'component/button';
import {Form, Input, useForm} from 'component/form';

const selectAPIUser = (api) => api.u.user.name;
const selectAPIRank = (api) => api.u.user.id.edit.rank;

const ManageUser = () => {
  const history = useHistory();
  const {username} = useParams();

  const displayUser = username && username.length > 0;

  const [editMode, setEdit] = useState(false);
  const toggleEditMode = useCallback(() => setEdit((e) => !e), [setEdit]);

  const {err: errUser, data: user, reexecute} = useResource(
    displayUser ? selectAPIUser : selectAPINull,
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
  const [rankState, execRank] = useAuthCall(
    selectAPIRank,
    [user.userid, formState.add, formState.remove],
    {},
    {posthook},
  );

  const {err: errEdit} = rankState;

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
          <Description label="userid" item={user.userid} />
          <Description label="username" item={user.username} />
          <Description
            label="current roles"
            item={
              user.auth_tags.length > 0 &&
              user.auth_tags
                .split(',')
                .map((tag) => <Chip key={tag}>{tag}</Chip>)
            }
          />
          <Description
            label="roles to add"
            item={
              formState.add.length > 0 &&
              formState.add
                .split(',')
                .map((tag) => <Chip key={tag.trim()}>{tag.trim()}</Chip>)
            }
          />
          <Description
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
          {errEdit && <span>{errEdit}</span>}
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
        <Description label="userid" item={user.userid} />
        <Description label="username" item={user.username} />
        <Description label="first name" item={user.first_name} />
        <Description label="last name" item={user.last_name} />
        <Description
          label="roles"
          item={
            user.auth_tags.length > 0 &&
            user.auth_tags.split(',').map((tag) => <Chip key={tag}>{tag}</Chip>)
          }
        />
        <Description
          label="creation time"
          item={<Time value={user.creation_time * 1000} />}
        />
        {errUser && <span>{errUser}</span>}
      </Section>
    </Card>
  );
};

export default ManageUser;
