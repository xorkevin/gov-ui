import {h, Component} from 'preact';
import shortid from 'shortid';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.id = shortid.generate();
  }

  handleChange(event) {
    if (this.props.type && this.props.type === 'file') {
      if (event.target.files.length < 1) {
        this.setState(prevState => {
          return Object.assign({}, prevState, {value: undefined});
        });
        if (this.props.onChange) {
          this.props.onChange(undefined);
        }
      } else {
        this.setState(prevState => {
          return Object.assign({}, prevState, {value: event.target.files[0]});
        });
        if (this.props.onChange) {
          this.props.onChange(event.target.files[0]);
        }
      }
    } else {
      this.setState(prevState => {
        return Object.assign({}, prevState, {value: event.target.value});
      });
      if (this.props.onChange) {
        this.props.onChange(event.target.value);
      }
    }
  }

  handleEnter(target) {
    if (this.props.onEnter && target.key === 'Enter') {
      this.props.onEnter();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState(prevState => {
        return Object.assign({}, prevState, {value: nextProps.value});
      });
    }
  }

  render(
    {valid, error, fullWidth, textarea, label, type, accept, capture, info},
    {value},
  ) {
    let k = ['input'];
    if (valid) {
      k.push('valid');
    } else if (error) {
      k.push('invalid');
    }

    if (type === 'checkbox') {
      k.push('checkbox');
    }

    if (fullWidth) {
      k.push('full-width');
    }

    let inp = false;
    if (textarea) {
      inp = (
        <textarea
          id={this.id}
          value={value}
          onInput={this.handleChange}
          onKeyPress={this.handleEnter}
          placeholder=" "
        />
      );
    } else if (type && (type === 'file' || type === 'checkbox')) {
      inp = (
        <input
          id={this.id}
          type={type}
          accept={accept}
          capture={capture}
          value={value}
          onChange={this.handleChange}
          onKeyPress={this.handleEnter}
          placeholder=" "
        />
      );
    } else {
      inp = (
        <input
          id={this.id}
          type={type}
          value={value}
          onInput={this.handleChange}
          onKeyPress={this.handleEnter}
          placeholder=" "
        />
      );
    }

    return (
      <div className={k.join(' ')}>
        {inp}
        <label htmlFor={this.id}>{label}</label>
        {!error && info && <span className="info">{info}</span>}
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
}

export default Input;
