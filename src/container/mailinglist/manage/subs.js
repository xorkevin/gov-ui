import {useCallback} from 'react';
import {useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {formatURL} from '../../../utility';

const selectAPISubs = (api) => api.mailinglist.personal;

const LISTS_LIMIT = 32;

const ListRow = ({
  listid,
  listname,
  name,
  archive,
  lastUpdated,
  creatorName,
  listurl,
}) => {
  const menu = useMenu();
  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="mailinglist-item-name">
          <h5 className="mailinglist-item-heading">
            <AnchorText local href={formatURL(listurl, listid)}>
              {name}
            </AnchorText>{' '}
            <small>{`${creatorName}.${listname}`}</small>
          </h5>{' '}
          <small>{archive && <Chip>Archived</Chip>}</small> Last updated{' '}
          <Time value={lastUpdated} />
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem local link="#">
                Unsubscribe
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const Subs = ({listurl}) => {
  const paginate = usePaginate(LISTS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookLists = useCallback(
    (_status, lists) => {
      setAtEnd(lists.length < LISTS_LIMIT);
    },
    [setAtEnd],
  );
  const [lists, _reexecute] = useAuthResource(
    selectAPISubs,
    [LISTS_LIMIT, paginate.index],
    [],
    {posthook: posthookLists},
  );

  return (
    <div>
      <h3>Manage Subscriptions</h3>
      <hr />
      <ListGroup>
        {Array.isArray(lists.data) &&
          lists.data.map((i) => (
            <ListRow
              key={i.listid}
              listid={i.listid}
              creatorid={i.creatorid}
              listname={i.listname}
              name={i.name}
              desc={i.desc}
              archive={i.archive}
              senderPolicy={i.sender_policy}
              memberPolicy={i.member_policy}
              lastUpdated={i.last_updated}
              creationTime={i.creation_time}
              creatorName="TODO"
              listurl={listurl}
            />
          ))}
      </ListGroup>
      <ButtonGroup>
        <ButtonTertiary disabled={paginate.atFirst} onClick={paginate.prev}>
          prev
        </ButtonTertiary>
        {paginate.page}
        <ButtonTertiary disabled={paginate.atLast} onClick={paginate.next}>
          next
        </ButtonTertiary>
      </ButtonGroup>
    </div>
  );
};

export default Subs;
