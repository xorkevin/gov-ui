import {h, Component} from 'preact';
import linkstate from 'linkstate';
import Section from 'component/section';
import Button from 'component/button';
import Input from 'component/form';
import Time from 'component/time';
import Anchor from 'component/anchor';

import {connect} from 'preact-redux';
import {GetLinkGroup, CreateLink} from 'reducer/courier/link';
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

  componentDidMount() {
    this.fetchLinkGroup();
  }

  render({}, {err, links, newLink}) {
    return (
      <div>
        <Section subsection sectionTitle="Add Link">
          <Input
            label="link id"
            info="usage: /link/:linkid; (optional, if not present, will be randomly generated)"
            value={newLink.id}
            onChange={linkstate(this, 'newLink.id')}
          />
          <Input
            label="link url"
            info="destination url"
            value={newLink.url}
            onChange={linkstate(this, 'newLink.url')}
          />
          <Button text onClick={this.clearLink}>
            Clear
          </Button>
          <Button onClick={this.createLink}>Add Link</Button>
        </Section>
        {err && <span>Error: {err}</span>}
        <Section subsection sectionTitle="Links">
          {links.map((link) => {
            return (
              <div>
                <span>
                  Linkid:{' '}
                  <Anchor ext href={COURIER.base + '/' + link.linkid}>
                    {COURIER.base + '/' + link.linkid}
                  </Anchor>
                </span>
                <span>
                  Link url:{' '}
                  <Anchor ext href={link.url}>
                    {link.url}
                  </Anchor>
                </span>
                <span>
                  Link creation time: <Time value={link.creation_time * 1000} />
                </span>
              </div>
            );
          })}
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
  };
};

CourierLink = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourierLink);

export default CourierLink;
