import {h, Component} from 'preact';
import linkstate from 'linkstate';
import Section from 'component/section';
import Table from 'component/table';
import Button from 'component/button';
import Input from 'component/form';
import Time from 'component/time';
import Anchor from 'component/anchor';

import {connect} from 'preact-redux';
import {GetLinkGroup, CreateLink, DeleteLink} from 'reducer/courier/link';
import {COURIER} from 'config';

class CourierLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      err: false,
      links: [],
      amount: 32,
      offset: 0,
      newLink: {
        id: '',
        url: '',
      },
    };
    this.fetchLinkGroup = this.fetchLinkGroup.bind(this);
    this.clearLink = this.clearLink.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    this.createLink = this.createLink.bind(this);
  }

  fetchLinkGroup() {
    const {amount, offset} = this.state;
    this.props.getLinkGroup(amount, offset, (err, data) => {
      if (err) {
        return this.setState((prevState) => {
          return Object.assign({}, prevState, {err});
        });
      }
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          links: data.links,
          err: false,
        });
      });
    });
  }

  clearLink() {
    return this.setState((prevState) => {
      return Object.assign({}, prevState, {
        newLink: {
          id: '',
          url: '',
        },
      });
    });
  }

  createLink() {
    const {newLink} = this.state;
    if (newLink.url.length == 0) {
      return this.setState((prevState) => {
        return Object.assign({}, prevState, {
          err: 'A url must be provided',
        });
      });
    }
    this.props.createLink(newLink.id, newLink.url, (err, data) => {
      if (err) {
        return this.setState((prevState) => {
          return Object.assign({}, prevState, {
            err,
          });
        });
      }
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          err: false,
        });
      });
      this.clearLink();
      this.fetchLinkGroup();
    });
  }

  deleteLink(linkid) {
    this.props.deleteLink(linkid, (err) => {
      if (err) {
        return this.setState((prevState) => {
          return Object.assign({}, prevState, {
            err,
          });
        });
      }
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          err: false,
        });
      });
      this.fetchLinkGroup();
    });
  }

  componentDidMount() {
    this.fetchLinkGroup();
  }

  render({}, {err, links, newLink}) {
    return (
      <div>
        <Section subsection sectionTitle="Add Link">
          <Input
            label="link id"
            info="usage: /link/:linkid; (optional)"
            value={newLink.id}
            onChange={linkstate(this, 'newLink.id')}
          />
          <Input
            label="link url"
            info="destination url"
            value={newLink.url}
            onChange={linkstate(this, 'newLink.url')}
            onEnter={this.createLink}
          />
          <Button text onClick={this.clearLink}>
            Clear
          </Button>
          <Button onClick={this.createLink}>Add Link</Button>
        </Section>
        {err && <span>Error: {err}</span>}
        <Section subsection sectionTitle="Links">
          <Table
            fullWidth
            head={[
              {key: 'shortlink', component: 'shortlink'},
              {key: 'url', component: 'url'},
              {key: 'image', component: 'qr code'},
              {key: 'time', component: 'creation time'},
              {key: 'delete', component: ''},
            ]}
            data={links.map(({linkid, url, creation_time}) => {
              return {
                key: linkid,
                row: [
                  {
                    key: 'shortlink',
                    component: (
                      <Anchor ext href={COURIER.base + '/' + linkid}>
                        {COURIER.base + '/' + linkid}
                      </Anchor>
                    ),
                  },
                  {
                    key: 'url',
                    component: (
                      <Anchor ext href={url}>
                        {url}
                      </Anchor>
                    ),
                  },
                  {
                    key: 'image',
                    component: (
                      <Anchor ext href={COURIER.base + '/' + linkid + '/image'}>
                        image
                      </Anchor>
                    ),
                  },
                  {
                    key: 'time',
                    component: <Time value={creation_time * 1000} />,
                  },
                  {
                    key: 'delete',
                    component: (
                      <Button text onClick={() => this.deleteLink(linkid)}>
                        Delete
                      </Button>
                    ),
                  },
                ],
              };
            })}
          />
        </Section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLinkGroup: async (amount, offset, callback) => {
      const data = await dispatch(GetLinkGroup(amount, offset));
      callback(data.err, data.data);
    },
    createLink: async (linkid, url, callback) => {
      const data = await dispatch(CreateLink(linkid, url));
      callback(data.err, data.data);
    },
    deleteLink: async (linkid, callback) => {
      const data = await dispatch(DeleteLink(linkid));
      callback(data.err);
    },
  };
};

CourierLink = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourierLink);

export default CourierLink;
