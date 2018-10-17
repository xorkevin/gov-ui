import {h} from 'preact';

const ListItem = ({label, item}) => {
  return (
    <dl className="list-item">
      <dt className="label">{label}</dt>
      <dd className="item">{item}</dd>
    </dl>
  );
};

export default ListItem;
