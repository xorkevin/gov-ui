import React, {Component} from 'react';
import shortid from 'shortid';

class Input extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.id = shortid.generate();
  }

  handleChange(event) {
    if (this.props.onChange) {
      switch (this.props.type) {
        case 'file':
          if (event.target.files.length < 1) {
            this.props.onChange(undefined);
          } else {
            this.props.onChange(event.target.files[0]);
          }
          break;
        case 'checkbox':
          this.props.onChange(event.target.checked);
          break;
        default:
          this.props.onChange(event.target.value);
      }
    }
  }

  handleEnter(target) {
    if (this.props.onEnter && target.key === 'Enter') {
      this.props.onEnter();
    }
  }

  render() {
    const {
      type,
      value,
      label,
      info,
      error,
      valid,
      wide,
      fullWidth,
      dropdown,
      multiple,
      textarea,
      accept,
      capture,
      checked,
    } = this.props;

    let k = ['input'];
    if (valid) {
      k.push('valid');
    } else if (error) {
      k.push('invalid');
    }

    if (type === 'file') {
      k.push('file');
    } else if (type === 'radio') {
      k.push('radio');
    } else if (type === 'checkbox') {
      k.push('checkbox');
    }

    if (wide) {
      k.push('wide');
    } else if (fullWidth) {
      k.push('full-width');
    }

    let inp = false;
    if (dropdown) {
      inp = (
        <select
          id={this.id}
          value={value}
          multiple={multiple}
          onChange={this.handleChange}
        >
          {Array.isArray(dropdown) &&
            dropdown.map((i) => {
              return (
                <option key={i.value} value={i.value}>
                  {i.text}
                </option>
              );
            })}
        </select>
      );
    } else if (textarea) {
      inp = (
        <textarea
          id={this.id}
          value={value}
          onChange={this.handleChange}
          onKeyPress={this.handleEnter}
          placeholder=" "
        />
      );
    } else {
      switch (type) {
        case 'file':
          inp = (
            <input
              id={this.id}
              type={type}
              accept={accept}
              capture={capture}
              value={value}
              checked={checked}
              onChange={this.handleChange}
              onKeyPress={this.handleEnter}
              placeholder=" "
            />
          );
          break;
        case 'radio':
          inp = (
            <input
              id={this.id}
              type={type}
              value={value}
              checked={checked === value}
              onChange={this.handleChange}
              onKeyPress={this.handleEnter}
              placeholder=" "
            />
          );
          break;
        case 'checkbox':
          inp = (
            <input
              id={this.id}
              type={type}
              checked={checked}
              onChange={this.handleChange}
              onKeyPress={this.handleEnter}
              placeholder=" "
            />
          );
          break;
        default:
          inp = (
            <input
              id={this.id}
              type={type}
              value={value}
              onChange={this.handleChange}
              onKeyPress={this.handleEnter}
              placeholder=" "
            />
          );
      }
    }

    return (
      <div className={k.join(' ')}>
        {inp}
        <label htmlFor={this.id}>{label}</label>
        {dropdown && <div className="dropdown-arrow" />}
        {!error && info && <span className="info">{info}</span>}
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
}

export default Input;
