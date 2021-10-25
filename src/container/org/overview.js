const OrgOverview = ({org}) => {
  return (
    <div>
      <h2>{org.display_name}</h2>
      <p>{org.desc}</p>
      <hr />
    </div>
  );
};

export default OrgOverview;
